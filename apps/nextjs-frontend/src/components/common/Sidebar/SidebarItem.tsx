'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ReactNode } from 'react';

interface SidebarItemProps {
  href: string;
  icon: ReactNode;
  label: string;
}

export default function SidebarItem({ href, icon, label }: SidebarItemProps) {
  const pathname = usePathname();
  // Kiểm tra trạng thái Active (Active state check)
  const isActive = pathname === href;

  return (
    <Link 
      href={href} 
      className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 group ${
        isActive 
          ? 'bg-emerald-600/10 text-emerald-400 border border-emerald-500/20 shadow-lg shadow-emerald-900/40' 
          : 'text-slate-400 hover:bg-slate-800 hover:text-white'
      }`}
    >
      <span className={`transition-colors ${isActive ? 'text-emerald-400' : 'group-hover:text-white'}`}>
        {icon}
      </span>
      <span className="font-medium tracking-wide">{label}</span>
    </Link>
  );
}