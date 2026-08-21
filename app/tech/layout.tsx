'use client';

import { useState, useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import Link from 'next/link';

export default function TechLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const [techName, setTechName] = useState('Technician');
  const [isAuthorized, setIsAuthorized] = useState(false);

  // Route Protection: Check Technician (Tech) permissions
  useEffect(() => {
    const token = localStorage.getItem('token');
    const role = localStorage.getItem('role');

    if (!token || (role !== 'tech' && role !== 'technician')) {
      router.push('/');
    } else {
      const storedName = localStorage.getItem('fullname') || localStorage.getItem('username');
      if (storedName) setTechName(storedName);
      setIsAuthorized(true);
    }
  }, [router]);

  const handleLogout = () => {
    localStorage.clear();
    router.push('/');
  };

  if (!isAuthorized) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center text-cyan-400 font-mono text-sm">
        ⏳ Checking access permissions...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex font-sans">
      
      {/* ----------------- FIXED SIDEBAR ----------------- */}
      <aside className="w-64 bg-slate-900 border-r border-slate-800 flex flex-col justify-between p-4 flex-shrink-0 h-screen sticky top-0">
        <div>
          {/* Logo Brand */}
          <Link href="/" className="flex items-center space-x-3 px-3 py-4 mb-6 border-b border-slate-800 block">
            <span className="text-2xl">🔧</span>
            <div>
              <h1 className="font-black text-base bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">
                WebAIRepair
              </h1>
              <p className="text-[10px] text-slate-500 font-mono">TECHNICIAN WORKSPACE</p>
            </div>
          </Link>

          {/* Navigation Menu Links */}
          <nav className="space-y-1.5">
            <SidebarLink 
              href="/tech" 
              icon="📊" 
              label="Work Overview" 
              active={pathname === '/tech'} 
            />
            <SidebarLink 
              href="/tech/issues" 
              icon="🛠️" 
              label="Assigned Tickets" 
              active={pathname.startsWith('/tech/issues')} 
              badgeColor="bg-cyan-500/20 text-cyan-400"
            />
            <SidebarLink 
              href="/tech/devices" 
              icon="📱" 
              label="Device Diagnostics" 
              active={pathname.startsWith('/tech/devices')} 
            />
            <SidebarLink 
              href="/tech/parts" 
              icon="🧩" 
              label="Parts Inventory" 
              active={pathname.startsWith('/tech/parts')} 
            />
            <SidebarLink 
              href="/tech/ai" 
              icon="🤖" 
              label="AI Diagnostics & Search" 
              active={pathname.startsWith('/tech/ai')} 
            />
            <SidebarLink 
              href="/tech/blogs" 
              icon="📝" 
              label="Tech Blogs & Articles" 
              active={pathname.startsWith('/tech/blogs')} 
            />
          </nav>
        </div>

        {/* Tech Information & Logout Button */}
        <div className="pt-4 border-t border-slate-800">
          <div className="flex items-center justify-between px-3 py-2 bg-slate-950/60 rounded-xl mb-3 border border-slate-800/80">
            <div className="flex items-center space-x-2 overflow-hidden">
              <div className="w-8 h-8 rounded-full bg-cyan-500/20 border border-cyan-500/40 text-cyan-400 flex items-center justify-center font-bold text-xs">
                T
              </div>
              <div className="truncate">
                <p className="text-xs font-bold text-white truncate">{techName}</p>
                <p className="text-[10px] text-cyan-400 font-mono">Technician</p>
              </div>
            </div>
          </div>
          
          <button 
            onClick={handleLogout}
            className="w-full flex items-center justify-center space-x-2 py-2.5 bg-red-500/10 hover:bg-red-500/20 text-red-400 text-xs font-bold rounded-xl border border-red-500/20 transition"
          >
            <span>🚪</span>
            <span>Log Out</span>
          </button>
        </div>
      </aside>

      {/* ----------------- MAIN CONTENT AREA ----------------- */}
      <div className="flex-1 flex flex-col min-w-0 min-h-screen">
        
        {/* Fixed Header */}
        <header className="h-16 border-b border-slate-800 bg-slate-900/50 backdrop-blur-md px-8 flex items-center justify-between sticky top-0 z-10">
          <div className="text-xs text-slate-400 font-mono">
            Technician / <span className="text-white font-bold capitalize">{pathname.replace('/tech', '') || 'Overview'}</span>
          </div>

          <div className="flex items-center space-x-4">
            <div className="relative">
              <input 
                type="text" 
                placeholder="Search ticket, error code, article..." 
                className="bg-slate-950 border border-slate-800 text-xs text-slate-200 rounded-xl pl-9 pr-4 py-2 w-64 focus:outline-none focus:border-cyan-500 transition"
              />
              <span className="absolute left-3 top-2 text-slate-500 text-xs">🔍</span>
            </div>
            <div className="flex items-center space-x-2 bg-cyan-500/10 border border-cyan-500/30 px-3 py-1 rounded-full">
              <div className="w-2 h-2 rounded-full bg-cyan-500 animate-ping" />
              <span className="text-[10px] text-cyan-400 font-mono font-bold">TECH ONLINE</span>
            </div>
          </div>
        </header>

        {/* Content */}
        <main className="flex-1 p-8 overflow-y-auto">
          {children}
        </main>
      </div>

    </div>
  );
}

function SidebarLink({ href, icon, label, active, badge, badgeColor }: any) {
  return (
    <Link
      href={href}
      className={`w-full flex items-center justify-between px-3.5 py-3 rounded-xl text-xs font-semibold transition ${
        active 
          ? 'bg-gradient-to-r from-cyan-500/20 to-blue-600/20 text-cyan-400 border border-cyan-500/30 shadow-lg' 
          : 'text-slate-400 hover:bg-slate-800/60 hover:text-slate-200'
      }`}
    >
      <div className="flex items-center space-x-3">
        <span className="text-base">{icon}</span>
        <span>{label}</span>
      </div>
      {badge && (
        <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${badgeColor || 'bg-slate-800 text-slate-400'}`}>
          {badge}
        </span>
      )}
    </Link>
  );
}