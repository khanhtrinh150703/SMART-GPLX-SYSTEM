// src/components/ui/sidebar/Sidebar.tsx
"use client";

import React from "react";
import SidebarLogo from "../layouts/SideBar/SidebarLogo";
import { sidebarVariants } from "@/components/layouts/SideBar/sidebar.variants";
import { cn } from "@/lib/utils/utils";
import { NAV_ITEMS } from "@/components/layouts/SideBar/sidebar.constants";
import SidebarItem from "../layouts/SideBar/SidebarItem";

/**
 * SidebarProps - Thuộc tính cho linh kiện thanh điều hướng bên trái
 * @param {string} className - Các lớp CSS bổ sung từ bên ngoài (English: Additional CSS classes)
 */
interface SidebarProps {
  className?: string;
}

/**
 * Sidebar - Linh kiện thanh điều hướng chính cho hệ thống Smart-GPLX
 * Thiết kế theo phong cách Deep Forest với hiệu ứng cuộn mượt (Smooth Scrolling).
 */
export default function Sidebar({ className }: SidebarProps) {
  return (
    <aside className={cn(sidebarVariants({ theme: "dark" }), className)}>
      {/* 1. Branding: Logo và nhận diện thương hiệu (English: Identity) */}
      <SidebarLogo />

      {/* 2. Navigation: Vùng chứa danh sách menu 
          flex-1: Chiếm hết không gian còn lại (English: Expand to fill space)
          overflow-y-auto: Chỉ hiện thanh cuộn khi nội dung tràn (English: Scroll on overflow)
          custom-scrollbar: Sử dụng cấu hình thanh trượt Emerald chúng ta đã viết ở file CSS
      */}
      <nav className="flex-1 px-4 py-6 space-y-2 overflow-y-auto custom-scrollbar scroll-smooth">
        {NAV_ITEMS.map((item) => (
          <SidebarItem 
            // CỰC KỲ QUAN TRỌNG: Key phải là duy nhất. 
            // Nếu href vẫn trùng, hãy dùng index làm fallback (dù không khuyến khích)
            key={item.href} 
            href={item.href}
            label={item.label}
            icon={item.icon}
          />
        ))}
      </nav>

      {/* 3. Footer Info: Thông tin phiên bản và trạng thái hệ thống (English: System Info) */}
      <div className="p-4 border-t border-slate-800">
        <div className="bg-slate-800/40 border border-slate-700/50 rounded-2xl p-4 text-center backdrop-blur-sm group hover:border-emerald-500/30 transition-colors">
          <p className="text-[10px] text-slate-500 font-black uppercase tracking-[0.2em] group-hover:text-slate-400">
            Smart GPLX v1.0
          </p>
          <div className="flex items-center justify-center gap-1.5 mt-1">
             <span className="w-1 h-1 rounded-full bg-emerald-500 animate-pulse" />
             <p className="text-[9px] text-emerald-500/60 font-medium">
                System Stable (Dịch: Hệ thống ổn định)
             </p>
          </div>
        </div>
      </div>
    </aside>
  );
}