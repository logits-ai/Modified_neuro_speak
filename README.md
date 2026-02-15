# ⚡ NeuroSpeak

> **AI-Powered Text-to-Speech Designed for Neurodiversity.**
> *Optimized for NVIDIA RTX GPUs | Local Inference | Accessibility First*

![License](https://img.shields.io/badge/license-MIT-blue.svg)
![Python](https://img.shields.io/badge/python-3.10%2B-blue)
![React](https://img.shields.io/badge/react-18-cyan)
![GPU](https://img.shields.io/badge/NVIDIA-RTX%20Optimized-green)

---

## 🧠 The Mission
**NeuroSpeak** is not just a TTS tool; it is an accessibility suite designed for users with **ADHD, Dyslexia, Autism, and OCD**.

Standard TTS readers are often robotic and lack sensory controls. NeuroSpeak combines high-fidelity AI voices (using the **Kokoro-82M model**) with features specifically engineered for neurodivergent brains, such as Brown Noise for focus, Panic Mode for sensory overload, and Gamification for motivation.

## ✨ Key Features

### 🛡️ For Sensory Processing (Autism/SPD)
* **🚨 Panic Mode:** A dedicated "Safety Switch" that instantly blacks out the screen, stops all audio, and plays calming **Brown Noise** with a visual breathing guide.
* **Local Processing:** No internet lag. Everything runs on your machine for consistent, anxiety-free performance.

### 🎯 For ADHD & Focus
* **⚡ Instant Start (3-Word Burst):** Uses a smart buffering logic to start speaking instantly (within 50ms) while the rest of the sentence generates in the background. No waiting = No distraction.
* **🎉 Dopamine Feedback:** Visual "Success Confetti" triggers upon successful generation to provide the micro-reward needed to keep ADHD brains engaged.
* **ASMR/Anime Voices:** Includes unique voice profiles (like *Japanese-Alpha*) to maintain attention through novelty.

### 👁️ For Dyslexia & Vision
* **Contrast Toggle:** One-click switch between "Cool Gray" (Soft) and "High Contrast" (Yellow-on-Black) themes.
* **Bimodal Reading:** Listen while you read to improve comprehension and retention.

---

## 🛠️ Tech Stack & Architecture

This is a **Monorepo** containing both the React Frontend and Python Backend.

### **The "Brain" (Backend)**
* **Framework:** FastAPI (Python)
* **AI Engine:** [Kokoro-82M](https://huggingface.co/hexgrad/Kokoro-82M) via ONNX Runtime.
* **Hardware Acceleration:** NVIDIA CUDA 12 (runs directly on RTX 4050/4060).
* **Audio Processing:** `soundfile` + `numpy` (v2.3.2).

### **The "Face" (Frontend)**
* **Framework:** React + Vite
* **Styling:** Tailwind CSS
* **State Management:** React Hooks (`useState`, `useRef` for audio queuing).
* **Audio Engine:** Web Audio API (for Brown Noise generation).

---

## 🚀 Installation Guide

### Prerequisites
1.  **NVIDIA GPU** (Recommended for speed) with [CUDA 12.x drivers](https://developer.nvidia.com/cuda-downloads).
2.  **Node.js** (v18 or higher).
3.  **Python** (v3.10 or higher).

### Step 1: Clone the Repository
```bash
git clone [https://github.com/logits-ai/neuro-speak.git](https://github.com/logits-ai/neuro-speak.git)
cd neuro-speak
