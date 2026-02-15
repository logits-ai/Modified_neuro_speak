import React, { useState, useEffect, useRef } from 'react';

const PanicMode = ({ isOpen, onClose }) => {
  const [isPlayingNoise, setIsPlayingNoise] = useState(false);
  const audioContextRef = useRef(null);

  // --- BROWN NOISE GENERATOR (Web Audio API) ---
  const toggleBrownNoise = () => {
    if (isPlayingNoise) {
      audioContextRef.current?.close();
      setIsPlayingNoise(false);
    } else {
      // Create Audio Context
      const ctx = new (window.AudioContext || window.webkitAudioContext)();
      const bufferSize = 4096;
      
      // Create a ScriptProcessor (Standard Brown Noise Math)
      const brownNoise = ctx.createScriptProcessor(bufferSize, 1, 1);
      let lastOut = 0;
      
      brownNoise.onaudioprocess = (e) => {
        const output = e.outputBuffer.getChannelData(0);
        for (let i = 0; i < bufferSize; i++) {
          const white = Math.random() * 2 - 1;
          output[i] = (lastOut + (0.02 * white)) / 1.02;
          lastOut = output[i];
          output[i] *= 3.5; // Gain compensation to make it audible
        }
      };
      
      brownNoise.connect(ctx.destination);
      audioContextRef.current = ctx;
      setIsPlayingNoise(true);
    }
  };

  // Cleanup: Stop noise if the component unmounts
  useEffect(() => {
    return () => {
      audioContextRef.current?.close();
    };
  }, []);

  // If Panic Mode is not active, render nothing
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-stone-900 text-stone-300">
      <h1 className="text-4xl font-light mb-8 tracking-widest">BREATHE</h1>
      
      {/* Pulse Animation */}
      <div className="w-64 h-64 rounded-full border-4 border-stone-700 animate-pulse mb-8 flex items-center justify-center">
         <span className="text-2xl">Inhale... Exhale</span>
      </div>
      
      {/* Brown Noise Button */}
      <button 
        onClick={toggleBrownNoise}
        className={`px-6 py-3 rounded-full mb-8 transition-all ${
          isPlayingNoise ? 'bg-amber-900/50 text-amber-200' : 'bg-stone-800 text-stone-400'
        }`}
      >
        {isPlayingNoise ? '🌊 Stop Brown Noise' : '🌊 Play Brown Noise (Focus)'}
      </button>

      {/* Exit Button */}
      <button 
        onClick={() => {
          if(isPlayingNoise) toggleBrownNoise(); // Auto-stop noise on exit
          onClose();
        }}
        className="px-8 py-2 border border-stone-600 rounded hover:bg-stone-800"
      >
        Exit Panic Mode
      </button>
    </div>
  );
};

export default PanicMode;