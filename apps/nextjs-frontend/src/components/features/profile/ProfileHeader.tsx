'use client';

export default function ProfileHeader() {
  return (
    <div className="p-8 md:p-10 border-b border-slate-50 bg-slate-50/30 flex flex-col md:flex-row items-center gap-8">
      <div className="relative group">
        <div className="w-28 h-28 rounded-3xl bg-emerald-100 border-4 border-white shadow-soft flex items-center justify-center overflow-hidden transition-transform group-hover:scale-105">
          <span className="text-4xl text-emerald-700 font-black">TV</span>
        </div>
        <button 
          aria-label="Đổi ảnh đại diện"
          className="absolute -bottom-2 -right-2 bg-white p-2 rounded-xl shadow-lg border border-slate-100 hover:text-emerald-600 transition-colors"
        >
           <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
             <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z"/>
           </svg>
        </button>
      </div>
      <div className="text-center md:text-left">
        <h4 className="text-xl font-bold text-slate-800">Ảnh đại diện (Avatar)</h4>
        <p className="text-sm text-slate-500 max-w-xs">Ảnh đại diện giúp hệ thống cá nhân hóa lộ trình học GPLX của bạn.</p>
      </div>
    </div>
  );
}