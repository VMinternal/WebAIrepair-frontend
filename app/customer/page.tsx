'use client';
import { useState } from 'react';
import Link from 'next/link';

export default function CustomerPortalPage() {
  const [showBookingForm, setShowBookingForm] = useState(false);
  const [customerName, setCustomerName] = useState('');
  const [phone, setPhone] = useState('');
  const [deviceModel, setDeviceModel] = useState('');
  const [description, setDescription] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

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
    <div className="relative min-h-screen flex flex-col bg-slate-950 text-slate-100">
      
      {/* Navigation header to return to the central homepage */}
      <header className="relative z-20 max-w-7xl w-full mx-auto px-6 py-4 flex justify-between items-center border-b border-slate-900 bg-slate-950/80 backdrop-blur-md">
        <div className="flex items-center gap-2">
          <span className="text-xl">🛠️</span>
          <span className="font-black text-lg bg-clip-text text-transparent bg-gradient-to-r from-emerald-400 to-teal-400">WebAI Repair</span>
        </div>
        <Link href="/" className="text-xs bg-slate-900 hover:bg-slate-800 text-slate-300 px-4 py-2 rounded-xl border border-slate-800/80 transition">
          ← Back to Homepage Center
        </Link>
      </header>

      {/* Giao diện chính */}
      <div className="flex-grow flex items-center justify-center px-4 py-12 relative">
        <div className="absolute top-1/4 left-1/4 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] bg-emerald-500/10 rounded-full blur-[120px] pointer-events-none" />
        <div className="absolute bottom-1/4 right-1/4 translate-x-1/2 translate-y-1/2 w-[500px] h-[500px] bg-teal-500/10 rounded-full blur-[150px] pointer-events-none" />

        <div className="relative z-10 max-w-6xl w-full grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          {/* LEFT COLUMN: AI CHATBOT */}
          <div className="lg:col-span-5 bg-slate-900/60 backdrop-blur-xl border border-slate-800/80 rounded-3xl h-[550px] flex flex-col shadow-2xl shadow-emerald-950/20">
            <div className="p-5 border-b border-slate-800/80 bg-slate-950/50 rounded-t-3xl flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="relative">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-emerald-400 to-teal-500 flex items-center justify-center shadow-lg shadow-emerald-500/20">
                    <span className="text-xl">🤖</span>
                  </div>
                  <span className="absolute bottom-0 right-0 w-3 h-3 bg-emerald-500 border-2 border-slate-900 rounded-full animate-pulse" />
                </div>
                <div>
                  <h2 className="font-bold text-white text-sm tracking-wide">WebAI Assistant</h2>
                  <p className="text-[10px] text-emerald-400 font-medium">The AI ​​assistant is online.</p>
                </div>
              </div>
              <span className="text-xs bg-slate-800 px-2.5 py-1 rounded-full text-slate-400 font-medium border border-slate-700/50">GPT-4o</span>
            </div>
            
            <div className="flex-grow p-6 space-y-4 overflow-y-auto text-sm">
              <div className="flex gap-3 max-w-[85%]">
                <div className="flex-shrink-0 w-7 h-7 rounded-full bg-slate-800 flex items-center justify-center text-xs">🤖</div>
                <div className="bg-slate-800/80 text-slate-200 p-3.5 rounded-2xl border border-slate-700/40 shadow-sm">
                  Hello! I'm the AI ​​assistant from **WebAI Repair**. What kind of problem are you experiencing with your device?
                </div>
              </div>
            </div>

            <div className="p-4 border-t border-slate-800/80 bg-slate-950/40 rounded-b-3xl flex gap-2">
              <input type="text" placeholder="Enter the error status..." className="flex-grow px-4 py-3 bg-slate-950 border border-slate-800/80 rounded-xl focus:outline-none focus:border-emerald-500/80 text-sm text-white placeholder-slate-600 transition" />
              <button className="px-5 py-3 bg-gradient-to-r from-emerald-500 to-teal-500 text-slate-950 font-bold rounded-xl text-sm">Gửi</button>
            </div>
          </div>

          {/* RIGHT COLUMN: APPOINTMENT BOOKING FORM */}
          <div className="lg:col-span-7 space-y-8">
            {!showBookingForm ? (
              <div className="space-y-8 lg:pr-6">
                <div className="inline-flex items-center gap-2 bg-emerald-500/10 border border-emerald-500/20 px-3.5 py-1.5 rounded-full text-xs text-emerald-400 font-semibold">
                  <span className="w-2 h-2 bg-emerald-400 rounded-full animate-ping" /> Customer Portal
                </div>
                <h1 className="text-4xl md:text-5xl font-black leading-[1.1] text-transparent bg-clip-text bg-gradient-to-r from-white via-slate-100 to-slate-400">
                  Diagnosis using AI.<br /><span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-teal-400">Rapid repairs.</span>
                </h1>
                <p className="text-slate-400 text-base">Book a repair appointment in just seconds. Save time, transparent pricing.</p>
                <button onClick={() => setShowBookingForm(true)} className="px-8 py-4 bg-gradient-to-r from-emerald-500 to-teal-500 text-slate-950 font-black rounded-2xl shadow-xl hover:-translate-y-1 transition duration-300">
                  Schedule a Repair Appointment Now 🛠️
                </button>
              </div>
            ) : (
              <div className="bg-slate-900/60 backdrop-blur-xl border border-slate-800 rounded-3xl p-8 shadow-2xl relative">
                <button onClick={() => setShowBookingForm(false)} className="absolute top-6 right-6 text-slate-500 hover:text-white bg-slate-800/50 w-8 h-8 rounded-full flex items-center justify-center">✕</button>
                <h3 className="text-2xl font-black text-white">Register to Book an Appointment</h3>
                <form onSubmit={handleBookingSubmit} className="space-y-5 mt-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    <input type="text" required placeholder="Họ và tên" value={customerName} onChange={(e) => setCustomerName(e.target.value)} className="w-full p-3.5 bg-slate-950 border border-slate-800 rounded-xl text-white focus:outline-none focus:border-emerald-500" />
                    <input type="text" required placeholder="Số điện thoại" value={phone} onChange={(e) => setPhone(e.target.value)} className="w-full p-3.5 bg-slate-950 border border-slate-800 rounded-xl text-white focus:outline-none focus:border-emerald-500" />
                  </div>
                  <input type="text" required placeholder="Device Name & Model" value={deviceModel} onChange={(e) => setDeviceModel(e.target.value)} className="w-full p-3.5 bg-slate-950 border border-slate-800 rounded-xl text-white focus:outline-none focus:border-emerald-500" />
                  <textarea required placeholder="Error phenomenon..." value={description} onChange={(e) => setDescription(e.target.value)} className="w-full p-3.5 bg-slate-950 border border-slate-800 rounded-xl text-white focus:outline-none focus:border-emerald-500" rows={3} />
                  <button type="submit" disabled={loading} className="w-full py-4 bg-gradient-to-r from-emerald-500 to-teal-500 text-slate-950 font-black rounded-xl hover:from-emerald-400 hover:to-teal-400 transition text-sm tracking-wider uppercase">{loading ? 'Sending...' : 'Sending Appointment Request'}</button>
                </form>
                {message && <div className="mt-5 p-4 rounded-xl text-xs text-center border bg-emerald-500/10 text-emerald-400 border-emerald-500/20">{message}</div>}
              </div>
            )}
          </div>

        </div>
      </div>
    </div>
  );
}