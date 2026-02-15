import React, { useState, useEffect, useRef } from 'react';
import Confetti from 'react-confetti';
import { useWindowSize } from 'react-use';

const TextToSpeech = () => {
  const [text, setText] = useState('');
  const [loading, setLoading] = useState(false);
  const [audioUrl, setAudioUrl] = useState(null);
  const [speed, setSpeed] = useState(1.0);
  
  // NEW: Voice State (Defaulting to the Japanese ASMR voice)
  const [voice, setVoice] = useState('jf_alpha'); 
  
  // UX Features
  const [showConfetti, setShowConfetti] = useState(false);
  const [panicMode, setPanicMode] = useState(false);
  const [highContrast, setHighContrast] = useState(false);
  const [isPlayingNoise, setIsPlayingNoise] = useState(false);
  
  const { width, height } = useWindowSize();
  const audioContextRef = useRef(null);

  // --- BROWN NOISE GENERATOR (Web Audio API) ---
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

  const handleGenerate = async () => {
    if (!text) return;
    setLoading(true);
    setAudioUrl(null);
    setShowConfetti(false);

    // NEW: Automatically determine language based on the voice ID
    // If the voice starts with 'j', it's Japanese ('ja'). Otherwise, English ('en-us').
    const selectedLang = voice.startsWith('j') ? 'ja' : 'en-us';

    try {
      const response = await fetch('http://localhost:8000/tts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        // NEW: Sending voice, speed, and lang to the Python server
        body: JSON.stringify({ 
            text: text, 
            speed: parseFloat(speed),
            voice: voice,
            lang: selectedLang
        }),
      });

      if (!response.ok) throw new Error('Generation failed');

      const blob = await response.blob();
      const url = URL.createObjectURL(blob);
      setAudioUrl(url);
      setShowConfetti(true);
      setTimeout(() => setShowConfetti(false), 5000); 

    } catch (error) {
      console.error(error);
      alert('Ensure server.py is running!');
    } finally {
      setLoading(false);
    }
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
        <h2 className={`font-bold ${highContrast ? 'text-3xl' : 'text-xl'}`}>Text to Speech</h2>
        <div className="flex gap-2">
          <button onClick={() => setHighContrast(!highContrast)} title="Accessibility Mode" className="p-2 bg-gray-700 rounded hover:bg-gray-600">
            👁️
          </button>
          <button onClick={() => setPanicMode(true)} title="Panic Mode" className="p-2 bg-red-900/50 text-red-200 rounded hover:bg-red-900">
            🚨
          </button>
        </div>
      </div>

      <textarea
        className={`w-full p-4 rounded mb-4 focus:outline-none focus:ring-2 ${
          highContrast 
            ? 'bg-black border-2 border-yellow-300 text-yellow-300 text-xl font-bold' 
            : 'bg-gray-700 border border-gray-600 text-white'
        }`}
        rows="5"
        placeholder="Type here..."
        value={text}
        onChange={(e) => setText(e.target.value)}
      />

      {/* NEW: Voice Selection Dropdown */}
      <div className="flex items-center gap-4 mb-4">
        <label className="text-sm opacity-80 whitespace-nowrap min-w-[50px]">Voice:</label>
        <select
          value={voice}
          onChange={(e) => setVoice(e.target.value)}
          className={`w-full p-2 rounded focus:outline-none focus:ring-2 ${
            highContrast ? 'bg-black border border-yellow-300 text-yellow-300' : 'bg-gray-700 border border-gray-600 text-white'
          }`}
        >
          <optgroup label="Japanese (ASMR / Anime)">
            <option value="jf_alpha">Alpha (Soft/ASMR)</option>
            <option value="jf_gongitsune">Gongitsune (Young Female)</option>
            <option value="jf_nezumi">Nezumi (Female)</option>
            <option value="jf_tebukuro">Tebukuro (Female)</option>
          </optgroup>
          <optgroup label="English">
            <option value="af_sarah">Sarah (US Female)</option>
            <option value="af_bella">Bella (US Female)</option>
            <option value="am_adam">Adam (US Male)</option>
          </optgroup>
        </select>
      </div>

      <div className="flex items-center gap-4 mb-6">
        <label className="text-sm opacity-80 whitespace-nowrap min-w-[50px]">Speed: {speed}x</label>
        <input 
          type="range" min="0.5" max="2.0" step="0.1" 
          value={speed} onChange={(e) => setSpeed(e.target.value)}
          className="w-full accent-blue-500"
        />
      </div>

      <button
        onClick={handleGenerate}
        disabled={loading}
        className={`w-full py-3 rounded-lg font-bold transition-all ${
          loading 
            ? 'bg-gray-600 cursor-not-allowed' 
            : highContrast 
              ? 'bg-yellow-400 text-black hover:bg-yellow-500' 
              : 'bg-blue-600 hover:bg-blue-500 shadow-lg shadow-blue-900/50'
        }`}
      >
        {loading ? 'Processing...' : 'Generate Speech'}
      </button>

      {audioUrl && (
        <div className="mt-6 animate-fade-in">
          <audio controls src={audioUrl} autoPlay className="w-full" />
        </div>
      )}
    </div>
  );
};

export default TextToSpeech;