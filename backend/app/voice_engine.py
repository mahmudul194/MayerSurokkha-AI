import os
import json
import base64
import google.generativeai as genai
from pydantic import BaseModel

class VoiceResult(BaseModel):
    text: str
    is_safe: bool
    moderation_reason: str = ""

class VoiceEngine:
    def __init__(self):
        self.model = None
        api_key = os.getenv("GEMINI_API_KEY")
        if api_key:
            genai.configure(api_key=api_key)
            # Use same model as rag_engine
            self.model = genai.GenerativeModel('gemini-3-flash-preview')
            
    async def process_audio(self, audio_bytes: bytes, mime_type: str = "audio/webm") -> VoiceResult:
        if not self.model:
            return VoiceResult(text="Error: AI engine not configured.", is_safe=False, moderation_reason="API key missing")

        prompt = """
        You are an AI assistant for a maternal healthcare app in rural areas. 
        Listen to the following audio and do two things:
        1. Transcribe it perfectly (in its original language, e.g., Bengali or English).
        2. Moderate the content. If the audio contains severe profanity, hate speech, or is completely unrelated to health, pregnancy, childcare, or emergency situations, flag it as unsafe.

        Return ONLY a raw JSON object with this exact schema (no markdown formatting or code blocks):
        {
            "text": "<the transcription>",
            "is_safe": <true/false>,
            "moderation_reason": "<if false, explain why concisely, else empty string>"
        }
        """

        try:
            # Prepare inline audio data
            audio_part = {
                "mime_type": mime_type,
                "data": audio_bytes
            }
            
            response = await self.model.generate_content_async([prompt, audio_part])
            
            # Parse JSON
            raw_text = response.text.strip().replace("```json", "").replace("```", "").strip()
            result_dict = json.loads(raw_text)
            
            return VoiceResult(
                text=result_dict.get("text", ""),
                is_safe=result_dict.get("is_safe", True),
                moderation_reason=result_dict.get("moderation_reason", "")
            )
            
        except Exception as e:
            print(f"Voice Engine Error: {e}")
            return VoiceResult(
                text="Could not process audio.", 
                is_safe=False, 
                moderation_reason="Server processing error."
            )

voice_engine = VoiceEngine()
