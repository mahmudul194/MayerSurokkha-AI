from dotenv import load_dotenv
load_dotenv()

from fastapi import FastAPI, HTTPException, File, UploadFile
from fastapi.middleware.cors import CORSMiddleware
from .risk_engine import engine, HealthInput, RiskResult
from .rag_engine import rag_engine
from .voice_engine import voice_engine
from .database import db
from typing import List
import os

app = FastAPI(title="MayerSurokkha AI - Health API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.on_event("startup")
async def startup_db_client():
    await db.connect()

@app.get("/")
async def root():
    return {"status": "MayerSurokkha AI Service Active"}

@app.post("/predict", response_model=RiskResult)
async def predict(data: HealthInput):
    """Hybrid Risk Analysis Endpoint"""
    try:
        result = await engine.analyze(data, rag_engine)
        return result
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/sync")
async def sync_records(data: dict):
    """Batch Sync for Offline-First Data (Cloud Persistence)"""
    results = {
        "vitals": [],
        "chat": 0,
        "anc": 0
    }
    
    # 1. Sync Vitals
    records = data.get("vitals", [])
    for record in records:
        try:
            # Analyze and Save to Cloud
            from .risk_engine import HealthInput
            res = await engine.analyze(HealthInput(**record), rag_engine)
            
            # Prepare for MongoDB (Convert objects to dicts if needed)
            db_record = record.copy()
            db_record["analysis"] = res.dict()
            
            await db.health_records.update_one(
                {"mother_id": record.get("mother_id"), "timestamp": record.get("timestamp")},
                {"$set": db_record},
                upsert=True
            )
            results["vitals"].append(res)
        except Exception as e:
            print(f"Sync Error (Vitals): {e}")
            
    # 2. Sync Chat History
    chat_logs = data.get("chat", [])
    if chat_logs:
        try:
            await db.chat_history.insert_many(chat_logs, ordered=False)
            results["chat"] = len(chat_logs)
        except Exception as e:
            print(f"Sync Error (Chat): {e}")

    # 3. Sync ANC Visits
    anc_data = data.get("anc", [])
    if anc_data:
        try:
            for visit in anc_data:
                await db.anc_visits.update_one(
                    {"mother_id": visit.get("mother_id"), "week": visit.get("week")},
                    {"$set": visit},
                    upsert=True
                )
            results["anc"] = len(anc_data)
        except Exception as e:
            print(f"Sync Error (ANC): {e}")
    
    return {"status": "success", "synced_count": len(records), "analysis": results}

@app.post("/summary")
async def generate_summary(history: List[dict]):
    """AI Health Summary for Mothers and Doctors"""
    if not rag_engine.model:
        return {"summary": "Weekly analysis currently unavailable."}
    
    from .prompts import HEALTH_SUMMARY_PROMPT
    prompt = HEALTH_SUMMARY_PROMPT.format(history=history)
    try:
        response = rag_engine.model.generate_content(prompt)
        return {"summary": response.text.strip()}
    except:
        return {"summary": "Check your progress in the dashboard history."}

@app.post("/chat")
async def chat_endpoint(data: dict):
    """Conversational AI for Clinical Queries"""
    message = data.get("message", "")
    history = data.get("history", [])
    language = data.get("language", "en")
    
    try:
        response = await rag_engine.query(message, history, language)
        return {"response": response}
    except Exception as e:
        return {"response": f"Error connecting to Neural Link: {str(e)}"}

@app.post("/voice/process")
async def process_voice(audio: UploadFile = File(...)):
    """Handles audio processing: STT + Moderation via Gemini"""
    try:
        content = await audio.read()
        mime_type = audio.content_type or "audio/webm"
        result = await voice_engine.process_audio(content, mime_type)
        return result.dict()
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Voice processing failed: {str(e)}")

from pydantic import BaseModel

class TTSRequest(BaseModel):
    text: str
    language: str = "bn"

def clean_tts_text(text: str) -> str:
    import re
    # Remove markdown formatting bold, italic, code
    text = re.sub(r'\*\*|\*|`|#+\s?', ' ', text)
    # Remove list indicators and hyphens
    text = re.sub(r'[-*•]', ' ', text)
    # Remove emojis and high-unicode symbols, keep standard ASCII and Bengali Unicode characters
    text = re.sub(r'[^\u0000-\u007F\u0980-\u09FF\s.,!?;:]', '', text)
    # Clean up excess spaces
    text = re.sub(r'\s+', ' ', text).strip()
    return text

@app.post("/tts")
async def post_tts(req: TTSRequest):
    """Proxy for Google TTS to bypass browser CORS and Referer restrictions"""
    import urllib.request
    import urllib.parse
    import textwrap
    import concurrent.futures
    from fastapi.responses import Response
    
    try:
        sanitized_text = clean_tts_text(req.text)
        if not sanitized_text:
            return Response(content=b"", media_type="audio/mpeg")

        # Google TTS has a strict ~200 character limit. Split text safely.
        chunks = textwrap.wrap(sanitized_text, width=150, break_long_words=False)
        
        urls = [
            f"https://translate.googleapis.com/translate_tts?client=gtx&ie=UTF-8&tl={req.language}&q={urllib.parse.quote(chunk)}"
            for chunk in chunks
        ]
        
        def fetch_chunk(url):
            request = urllib.request.Request(url, headers={'User-Agent': 'Mozilla/5.0'})
            with urllib.request.urlopen(request) as response:
                return response.read()

        # Fetch all chunks in parallel using thread pool to dramatically reduce latency
        with concurrent.futures.ThreadPoolExecutor(max_workers=min(len(urls), 10)) as executor:
            results = list(executor.map(fetch_chunk, urls))
            
        full_audio = b"".join(results)
        return Response(content=full_audio, media_type="audio/mpeg")
    except Exception as e:
        print(f"TTS Proxy Error: {e}")
        raise HTTPException(status_code=500, detail=str(e))

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
