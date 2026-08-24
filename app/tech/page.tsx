'use client';

import { useRouter } from 'next/navigation';

export default function TechPage() {
  const router = useRouter();

  return (
    <div className="space-y-8 animate-fade-in">
      
      {/* WELCOME BANNER */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-gradient-to-r from-slate-900 via-slate-900 to-cyan-950/40 p-6 rounded-2xl border border-slate-800">
        <div>
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <span>👋</span> Hello, Technician!
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Overview of the day's repair work, appointments, parts lookup, and AI support.
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => router.push('/tech/appointment')}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs rounded-xl transition flex items-center justify-center gap-2 shadow-lg shadow-blue-600/20"
          >
            <span>📅</span>
            <span>View Appointments</span>
          </button>
          <button
            onClick={() => router.push('/tech/issues')}
            className="px-4 py-2 bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs rounded-xl transition flex items-center justify-center gap-2 shadow-lg shadow-cyan-500/20"
          >
            <span>🛠️</span>
            <span>View Repair List</span>
          </button>
        </div>
      </div>

      {/* Metric Cards for Technicians */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        <StatCard 
          title="Appointments & Jobs" 
          value="5" 
          change="2 lịch hẹn mới" 
          icon="📅" 
          color="border-blue-500/30"
          changeColor="text-blue-400"
        />
        <StatCard 
          title="Assigned Incident" 
          value="12" 
          change="3 ca khẩn cấp" 
          icon="🛠️" 
          color="border-amber-500/30"
          changeColor="text-amber-400"
        />
        <StatCard 
          title="Device Under Repair" 
          value="8" 
          change="5 đang test, 3 chờ linh kiện" 
          icon="📱" 
          color="border-cyan-500/30" 
          changeColor="text-cyan-400"
        />
        <StatCard 
          title="AI Lookup Requests" 
          value="45" 
          change="Độ chính xác 98%" 
          icon="🤖" 
          color="border-purple-500/30" 
          changeColor="text-purple-400"
        />
        <StatCard 
          title="Technical Blog Post" 
          value="6" 
          change="2 bản nháp chưa xuất bản" 
          icon="📝" 
          color="border-emerald-500/30" 
          changeColor="text-emerald-400"
        />
      </div>

      {/* SHORTCUT AREA  */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6">
        <h3 className="text-sm font-bold text-white mb-4 flex items-center gap-2">
          <span>🚀</span> Quick Action Shortcuts
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-3">
          
          <button 
            onClick={() => router.push('/tech/appointment')} 
            className="p-4 bg-slate-950 border border-slate-800 hover:border-blue-500/50 rounded-xl text-left transition group"
          >
            <span className="text-xl block mb-2 group-hover:scale-110 transition-transform">📅</span>
            <p className="text-xs font-bold text-white">Appointments</p>
            <p className="text-[10px] text-slate-500">Claim new jobs & view schedule.</p>
          </button>

          <button 
            onClick={() => router.push('/tech/issues')} 
            className="p-4 bg-slate-950 border border-slate-800 hover:border-cyan-500/50 rounded-xl text-left transition group"
          >
            <span className="text-xl block mb-2 group-hover:scale-110 transition-transform">🛠️</span>
            <p className="text-xs font-bold text-white">Troubleshooting</p>
            <p className="text-[10px] text-slate-500">View the assigned repair request.</p>
          </button>

          <button 
            onClick={() => router.push('/tech/ai')} 
            className="p-4 bg-slate-950 border border-slate-800 hover:border-cyan-500/50 rounded-xl text-left transition group"
          >
            <span className="text-xl block mb-2 group-hover:scale-110 transition-transform">🤖</span>
            <p className="text-xs font-bold text-white">AI Q&A</p>
            <p className="text-[10px] text-slate-500">Look up error codes & solutions</p>
          </button>

          <button 
            onClick={() => router.push('/tech/devices')} 
            className="p-4 bg-slate-950 border border-slate-800 hover:border-cyan-500/50 rounded-xl text-left transition group"
          >
            <span className="text-xl block mb-2 group-hover:scale-110 transition-transform">📱</span>
            <p className="text-xs font-bold text-white">Equipment Diagnostics</p>
            <p className="text-[10px] text-slate-500">View machine history & specifications</p>
          </button>

          <button 
            onClick={() => router.push('/tech/parts')} 
            className="p-4 bg-slate-950 border border-slate-800 hover:border-cyan-500/50 rounded-xl text-left transition group"
          >
            <span className="text-xl block mb-2 group-hover:scale-110 transition-transform">🧩</span>
            <p className="text-xs font-bold text-white">Spare Parts Warehouse</p>
            <p className="text-[10px] text-slate-500">Check available materials</p>
          </button>

          <button 
            onClick={() => router.push('/tech/blogs')} 
            className="p-4 bg-slate-950 border border-slate-800 hover:border-cyan-500/50 rounded-xl text-left transition group"
          >
            <span className="text-xl block mb-2 group-hover:scale-110 transition-transform">✍️</span>
            <p className="text-xs font-bold text-white">Write a Blog Post</p>
            <p className="text-[10px] text-slate-500">Sharing repair tips and experiences</p>
          </button>

        </div>
      </div>

    </div>
  );
}

// Sub-component hiển thị Thẻ Chỉ Số.
function StatCard({ title, value, change, icon, color, changeColor }: any) {
  return (
    <div className={`p-5 bg-slate-900 border ${color} rounded-2xl flex items-center justify-between`}>
      <div>
        <p className="text-xs text-slate-400 font-medium">{title}</p>
        <p className="text-2xl font-black text-white mt-1">{value}</p>
        <p className={`text-[10px] mt-1 font-mono ${changeColor || 'text-cyan-400'}`}>{change}</p>
      </div>
      <span className="text-3xl p-3 bg-slate-950 rounded-xl border border-slate-800">{icon}</span>
    </div>
  );
}