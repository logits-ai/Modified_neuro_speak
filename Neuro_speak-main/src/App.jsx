import React, { useState, useEffect, useRef } from 'react';
<<<<<<< HEAD
import PanicMode from './components/PanicMode';
import SuccessConfetti from './components/SuccessConfetti';
import AccessibilityToggle from './components/AccessibilityToggle';

function App() {
  // --- STATE MANAGEMENT ---
=======

function App() {
>>>>>>> 883d85f1f20eb6b35ba547baf2dfcddb30cc7b1d
  const [text, setText] = useState("Copilot gives shitty results but Gemini is love. That will install the GPU-enabled runtime into your venv, and your RTX 4060 will be used.");
  const [isListening, setIsListening] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [status, setStatus] = useState("System Ready");
  
<<<<<<< HEAD
  // New Features State
  const [voice, setVoice] = useState("jf_alpha"); // Default to Japanese ASMR
  const [speed, setSpeed] = useState(1.0);
  const [panicMode, setPanicMode] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);
  const [highContrast, setHighContrast] = useState(false);
  
=======
>>>>>>> 883d85f1f20eb6b35ba547baf2dfcddb30cc7b1d
  const recognitionRef = useRef(null);
  const audioQueue = useRef([]); 
  const isPlayingRef = useRef(false);

  // --- 1. AUDIO PLAYER (Queue System) ---
  const playNextInQueue = () => {
    if (audioQueue.current.length === 0) {
      isPlayingRef.current = false;
      setIsSpeaking(false);
      setStatus("Finished");
      return;
    }

    isPlayingRef.current = true;
<<<<<<< HEAD
    const blob = audioQueue.current.shift(); // Get the next audio chunk
=======
    const blob = audioQueue.current.shift();
>>>>>>> 883d85f1f20eb6b35ba547baf2dfcddb30cc7b1d
    const audio = new Audio(URL.createObjectURL(blob));
    
    audio.onended = () => {
      playNextInQueue(); 
    };
    audio.play();
  };

<<<<<<< HEAD
  // --- 2. THE "INSTANT START" LOGIC (Updated for Voice/Speed) ---
  const handleSpeak = async () => {
    if (!text || isSpeaking) return;
    setIsSpeaking(true);
    setStatus("🚀 instant start...");
    setShowConfetti(false); // Reset confetti

    // Auto-detect language based on voice selection
    const selectedLang = voice.startsWith('j') ? 'ja' : 'en-us';

    // 1. Prepare Text (Remove newlines)
    const cleanText = text.replace(/\n/g, " ");
    
    // 2. The "3-WORD BURST" Strategy
=======
  // --- 2. THE "INSTANT START" LOGIC ---
const handleSpeak = async () => {
    if (!text || isSpeaking) return;
    setIsSpeaking(true);
    setStatus("🚀 instant start...");

    // 1. Prepare Text
    // Remove newlines to prevent weird pauses
    const cleanText = text.replace(/\n/g, " ");
    
    // 2. The "3-WORD BURST" Strategy
    // Chunk 1: First 3 words (Generates in ~50ms -> Instant Audio)
    // Chunk 2: Rest of the sentence
    // Chunk 3: Rest of the paragraph
>>>>>>> 883d85f1f20eb6b35ba547baf2dfcddb30cc7b1d
    const words = cleanText.split(" ");
    let chunks = [];

    if (words.length > 3) {
<<<<<<< HEAD
      chunks.push(words.slice(0, 3).join(" ")); // Chunk 1: The "Burst"
      
      const remainingText = words.slice(3).join(" ");
      // Chunk 2+: Split the rest by punctuation
=======
      chunks.push(words.slice(0, 3).join(" ")); // The "Burst"
      
      // Split the rest by punctuation
      const remainingText = words.slice(3).join(" ");
>>>>>>> 883d85f1f20eb6b35ba547baf2dfcddb30cc7b1d
      const restChunks = remainingText.match(/[^.?!,;]+[.?!,;]+[\])'"]*|.+/g) || [remainingText];
      chunks.push(...restChunks);
    } else {
      chunks = [cleanText];
    }

    // 3. Streaming Loop
    for (let i = 0; i < chunks.length; i++) {
      const chunk = chunks[i].trim();
      if (!chunk) continue;

      try {
        const response = await fetch("http://localhost:8000/tts", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
<<<<<<< HEAD
          // UPDATED: Sending Voice, Speed, and Lang dynamically!
          body: JSON.stringify({ 
            text: chunk, 
            voice: voice,
            speed: parseFloat(speed),
            lang: selectedLang
=======
          body: JSON.stringify({ 
            text: chunk, 
            speed: 1.1 
>>>>>>> 883d85f1f20eb6b35ba547baf2dfcddb30cc7b1d
          })
        });

        if (!response.ok) throw new Error("Server Error");

        const blob = await response.blob();
        audioQueue.current.push(blob);

<<<<<<< HEAD
        // If this is the first chunk, trigger confetti and start playing!
        if (!isPlayingRef.current) {
          setShowConfetti(true); // 🎉 Confetti on first success
          playNextInQueue();
          setTimeout(() => setShowConfetti(false), 5000); // Stop confetti after 5s
=======
        if (!isPlayingRef.current) {
          playNextInQueue();
>>>>>>> 883d85f1f20eb6b35ba547baf2dfcddb30cc7b1d
        }

      } catch (e) {
        console.error(e);
<<<<<<< HEAD
        setStatus("Error: Check Server");
=======
>>>>>>> 883d85f1f20eb6b35ba547baf2dfcddb30cc7b1d
      }
    }
  };

<<<<<<< HEAD
  // --- 3. PROACTIVE GPU WARM-UP (Updated) ---
  const warmUpGPU = async () => {
    const selectedLang = voice.startsWith('j') ? 'ja' : 'en-us';
    await fetch("http://localhost:8000/tts", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ 
        text: ".", 
        voice: voice,
        speed: parseFloat(speed),
        lang: selectedLang
      })
    }).catch(() => {});
  };

  // --- 4. SPEECH TO TEXT ---
=======


  // --- 3. PROACTIVE GPU WARM-UP ---
  // Wakes up the GPU the moment your mouse touches the button
  const warmUpGPU = async () => {
    await fetch("http://localhost:8000/tts", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ text: ".", speed: 2.0 })
    }).catch(() => {});
  };

  // --- 4. SPEECH TO TEXT & UTILS ---
>>>>>>> 883d85f1f20eb6b35ba547baf2dfcddb30cc7b1d
  useEffect(() => {
    if ('webkitSpeechRecognition' in window) {
      const recognition = new window.webkitSpeechRecognition();
      recognition.continuous = false;
      recognition.lang = 'en-US';
      recognition.onresult = (e) => {
        const t = e.results[0][0].transcript;
        setText(prev => prev + " " + t);
        setStatus("Heard: " + t);
      };
      recognition.onend = () => setIsListening(false);
      recognitionRef.current = recognition;
    }
  }, []);

  const toggleListening = () => {
    if (isListening) recognitionRef.current?.stop();
    else {
      recognitionRef.current?.start();
      setIsListening(true);
      setStatus("Listening...");
    }
  };

<<<<<<< HEAD
  // --- STYLING (High Contrast Logic) ---
  const theme = {
    bg: highContrast ? '#000000' : '#1e1e2e',
    text: highContrast ? '#ffff00' : '#cdd6f4', // Yellow vs Soft White
    cardBg: highContrast ? '#000000' : '#313244',
    border: highContrast ? '2px solid #ffff00' : '2px solid #45475a',
    accent: highContrast ? '#ffff00' : '#89b4fa',
    highlight: highContrast ? '#ffff00' : '#f9e2af',
  };

  return (
    <div style={{ 
      minHeight: '100vh', backgroundColor: theme.bg, color: theme.text,
      fontFamily: 'Inter, sans-serif', display: 'flex', flexDirection: 'column', alignItems: 'center',
      transition: 'all 0.3s ease'
    }}>
      
      {/* 1. CONFETTI */}
      <SuccessConfetti trigger={showConfetti} />

      {/* 2. HEADER & TOGGLES */}
      <nav style={{ width: '100%', padding: '20px', background: 'rgba(0,0,0,0.2)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h1 style={{ margin: 0, fontWeight: 'bold', fontSize: '1.5rem' }}>⚡ NeuroSpeak</h1>
        
        <div style={{ display: 'flex', gap: '10px' }}>
          {/* Accessibility Toggle Component */}
          <AccessibilityToggle highContrast={highContrast} setHighContrast={setHighContrast} />
          
          {/* Panic Button */}
          <button 
            onClick={() => setPanicMode(true)} 
            style={{ background: '#ff4757', border: 'none', borderRadius: '5px', padding: '10px', cursor: 'pointer', fontSize: '1.2rem' }}
            title="Panic Mode"
          >
            🚨
          </button>
        </div>
      </nav>

      <main style={{ width: '100%', maxWidth: '800px', margin: '40px auto', padding: '20px', textAlign: 'center' }}>
        <div style={{ marginBottom: '10px', opacity: 0.8, color: theme.highlight }}>STATUS: {status}</div>
        
        {/* 3. NEW CONTROLS (Voice & Speed) */}
        <div style={{ display: 'flex', gap: '20px', marginBottom: '20px', flexWrap: 'wrap', justifyContent: 'center' }}>
          
          {/* Voice Dropdown */}
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'start', flex: 1, minWidth: '200px' }}>
            <label style={{ fontSize: '0.8rem', opacity: 0.7, marginBottom: '5px' }}>VOICE MODEL</label>
            <select 
              value={voice}
              onChange={(e) => setVoice(e.target.value)}
              style={{ 
                width: '100%', padding: '10px', borderRadius: '8px', 
                background: theme.cardBg, color: theme.text, border: theme.border 
              }}
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

          {/* Speed Slider */}
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'start', flex: 1, minWidth: '200px' }}>
             <label style={{ fontSize: '0.8rem', opacity: 0.7, marginBottom: '5px' }}>SPEED: {speed}x</label>
             <input 
               type="range" min="0.5" max="2.0" step="0.1"
               value={speed} onChange={(e) => setSpeed(e.target.value)}
               style={{ width: '100%', accentColor: theme.accent, cursor: 'pointer' }}
             />
          </div>
        </div>

        {/* 4. TEXT AREA */}
=======
  return (
    <div style={{ 
      minHeight: '100vh', backgroundColor: '#1e1e2e', color: '#cdd6f4',
      fontFamily: 'Inter, sans-serif', display: 'flex', flexDirection: 'column', alignItems: 'center'
    }}>
      <nav style={{ width: '100%', padding: '20px', background: 'rgba(0,0,0,0.2)', textAlign: 'center' }}>
        <h1 style={{ margin: 0, fontWeight: 'bold' }}>⚡ NeuroSpeak (RTX 4050)</h1>
      </nav>

      <main style={{ maxWidth: '800px', margin: '40px auto', padding: '20px', textAlign: 'center' }}>
        <div style={{ marginBottom: '10px', opacity: 0.8, color: '#f9e2af' }}>STATUS: {status}</div>
        
>>>>>>> 883d85f1f20eb6b35ba547baf2dfcddb30cc7b1d
        <textarea 
          value={text}
          onChange={(e) => setText(e.target.value)}
          style={{
<<<<<<< HEAD
            width: '100%', height: '200px', background: theme.cardBg, color: theme.text,
            border: theme.border, borderRadius: '15px', padding: '20px', 
            fontSize: '1.2rem', resize: 'none', outline: 'none',
            boxShadow: highContrast ? 'none' : '0 10px 30px rgba(0,0,0,0.3)'
          }}
        />

        {/* 5. ACTION BUTTONS */}
        <div style={{ display: 'flex', justifyContent: 'center', gap: '20px', marginTop: '30px' }}>
          <button 
            onClick={toggleListening} 
            style={{ 
              width: '60px', height: '60px', borderRadius: '50%', border: highContrast ? '2px solid white' : 'none', 
              background: isListening ? '#ff4757' : theme.accent, color: highContrast ? 'black' : 'white',
              cursor: 'pointer', fontSize: '1.5rem', transition: 'transform 0.2s'
            }}
          >
            🎤
          </button>

          <button 
            onMouseEnter={warmUpGPU} 
            onClick={handleSpeak} 
            disabled={isSpeaking} 
            style={{ 
              padding: '0 40px', borderRadius: '30px', border: highContrast ? '2px solid white' : 'none', 
              background: highContrast ? '#ffff00' : '#a6e3a1', 
              color: highContrast ? 'black' : '#1e1e2e',
              fontSize: '1.2rem', fontWeight: 'bold', 
              cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '10px', 
              opacity: isSpeaking ? 0.7 : 1, transition: 'all 0.2s',
              boxShadow: highContrast ? 'none' : '0 5px 15px rgba(166, 227, 161, 0.4)'
=======
            width: '100%', height: '200px', background: '#313244', color: 'white',
            border: `2px solid #45475a`, borderRadius: '15px', padding: '20px', 
            fontSize: '1.2rem', resize: 'none', outline: 'none'
          }}
        />

        <div style={{ display: 'flex', justifyContent: 'center', gap: '20px', marginTop: '30px' }}>
          <button onClick={toggleListening} style={{ width: '60px', height: '60px', borderRadius: '50%', border: 'none', background: isListening ? '#ff4757' : '#89b4fa', cursor: 'pointer', fontSize: '1.5rem' }}>
            🎤
          </button>

          {/* THE MAGIC BUTTON */}
          <button 
            onMouseEnter={warmUpGPU} // <--- Wakes up GPU before you click!
            onClick={handleSpeak} 
            disabled={isSpeaking} 
            style={{ 
              padding: '0 40px', borderRadius: '30px', border: 'none', 
              background: '#a6e3a1', fontSize: '1.2rem', fontWeight: 'bold', 
              cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '10px', 
              opacity: isSpeaking ? 0.7 : 1, transition: 'all 0.2s'
>>>>>>> 883d85f1f20eb6b35ba547baf2dfcddb30cc7b1d
            }}
          >
             🔊 {isSpeaking ? 'Speaking...' : 'Read Aloud'}
          </button>
        </div>
      </main>
<<<<<<< HEAD

      {/* 6. PANIC MODE OVERLAY */}
      <PanicMode isOpen={panicMode} onClose={() => setPanicMode(false)} />

=======
>>>>>>> 883d85f1f20eb6b35ba547baf2dfcddb30cc7b1d
    </div>
  );
}

export default App;