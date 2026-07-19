'use client';

import { useState } from 'react';

export default function BookingPage() {
  const [customerName, setCustomerName] = useState('');
  const [phone, setPhone] = useState('');
  const [deviceType, setDeviceType] = useState('Laptop');
  const [description, setDescription] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');

    try {
      // Gọi API sang NestJS (cổng 8000)
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/appointments`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          customerName,
          phone,
          deviceType,
          description,
        }),
      });

      if (res.ok) {
        setMessage('🎉 Đặt lịch thành công! Kỹ thuật viên sẽ liên hệ lại ngay.');
        // Reset form
        setCustomerName('');
        setPhone('');
        setDescription('');
      } else {
        setMessage('❌ Có lỗi xảy ra. Vui lòng thử lại!');
      }
    } catch (error) {
      setMessage('❌ Không thể kết nối tới máy chủ!');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-white">Đăng Ký Lịch Sửa Chữa</h1>
        <p className="text-slate-400 mt-1">Vui lòng điền thông tin thiết bị cần sửa chữa vào form dưới đây.</p>
      </div>

      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-8 shadow-xl">
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Tên khách hàng */}
          <div>
            <label className="block text-sm font-semibold text-slate-300 mb-2">Tên khách hàng</label>
            <input
              type="text"
              required
              placeholder="Ví dụ: Nguyễn Văn A"
              value={customerName}
              onChange={(e) => setCustomerName(e.target.value)}
              className="w-full px-4 py-3 bg-slate-950 border border-slate-800 rounded-lg text-white focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition"
            />
          </div>

          {/* Số điện thoại */}
          <div>
            <label className="block text-sm font-semibold text-slate-300 mb-2">Số điện thoại</label>
            <input
              type="tel"
              required
              placeholder="Ví dụ: 0901234567"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="w-full px-4 py-3 bg-slate-950 border border-slate-800 rounded-lg text-white focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition"
            />
          </div>

          {/* Loại thiết bị */}
          <div>
            <label className="block text-sm font-semibold text-slate-300 mb-2">Loại thiết bị cần sửa</label>
            <select
              value={deviceType}
              onChange={(e) => setDeviceType(e.target.value)}
              className="w-full px-4 py-3 bg-slate-950 border border-slate-800 rounded-lg text-white focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition"
            >
              <option value="Laptop">Laptop / Máy tính xách tay</option>
              <option value="PC">PC / Máy tính để bàn</option>
              <option value="Phone">Điện thoại di động</option>
              <option value="Tablet">Máy tính bảng</option>
            </select>
          </div>

          {/* Mô tả lỗi */}
          <div>
            <label className="block text-sm font-semibold text-slate-300 mb-2">Mô tả chi tiết tình trạng lỗi</label>
            <textarea
              rows={4}
              required
              placeholder="Mô tả hiện tượng lỗi (Ví dụ: Bật không lên nguồn, màn hình bị sọc xanh...)"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full px-4 py-3 bg-slate-950 border border-slate-800 rounded-lg text-white focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition resize-none"
            />
          </div>

          {/* Nút gửi */}
          <button
            type="submit"
            disabled={loading}
            className="w-full py-3.5 px-4 bg-emerald-500 hover:bg-emerald-600 disabled:bg-slate-700 text-slate-950 font-bold rounded-lg transition duration-200"
          >
            {loading ? 'Đang gửi thông tin...' : 'Gửi Yêu Cầu Đặt Lịch 🛠️'}
          </button>
        </form>

        {/* Thông báo trạng thái */}
        {message && (
          <div className={`mt-6 p-4 rounded-lg text-sm text-center font-medium ${
            message.includes('❌') ? 'bg-red-500/10 text-red-400 border border-red-500/20' : 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
          }`}>
            {message}
          </div>
        )}
      </div>
    </div>
  );
}