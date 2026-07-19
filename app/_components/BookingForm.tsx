'use client'; // Bắt buộc phải có vì Next.js App Router dùng Hook

import { useState } from 'react';


interface BookingFormProps {
  setActiveTab: (tab: 'welcome' | 'booking' | 'tracking') => void; 
}

export default function BookingForm({ setActiveTab }: BookingFormProps) {
  const [customerName, setCustomerName] = useState('');
  const [phone, setPhone] = useState('');
  const [deviceModel, setDeviceModel] = useState(''); 
  const [issueDescription, setIssueDescription] = useState(''); 
  const [bookingLoading, setBookingLoading] = useState(false);
  const [bookingMessage, setBookingMessage] = useState('');
  const [isError, setIsError] = useState(false); 


  const handleBookingSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setBookingLoading(true);
    setBookingMessage('');
    setIsError(false);

    try {
     
      const response = await fetch('http://localhost:8000/appointments', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          customerName,
          phone,
          deviceModel, // Backend của bạn sẽ xử lý logic map chuỗi này sang UUID của bảng devices
          issueDescription,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Có lỗi xảy ra khi đặt lịch. Vui lòng thử lại!');
      }

  
      setIsError(false);
      setBookingMessage('🎉 Đăng ký đặt lịch thành công! Nhân viên sẽ liên hệ bạn sớm nhất.');
      
      setCustomerName('');
      setPhone('');
      setDeviceModel('');
      setIssueDescription('');

    } catch (error: any) {
      setIsError(true);
      setBookingMessage(error.message || 'Không thể kết nối tới máy chủ lúc này.');
    } finally {
      setBookingLoading(false);
    }
  };

  return (
    <div className="bg-slate-900/60 backdrop-blur-xl border border-slate-800 rounded-3xl p-8 md:p-10 shadow-2xl relative">
      <button 
        onClick={() => setActiveTab('welcome')} 
        className="absolute top-6 right-6 text-slate-500 hover:text-white bg-slate-800/50 w-8 h-8 rounded-full flex items-center justify-center transition"
      >
        ✕
      </button>
      
      <div className="mb-6">
        <h3 className="text-2xl font-black text-white tracking-wide">Đăng Ký Đặt Lịch</h3>
        <p className="text-slate-400 text-xs mt-1">Lịch hẹn của bạn sẽ được đồng bộ trực tiếp lên Database.</p>
      </div>
      
      {/* Form được kích hoạt trigger gửi dữ liệu */}
      <form onSubmit={handleBookingSubmit} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-1">
            <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Họ và tên</label>
            <input 
              type="text" 
              required 
              placeholder="Nguyễn Văn Vương" 
              value={customerName} 
              onChange={(e) => setCustomerName(e.target.value)} 
              className="w-full p-3 bg-slate-950/80 border border-slate-800/80 rounded-xl text-sm text-white focus:border-emerald-500 focus:outline-none transition" 
            />
          </div>
          <div className="space-y-1">
            <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Số điện thoại</label>
            <input 
              type="text" 
              required 
              placeholder="0987xxxxxx" 
              value={phone} 
              onChange={(e) => setPhone(e.target.value)} 
              className="w-full p-3 bg-slate-950/80 border border-slate-800/80 rounded-xl text-sm text-white focus:border-emerald-500 focus:outline-none transition" 
            />
          </div>
        </div>

        <div className="space-y-1">
          <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Tên thiết bị & Dòng máy</label>
          <input 
            type="text" 
            required 
            placeholder="Macbook Pro M2, iPhone 15 Pro..." 
            value={deviceModel} 
            onChange={(e) => setDeviceModel(e.target.value)} 
            className="w-full p-3 bg-slate-950/80 border border-slate-800/80 rounded-xl text-sm text-white focus:border-emerald-500 focus:outline-none transition" 
          />
        </div>

        <div className="space-y-1">
          <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Mô tả tình trạng hư hỏng</label>
          <textarea 
            required 
            placeholder="Mô tả cụ thể lỗi..." 
            value={issueDescription} 
            onChange={(e) => setIssueDescription(e.target.value)} 
            className="w-full p-3 bg-slate-950/80 border border-slate-800/80 rounded-xl text-sm text-white resize-none focus:border-emerald-500 focus:outline-none transition" 
            rows={3} 
          />
        </div>
        
        <button 
          type="submit" 
          disabled={bookingLoading} 
          className="w-full py-3.5 bg-gradient-to-r from-emerald-500 to-teal-500 text-slate-950 font-black rounded-xl hover:from-emerald-400 hover:to-teal-400 transition text-sm uppercase tracking-wider disabled:opacity-50"
        >
          {bookingLoading ? 'Hệ thống đang ghi nhận...' : 'Gửi Yêu Cầu Đặt Lịch'}
        </button>
      </form>

    
      {bookingMessage && (
        <div className={`mt-4 p-3.5 rounded-xl text-xs text-center font-bold border ${
          isError 
            ? 'bg-rose-500/10 text-rose-400 border-rose-500/20' 
            : 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
        }`}>
          {bookingMessage}
        </div>
      )}
    </div>
  );
}