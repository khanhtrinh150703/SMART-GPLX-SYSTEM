// src/components/ui/sidebar/Sidebar.tsx
"use client";

import React from "react";
import SidebarLogo from "./Sidebar/SidebarLogo";
import SidebarItem from "./Sidebar/SidebarItem";
import { sidebarVariants } from "@/components/ui/SideBar/sidebar.variants";
import { cn } from "@/lib/utils/utils";
import { NAV_ITEMS } from "@/components/ui/SideBar/sidebar.constants";

interface SidebarProps {
  className?: string;
}

export default function Sidebar({ className }: SidebarProps) {
  return (
    <aside className={cn(sidebarVariants({ theme: "dark" }), className)}>
      {/* 1. Branding: Logo và tên dự án */}
      <SidebarLogo />

      {/* 2. Navigation: Danh sách menu chính */}
      <nav className="flex-1 px-4 py-6 space-y-2 overflow-y-auto custom-scrollbar">
        {NAV_ITEMS.map((item) => (
          <SidebarItem 
            key={item.href} 
            href={item.href}
            label={item.label}
            icon={item.icon}
          />
        ))}
      </nav>

      {/* 3. Footer Info: Thông tin phiên bản hệ thống */}
      <div className="p-4 border-t border-slate-800">
        <div className="bg-slate-800/40 border border-slate-700/50 rounded-2xl p-4 text-center backdrop-blur-sm group hover:border-emerald-500/30 transition-colors">
          <p className="text-[10px] text-slate-500 font-black uppercase tracking-[0.2em] group-hover:text-slate-400">
            Smart GPLX v1.0
          </p>
          <div className="flex items-center justify-center gap-1.5 mt-1">
             <span className="w-1 h-1 rounded-full bg-emerald-500 animate-pulse" />
             <p className="text-[9px] text-emerald-500/60 font-medium">
               System Stable
             </p>
          </div>
        </div>
      </div>
    </aside>
  );
}