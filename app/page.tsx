'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

import BookingForm from './_components/BookingForm';
import TrackingForm from './_components/TrackingForm';
import LoginModal from './_components/LoginModal';
import RegisterModal from './_components/RegisterModal';

interface Message {
  id: string;
  sender: 'user' | 'assistant';
  text: string;
  time: string;
}

export default function UnifiedHomePage() {
  const router = useRouter();
  
  const [activeTab, setActiveTab] = useState<'welcome' | 'booking' | 'tracking'>('welcome');
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [showRegister, setShowRegister] = useState(false);
  const [currentUser, setCurrentUser] = useState<{ fullName?: string; email?: string; role?: string } | null>(null);
  const [isMounted, setIsMounted] = useState(false);

  // --- AI CHATBOT STATE ---
  const [inputMessage, setInputMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [chatHistory, setChatHistory] = useState<Message[]>([
    {
      id: '1',
      sender: 'assistant',
      text: "Hello! I'm the AI assistant from **WebAI Repair**. You can diagnose your device's problems here, or schedule an appointment directly!",
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    },
  ]);

  const chatEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setIsMounted(true);
    const savedUser = localStorage.getItem('user');
    const savedRole = localStorage.getItem('role');
    if (savedUser) {
      try {
        const parsedUser = JSON.parse(savedUser);
        setCurrentUser({
          ...parsedUser,
          role: parsedUser.role || savedRole || 'user',
        });
      } catch (e) {
        localStorage.removeItem('user');
      }
    }
  }, []);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chatHistory, isTyping]);

  const formatText = (text: string) => {
    const parts = text.split(/(\*\*.*?\*\*)/g);
    return parts.map((part, i) => {
      if (part.startsWith('**') && part.endsWith('**')) {
        return (
          <strong key={i} className="font-bold text-emerald-400">
            {part.slice(2, -2)}
          </strong>
        );
      }
      return part;
    });
  };

  const handleSendMessage = async (textToSend?: string) => {
    const query = (typeof textToSend === 'string' ? textToSend : inputMessage).trim();
    if (!query) return;

    const currentTime = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    const userMsg: Message = {
      id: Date.now().toString(),
      sender: 'user',
      text: query,
      time: currentTime,
    };

    setChatHistory((prev) => [...prev, userMsg]);
    setInputMessage('');
    setIsTyping(true);

    try {
      const response = await fetch('http://localhost:8000/ai/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: query }),
      });

      if (response.ok) {
        const data = await response.json();
        const aiReply = data.reply || data.response || "I have recorded your information. Would you like to schedule an inspection right away?";
        
        setChatHistory((prev) => [
          ...prev,
          {
            id: (Date.now() + 1).toString(),
            sender: 'assistant',
            text: aiReply,
            time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          },
        ]);
      } else {
        throw new Error(`Server status ${response.status}`);
      }
    } catch (error) {
      setChatHistory((prev) => [
        ...prev,
        {
          id: (Date.now() + 1).toString(),
          sender: 'assistant',
          text: "The diagnostic system is currently busy. You can click the **Book a New Appointment** tab for technician support!",
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        },
      ]);
    } finally {
      setIsTyping(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('user');
    localStorage.removeItem('role');
    setCurrentUser(null);
  };

  return (
    <div className="relative min-h-screen flex flex-col justify-between overflow-x-hidden bg-slate-950 text-slate-100 font-sans selection:bg-emerald-500/30 selection:text-emerald-300">
      
      {/* AMBIENT BACKGROUND LIGHTS */}
      <div className="absolute top-12 left-1/3 -translate-x-1/2 w-[600px] h-[600px] bg-emerald-500/10 rounded-full blur-[140px] pointer-events-none -z-0" />
      <div className="absolute bottom-10 right-10 w-[500px] h-[500px] bg-teal-500/10 rounded-full blur-[160px] pointer-events-none -z-0" />

      {/* ================= FLOATING MODERN HEADER ================= */}
      <header className="relative z-30 max-w-7xl w-full mx-auto px-4 pt-4">
        <div className="w-full px-6 py-3.5 flex justify-between items-center rounded-2xl bg-slate-900/60 backdrop-blur-2xl border border-slate-800/80 shadow-2xl shadow-black/40">
          <div className="flex items-center gap-3">
            <div className="relative group">
              <div className="absolute -inset-0.5 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-xl blur opacity-50 group-hover:opacity-100 transition duration-300" />
              <div className="relative w-10 h-10 rounded-xl bg-slate-950 flex items-center justify-center font-black text-emerald-400 text-lg border border-slate-800">
                WA
              </div>
            </div>
            <div>
              <h1 className="font-black text-base tracking-wider text-white flex items-center gap-1.5">
                WebAIRepair
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              </h1>
              <p className="text-[9px] text-emerald-400/90 font-bold uppercase tracking-widest">Enterprise System</p>
            </div>
          </div>

          <nav className="hidden md:flex items-center gap-1 bg-slate-950/60 p-1.5 rounded-xl border border-slate-800/60 text-xs font-semibold text-slate-400">
            <button 
              onClick={() => setActiveTab('welcome')} 
              className={`px-4 py-2 rounded-lg transition-all duration-200 ${activeTab === 'welcome' ? 'bg-slate-800 text-emerald-400 font-bold shadow-md shadow-emerald-950/20' : 'hover:text-white'}`}
            >
              Homepage
            </button>
            <button 
              onClick={() => setActiveTab('booking')} 
              className={`px-4 py-2 rounded-lg transition-all duration-200 ${activeTab === 'booking' ? 'bg-slate-800 text-emerald-400 font-bold shadow-md shadow-emerald-950/20' : 'hover:text-white'}`}
            >
              Book
            </button>
            <button 
              onClick={() => setActiveTab('tracking')} 
              className={`px-4 py-2 rounded-lg transition-all duration-200 ${activeTab === 'tracking' ? 'bg-slate-800 text-emerald-400 font-bold shadow-md shadow-emerald-950/20' : 'hover:text-white'}`}
            >
              Check Schedule
            </button>
            <Link 
              href="/customer/blogs" 
              className="px-4 py-2 rounded-lg text-slate-400 hover:text-white transition-all duration-200"
            >
              Tech Blog
            </Link>
          </nav>

          <div className="flex items-center gap-3">
            {isMounted && currentUser && ['admin', 'tech', 'technician'].includes(currentUser.role?.toLowerCase() || '') && (
              <button 
                onClick={() => {
                  const role = currentUser.role?.toLowerCase();
                  if (role === 'admin') {
                    router.push('/admin');
                  } else {
                    router.push('/tech'); 
                  }
                }} 
                className="px-3.5 py-2 rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 text-xs font-bold hover:bg-emerald-500 hover:text-slate-950 transition-all shadow-sm"
              >
                {currentUser.role?.toLowerCase() === 'admin' ? '👑 Admin Dashboard' : '🔧 Tech Dashboard'}
              </button>
            )}

            {isMounted && currentUser ? (
              <div className="flex items-center gap-2">
                <span className="text-xs font-semibold text-slate-200 bg-slate-950/80 px-3.5 py-2 rounded-xl border border-slate-800">
                  {currentUser.fullName || currentUser.email || 'Client'}
                </span>
                <button 
                  onClick={handleLogout}
                  className="px-3 py-2 text-xs font-semibold text-slate-400 hover:text-red-400 transition"
                >
                  Log out
                </button>
              </div>
            ) : (
              <button 
                onClick={() => setShowLoginModal(true)}
                className="relative group overflow-hidden px-5 py-2.5 rounded-xl bg-gradient-to-r from-emerald-500 via-teal-500 to-emerald-400 text-slate-950 font-bold text-xs shadow-lg shadow-emerald-500/20 hover:shadow-emerald-500/40 transition-all transform hover:-translate-y-0.5"
              >
                <span className="relative z-10 flex items-center gap-1.5">
                  Log In to the System 🔐
                </span>
              </button>
            )}
          </div>
        </div>
      </header>

      {/* ================= MAIN CONTENT ================= */}
      <main className="relative z-10 max-w-7xl w-full mx-auto px-4 py-8 flex-grow flex items-center justify-center">
        <div className="w-full grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          
          {/* LEFT COLUMN: EXPANDED & MODERNIZED CHATBOT (Tăng kích thước lên 6 cột và cao 620px) */}
          <div className="lg:col-span-6 bg-slate-900/40 backdrop-blur-2xl border border-slate-800/80 rounded-3xl h-[620px] flex flex-col shadow-2xl shadow-emerald-950/10 relative group overflow-hidden">
            {/* Ambient inner glow */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/5 rounded-full blur-3xl pointer-events-none" />

            {/* Chat Header */}
            <div className="p-4 border-b border-slate-800/80 bg-slate-950/60 rounded-t-3xl flex items-center justify-between backdrop-blur-md">
              <div className="flex items-center gap-3">
                <div className="relative">
                  <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-emerald-400 to-teal-600 flex items-center justify-center shadow-lg shadow-emerald-500/20 text-xl">
                    🤖
                  </div>
                  <span className="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 bg-emerald-500 border-2 border-slate-950 rounded-full" />
                </div>
                <div>
                  <h2 className="font-bold text-white text-sm tracking-wide flex items-center gap-2">
                    WebAI Assistant
                    <span className="text-[10px] bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 px-2 py-0.5 rounded-full font-mono">v2.5</span>
                  </h2>
                  <p className="text-[11px] text-slate-400">Automated Hardware Diagnostic</p>
                </div>
              </div>
              <span className="text-[10px] bg-slate-900/90 px-3 py-1.5 rounded-xl text-slate-300 font-mono border border-slate-800/80 shadow-inner">
                Qwen2.5 Local Engine
              </span>
            </div>

            {/* Chat Messages Body */}
            <div className="flex-grow p-5 space-y-4 overflow-y-auto text-sm custom-scrollbar">
              {chatHistory.map((msg) => (
                <div
                  key={msg.id}
                  className={`flex gap-3 ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  {msg.sender === 'assistant' && (
                    <div className="flex-shrink-0 w-8 h-8 rounded-xl bg-slate-800/80 border border-slate-700/60 flex items-center justify-center text-sm shadow-sm">
                      🤖
                    </div>
                  )}

                  <div
                    className={`max-w-[82%] p-4 rounded-2xl text-xs leading-relaxed shadow-md ${
                      msg.sender === 'user'
                        ? 'bg-gradient-to-r from-emerald-500 to-teal-500 text-slate-950 font-semibold rounded-tr-xs'
                        : 'bg-slate-800/70 text-slate-200 border border-slate-700/50 backdrop-blur-md rounded-tl-xs'
                    }`}
                  >
                    <div className="whitespace-pre-wrap">{formatText(msg.text)}</div>
                    <div
                      className={`text-[9px] mt-2 text-right font-mono ${
                        msg.sender === 'user' ? 'text-slate-900/70' : 'text-slate-500'
                      }`}
                    >
                      {msg.time}
                    </div>
                  </div>
                </div>
              ))}

              {isTyping && (
                <div className="flex gap-3 items-center">
                  <div className="w-8 h-8 rounded-xl bg-slate-800/80 border border-slate-700/60 flex items-center justify-center text-sm">
                    🤖
                  </div>
                  <div className="bg-slate-800/60 backdrop-blur-md text-slate-400 p-3.5 rounded-2xl rounded-tl-xs border border-slate-700/50 text-xs flex items-center gap-2">
                    <span className="font-medium text-slate-300">AI is analyzing</span>
                    <span className="flex gap-1 items-center">
                      <span className="w-1.5 h-1.5 bg-emerald-400 rounded-full animate-bounce [animation-delay:-0.3s]" />
                      <span className="w-1.5 h-1.5 bg-emerald-400 rounded-full animate-bounce [animation-delay:-0.15s]" />
                      <span className="w-1.5 h-1.5 bg-emerald-400 rounded-full animate-bounce" />
                    </span>
                  </div>
                </div>
              )}

              <div ref={chatEndRef} />
            </div>

            {/* Chat Input Bar */}
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSendMessage();
              }}
              className="p-3.5 border-t border-slate-800/80 bg-slate-950/80 backdrop-blur-md rounded-b-3xl flex gap-2.5"
            >
              <input
                type="text"
                placeholder="Describe your device issue (e.g. Broken screen, overheating)..."
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                className="flex-grow px-4 py-3 bg-slate-900/90 border border-slate-800 rounded-xl focus:outline-none focus:border-emerald-500/80 text-xs text-white placeholder-slate-500 transition shadow-inner"
              />
              <button
                type="submit"
                disabled={!inputMessage.trim() || isTyping}
                className="px-5 py-3 bg-gradient-to-r from-emerald-500 to-teal-500 disabled:opacity-40 text-slate-950 font-bold rounded-xl text-xs hover:shadow-lg hover:shadow-emerald-500/20 active:scale-95 transition-all flex items-center justify-center min-w-[70px]"
              >
                Send
              </button>
            </form>
          </div>

          {/* RIGHT COLUMN: INTERACTIVE INTERFACE (6 Cột) */}
          <div className="lg:col-span-6 space-y-8">
            {activeTab === 'welcome' && (
              <div className="space-y-6 lg:pl-2">
                <div>
                  <div className="inline-flex items-center gap-2 bg-emerald-500/10 border border-emerald-500/30 px-4 py-1.5 rounded-full text-xs text-emerald-400 font-semibold tracking-wide backdrop-blur-md">
                    <span className="w-2 h-2 bg-emerald-400 rounded-full animate-ping" />
                    NEXT GENERATION REPAIR SYSTEM
                  </div>
                </div>

                <h2 className="text-4xl md:text-5xl font-black tracking-tight leading-[1.12] text-transparent bg-clip-text bg-gradient-to-br from-white via-slate-100 to-slate-400">
                  Diagnosis using AI.<br />
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 via-teal-400 to-emerald-300">
                    Rapid repairs.
                  </span>
                </h2>

                <p className="text-slate-400 text-sm md:text-base leading-relaxed max-w-lg">
                  Manage your repair journey transparently. Integrated artificial intelligence supports highly accurate technical diagnoses.
                </p>

                <div className="flex flex-wrap gap-3.5 pt-2">
                  <button 
                    onClick={() => setActiveTab('booking')}
                    className="px-6 py-3.5 bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-slate-950 font-black rounded-xl shadow-xl shadow-emerald-950/40 transition-all transform hover:-translate-y-0.5 text-xs tracking-wide flex items-center gap-2"
                  >
                    Book a New Appointment 🛠️
                  </button>
                  <button 
                    onClick={() => setActiveTab('tracking')}
                    className="px-6 py-3.5 bg-slate-900/80 hover:bg-slate-800 border border-slate-800 hover:border-slate-700 text-white font-bold rounded-xl shadow-lg transition-all transform hover:-translate-y-0.5 text-xs flex items-center gap-2"
                  >
                    Track Progress 🔍
                  </button>
                  <Link 
                    href="/customer/blogs"
                    className="px-6 py-3.5 bg-slate-900/80 hover:bg-slate-800 border border-slate-800 hover:border-slate-700 text-slate-300 hover:text-white font-bold rounded-xl shadow-lg transition-all transform hover:-translate-y-0.5 text-xs flex items-center gap-2"
                  >
                    Tech Blog 📖
                  </Link>
                </div>
              </div>
            )}

            {activeTab === 'booking' && (
              <BookingForm setActiveTab={setActiveTab} />
            )}

            {activeTab === 'tracking' && (
              <TrackingForm setActiveTab={setActiveTab} />
            )}
          </div>
        </div>
      </main>

      {/* MODALS */}
      {showLoginModal && (
        <LoginModal 
          onClose={() => setShowLoginModal(false)} 
          onSwitchToRegister={() => { setShowLoginModal(false); setShowRegister(true); }} 
        />
      )}

      {showRegister && (
        <RegisterModal 
          onClose={() => setShowRegister(false)} 
          onSwitchToLogin={() => { setShowRegister(false); setShowLoginModal(true); }} 
        />
      )}

      {/* FOOTER */}
      <footer className="relative z-10 max-w-7xl w-full mx-auto py-6 text-center text-[11px] text-slate-500 border-t border-slate-900/80 px-6">
        © 2026 WebAIRepair System. Development is intended for evaluation by expert panels.
      </footer>
    </div>
  );
}