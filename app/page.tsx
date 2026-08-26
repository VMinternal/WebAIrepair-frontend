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
        console.error('AI Backend Server returned status:', response.status);
        throw new Error(`Server status ${response.status}`);
      }
    } catch (error) {
      console.error('Fetch AI Chat Error:', error);
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
    // Đã thay overflow-hidden thành overflow-x-hidden để tránh xén Header
    <div className="relative min-h-screen flex flex-col justify-between overflow-x-hidden bg-slate-950 text-slate-100">
      
      {/* BACKGROUND GLOWS */}
      <div className="absolute top-1/4 left-1/4 -translate-x-1/2 -translate-y-1/2 w-[450px] h-[450px] bg-emerald-500/10 rounded-full blur-[130px] pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 translate-x-1/2 translate-y-1/2 w-[550px] h-[550px] bg-blue-500/10 rounded-full blur-[160px] pointer-events-none" />

      {/* ================= HEADER ================= */}
      <header className="relative z-20 max-w-7xl w-full mx-auto px-6 py-4 flex justify-between items-center border-b border-slate-900/80 bg-slate-950/70 backdrop-blur-md">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-emerald-500 to-blue-600 flex items-center justify-center font-black text-slate-950 text-lg shadow-lg shadow-emerald-500/20">
            WA
          </div>
          <div>
            <h1 className="font-black text-base tracking-wider text-white">WebAIRepair</h1>
            <p className="text-[9px] text-emerald-400 font-bold uppercase tracking-widest">Enterprise System</p>
          </div>
        </div>

        <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-slate-400">
          <button onClick={() => setActiveTab('welcome')} className={`transition ${activeTab === 'welcome' ? 'text-emerald-400 font-bold' : 'hover:text-emerald-400'}`}>Homepage</button>
          <button onClick={() => setActiveTab('booking')} className={`transition ${activeTab === 'booking' ? 'text-emerald-400 font-bold' : 'hover:text-emerald-400'}`}>Book</button>
          <button onClick={() => setActiveTab('tracking')} className={`transition ${activeTab === 'tracking' ? 'text-emerald-400 font-bold' : 'hover:text-emerald-400'}`}>Check Schedule</button>
          <Link href="/customer/blogs" className="text-slate-400 hover:text-white transition">
            Tech Blog
          </Link>

          {isMounted && currentUser?.role === 'admin' && (
            <button 
              onClick={() => router.push('/admin')} 
              className="px-3 py-1.5 rounded-lg bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 font-bold hover:bg-emerald-500 hover:text-slate-950 transition-all flex items-center gap-1.5 shadow-sm hover:shadow-emerald-500/20"
            >
              👑 Admin Dashboard
            </button>
          )}

          {isMounted && (currentUser?.role === 'tech' || currentUser?.role === 'technician') && (
            <button 
              onClick={() => router.push('/tech')} 
              className="px-3 py-1.5 rounded-lg bg-blue-500/10 text-blue-400 border border-blue-500/30 font-bold hover:bg-blue-500 hover:text-slate-950 transition-all flex items-center gap-1.5 shadow-sm hover:shadow-blue-500/20"
            >
              🛠️ Tech Dashboard
            </button>
          )}
        </nav>

        {isMounted && currentUser ? (
          <div className="flex items-center gap-3">
            <span className="text-xs font-bold text-emerald-400 bg-slate-900 px-4 py-2 rounded-xl border border-slate-800 shadow-inner">
              Welcome, {currentUser.fullName || currentUser.email || 'Client'} 👋
            </span>
            <button 
              onClick={handleLogout}
              className="px-3 py-2 text-xs font-bold text-slate-400 hover:text-red-400 transition"
            >
              Log out
            </button>
          </div>
        ) : (
          <button 
            onClick={() => setShowLoginModal(true)}
            className="px-5 py-2.5 bg-gradient-to-r from-emerald-500 to-teal-500 text-slate-950 font-bold text-xs rounded-xl shadow-lg hover:shadow-emerald-500/20 transition-all transform hover:-translate-y-0.5"
          >
            Log In to the System 🔐
          </button>
        )}
      </header>

      {/* ================= MAIN CONTENT ================= */}
      {/* Giảm py-12 xuống py-6 md:py-8 để giao diện bớt cao */}
      <main className="relative z-10 max-w-7xl w-full mx-auto px-6 py-6 md:py-8 flex-grow flex items-center justify-center">
        <div className="w-full grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
          
          {/* LEFT COLUMN: DYNAMIC AI CHATBOT */}
          <div className="lg:col-span-5 bg-slate-900/60 backdrop-blur-xl border border-slate-800/80 rounded-3xl h-[520px] flex flex-col shadow-2xl shadow-emerald-950/20">
            
            <div className="p-4 border-b border-slate-800/80 bg-slate-950/50 rounded-t-3xl flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="relative">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-emerald-400 to-teal-500 flex items-center justify-center shadow-lg shadow-emerald-500/20">
                    <span className="text-xl">🤖</span>
                  </div>
                  <span className="absolute bottom-0 right-0 w-3 h-3 bg-emerald-500 border-2 border-slate-900 rounded-full animate-pulse" />
                </div>
                <div>
                  <h2 className="font-bold text-white text-sm tracking-wide">WebAI Assistant</h2>
                  <p className="text-[10px] text-emerald-400 font-medium">Ready to diagnose 24/7</p>
                </div>
              </div>
              <span className="text-[10px] bg-slate-800 px-2.5 py-1 rounded-full text-slate-400 font-mono border border-slate-700/50">
                Local AI Engine (Qwen2.5)
              </span>
            </div>
            
            <div className="flex-grow p-4 space-y-4 overflow-y-auto text-sm custom-scrollbar">
              {chatHistory.map((msg) => (
                <div
                  key={msg.id}
                  className={`flex gap-2.5 ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  {msg.sender === 'assistant' && (
                    <div className="flex-shrink-0 w-7 h-7 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center text-xs">
                      🤖
                    </div>
                  )}

                  <div
                    className={`max-w-[80%] p-3.5 rounded-2xl text-xs leading-relaxed shadow-sm ${
                      msg.sender === 'user'
                        ? 'bg-gradient-to-r from-emerald-500 to-teal-600 text-slate-950 font-medium rounded-br-none'
                        : 'bg-slate-800/90 text-slate-200 border border-slate-700/50 rounded-bl-none'
                    }`}
                  >
                    <div>{formatText(msg.text)}</div>
                    <div
                      className={`text-[9px] mt-1.5 text-right ${
                        msg.sender === 'user' ? 'text-slate-900/70' : 'text-slate-500'
                      }`}
                    >
                      {msg.time}
                    </div>
                  </div>
                </div>
              ))}

              {isTyping && (
                <div className="flex gap-2.5 items-center">
                  <div className="w-7 h-7 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center text-xs">
                    🤖
                  </div>
                  <div className="bg-slate-800/90 text-slate-400 p-3 rounded-2xl rounded-bl-none border border-slate-700/50 text-xs flex items-center gap-1.5">
                    <span>AI is analyzing</span>
                    <span className="w-1.5 h-1.5 bg-emerald-400 rounded-full animate-bounce" />
                    <span className="w-1.5 h-1.5 bg-emerald-400 rounded-full animate-bounce [animation-delay:0.2s]" />
                    <span className="w-1.5 h-1.5 bg-emerald-400 rounded-full animate-bounce [animation-delay:0.4s]" />
                  </div>
                </div>
              )}

              <div ref={chatEndRef} />
            </div>

            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSendMessage();
              }}
              className="p-3 border-t border-slate-800/80 bg-slate-950/40 rounded-b-3xl flex gap-2"
            >
              <input
                type="text"
                placeholder="Enter device issue description..."
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                className="flex-grow px-4 py-2.5 bg-slate-950 border border-slate-800/80 rounded-xl focus:outline-none focus:border-emerald-500/80 text-xs text-white placeholder-slate-600 transition"
              />
              <button
                type="submit"
                disabled={!inputMessage.trim() || isTyping}
                className="px-4 py-2.5 bg-emerald-500 disabled:opacity-50 text-slate-950 font-bold rounded-xl text-xs hover:bg-emerald-400 transition flex items-center justify-center min-w-[60px]"
              >
                Send
              </button>
            </form>
          </div>

          {/* RIGHT COLUMN: INTERACTIVE INTERFACE */}
          <div className="lg:col-span-7 space-y-8">
            {activeTab === 'welcome' && (
              <div className="space-y-8 lg:pr-6">
                <div className="pb-2">
                  <div className="inline-flex items-center gap-2 bg-emerald-500/10 border border-emerald-500/20 px-3.5 py-1.5 rounded-full text-xs text-emerald-400 font-semibold tracking-wide">
                    <span className="w-2 h-2 bg-emerald-400 rounded-full animate-ping" />
                    NEXT GENERATION REPAIR SYSTEM
                  </div>
                </div>

                <h2 className="text-4xl md:text-5xl lg:text-6xl font-black tracking-tight leading-[1.15] text-transparent bg-clip-text bg-gradient-to-b from-white to-slate-400">
                  Diagnosis using AI.<br />
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-teal-400">
                    Rapid repairs.
                  </span>
                </h2>

                <p className="text-slate-400 text-sm md:text-base leading-relaxed max-w-xl">
                  Manage your repair journey transparently. Integrated artificial intelligence supports highly accurate technical diagnoses.
                </p>

                <div className="flex flex-wrap gap-4 pt-4">
                  <button 
                    onClick={() => setActiveTab('booking')}
                    className="px-6 py-4 bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-slate-950 font-black rounded-2xl shadow-xl transition transform hover:-translate-y-1 flex items-center gap-2"
                  >
                    Book a New Appointment 🛠️
                  </button>
                  <button 
                    onClick={() => setActiveTab('tracking')}
                    className="px-6 py-4 bg-slate-900 hover:bg-slate-850 border border-slate-800 hover:border-slate-700 text-white font-bold rounded-2xl shadow-xl transition transform hover:-translate-y-1 flex items-center gap-2"
                  >
                    Track Progress 🔍
                  </button>
                  <Link 
                    href="/customer/blogs"
                    className="px-6 py-4 bg-slate-900 hover:bg-slate-850 border border-slate-800 hover:border-slate-700 text-white font-bold rounded-2xl shadow-xl transition transform hover:-translate-y-1 flex items-center gap-2"
                  >
                    Tech Blog & Articles 📖
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

      <footer className="relative z-10 max-w-7xl w-full mx-auto py-5 text-center text-[11px] text-slate-600 border-t border-slate-900/50 px-6">
        © 2026 WebAIRepair System. Development is intended for evaluation by expert panels.
      </footer>
    </div>
  );
}