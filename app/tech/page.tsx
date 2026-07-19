import Link from 'next/link';
export default function TechPortalPage() {
  return (
    <div className="min-h-screen bg-slate-950 text-white flex flex-col items-center justify-center space-y-6">
      <span className="text-5xl">🔧</span>
      <h1 className="text-3xl font-black text-blue-400">Portal Kỹ Thuật Viên</h1>
      <p className="text-slate-400 text-sm">Hệ thống đang sẵn sàng thiết lập danh sách công việc.</p>
      <Link href="/" className="px-5 py-2.5 bg-slate-900 border border-slate-800 rounded-xl text-xs hover:bg-slate-800 transition">
        ← Về Trang Chủ Trung Tâm
      </Link>
    </div>
  );
}