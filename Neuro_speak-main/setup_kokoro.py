import urllib.request
import shutil
import os

print("⬇️  Downloading Compatible Model (v0.19)...")

# URLs from the official library release (Guaranteed to match voices.bin)
MODEL_URL = "https://github.com/thewh1teagle/kokoro-onnx/releases/download/model-files/kokoro-v0_19.onnx"
VOICES_URL = "https://github.com/thewh1teagle/kokoro-onnx/releases/download/model-files/voices.bin"

try:
    # 1. Download Model
    print(f"⏳ Fetching Model from GitHub...")
    urllib.request.urlretrieve(MODEL_URL, "kokoro-v0_19.onnx")
    print("✅ Model Downloaded (kokoro-v0_19.onnx)")

    # 2. Download Voices (Just to be safe, we re-download the matching one)
    print(f"⏳ Fetching Voices from GitHub...")
    urllib.request.urlretrieve(VOICES_URL, "voices.bin")
    print("✅ Voices Downloaded (voices.bin)")

    print("\n🎉 REPAIR COMPLETE! You are now fully synced on v0.19.")

except Exception as e:
    print(f"\n❌ Error: {e}")