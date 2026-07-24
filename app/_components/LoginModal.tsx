'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

interface LoginModalProps {
  onClose: () => void;
  onSwitchToRegister?: () => void;
  onLoginSuccess?: (userData: any) => void;
}



export default function LoginModal({ onClose, onSwitchToRegister, onLoginSuccess }: LoginModalProps) {
  const router = useRouter();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loginError, setLoginError] = useState('');
  const [loginLoading, setLoginLoading] = useState(false);

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginLoading(true);
    setLoginError('');

    try {
      const response = await fetch('http://localhost:8000/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (response.ok) {
      console.log('👉 Data từ Backend:', data);

      const detectedName = 
        data.user?.fullName || data.user?.full_name || data.user?.name || data.user?.username ||
        data.fullName || data.full_name || data.name || data.username ||
        data.user?.email || data.email || 
        email;

      // Create a secure User Object
      const userToSave = {
        fullName: detectedName,
        email: data.email || email,
        role: data.role || data.user?.role || 'user',
      };

      // Save the token and information to localStorage
      localStorage.setItem('token', data.accessToken || data.token || '');
      localStorage.setItem('role', data.role || userToSave.role || 'user');
      localStorage.setItem('user', JSON.stringify(userToSave)); 

      // Notify page.tsx to update the UI Header.
      if (onLoginSuccess) {
        onLoginSuccess(userToSave); 
      }

      // Redirect permissions and page reloading.
      onClose();
      setLoginLoading(false);

      if (data.role === 'admin') {
        router.push('/admin');
      } else if (data.role === 'tech' || data.role === 'technician') {
        router.push('/tech');
      } else {
        // If you are a regular user, reload the page so the Welcome message updates immediately.
        window.location.reload();
      }
      return;
    } else {
      // Login failed (Incorrect email, password)
      setLoginError(data.message || 'Incorrect email or password!');
      setLoginLoading(false);
      return;
    }

    } catch (error: any) {
      console.log("⚠️ API connection lost. Activate Demo rescue mode...");
      
      // Demo mode when backend connection is unsuccessful.
      setTimeout(() => {
        if (email === 'admin@webairepair.com' && password === '123456') {
          const adminUser = { fullName: 'System Admin', role: 'admin' };
          localStorage.setItem('token', 'mock-admin-jwt-token');
          localStorage.setItem('role', 'admin');
          localStorage.setItem('user', JSON.stringify(adminUser));
          if (onLoginSuccess) onLoginSuccess(adminUser);

          router.push('/admin');
          onClose();
        } else if (email === 'tech@webairepair.com' && password === '123456') {
          const techUser = { fullName: 'Technician Demo', role: 'tech' };
          localStorage.setItem('token', 'mock-tech-jwt-token');
          localStorage.setItem('role', 'tech');
          localStorage.setItem('user', JSON.stringify(techUser));
          if (onLoginSuccess) onLoginSuccess(techUser);

          router.push('/tech');
          onClose();
        } else {
          setLoginError('❌ Incorrect email or password for system verification!');
        }
        setLoginLoading(false);
      }, 800);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-8 max-w-md w-full relative shadow-2xl">
        
        {/* Modal close button */}
        <button 
          onClick={() => { onClose(); setLoginError(''); }} 
          className="absolute top-6 right-6 text-slate-500 hover:text-white bg-slate-800/50 w-8 h-8 rounded-full flex items-center justify-center transition"
        >
         ✕
        </button>

        {/* Switch to Registration Mode */}
        {onSwitchToRegister && (
          <div className="mt-5 text-center text-xs text-slate-400">
            Don't have an account?{' '}
            <button 
              type="button"
              onClick={onSwitchToRegister}
              className="text-emerald-400 font-bold hover:underline"
            >
              Register now
            </button>
          </div>
        )}

        <div className="mb-6 text-center">
          <span className="text-3xl">🔐</span>
          <h3 className="text-xl font-black text-white mt-3">Log In to the System</h3>
          <p className="text-slate-500 text-xs mt-1">The system provides permission settings for administrators and technicians.</p>
        </div>

        <form onSubmit={handleLoginSubmit} className="space-y-4">
          <div className="space-y-1">
            <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Account email</label>
            <input 
              type="email" 
              required 
              placeholder="admin@webairepair.com hoặc tech@webairepair.com" 
              value={email} 
              onChange={(e) => setEmail(e.target.value)} 
              className="w-full p-3 bg-slate-950 border border-slate-800 rounded-xl text-sm text-white focus:outline-none focus:border-emerald-500 transition" 
            />
          </div>

          <div className="space-y-1">
            <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Password</label>
            <input 
              type="password" 
              required 
              placeholder="System password (123456)" 
              value={password} 
              onChange={(e) => setPassword(e.target.value)} 
              className="w-full p-3 bg-slate-950 border border-slate-800 rounded-xl text-sm text-white focus:outline-none focus:border-emerald-500 transition" 
            />
          </div>

          {loginError && (
            <div className="p-3 bg-red-500/10 border border-red-500/25 rounded-xl text-[11px] text-red-400 animate-pulse">
              {loginError}
            </div>
          )}

          <button 
            type="submit" 
            disabled={loginLoading} 
            className="w-full py-3 bg-gradient-to-r from-emerald-500 to-blue-600 text-slate-950 font-bold rounded-xl text-sm hover:from-emerald-400 hover:to-blue-500 transition shadow-lg disabled:opacity-40 disabled:cursor-not-allowed"
          >
            {loginLoading ? 'Data verification in progress...' : 'Login Verification'}
          </button>
        </form>

        <div className="mt-6 p-3.5 bg-slate-950 rounded-xl border border-slate-800/80 text-[10px] text-slate-500 leading-relaxed">
          💡 <span className="font-bold text-slate-400">Council Demo Account:</span> <br />
          • Admin: <code className="text-emerald-400">admin@webairepair.com</code> / Pass: <code className="text-slate-300">123456</code> <br />
          • Tech: <code className="text-blue-400">tech@webairepair.com</code> / Pass: <code className="text-slate-300">123456</code>
        </div>
      </div>
    </div>
  );
}