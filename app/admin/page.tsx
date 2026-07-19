import Link from 'next/link';
export default function AdminPortalPage() {
  return (
    <div className="min-h-screen bg-slate-950 text-white flex flex-col items-center justify-center space-y-6">
      <span className="text-5xl">📊</span>
      <h1 className="text-3xl font-black text-pink-400">Portal Quản Trị Viên (Admin)</h1>
      <p className="text-slate-400 text-sm">Hệ thống phân tích doanh số và quản lý toàn quyền đang khởi tạo.</p>
      <Link href="/" className="px-5 py-2.5 bg-slate-900 border border-slate-800 rounded-xl text-xs hover:bg-slate-800 transition">
        ← Về Trang Chủ Trung Tâm
      </Link>
    </div>
  );
}