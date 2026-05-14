import os
import google.generativeai as genai
from .prompts import RISK_CLASSIFICATION_PROMPT, BANGLA_VOICE_PROMPT
import json
from typing import List, Dict, Any, Optional

class MayerRAGEngine:
    def __init__(self):
        api_key = os.getenv("GEMINI_API_KEY")
        if api_key:
            print("Neural Link: GEMINI_API_KEY detected. Initializing RAG node...")
            genai.configure(api_key=api_key)
            self.model = genai.GenerativeModel('gemini-1.5-flash')
        else:
            print("Neural Link: GEMINI_API_KEY NOT FOUND. AI features will be limited.")
            self.model = None

    async def generate_risk_explanation(self, risk_level: str, data: any):
        if not self.model:
            return {"explanation": "Vitals analyzed. Please consult a doctor."}
        
        prompt = RISK_CLASSIFICATION_PROMPT.format(
            age=data.age,
            bp=f"{data.bp_sys}/{data.bp_dia}",
            swelling=data.swelling,
            headache=data.headache_severity,
            fever=data.fever,
            diabetes=data.diabetes_history,
            fetal_movement=data.fetal_movement,
            week=data.week
        )
        
        try:
            response = await self.model.generate_content_async(prompt)
            # Cleanup and parse JSON
            text = response.text.replace("```json", "").replace("```", "").strip()
            try:
                result = json.loads(text)
            except json.JSONDecodeError:
                # Fallback if JSON parsing fails
                result = {
                    "risk_level": risk_level,
                    "explanation": text[:200] if text else "Analysis completed.",
                    "emergency_alert": risk_level == "High"
                }
            
            # Generate Bangla Voice advice in parallel
            voice_prompt = BANGLA_VOICE_PROMPT.format(text=result["explanation"])
            voice_res = await self.model.generate_content_async(voice_prompt)
            result["advice_bn"] = voice_res.text.strip()
            
            return result
        except Exception as e:
            print(f"RAG Error: {e}")
            return {"explanation": f"We detected {risk_level} risk. Please seek medical attention."}

    async def query(self, message: str, history: List[dict], language: str = "en"):
        if not self.model:
            return "API Key not configured. Please check backend/.env file."
        
        chat = self.model.start_chat(history=[
            {"role": "user", "parts": [m["content"]]} if m["role"] == "user" else {"role": "model", "parts": [m["content"]]}
            for m in history
        ])
        
        # System instruction for language
        instruction = "Answer in Bangla." if language == "bn" else "Answer in English."
        full_message = f"{instruction}\n\nUser Question: {message}"
        
        try:
            response = await chat.send_message_async(full_message)
            return response.text.strip()
        except Exception as e:
            print(f"Chat Error: {e}")
            return f"Neural Link Error: {str(e)}"

rag_engine = MayerRAGEngine()
