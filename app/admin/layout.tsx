'use client';

import { useState, useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import Link from 'next/link';

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const [adminName, setAdminName] = useState('Admin');
  const [isAuthorized, setIsAuthorized] = useState(false);

  // Route Protection: Check Admin Privileges
  useEffect(() => {
    const token = localStorage.getItem('token');
    const role = localStorage.getItem('role');

    if (!token || role !== 'admin') {
      router.push('/');
    } else {
      const storedName = localStorage.getItem('username');
      if (storedName) setAdminName(storedName);
      setIsAuthorized(true);
    }
  }, [router]);

  const handleLogout = () => {
    localStorage.clear();
    router.push('/');
  };

  //If authentication is not yet complete, hide the interface to avoid data leakage.
  if (!isAuthorized) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center text-emerald-400 font-mono text-sm">
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
            <span className="text-2xl">🛠️</span>
            <div>
              <h1 className="font-black text-base bg-gradient-to-r from-emerald-400 to-blue-500 bg-clip-text text-transparent">
                WebAIRepair
              </h1>
              <p className="text-[10px] text-slate-500 font-mono">ADMIN CONTROL PANEL</p>
            </div>
          </Link>

          {/* Navigation Menu Links */}
         <nav className="space-y-1.5">
          <SidebarLink 
            href="/admin" 
            icon="📊" 
            label="Overview" 
            active={pathname === '/admin'} 
          />
          <SidebarLink 
            href="/admin/users" 
            icon="👥" 
            label="User Management" 
            active={pathname === '/admin/users'} 
          />
         <SidebarLink 
            href="/admin/issues" 
            icon="⚠️" 
            label="Issue Management" 
            active={pathname === '/admin/issues'}
            badgeColor="bg-amber-500/20 text-amber-400"
          />
          <SidebarLink 
            href="/admin/devices" 
            icon="📱" 
            label="Device Management" 
            active={pathname === '/admin/devices'} 
          />
          <SidebarLink 
            href="/admin/parts" 
            icon="🧩" 
            label="Parts Management" 
            active={pathname.startsWith('/admin/parts')} 
          />
          <SidebarLink 
            href="/admin/ai" 
            icon="🤖" 
            label="AI Model Management" 
            active={pathname === '/admin/ai'} 
          />
          <SidebarLink 
            href="/admin/blogs" 
            icon="📝" 
            label="Blog Post Management" 
            active={pathname === '/admin/blogs'} 
          />
        </nav>
        </div>

        {/* Admin Information & Logout Button */}
        <div className="pt-4 border-t border-slate-800">
          <div className="flex items-center justify-between px-3 py-2 bg-slate-950/60 rounded-xl mb-3 border border-slate-800/80">
            <div className="flex items-center space-x-2 overflow-hidden">
              <div className="w-8 h-8 rounded-full bg-emerald-500/20 border border-emerald-500/40 text-emerald-400 flex items-center justify-center font-bold text-xs">
                A
              </div>
              <div className="truncate">
                <p className="text-xs font-bold text-white truncate">{adminName}</p>
                <p className="text-[10px] text-emerald-400 font-mono">System Admin</p>
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
            Hệ Thống Quản Trị / <span className="text-white font-bold capitalize">{pathname.replace('/admin', '') || 'Overview'}</span>
          </div>

          <div className="flex items-center space-x-4">
            <div className="relative">
              <input 
                type="text" 
                placeholder="Quick search..." 
                className="bg-slate-950 border border-slate-800 text-xs text-slate-200 rounded-xl pl-9 pr-4 py-2 w-60 focus:outline-none focus:border-emerald-500 transition"
              />
              <span className="absolute left-3 top-2 text-slate-500 text-xs">🔍</span>
            </div>
            <div className="flex items-center space-x-2 bg-emerald-500/10 border border-emerald-500/30 px-3 py-1 rounded-full">
              <div className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
              <span className="text-[10px] text-emerald-400 font-mono font-bold">SERVER LIVE</span>
            </div>
          </div>
        </header>

        {/* The subpage content will be inserted here. */}
        <main className="flex-1 p-8 overflow-y-auto">
          {children}
        </main>
      </div>

    </div>
  );
}

// Sub-components for links in the sidebar.
function SidebarLink({ href, icon, label, active, badge, badgeColor }: any) {
  return (
    <Link
      href={href}
      className={`w-full flex items-center justify-between px-3.5 py-3 rounded-xl text-xs font-semibold transition ${
        active 
          ? 'bg-gradient-to-r from-emerald-500/20 to-blue-600/20 text-emerald-400 border border-emerald-500/30 shadow-lg' 
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