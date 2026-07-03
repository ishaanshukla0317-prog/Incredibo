import React, { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Camera, MapPin, Landmark, Crown, CalendarDays, ScrollText, Send, Loader2,
  Sparkles, X, Video, Image as ImageIcon, Mic, MicOff, Volume2, Lock
} from "lucide-react";

const tokens = {
  ink: "#141B2E",
  inkSoft: "#1E2740",
  sandstone: "#C2703D",
  sandstoneSoft: "#8C4A26",
  gold: "#D4AF37",
  ivory: "#F4ECD9",
  stone: "#948B7A",
};

function JaliPattern({ id, opacity = 0.14, color = tokens.gold }) {
  return (
    <svg width="0" height="0" style={{ position: "absolute" }}>
      <defs>
        <pattern id={id} width="44" height="44" patternUnits="userSpaceOnUse">
          <g fill="none" stroke={color} strokeWidth="1" opacity={opacity}>
            <path d="M22 2 L42 22 L22 42 L2 22 Z" />
            <circle cx="22" cy="22" r="3.5" />
            <path d="M22 2 L22 8 M22 36 L22 42 M2 22 L8 22 M36 22 L42 22" />
          </g>
        </pattern>
      </defs>
    </svg>
  );
}

function JaliLayer({ id, opacity, className = "" }) {
  return (
    <div
      className={`pointer-events-none absolute inset-0 ${className}`}
      style={{ backgroundImage: `url(#${id})` }}
    >
      <svg width="100%" height="100%">
        <rect width="100%" height="100%" fill={`url(#${id})`} />
      </svg>
    </div>
  );
}

const archStyle = {
  borderTopLeftRadius: "999px 640px",
  borderTopRightRadius: "999px 640px",
};

export default function AI() {
  const [mode, setMode] = useState("upload");
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const [monumentData, setMonumentData] = useState(null);
  const [error, setError] = useState("");
  const monumentRef = useRef(null);
  const [chatQuestion, setChatQuestion] = useState("");
  const [chatHistory, setChatHistory] = useState([]);
  const [chatLoading, setChatLoading] = useState(false);
  const fileInputRef = useRef(null);
  const chatEndRef = useRef(null);
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const [cameraActive, setCameraActive] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const recognitionRef = useRef(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const handleAuth = () => {
    setIsAuthenticated(true);
  };

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [chatHistory, chatLoading]);

  useEffect(() => {
    monumentRef.current = monumentData;
  }, [monumentData]);

  useEffect(() => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (SpeechRecognition) {
      const rec = new SpeechRecognition();
      rec.continuous = false;
      rec.interimResults = false;
      rec.lang = "en-IN";
      rec.onresult = (event) => {
        const transcript = event.results[0][0].transcript;
        triggerChat(transcript);
      };

      rec.onend = () => setIsListening(false);
      rec.onerror = (e) => {
        console.error("Speech Error:", e.error);
        setIsListening(false);
      };

      recognitionRef.current = rec;
    }
  }, [mode]);

  useEffect(() => {
    const startCamera = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: { facingMode: "environment" }
        });
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }
        setCameraActive(true);
      } catch (err) {
        setError("Camera access denied or unavailable.");
      }
    };

    const stopCamera = () => {
      if (videoRef.current && videoRef.current.srcObject) {
        videoRef.current.srcObject.getTracks().forEach((track) => track.stop());
      }
      setCameraActive(false);
    };

    if (mode === "live") {
      startCamera();
    } else {
      stopCamera();
    }

    return () => stopCamera();
  }, [mode]);

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      setFile(selectedFile);
      setPreview(URL.createObjectURL(selectedFile));
      setMonumentData(null);
      setChatHistory([]);
      setError("");
    }
  };

  const captureFrame = () => {
    if (!videoRef.current || !canvasRef.current) return;
    const canvas = canvasRef.current;
    const video = videoRef.current;
    
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    const ctx = canvas.getContext("2d");
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
    
    canvas.toBlob((blob) => {
      if (blob) detectFromBlob(blob);
    }, "image/jpeg", 0.8);
  };

  const detectFromBlob = async (blob) => {
    setLoading(true);
    setError("");
    setChatHistory([]);

    const formData = new FormData();
    formData.append("image", blob, "capture.jpg");

    const token = localStorage.getItem("accessToken");
    const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

    try {
      const response = await fetch(`${API_URL}/api/yatri/detect`, {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${token}`
        },
        body: formData,
      });

      if (response.status === 401) {
        setError("Authentication required. Please log in to use Yatri.");
        setLoading(false);
        return;
      }

      const data = await response.json();

      if (data.success) {
        setMonumentData(data.data);
      } else {
        setError(data.message || "Couldn't identify this monument.");
      }
    } catch (err) {
      setError("Couldn't reach the server. Is your backend running?");
    } finally {
      setLoading(false);
    }
  };

  const speakText = (text) => {
    if (!window.speechSynthesis) return;
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    const voices = window.speechSynthesis.getVoices();
    const indianVoice = voices.find(v => v.lang.includes("en-IN"));
    if (indianVoice) utterance.voice = indianVoice;

    utterance.onstart = () => setIsSpeaking(true);
    utterance.onend = () => setIsSpeaking(false);
    
    window.speechSynthesis.speak(utterance);
  };

  const triggerChat = async (questionText) => {
    if (!questionText.trim() || !monumentRef.current?.monument) return;

    const newQuestion = questionText;
    setChatQuestion("");
    setChatHistory((prev) => [...prev, { role: "user", text: newQuestion }]);
    setChatLoading(true);

    const token = localStorage.getItem("accessToken");
    const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

    try {
      const response = await fetch(`${API_URL}/api/yatri/chat`, {
        method: "POST",
        headers: { 
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({
          monument: monumentRef.current.monument,
          question: newQuestion,
        }),
      });

      if (response.status === 401) {
        setChatHistory((prev) => [...prev, { role: "ai", text: "Your session has expired. Please log in again." }]);
        setChatLoading(false);
        return;
      }

      const data = await response.json();
      
      const answer = data.success ? data.answer : "I couldn't find an answer to that.";
      
      setChatHistory((prev) => [...prev, { role: "ai", text: answer }]);
      if (mode === "live") {
        speakText(answer);
      }

    } catch (err) {
      setChatHistory((prev) => [...prev, { role: "ai", text: "Network trouble on my end — please try again." }]);
    } finally {
      setChatLoading(false);
    }
  };

  const handleChatFormSubmit = (e) => {
    e.preventDefault();
    triggerChat(chatQuestion);
  };

  const toggleListening = () => {
    if (!recognitionRef.current) {
      alert("Speech recognition is not supported in this browser. Please use Chrome.");
      return;
    }
    
    if (isListening) {
      recognitionRef.current.stop();
      setIsListening(false);
    } else {
      window.speechSynthesis.cancel();
      recognitionRef.current.start();
      setIsListening(true);
    }
  };

  const clearSession = () => {
    setFile(null);
    setPreview(null);
    setMonumentData(null);
    setChatHistory([]);
    setError("");
    window.speechSynthesis?.cancel();
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const isUnknown = monumentData?.monument === "Unknown";

  return (
    <div
      className="min-h-screen w-full relative overflow-x-hidden"
      style={{
        background: `radial-gradient(ellipse 120% 80% at 50% -10%, ${tokens.inkSoft} 0%, ${tokens.ink} 55%)`,
        fontFamily: "'Work Sans', ui-sans-serif, system-ui",
        color: tokens.ivory,
      }}
    >
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Fraunces:ital,opsz,wght@0,9..144,400;0,9..144,600;1,9..144,500&family=Work+Sans:wght@300;400;500;600&family=Noto+Sans+Devanagari:wght@500;700&display=swap');
        .font-display { font-family: 'Fraunces', ui-serif, Georgia, serif; }
        .font-devanagari { font-family: 'Noto Sans Devanagari', sans-serif; }
        ::selection { background: ${tokens.gold}; color: ${tokens.ink}; }
        .scrollbar-thin::-webkit-scrollbar { width: 6px; }
        .scrollbar-thin::-webkit-scrollbar-thumb { background: ${tokens.sandstone}; border-radius: 999px; }
        .scrollbar-thin::-webkit-scrollbar-track { background: transparent; }
      `}</style>

      <JaliPattern id="jaliBg" opacity={0.05} color={tokens.gold} />
      <JaliPattern id="jaliCard" opacity={0.35} color={tokens.sandstone} />
      <JaliLayer id="jaliBg" className="fixed" />
      <canvas ref={canvasRef} className="hidden" />

      <div className="relative max-w-6xl mx-auto px-6 md:px-10 py-10 md:py-16">
        <motion.header
          initial={{ opacity: 0, y: -16 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col sm:flex-row items-center justify-between gap-6 mb-14 md:mb-20"
        >
          <div className="flex items-center gap-3">
            <div
              className="w-10 h-10 flex items-center justify-center rounded-full border"
              style={{ borderColor: tokens.gold, color: tokens.gold }}
            >
              <Landmark size={18} />
            </div>
            <div>
              <div className="font-devanagari text-xl leading-none" style={{ color: tokens.ivory }}>
                यात्री
              </div>
              <div className="text-[11px] tracking-[0.25em] uppercase" style={{ color: tokens.stone }}>
                Yatri AI
              </div>
            </div>
          </div>
          <div className="flex bg-black/20 rounded-full p-1 border" style={{ borderColor: `${tokens.stone}33` }}>
            <button
              onClick={() => { setMode("upload"); clearSession(); }}
              className={`flex items-center gap-2 px-5 py-2 rounded-full text-xs tracking-wider uppercase transition-all ${mode === "upload" ? "bg-white/10 text-white" : "text-white/40 hover:text-white"}`}
            >
              <ImageIcon size={14} /> Photo
            </button>
            <button
              onClick={() => { setMode("live"); clearSession(); }}
              className={`flex items-center gap-2 px-5 py-2 rounded-full text-xs tracking-wider uppercase transition-all ${mode === "live" ? "bg-white/10 text-white" : "text-white/40 hover:text-white"}`}
            >
              <Video size={14} /> Live Guide
            </button>
          </div>
        </motion.header>

        {mode === "upload" && (
          <div className="grid md:grid-cols-2 gap-12 md:gap-16 items-center mb-20">
            <motion.div initial={{ opacity: 0, x: -24 }} animate={{ opacity: 1, x: 0 }}>
              <div className="flex items-center gap-2 mb-5" style={{ color: tokens.gold }}>
                <Sparkles size={14} />
                <span className="text-xs tracking-[0.2em] uppercase">Point. Ask. Discover.</span>
              </div>
              <h1 className="font-display text-4xl md:text-5xl leading-[1.1] mb-6" style={{ color: tokens.ivory }}>
                Every monument<br />carries a story carved<br />in stone.
              </h1>
              <p className="text-base leading-relaxed mb-8 max-w-md" style={{ color: tokens.stone }}>
                Upload a photograph of any Indian monument. Yatri identifies it, tells you its history, and answers whatever you're curious about.
              </p>

              <input
                type="file"
                accept="image/*"
                className="hidden"
                ref={fileInputRef}
                onChange={handleFileChange}
              />

              {!preview && (
                <button
                  onClick={() => fileInputRef.current?.click()}
                  className="inline-flex items-center gap-3 px-6 py-3.5 rounded-full font-medium text-sm transition-transform hover:scale-105"
                  style={{ background: tokens.gold, color: tokens.ink }}
                >
                  <Camera size={16} /> Upload a photograph
                </button>
              )}

              {error && <p className="mt-4 text-sm text-red-400">{error}</p>}
            </motion.div>

            <motion.div initial={{ opacity: 0, scale: 0.92 }} animate={{ opacity: 1, scale: 1 }} className="relative flex justify-center">
              <div className="relative w-full max-w-sm">
                <div className="absolute -inset-3 opacity-60" style={{ ...archStyle, border: `1px solid ${tokens.sandstoneSoft}` }} />
                <div
                  onClick={() => fileInputRef.current?.click()}
                  className="relative h-96 flex items-center justify-center cursor-pointer overflow-hidden"
                  style={{ ...archStyle, background: tokens.inkSoft, border: `1px solid ${tokens.gold}55` }}
                >
                  <JaliLayer id="jaliCard" />
                  {preview ? (
                    <img src={preview} alt="Uploaded" className="w-full h-full object-cover" />
                  ) : (
                    <div className="text-center px-8 relative">
                      <Landmark className="mx-auto mb-3" size={28} style={{ color: tokens.sandstone }} />
                      <p className="text-sm" style={{ color: tokens.stone }}>Your photograph will appear here</p>
                    </div>
                  )}
                </div>
                {preview && (
                  <button onClick={(e) => { e.stopPropagation(); clearSession(); }} className="absolute top-2 right-2 w-8 h-8 rounded-full flex items-center justify-center bg-black/60">
                    <X size={14} />
                  </button>
                )}
              </div>
            </motion.div>
          </div>
        )}

        {mode === "live" && (
          <div className="max-w-2xl mx-auto mb-20">
            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="relative flex justify-center">
              
              <div className="relative w-full rounded-[2rem] overflow-hidden aspect-[3/4] md:aspect-video bg-black/80 border border-white/10 shadow-2xl">
                
                <video 
                  ref={videoRef} 
                  autoPlay 
                  playsInline 
                  muted 
                  className="absolute inset-0 w-full h-full object-cover"
                  style={{ transform: "scaleX(-1)" }}
                />

                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/30 pointer-events-none" />

                <div className="absolute top-4 left-4 right-4 flex justify-between items-center z-10 pointer-events-none">
                   <div className="flex items-center gap-2 bg-black/40 backdrop-blur-md px-3 py-1.5 rounded-full border border-white/10">
                      <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
                      <span className="text-[10px] tracking-widest uppercase font-medium">Live</span>
                   </div>
                   {isSpeaking && (
                      <div className="flex items-center gap-2 bg-black/40 backdrop-blur-md px-3 py-1.5 rounded-full border border-white/10" style={{ color: tokens.gold }}>
                         <Volume2 size={12} className="animate-pulse" />
                         <span className="text-[10px] tracking-widest uppercase">AI Speaking</span>
                      </div>
                   )}
                </div>
                <div className="absolute bottom-28 left-0 w-full px-8 text-center z-10 pointer-events-none">
                  <AnimatePresence mode="wait">
                    {chatHistory.length > 0 && (
                      <motion.div
                        key={chatHistory.length}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        className="inline-block bg-black/60 backdrop-blur-md px-5 py-3 rounded-2xl border border-white/10"
                      >
                        <p className={`text-sm md:text-base leading-snug ${chatHistory[chatHistory.length-1].role === "user" ? "text-white" : "text-yellow-200"}`}>
                          {chatHistory[chatHistory.length-1].text}
                        </p>
                      </motion.div>
                    )}
                    {chatLoading && (
                      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="inline-block bg-black/60 px-5 py-3 rounded-2xl">
                         <Loader2 size={16} className="animate-spin text-white/50" />
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
                <div className="absolute bottom-8 left-0 w-full flex justify-center z-10">
                  {!monumentData ? (
                    <button
                      onClick={captureFrame}
                      disabled={loading || !cameraActive}
                      className="inline-flex items-center gap-3 px-8 py-4 rounded-full font-medium text-sm transition-transform hover:scale-105 shadow-xl disabled:opacity-70 disabled:hover:scale-100"
                      style={{ background: tokens.sandstone, color: tokens.ivory }}
                    >
                      {loading ? (
                        <><Loader2 size={16} className="animate-spin" /> Reading stone...</>
                      ) : (
                        <><Sparkles size={16} /> Identify Monument</>
                      )}
                    </button>
                  ) : (
                    <div className="flex flex-col items-center gap-3">
                       <span className="text-xs uppercase tracking-widest font-bold drop-shadow-md" style={{ color: tokens.gold }}>
                         {monumentData.monument} Detected
                       </span>
                       
                      
                       {!isAuthenticated ? (
                          <button
                            onClick={handleAuth}
                            className="w-16 h-16 rounded-full flex items-center justify-center shadow-xl hover:scale-105 transition-all bg-black/50 backdrop-blur-md"
                            style={{ color: tokens.gold, border: `1px solid ${tokens.gold}55` }}
                          >
                            <Lock size={24} />
                          </button>
                       ) : (
                          <button
                            onClick={toggleListening}
                            className={`w-16 h-16 rounded-full flex items-center justify-center shadow-xl transition-all duration-300 ${isListening ? "scale-110" : "hover:scale-105"}`}
                            style={{ 
                              background: isListening ? "#EF4444" : tokens.gold, 
                              color: isListening ? "white" : tokens.ink,
                              boxShadow: isListening ? "0 0 40px rgba(239,68,68,0.5)" : "0 10px 25px rgba(0,0,0,0.5)"
                            }}
                          >
                            {isListening ? <Mic size={24} className="animate-pulse" /> : <MicOff size={24} />}
                          </button>
                       )}
                       
                       <span className="text-[10px] text-white/60 tracking-wider">
                         {!isAuthenticated ? "Log in to ask questions" : (isListening ? "Listening... speak now" : "Tap to speak question")}
                       </span>
                    </div>
                  )}
                </div>

              </div>
            </motion.div>
          </div>
        )}

        {mode === "upload" && preview && !monumentData && (
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="flex justify-center mb-20">
            <button
              onClick={() => detectFromBlob(file)}
              disabled={loading}
              className="inline-flex items-center gap-3 px-8 py-3.5 rounded-full font-medium text-sm disabled:opacity-70"
              style={{ background: tokens.sandstone, color: tokens.ivory }}
            >
              {loading ? <><Loader2 size={16} className="animate-spin" /> Reading the stone…</> : <><Sparkles size={16} /> Identify this monument</>}
            </button>
          </motion.div>
        )}

        <AnimatePresence>
          {monumentData && !isUnknown && (
            <motion.section
              initial={{ opacity: 0, y: 28 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="relative mb-16 p-8 md:p-10"
              style={{ background: tokens.inkSoft, border: `1px solid ${tokens.gold}33` }}
            >
              <div className="absolute top-0 left-0 w-full h-[2px]" style={{ background: `linear-gradient(90deg, transparent, ${tokens.gold}, transparent)` }} />
              <div className="text-xs tracking-[0.2em] uppercase mb-2" style={{ color: tokens.gold }}>Identified</div>
              <h2 className="font-display text-3xl md:text-4xl mb-6" style={{ color: tokens.ivory }}>{monumentData.monument}</h2>
              <div className="grid sm:grid-cols-3 gap-5 mb-7 pb-7" style={{ borderBottom: `1px solid ${tokens.stone}33` }}>
                <PlaqueFact icon={<MapPin size={14} />} label="Location" value={[monumentData.city, monumentData.state].filter(Boolean).join(", ") || "—"} />
                <PlaqueFact icon={<Crown size={14} />} label="Built by" value={monumentData.builtBy || "—"} />
                <PlaqueFact icon={<CalendarDays size={14} />} label="Year built" value={monumentData.yearBuilt || "—"} />
              </div>
              <p className="text-sm leading-relaxed" style={{ color: tokens.stone }}>{monumentData.description}</p>
            </motion.section>
          )}
        </AnimatePresence>

        <AnimatePresence>
          {monumentData && !isUnknown && (
            <motion.section initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} className="mb-10">
              <div className="flex items-center gap-2 mb-5">
                <ScrollText size={14} style={{ color: tokens.gold }} />
                <span className="text-xs tracking-[0.2em] uppercase" style={{ color: tokens.stone }}>
                  Ask your guide about {monumentData.monument}
                </span>
              </div>

              <div className="h-80 overflow-y-auto scrollbar-thin px-6 py-6 space-y-4 mb-4" style={{ background: tokens.inkSoft, border: `1px solid ${tokens.stone}22` }}>
                {chatHistory.length === 0 && (
                  <p className="text-sm text-center mt-16" style={{ color: tokens.stone }}>
                    Ask about who built it, why, or what makes it remarkable.<br/>
                    {mode === "live" && <span className="text-xs opacity-70 mt-2 block">(Tap the mic above to speak)</span>}
                  </p>
                )}
                {chatHistory.map((msg, i) => (
                  <motion.div key={i} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
                    <div
                      className="max-w-[75%] px-4 py-2.5 text-sm leading-relaxed rounded-2xl"
                      style={
                        msg.role === "user"
                          ? { background: tokens.sandstone, color: tokens.ivory, borderBottomRightRadius: 4 }
                          : { background: `${tokens.gold}14`, color: tokens.ivory, border: `1px solid ${tokens.gold}33`, borderBottomLeftRadius: 4 }
                      }
                    >
                      {msg.text}
                    </div>
                  </motion.div>
                ))}
                {chatLoading && (
                  <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex justify-start">
                    <div className="px-4 py-2.5 rounded-2xl flex items-center gap-2 text-sm" style={{ background: `${tokens.gold}14`, color: tokens.stone, border: `1px solid ${tokens.gold}33` }}>
                      <Loader2 size={13} className="animate-spin" /> thinking
                    </div>
                  </motion.div>
                )}
                <div ref={chatEndRef} />
              </div>

          
              {!isAuthenticated ? (
                <div 
                  className="flex flex-col sm:flex-row items-center justify-between gap-4 px-5 py-4 rounded-xl"
                  style={{ background: tokens.inkSoft, border: `1px solid ${tokens.stone}33` }}
                >
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-full" style={{ background: `${tokens.gold}14`, color: tokens.gold }}>
                      <Lock size={16} />
                    </div>
                    <div>
                      <p className="text-sm font-medium" style={{ color: tokens.ivory }}>Login Required</p>
                      <p className="text-xs" style={{ color: tokens.stone }}>You must be logged in to chat with the AI guide.</p>
                    </div>
                  </div>
                  <button
                    onClick={handleAuth}
                    className="whitespace-nowrap px-6 py-2 rounded-lg text-xs font-medium uppercase tracking-wider transition-transform hover:scale-105"
                    style={{ background: tokens.gold, color: tokens.ink }}
                  >
                    Login to chat
                  </button>
                </div>
              ) : (
                <form onSubmit={handleChatFormSubmit} className="flex gap-3">
                  <input
                    type="text"
                    value={chatQuestion}
                    onChange={(e) => setChatQuestion(e.target.value)}
                    placeholder="Type your question..."
                    className="flex-1 px-5 py-3 text-sm outline-none rounded-xl"
                    style={{ background: tokens.inkSoft, border: `1px solid ${tokens.stone}33`, color: tokens.ivory }}
                  />
                  <button
                    type="submit"
                    disabled={chatLoading || !chatQuestion.trim()}
                    className="w-12 h-12 flex items-center justify-center rounded-xl disabled:opacity-50 shrink-0 transition-transform hover:scale-105"
                    style={{ background: tokens.gold, color: tokens.ink }}
                  >
                    <Send size={16} />
                  </button>
                </form>
              )}
            </motion.section>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

function PlaqueFact({ icon, label, value }) {
  return (
    <div>
      <div className="flex items-center gap-1.5 mb-1.5" style={{ color: "#D4AF37" }}>
        {icon}
        <span className="text-[10px] tracking-[0.15em] uppercase" style={{ color: "#948B7A" }}>{label}</span>
      </div>
      <div className="text-sm font-medium" style={{ color: "#F4ECD9" }}>{value}</div>
    </div>
  );
}