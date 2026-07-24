'use client';

import { useState } from 'react';

interface RegisterModalProps {
  onClose: () => void;
  onSwitchToLogin?: () => void;
}

export default function RegisterModal({ onClose, onSwitchToLogin }: RegisterModalProps) {
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const [loading, setLoading] = useState(false);

  // Client-side validation compatible with Backend RegisterDto
  const validateForm = () => {
    if (!fullName.trim()) {
      setError("⚠️ Full name cannot be empty!");
      return false;
    }
    if (!email.trim() || !email.includes('@')) {
      setError("⚠️ Invalid email address!");
      return false;
    }
    if (password.length < 8) {
      setError("⚠️ Password must be at least 8 characters long!");
      return false;
    }
    // Password regex check: Uppercase, lowercase, number/special character
    const passwordRegex = /((?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/;
    if (!passwordRegex.test(password)) {
      setError("⚠️ Password must contain at least one uppercase letter, one lowercase letter, and one number or special character!");
      return false;
    }
    if (password !== confirmPassword) {
      setError("⚠️ Passwords do not match!");
      return false;
    }
    return true;
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccessMsg('');

    if (!validateForm()) return;

    setLoading(true);

    try {
      const response = await fetch('http://localhost:8000/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          fullName: fullName.trim(),
          email: email.trim().toLowerCase(),
          password,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        setSuccessMsg("🎉 Registration successful! Redirecting to login...");
        setTimeout(() => {
          if (onSwitchToLogin) onSwitchToLogin();
          else onClose();
        }, 1500);
      } else {
        // Get error message returned from NestJS ValidationPipe
        const message = Array.isArray(data.message) ? data.message[0] : data.message;
        throw new Error(message || "Registration failed, please try again!");
      }
    } catch (err: any) {
      setError(err.message || "Cannot connect to server!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-fade-in">
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-8 max-w-md w-full relative shadow-2xl">
        
        {/* Close Button */}
        <button 
          onClick={onClose} 
          className="absolute top-6 right-6 text-slate-500 hover:text-white bg-slate-800/50 w-8 h-8 rounded-full flex items-center justify-center transition"
        >
          ✕
        </button>

        {/* Header Title */}
        <div className="mb-6 text-center">
          <span className="text-3xl">🛠️</span>
          <h3 className="text-xl font-black text-white mt-2">Create New Account</h3>
          <p className="text-slate-400 text-xs mt-1">Register to use WebAIRepair AI Diagnostic System</p>
        </div>

        {/* Registration Form */}
        <form onSubmit={handleRegister} className="space-y-3.5">
          <div className="space-y-1">
            <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Full Name</label>
            <input 
              type="text" 
              required 
              placeholder="John Doe" 
              value={fullName} 
              onChange={(e) => setFullName(e.target.value)} 
              className="w-full p-3 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:border-emerald-500 transition" 
            />
          </div>

          <div className="space-y-1">
            <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Email</label>
            <input 
              type="email" 
              required 
              placeholder="user@webairepair.com" 
              value={email} 
              onChange={(e) => setEmail(e.target.value)} 
              className="w-full p-3 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:border-emerald-500 transition" 
            />
          </div>

          <div className="space-y-1">
            <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Password</label>
            <input 
              type="password" 
              required 
              placeholder="Min 8 chars (Upper, lower, number/special)" 
              value={password} 
              onChange={(e) => setPassword(e.target.value)} 
              className="w-full p-3 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:border-emerald-500 transition" 
            />
          </div>

          <div className="space-y-1">
            <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Confirm Password</label>
            <input 
              type="password" 
              required 
              placeholder="Re-enter password" 
              value={confirmPassword} 
              onChange={(e) => setConfirmPassword(e.target.value)} 
              className="w-full p-3 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:border-emerald-500 transition" 
            />
          </div>

          {/* Error Message */}
          {error && (
            <div className="p-3 bg-red-500/10 border border-red-500/30 rounded-xl text-[11px] text-red-400">
              {error}
            </div>
          )}

          {/* Success Message */}
          {successMsg && (
            <div className="p-3 bg-emerald-500/10 border border-emerald-500/30 rounded-xl text-[11px] text-emerald-400 font-bold">
              {successMsg}
            </div>
          )}

          <button 
            type="submit" 
            disabled={loading} 
            className="w-full py-3 bg-gradient-to-r from-emerald-500 to-blue-600 text-slate-950 font-bold rounded-xl text-xs hover:from-emerald-400 hover:to-blue-500 transition shadow-lg disabled:opacity-40"
          >
            {loading ? "⏳ Creating account..." : "Create Account"}
          </button>
        </form>

        {/* Switch to Login Modal */}
        {onSwitchToLogin && (
          <div className="mt-5 text-center text-xs text-slate-400">
            Already have an account?{' '}
            <button 
              onClick={onSwitchToLogin} 
              className="text-emerald-400 font-bold hover:underline"
            >
              Log in now
            </button>
          </div>
        )}

      </div>
    </div>
  );
}