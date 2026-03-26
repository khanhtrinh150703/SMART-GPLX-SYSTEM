import Link from 'next/link';

export default function Sidebar() {
  return (
    <aside className="w-64 h-screen bg-slate-900 text-slate-300 flex flex-col transition-all duration-300">
      {/* Khung Logo (Branding) */}
      <div className="h-20 flex items-center justify-center border-b border-slate-800">
        <h1 className="text-2xl font-bold text-white tracking-wider">
          Smart<span className="text-emerald-500">GPLX</span>
        </h1>
      </div>

      {/* Danh sách Menu (Navigation) */}
      <nav className="flex-1 px-4 py-6 space-y-2 overflow-y-auto">
        {/* Menu Item: Đang được chọn (Active) */}
        <Link 
          href="/dashboard" 
          className="flex items-center gap-3 px-4 py-3 bg-emerald-600/10 text-emerald-400 rounded-xl transition-colors"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
          </svg>
          <span className="font-medium">Tổng quan</span>
        </Link>

        {/* Menu Item: Bình thường (Inactive) */}
        <Link 
          href="/dashboard/exams" 
          className="flex items-center gap-3 px-4 py-3 hover:bg-slate-800 hover:text-white rounded-xl transition-colors"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
          <span className="font-medium">Quản lý Đề thi</span>
        </Link>
      </nav>
    </aside>
  );
}