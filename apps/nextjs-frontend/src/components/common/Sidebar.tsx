'use client';

import SidebarItem from "./Sidebar/SidebarItem";
import SidebarLogo from "./Sidebar/SidebarLogo";


// Định nghĩa danh sách Menu để dễ quản lý (Navigation Config)
const NAV_ITEMS = [
  {
    href: '/',
    label: 'Tổng quan',
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
      </svg>
    ),
  },
  {
    href: '/dashboard/exams',
    label: 'Quản lý Đề thi',
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
      </svg>
    ),
  },
  {
    href: '/profile',
    label: 'Hồ sơ cá nhân',
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
      </svg>
    ),
  },
];

export default function Sidebar() {
  return (
    <aside className="w-64 h-screen bg-slate-900 text-slate-300 flex flex-col transition-all duration-300 border-r border-slate-800">
      {/* Branding */}
      <SidebarLogo />

      {/* Navigation */}
      <nav className="flex-1 px-4 py-6 space-y-2 overflow-y-auto">
        {NAV_ITEMS.map((item) => (
          <SidebarItem 
            key={item.href} 
            href={item.href} 
            icon={item.icon} 
            label={item.label} 
          />
        ))}
      </nav>

      {/* Footer Info */}
      <div className="p-4 border-t border-slate-800">
        <div className="bg-slate-800/50 rounded-xl p-3 text-center">
          <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">Version 1.0.0 Stable</p>
        </div>
      </div>
    </aside>
  );
}