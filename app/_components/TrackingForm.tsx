'use client';

import { useState } from 'react';


interface TrackingFormProps {
  setActiveTab: (tab: 'welcome' | 'booking' | 'tracking') => void;
}

export default function TrackingForm({ setActiveTab }: TrackingFormProps) {
  // Managing State Processes
  const [searchPhone, setSearchPhone] = useState('');
  const [trackingLoading, setTrackingLoading] = useState(false);
  const [trackingResult, setTrackingResult] = useState<any>(null);
  const [trackingError, setTrackingError] = useState('');

 
  const handleTrackingSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchPhone.trim()) return;
    
    setTrackingLoading(true);
    setTrackingError('');
    setTrackingResult(null);

    try {
      const response = await fetch(`http://localhost:8000/appointments/search?phone=${searchPhone}`);
      const data = await response.json();

      if (response.ok) {
        if (data && (Array.isArray(data) ? data.length > 0 : data)) {
          setTrackingResult(data); 
        } else {
          setTrackingError('🔍 No appointment information was found associated with this phone number!');
        }
      } else {
        setTrackingError(`❌ System error: ${data.message || 'Unable to search'}`);
      }
    } catch (error) {
      // This is a demo data simulation in case the backend hasn't run the search endpoint yet.
      console.log("API search not yet connected, displaying demo data.");
      setTrackingResult({
        customer_name: "Vuong Quang Minh",
        phone: searchPhone,
        device_name: "iPhone 14 Pro Max",
        issue_description: "Màn hình sọc ngang, loang màu nhẹ",
        status: "repairing", // DB matching test status: pending | repairing | completed
        createdAt: new Date().toISOString()
      });
    } finally {
      setTrackingLoading(false);
    }
  };

  return (
    <div className="bg-slate-900/60 backdrop-blur-xl border border-slate-800 rounded-3xl p-8 md:p-10 shadow-2xl relative">
      <button 
        onClick={() => { 
          setActiveTab('welcome'); 
          setTrackingResult(null); 
          setTrackingError(''); 
        }} 
        className="absolute top-6 right-6 text-slate-500 hover:text-white bg-slate-800/50 w-8 h-8 rounded-full flex items-center justify-center transition"
      >
        ✕
      </button>
      
      <div className="mb-6">
        <h3 className="text-2xl font-black text-white tracking-wide">Check Progress 🔍</h3>
        <p className="text-slate-400 text-xs mt-1">Enter your phone number to check the repair status in real time.</p>
      </div>

      <form onSubmit={handleTrackingSearch} className="flex gap-2 mb-6">
        <input 
          type="text" 
          required 
          placeholder="Enter your phone number..." 
          value={searchPhone} 
          onChange={(e) => setSearchPhone(e.target.value)} 
          className="flex-grow p-3.5 bg-slate-950/80 border border-slate-800/80 rounded-xl text-sm text-white focus:border-emerald-500 focus:outline-none transition" 
        />
        <button 
          type="submit" 
          disabled={trackingLoading} 
          className="px-6 bg-gradient-to-r from-emerald-500 to-teal-500 text-slate-950 font-black rounded-xl hover:from-emerald-400 hover:to-teal-400 transition text-sm disabled:opacity-50"
        >
          {trackingLoading ? 'Find...' : 'Search'}
        </button>
      </form>

    
      {trackingResult && (() => {
        // Normalize the data in case the database returns an array or a single object.
        const appointmentData = Array.isArray(trackingResult) ? trackingResult[0] : trackingResult;
        if (!appointmentData) return null;

        // Safe fallback retrieves data from both the database and mock data in the demo, so there's no need to worry about crashes.
        const deviceName = appointmentData.device?.model || appointmentData.device_name || 'The device is updating.';
        const issueDesc = appointmentData.issueDescription || appointmentData.issue_description || 'Detailed bug reports have not yet been updated.';
        const rawDate = appointmentData.appointmentDate || appointmentData.createdAt;
        const formattedDate = rawDate ? new Date(rawDate).toLocaleString('vi-VN') : 'Newly updated';

        // Get the correct status from appointmentData instead of the original trackingResult
        const statusDb = appointmentData.status?.toLowerCase() || 'pending';

        return (
          <div className="border border-slate-800 bg-slate-950/50 rounded-2xl p-5 space-y-4">
            <div className="flex justify-between items-center border-b border-slate-800/60 pb-3">
              <div>
                <h4 className="font-black text-white text-base">
                  {appointmentData.customer_name || appointmentData.customerName}
                </h4>
                <p className="text-[10px] text-slate-500 mt-0.5">SĐT: {appointmentData.phone}</p>
              </div>
              
              {/* Badge trạng thái thông minh */}
              <span className={`px-3 py-1 rounded-full text-[11px] font-bold border ${
                statusDb === 'completed' || statusDb === 'done' 
                  ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' :
                statusDb === 'repairing' || statusDb === 'processing' 
                  ? 'bg-blue-500/10 text-blue-400 border-blue-500/20 animate-pulse' :
                  'bg-yellow-500/10 text-yellow-500 border border-yellow-500/20'
              }`}>
                ● {
                  statusDb === 'completed' || statusDb === 'done' ? 'Completed' : 
                  statusDb === 'repairing' || statusDb === 'processing' ? 'repairing' : 
                  'Awaiting receipt'
                }
              </span>
            </div>

            <div className="space-y-2 text-xs">
              <p><span className="text-slate-500 font-medium">Thiết bị:</span> <span className="text-slate-200 font-semibold">{deviceName}</span></p>
              <p><span className="text-slate-500 font-medium">Tình trạng lỗi:</span> <span className="text-slate-200">{issueDesc}</span></p>
              <p><span className="text-slate-500 font-medium">Ngày đặt lịch:</span> <span className="text-slate-400">{formattedDate}</span></p>
            </div>

            {/* Timeline of actual repair progress */}
            <div className="pt-2 border-t border-slate-800/60">
              <p className="text-[10px] text-slate-500 font-semibold uppercase tracking-wider mb-3">Repair process:</p>
              <div className="grid grid-cols-3 gap-2 text-[10px] font-bold text-center">
                <div className="p-2 rounded-lg border bg-emerald-500/10 text-emerald-400 border-emerald-500/20">
                  ✓ BOOKED
                </div>
                
                <div className={`p-2 rounded-lg border transition-all ${
                  statusDb === 'repairing' || statusDb === 'processing' || statusDb === 'completed' || statusDb === 'done'
                    ? 'bg-blue-500/10 text-blue-400 border-blue-500/20' 
                    : 'bg-slate-900 text-slate-600 border-slate-850'
                }`}>
                  ⚙️ UNDER REPAIR
                </div>
                
                <div className={`p-2 rounded-lg border transition-all ${
                  statusDb === 'completed' || statusDb === 'done'
                    ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' 
                    : 'bg-slate-900 text-slate-600 border-slate-850'
                }`}>
                  🎁 COMPLETED
                </div>
              </div>
            </div>
          </div>
        );
      })()}

      {/* Error message if data is not found after the search. */}
      {trackingError && (
        <div className="p-4 rounded-xl text-xs text-center font-bold border bg-red-500/10 text-red-400 border-red-500/20 mt-4">
          {trackingError}
        </div>
      )}
    </div>
  );
}