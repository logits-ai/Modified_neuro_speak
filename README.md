# ⚡ NeuroSpeak

> **AI-Powered Text-to-Speech Designed for Neurodiversity.**
> *Optimized for NVIDIA RTX GPUs | Local Inference | Accessibility First*

![License](https://img.shields.io/badge/license-MIT-blue.svg)
![React](https://img.shields.io/badge/react-18-cyan)
![Python](https://img.shields.io/badge/python-3.10%2B-blue)
![GPU](https://img.shields.io/badge/NVIDIA-RTX%20Optimized-green)

---

## 🧠 The Mission
**NeuroSpeak** is an accessibility suite designed for users with **ADHD, Dyslexia, Autism, and OCD**.

Standard TTS readers are often robotic and lack sensory controls. NeuroSpeak combines high-fidelity AI voices (using the **Kokoro-82M model**) with features specifically engineered for neurodivergent brains. It solves the "Wall of Text" anxiety by turning reading into an engaging, multi-sensory experience that users can control.

---

## ✨ Key Features

### 🛡️ For Sensory Processing (Autism/SPD)
* **🚨 Panic Mode:** A dedicated "Safety Switch" for sensory overload. One click instantly blacks out the screen, stops all stimulating audio, and plays calming **Brown Noise** (low-frequency static) with a visual breathing guide.
* **Local Privacy:** All processing happens locally on the user's machine, ensuring privacy and zero internet lag.

### 🎯 For ADHD & Focus
* **⚡ Instant Start (3-Word Burst):** Uses a smart buffering logic to start speaking within **50ms** by generating the first three words immediately while the rest of the sentence processes in the background. No waiting = No distraction.
* **🎉 Dopamine Feedback:** A "Success Confetti" animation triggers upon successful generation, providing the visual micro-reward needed to keep ADHD brains engaged and motivated.
* **ASMR & Anime Voices:** Includes unique voice profiles (like *Japanese-Alpha*) to provide auditory novelty and maintain attention.

### 👁️ For Dyslexia & Vision
* **Accessibility Toggle:** A one-click switch between **"Cool Gray" (Soft)** and **"High Contrast" (Yellow-on-Black)** themes.
* **Bimodal Reading:** Allows users to listen while they read, which significantly improves comprehension and retention for dyslexic readers.

---

## 🛠️ Tech Stack & Architecture

This project is a **Monorepo** containing both the React Frontend and Python Backend.

### **The "Brain" (Backend)**
* **Framework:** FastAPI (Python).
* **AI Engine:** [Kokoro-82M](https://huggingface.co/hexgrad/Kokoro-82M) running via **ONNX Runtime**.
* **Hardware Acceleration:** Optimized for **NVIDIA CUDA 12**, utilizing RTX 4050/4060 GPUs for real-time synthesis.
* **Audio Processing:** Custom logic using `soundfile` and `numpy` to stream raw audio bytes.

### **The "Face" (Frontend)**
* **Framework:** React + Vite.
* **Styling:** Tailwind CSS for rapid, responsive design.
* **State Management:** React Hooks (`useState`, `useRef`) for managing the complex audio queue and playback synchronization.
* **Audio Engine:** Web Audio API for generating Brown Noise directly in the browser.

---

## 📂 Project Structure

* **`server.py`**: The FastAPI backend that loads the AI model and handles TTS requests.
* **`src/App.jsx`**: The main application logic, handling the "Burst" streaming strategy and UI state.
* **`src/components/`**: Modular feature components:
    * `PanicMode.jsx`: Handles the blackout overlay and Brown Noise generation.
    * `SuccessConfetti.jsx`: Manages the gamification visual effects.
    * `AccessibilityToggle.jsx`: Controls the high-contrast theming.
* **`kokoro-v0_19.onnx`**: The quantized AI model weights (approx. 300MB).
* **`voices.bin`**: The voice style vectors for different speakers.

---


## 📜 License
MIT License. Free to use and modify.
