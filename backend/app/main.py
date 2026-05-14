from dotenv import load_dotenv
load_dotenv()

from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from .risk_engine import engine, HealthInput, RiskResult
from .rag_engine import rag_engine
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
async def sync_records(records: List[HealthInput]):
    """Batch Sync for Offline-First Data"""
    results = []
    for record in records:
        res = await engine.analyze(record, rag_engine)
        results.append(res)
    return {"synced_count": len(records), "analysis": results}

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

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
