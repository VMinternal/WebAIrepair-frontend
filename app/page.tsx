'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

// Import các mảnh ghép vừa được tách ra từ thư mục _components
import BookingForm from './_components/BookingForm';
import TrackingForm from './_components/TrackingForm';
import LoginModal from './_components/LoginModal';

export default function UnifiedHomePage() {
  const router = useRouter();
  
  // Quản lý tab hoạt động: 'welcome' (mặc định), 'booking' (đặt lịch), 'tracking' (tra cứu)
  const [activeTab, setActiveTab] = useState<'welcome' | 'booking' | 'tracking'>('welcome');
  const [showLoginModal, setShowLoginModal] = useState(false);

  return (
    <div className="relative min-h-screen flex flex-col justify-between overflow-hidden bg-slate-950 text-slate-100">
      
      {/* BACKGROUND GLOWS */}
      <div className="absolute top-1/4 left-1/4 -translate-x-1/2 -translate-y-1/2 w-[450px] h-[450px] bg-emerald-500/10 rounded-full blur-[130px] pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 translate-x-1/2 translate-y-1/2 w-[550px] h-[550px] bg-blue-500/10 rounded-full blur-[160px] pointer-events-none" />

      {/* ================= HEADER ================= */}
      <header className="relative z-20 max-w-7xl w-full mx-auto px-6 py-5 flex justify-between items-center border-b border-slate-900/80 bg-slate-950/70 backdrop-blur-md">
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
          <button onClick={() => setActiveTab('welcome')} className={`transition ${activeTab === 'welcome' ? 'text-emerald-400 font-bold' : 'hover:text-emerald-400'}`}>Trang Chủ</button>
          <button onClick={() => setActiveTab('booking')} className={`transition ${activeTab === 'booking' ? 'text-emerald-400 font-bold' : 'hover:text-emerald-400'}`}>Đặt Lịch</button>
          <button onClick={() => setActiveTab('tracking')} className={`transition ${activeTab === 'tracking' ? 'text-emerald-400 font-bold' : 'hover:text-emerald-400'}`}>Tra Cứu Lịch Trình</button>
        </nav>

        <button 
          onClick={() => setShowLoginModal(true)}
          className="px-5 py-2.5 bg-gradient-to-r from-emerald-500 to-teal-500 text-slate-950 font-bold text-xs rounded-xl shadow-lg hover:shadow-emerald-500/20 transition-all transform hover:-translate-y-0.5"
        >
          Đăng Nhập Hệ Thống 🔐
        </button>
      </header>

      {/* ================= MAIN CONTENT ================= */}
      <main className="relative z-10 max-w-7xl w-full mx-auto px-6 py-12 flex-grow flex items-center justify-center">
        <div className="w-full grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          {/* CỘT TRÁI: CHATBOT AI CHẨN ĐOÁN */}
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
                  <p className="text-[10px] text-emerald-400 font-medium">Trợ lý AI đang trực tuyến</p>
                </div>
              </div>
              <span className="text-xs bg-slate-800 px-2.5 py-1 rounded-full text-slate-400 font-medium border border-slate-700/50">GPT-4o</span>
            </div>
            
            <div className="flex-grow p-6 space-y-4 overflow-y-auto text-sm">
              <div className="flex gap-3 max-w-[85%]">
                <div className="flex-shrink-0 w-7 h-7 rounded-full bg-slate-800 flex items-center justify-center text-xs">🤖</div>
                <div className="bg-slate-800/80 text-slate-200 p-3.5 rounded-2xl rounded-tl-none border border-slate-700/40 leading-relaxed shadow-sm">
                  Xin chào quý khách! Mình là trợ lý AI của **WebAI Repair**. Bạn có thể chẩn đoán lỗi thiết bị tại đây, hoặc dùng form bên cạnh để **đặt lịch hẹn** / **tra cứu tiến độ sửa chữa** trực tiếp nha!
                </div>
              </div>
            </div>

            <div className="p-4 border-t border-slate-800/80 bg-slate-950/40 rounded-b-3xl flex gap-2">
              <input type="text" placeholder="Nhập tình trạng lỗi thiết bị..." className="flex-grow px-4 py-3 bg-slate-950 border border-slate-800/80 rounded-xl focus:outline-none focus:border-emerald-500/80 text-sm text-white placeholder-slate-600 transition" />
              <button className="px-5 py-3 bg-gradient-to-r from-emerald-500 to-teal-500 text-slate-950 font-bold rounded-xl hover:from-emerald-400 hover:to-teal-400 transition text-sm">Gửi</button>
            </div>
          </div>

          {/* CỘT PHẢI: GIAO DIỆN TƯƠNG TÁC (Đã xử lý cấu trúc Tab mượt mà) */}
          <div className="lg:col-span-7 space-y-8">
            
            {/* 1. MÀN HÌNH CHÀO MỪNG TRANG CHỦ */}
            {activeTab === 'welcome' && (
              <div className="space-y-8 lg:pr-6">
                <div className="pb-2">
                  <div className="inline-flex items-center gap-2 bg-emerald-500/10 border border-emerald-500/20 px-3.5 py-1.5 rounded-full text-xs text-emerald-400 font-semibold tracking-wide">
                    <span className="w-2 h-2 bg-emerald-400 rounded-full animate-ping" />
                    HỆ THỐNG SỬA CHỮA THẾ HỆ MỚI
                  </div>
                </div>

                <h2 className="text-4xl md:text-5xl lg:text-6xl font-black tracking-tight leading-[1.15] text-transparent bg-clip-text bg-gradient-to-b from-white to-slate-400">
                  Chẩn đoán bằng AI. <br />
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-teal-400">
                    Sửa chữa thần tốc.
                  </span>
                </h2>

                <p className="text-slate-400 text-sm md:text-base leading-relaxed max-w-xl">
                  Quản lý hành trình sửa chữa của bạn một cách minh bạch. Tích hợp trí tuệ nhân tạo hỗ trợ chuẩn đoán kỹ thuật cực kỳ chính xác.
                </p>

                {/* Hai nút hành động cốt lõi */}
                <div className="flex flex-wrap gap-4 pt-4">
                  <button 
                    onClick={() => setActiveTab('booking')}
                    className="px-6 py-4 bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-slate-950 font-black rounded-2xl shadow-xl transition transform hover:-translate-y-1 flex items-center gap-2"
                  >
                    Đặt Lịch Mới 🛠️
                  </button>
                  <button 
                    onClick={() => setActiveTab('tracking')}
                    className="px-6 py-4 bg-slate-900 hover:bg-slate-850 border border-slate-800 hover:border-slate-700 text-white font-bold rounded-2xl shadow-xl transition transform hover:-translate-y-1 flex items-center gap-2"
                  >
                    Tra Cứu Tiến Độ 🔍
                  </button>
                </div>
              </div>
            )}

            {/* 2. NHÚNG FORM ĐẶT LỊCH (BOOKING TAB) */}
            {activeTab === 'booking' && (
              <BookingForm setActiveTab={setActiveTab} />
            )}

            {/* 3. NHÚNG FORM TRA CỨU TIẾN ĐỘ (TRACKING TAB) */}
            {activeTab === 'tracking' && (
              <TrackingForm setActiveTab={setActiveTab} />
            )}

          </div>
        </div>
      </main>

      {/* ================= MODAL ĐĂNG NHẬP (POPUP PHÂN QUYỀN) ================= */}
      {showLoginModal && (
        <LoginModal onClose={() => setShowLoginModal(false)} />
      )}

      {/* ================= FOOTER ================= */}
      <footer className="relative z-10 max-w-7xl w-full mx-auto py-6 text-center text-[11px] text-slate-600 border-t border-slate-900/50 px-6">
        © 2026 WebAIRepair System. Phát triển phục vụ mục đích đánh giá hội đồng chuyên môn.
      </footer>
    </div>
  );
}