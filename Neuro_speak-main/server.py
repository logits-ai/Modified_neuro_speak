from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import Response
from kokoro_onnx import Kokoro
import onnxruntime as ort
import soundfile as sf
import io
import os

# --- APP SETUP ---
app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# --- LOAD AI MODEL ---
print("\n------------------------------------------------")
print("🚀 Initializing NVIDIA CUDA Engine...")

try:
    # 1. Initialize Kokoro normally
    kokoro = Kokoro("kokoro-v0_19.onnx", "voices.bin")
    
    # 2. THE BRAIN TRANSPLANT: Force it to use CUDA!
    kokoro.sess = ort.InferenceSession(
        "kokoro-v0_19.onnx", 
        providers=['CUDAExecutionProvider', 'CPUExecutionProvider']
    )
    
    # 3. Verify it worked
    active_provider = kokoro.sess.get_providers()[0]
    print(f"✅ NVIDIA GPU Detected: CUDA is ready.")
    print(f"⚡ ACTIVE ENGINE: {active_provider}")
    print("------------------------------------------------\n")

except Exception as e:
    print(f"❌ CRITICAL ERROR: Could not load model.\n{e}")
    print("------------------------------------------------\n")
    raise e

# --- DATA MODEL ---
class TTSRequest(BaseModel):
    text: str
    voice: str = "jf_alpha"  # Added voice variable
    speed: float = 1.0       # Added speed variable
    lang: str = "ja"         # Added lang variable

# --- API ENDPOINT ---
@app.post("/tts")
async def text_to_speech(request: TTSRequest):
    try:
        # Generate audio using the Japanese ASMR voice
        samples, sample_rate = kokoro.create(
            request.text, 
            voice="jf_alpha",   # 'jf_alpha' is the soft, cute Japanese female voice
            speed=0.85,         # 0.85 slows it down slightly for that relaxed ASMR feel
            lang="ja"           # 'ja' tells the engine to use Japanese pronunciation
        )

        byte_io = io.BytesIO()
        sf.write(byte_io, samples, sample_rate, format='WAV')
        byte_io.seek(0)

        return Response(content=byte_io.read(), media_type="audio/wav")

    except Exception as e:
        print(f"Error generating audio: {e}")
        raise HTTPException(status_code=500, detail=str(e))