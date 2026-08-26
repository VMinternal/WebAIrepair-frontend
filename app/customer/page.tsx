'use client';

import { useState, useRef, useEffect } from 'react';
import Link from 'next/link';

interface Message {
  id: string;
  sender: 'user' | 'assistant';
  text: string;
  time: string;
}

export default function CustomerPortalPage() {
  // --- BOOKING FORM STATE ---
  const [showBookingForm, setShowBookingForm] = useState(false);
  const [customerName, setCustomerName] = useState('');
  const [phone, setPhone] = useState('');
  const [deviceModel, setDeviceModel] = useState('');
  const [description, setDescription] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  // --- AI CHATBOT STATE ---
  const [inputMessage, setInputMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [chatHistory, setChatHistory] = useState<Message[]>([
    {
      id: '1',
      sender: 'assistant',
      text: "Hello! I am the AI assistant from **WebAI Repair**. What kind of problem are you experiencing with your device?",
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    },
  ]);

  const chatEndRef = useRef<HTMLDivElement>(null);

  // Auto scroll down when a new message arrives
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chatHistory, isTyping]);

  // Convert **text** to <strong>text</strong> for basic Markdown formatting
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

  // Handle sending AI Chat messages
 const handleSendMessage = async (textToSend?: string) => {
  // Lấy tin nhắn từ tham số nếu là string, ngược lại lấy từ inputMessage
  const query = (typeof textToSend === 'string' ? textToSend : inputMessage).trim();
  if (!query) return;

  const currentTime = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

  // 1. Thêm tin nhắn của User vào giao diện
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
    // 2. Gọi API Backend AI
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
      throw new Error('API Error');
    }
  } catch (error) {
    setChatHistory((prev) => [
      ...prev,
      {
        id: (Date.now() + 1).toString(),
        sender: 'assistant',
        text: "The diagnostic system is currently busy. You can click the **Schedule a Repair** button on the side for immediate technician support!",
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      },
    ]);
  } finally {
    setIsTyping(false);
  }
};

  // Handle Appointment Booking Submit
  const handleBookingSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');

    try {
      const response = await fetch('http://localhost:8000/appointments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ customerName, phone, deviceModel, description }),
      });

      const data = await response.json();

      if (response.ok) {
        setMessage('🎉 Appointment booked successfully! The system has recorded it.');
        setCustomerName('');
        setPhone('');
        setDeviceModel('');
        setDescription('');
        setTimeout(() => setShowBookingForm(false), 3000);
      } else {
        setMessage(`❌ Failure: ${data.message || 'System error'}`);
      }
    } catch (error) {
      setMessage('❌ Unable to connect to the Backend server (Port 8000)!');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen flex flex-col bg-slate-950 text-slate-100 font-sans">
      
      {/* Navigation header */}
      <header className="relative z-20 max-w-7xl w-full mx-auto px-6 py-4 flex justify-between items-center border-b border-slate-900 bg-slate-950/80 backdrop-blur-md">
        <div className="flex items-center gap-2">
          <span className="text-xl">🛠️</span>
          <span className="font-black text-lg bg-clip-text text-transparent bg-gradient-to-r from-emerald-400 to-teal-400">
            WebAI Repair
          </span>
        </div>
        <Link href="/" className="text-xs bg-slate-900 hover:bg-slate-800 text-slate-300 px-4 py-2 rounded-xl border border-slate-800/80 transition">
          ← Back to Main Center
        </Link>
      </header>

      {/* Main interface */}
      <div className="flex-grow flex items-center justify-center px-4 py-8 relative">
        <div className="absolute top-1/4 left-1/4 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] bg-emerald-500/10 rounded-full blur-[120px] pointer-events-none" />
        <div className="absolute bottom-1/4 right-1/4 translate-x-1/2 translate-y-1/2 w-[500px] h-[500px] bg-teal-500/10 rounded-full blur-[150px] pointer-events-none" />

        <div className="relative z-10 max-w-6xl w-full grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* LEFT COLUMN: INTERACTIVE AI CHATBOT */}
          <div className="lg:col-span-5 bg-slate-900/60 backdrop-blur-xl border border-slate-800/80 rounded-3xl h-[600px] flex flex-col shadow-2xl shadow-emerald-950/20">
            
            {/* Chat Header */}
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

            {/* Chat Messages Body */}
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

              {/* AI Typing Indicator */}
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

            {/* Quick Prompts */}
            <div className="px-4 py-2 border-t border-slate-800/50 bg-slate-950/20 flex gap-2 overflow-x-auto no-scrollbar text-[11px]">
              <button
                onClick={() => handleSendMessage("The device screen won't turn on")}
                className="whitespace-nowrap px-2.5 py-1 bg-slate-800/80 hover:bg-slate-700 text-slate-300 rounded-lg border border-slate-700/50 transition"
              >
                💡 Won't turn on
              </button>
              <button
                onClick={() => handleSendMessage("Battery drains fast and device gets hot")}
                className="whitespace-nowrap px-2.5 py-1 bg-slate-800/80 hover:bg-slate-700 text-slate-300 rounded-lg border border-slate-700/50 transition"
              >
                🔋 Battery drain / Overheating
              </button>
              <button
                onClick={() => handleSendMessage("Device dropped in water")}
                className="whitespace-nowrap px-2.5 py-1 bg-slate-800/80 hover:bg-slate-700 text-slate-300 rounded-lg border border-slate-700/50 transition"
              >
                💧 Water damage
              </button>
            </div>

            {/* Chat Input Bar */}
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

          {/* RIGHT COLUMN: APPOINTMENT BOOKING FORM */}
          <div className="lg:col-span-7 space-y-8">
            {!showBookingForm ? (
              <div className="space-y-8 lg:pr-6">
                <div className="inline-flex items-center gap-2 bg-emerald-500/10 border border-emerald-500/20 px-3.5 py-1.5 rounded-full text-xs text-emerald-400 font-semibold">
                  <span className="w-2 h-2 bg-emerald-400 rounded-full animate-ping" /> Customer Portal
                </div>
                <h1 className="text-4xl md:text-5xl font-black leading-[1.1] text-transparent bg-clip-text bg-gradient-to-r from-white via-slate-100 to-slate-400">
                  Diagnosis using AI.<br />
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-teal-400">
                    Rapid repairs.
                  </span>
                </h1>
                <p className="text-slate-400 text-sm md:text-base leading-relaxed">
                  Book a repair appointment in just seconds. Save time with transparent pricing.
                </p>
                <button
                  onClick={() => setShowBookingForm(true)}
                  className="px-8 py-4 bg-gradient-to-r from-emerald-500 to-teal-500 text-slate-950 font-black rounded-2xl shadow-xl hover:-translate-y-1 transition duration-300 text-sm tracking-wide"
                >
                  Schedule a Repair Appointment Now 🛠️
                </button>
              </div>
            ) : (
              <div className="bg-slate-900/60 backdrop-blur-xl border border-slate-800 rounded-3xl p-8 shadow-2xl relative">
                <button
                  onClick={() => setShowBookingForm(false)}
                  className="absolute top-6 right-6 text-slate-500 hover:text-white bg-slate-800/50 w-8 h-8 rounded-full flex items-center justify-center transition"
                >
                  ✕
                </button>
                <h3 className="text-2xl font-black text-white">Register to Book an Appointment</h3>
                
                <form onSubmit={handleBookingSubmit} className="space-y-5 mt-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    <input
                      type="text"
                      required
                      placeholder="Full Name"
                      value={customerName}
                      onChange={(e) => setCustomerName(e.target.value)}
                      className="w-full p-3.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:border-emerald-500"
                    />
                    <input
                      type="text"
                      required
                      placeholder="Phone Number"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      className="w-full p-3.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:border-emerald-500"
                    />
                  </div>
                  <input
                    type="text"
                    required
                    placeholder="Device Name & Model"
                    value={deviceModel}
                    onChange={(e) => setDeviceModel(e.target.value)}
                    className="w-full p-3.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:border-emerald-500"
                  />
                  <textarea
                    required
                    placeholder="Describe the issue or symptoms..."
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    className="w-full p-3.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:border-emerald-500"
                    rows={3}
                  />
                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full py-4 bg-gradient-to-r from-emerald-500 to-teal-500 text-slate-950 font-black rounded-xl hover:from-emerald-400 hover:to-teal-400 transition text-xs tracking-wider uppercase"
                  >
                    {loading ? 'Sending...' : 'Sending Appointment Request'}
                  </button>
                </form>

                {message && (
                  <div className="mt-5 p-4 rounded-xl text-xs text-center border bg-emerald-500/10 text-emerald-400 border-emerald-500/20">
                    {message}
                  </div>
                )}
              </div>
            )}
          </div>

        </div>
      </div>
    </div>
  );
}