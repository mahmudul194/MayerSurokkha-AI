import asyncio
import os
import sys

# Add backend directory to sys.path so we can import the module
sys.path.append(r"d:\CloudCamp - Hackathon\MayerSurokkha AI\backend")

from dotenv import load_dotenv
load_dotenv(r"d:\CloudCamp - Hackathon\MayerSurokkha AI\backend\.env")

from app.voice_engine import voice_engine

async def main():
    # Create a tiny dummy wav file or just pass empty bytes
    dummy_audio = b"RIFF\x24\x00\x00\x00WAVEfmt \x10\x00\x00\x00\x01\x00\x01\x00D\xac\x00\x00\x88X\x01\x00\x02\x00\x10\x00data\x00\x00\x00\x00"
    try:
        result = await voice_engine.process_audio(dummy_audio, mime_type="audio/wav")
        print("Success:", result)
    except Exception as e:
        print("Error outside:", e)

if __name__ == "__main__":
    asyncio.run(main())
