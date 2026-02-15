import React, { useState, useEffect, useRef } from 'react';
import Confetti from 'react-confetti';
import { useWindowSize } from 'react-use';

const SpeechToText = () => {
  const [isRecording, setIsRecording] = useState(false);
  const [transcript, setTranscript] = useState('');
  const recognitionRef = useRef(null);
  
  // UX Features
  const [showConfetti, setShowConfetti] = useState(false);
  const [panicMode, setPanicMode] = useState(false);
  const [highContrast, setHighContrast] = useState(false);
  const [isPlayingNoise, setIsPlayingNoise] = useState(false);
  
  const { width, height } = useWindowSize();
  const audioContextRef = useRef(null);

  // Initialize Speech Recognition
  useEffect(() => {
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      recognitionRef.current = new SpeechRecognition();
      recognitionRef.current.continuous = true;
      recognitionRef.current.interimResults = true;

      recognitionRef.current.onresult = (event) => {
        let final = '';
        for (let i = 0; i < event.results.length; i++) {
          final += event.results[i][0].transcript + ' ';
        }
        setTranscript(final);
      };
    }
  }, []);

  // --- BROWN NOISE LOGIC (Same as TTS) ---
  const toggleBrownNoise = () => {
    if (isPlayingNoise) {
      audioContextRef.current?.close();
      setIsPlayingNoise(false);
    } else {
      const ctx = new (window.AudioContext || window.webkitAudioContext)();
      const bufferSize = 4096;
      const brownNoise = ctx.createScriptProcessor(bufferSize, 1, 1);
      let lastOut = 0;
      
      brownNoise.onaudioprocess = (e) => {
        const output = e.outputBuffer.getChannelData(0);
        for (let i = 0; i < bufferSize; i++) {
          const white = Math.random() * 2 - 1;
          output[i] = (lastOut + (0.02 * white)) / 1.02;
          lastOut = output[i];
          output[i] *= 3.5; 
        }
      };
      
      brownNoise.connect(ctx.destination);
      audioContextRef.current = ctx;
      setIsPlayingNoise(true);
    }
  };

  useEffect(() => {
    return () => audioContextRef.current?.close();
  }, []);

  const toggleRecording = () => {
    if (isRecording) {
      recognitionRef.current.stop();
    } else {
      recognitionRef.current.start();
    }
    setIsRecording(!isRecording);
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(transcript);
    setShowConfetti(true);
    setTimeout(() => setShowConfetti(false), 4000);
  };

  // --- PANIC MODE OVERLAY ---
  if (panicMode) {
    return (
      <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-stone-900 text-stone-300">
        <h1 className="text-4xl font-light mb-8 tracking-widest">BREATHE</h1>
        <div className="w-64 h-64 rounded-full border-4 border-stone-700 animate-pulse mb-8 flex items-center justify-center">
             <span className="text-2xl">Inhale... Exhale</span>
        </div>
        <button 
          onClick={toggleBrownNoise}
          className={`px-6 py-3 rounded-full mb-8 transition-all ${
            isPlayingNoise ? 'bg-amber-900/50 text-amber-200' : 'bg-stone-800 text-stone-400'
          }`}
        >
          {isPlayingNoise ? '🌊 Stop Brown Noise' : '🌊 Play Brown Noise (Focus)'}
        </button>
        <button 
          onClick={() => {
            setPanicMode(false);
            if(isPlayingNoise) toggleBrownNoise();
          }}
          className="px-8 py-2 border border-stone-600 rounded hover:bg-stone-800"
        >
          Exit Panic Mode
        </button>
      </div>
    );
  }

  // --- MAIN COMPONENT ---
  return (
    <div className={`relative p-6 rounded-xl transition-colors duration-300 ${
      highContrast ? 'bg-black text-yellow-300 border-2 border-yellow-300' : 'bg-gray-800 text-white'
    }`}>
      {showConfetti && <Confetti width={width} height={height} numberOfPieces={200} recycle={false} />}

      <div className="flex justify-between items-center mb-6">
        <h2 className={`font-bold ${highContrast ? 'text-3xl' : 'text-xl'}`}>Speech to Text</h2>
        <div className="flex gap-2">
          <button onClick={() => setHighContrast(!highContrast)} title="Accessibility Mode" className="p-2 bg-gray-700 rounded hover:bg-gray-600">
            👁️
          </button>
          <button onClick={() => setPanicMode(true)} title="Panic Mode" className="p-2 bg-red-900/50 text-red-200 rounded hover:bg-red-900">
            🚨
          </button>
        </div>
      </div>

      <div className={`w-full h-64 p-4 rounded mb-6 overflow-y-auto whitespace-pre-wrap ${
         highContrast 
         ? 'bg-black border-2 border-yellow-300 text-yellow-300 text-xl font-bold' 
         : 'bg-gray-700 border border-gray-600 text-gray-200'
      }`}>
        {transcript || "Start speaking..."}
      </div>

      <div className="flex gap-4">
        <button
          onClick={toggleRecording}
          className={`flex-1 py-3 rounded-lg font-bold flex items-center justify-center gap-2 transition-all ${
            isRecording 
              ? 'bg-red-600 animate-pulse' 
              : highContrast ? 'bg-yellow-400 text-black' : 'bg-green-600 hover:bg-green-500'
          }`}
        >
          {isRecording ? (
            <><span>⏹</span> Stop Recording</>
          ) : (
            <><span>🎙</span> Start Recording</>
          )}
        </button>

        <button
          onClick={handleCopy}
          className={`px-6 py-3 rounded-lg font-bold ${
            highContrast ? 'bg-gray-800 text-yellow-300 border border-yellow-300' : 'bg-gray-600 hover:bg-gray-500'
          }`}
        >
          Copy Text
        </button>
      </div>
    </div>
  );
};

export default SpeechToText;