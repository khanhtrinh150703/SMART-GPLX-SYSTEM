'use client';

import Link from 'next/link';

export default function SidebarLogo() {
  return (
    <Link 
      href="/" 
      className="h-20 flex items-center justify-center border-b border-slate-800 hover:bg-slate-800/30 transition-all group"
    >
      <h1 className="text-2xl font-black text-white tracking-tighter transition-transform group-active:scale-95">
        Smart<span className="text-emerald-500 group-hover:text-emerald-400 transition-colors">GPLX</span>
      </h1>
    </Link>
  );
}