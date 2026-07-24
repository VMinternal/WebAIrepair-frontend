'use client';

import { useState } from 'react';

export default function AdminPage() {
  const [activeTab, setActiveTab] = useState<'overview' | 'users' | 'issues' | 'devices' | 'ai' | 'blogs'>('overview');

  return (
    <div className="space-y-8 animate-fade-in">
      
      {/* SET OF METRIC CARDS */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <StatCard title="Total Users" value="1,248" change="+12% this month" icon="👥" color="border-emerald-500/30" />
        <StatCard title="Errors Needing Correction" value="18" change="5 emergency cases" icon="🛠️" color="border-amber-500/30" />
        <StatCard title="Receiving Device" value="342" change="98% completed" icon="💻" color="border-blue-500/30" />
        <StatCard title="AI Accuracy" value="96.4%" change="Model: Local-E5" icon="🤖" color="border-purple-500/30" />
      </div>

      {/* SHORTCUT AREA */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6">
        <h3 className="text-sm font-bold text-white mb-4">🚀 Quick Management Shortcut</h3>
        <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
          <button onClick={() => setActiveTab('users')} className="p-4 bg-slate-950 border border-slate-800 hover:border-emerald-500/50 rounded-xl text-left transition group">
            <span className="text-xl block mb-2 group-hover:scale-110 transition-transform">➕</span>
            <p className="text-xs font-bold text-white">Add Account</p>
            <p className="text-[10px] text-slate-500">Grant Technician permissions</p>
          </button>

          <button onClick={() => setActiveTab('issues')} className="p-4 bg-slate-950 border border-slate-800 hover:border-emerald-500/50 rounded-xl text-left transition group">
            <span className="text-xl block mb-2 group-hover:scale-110 transition-transform">🔍</span>
            <p className="text-xs font-bold text-white">Troubleshooting</p>
            <p className="text-[10px] text-slate-500">Review new repair schedule</p>
          </button>

          <button onClick={() => setActiveTab('ai')} className="p-4 bg-slate-950 border border-slate-800 hover:border-emerald-500/50 rounded-xl text-left transition group">
            <span className="text-xl block mb-2 group-hover:scale-110 transition-transform">⚡</span>
            <p className="text-xs font-bold text-white">AI Engine Configuration</p>
            <p className="text-[10px] text-slate-500">Train model & Prompts</p>
          </button>

          <button onClick={() => setActiveTab('devices')} className="p-4 bg-slate-950 border border-slate-800 hover:border-emerald-500/50 rounded-xl text-left transition group">
            <span className="text-xl block mb-2 group-hover:scale-110 transition-transform">📦</span>
            <p className="text-xs font-bold text-white">Import New Machines</p>
            <p className="text-[10px] text-slate-500">Warranty storage</p>
          </button>

          <button onClick={() => setActiveTab('blogs')} className="p-4 bg-slate-950 border border-slate-800 hover:border-emerald-500/50 rounded-xl text-left transition group">
            <span className="text-xl block mb-2 group-hover:scale-110 transition-transform">✍️</span>
            <p className="text-xs font-bold text-white">Posting Instructions</p>
            <p className="text-[10px] text-slate-500">AI Blog Update</p>
          </button>
        </div>
      </div>

    </div>
  );
}

// Sub-component hiển thị Thẻ thông số
function StatCard({ title, value, change, icon, color }: any) {
  return (
    <div className={`p-5 bg-slate-900 border ${color} rounded-2xl flex items-center justify-between`}>
      <div>
        <p className="text-xs text-slate-400 font-medium">{title}</p>
        <p className="text-2xl font-black text-white mt-1">{value}</p>
        <p className="text-[10px] text-emerald-400 mt-1 font-mono">{change}</p>
      </div>
      <span className="text-3xl p-3 bg-slate-950 rounded-xl border border-slate-800">{icon}</span>
    </div>
  );
}