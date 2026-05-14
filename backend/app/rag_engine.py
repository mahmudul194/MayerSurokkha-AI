import os
import google.generativeai as genai
from .prompts import RISK_CLASSIFICATION_PROMPT, BANGLA_VOICE_PROMPT
import json

class MayerRAGEngine:
    def __init__(self):
        api_key = os.getenv("GEMINI_API_KEY")
        if api_key:
            genai.configure(api_key=api_key)
            self.model = genai.GenerativeModel('gemini-1.5-flash')
        else:
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
            response = self.model.generate_content(prompt)
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
            voice_res = self.model.generate_content(voice_prompt)
            result["advice_bn"] = voice_res.text.strip()
            
            return result
        except Exception as e:
            print(f"RAG Error: {e}")
            return {"explanation": f"We detected {risk_level} risk. Please seek medical attention."}

rag_engine = MayerRAGEngine()
