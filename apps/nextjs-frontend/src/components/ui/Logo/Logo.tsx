"use client";

import React from "react";
import { cn } from "@/lib/utils/utils";

interface LogoProps {
  className?: string;
  showText?: boolean; // Thêm option này để nếu sau này ông chỉ muốn hiện mỗi icon S
}

export const Logo = ({ className, showText = true }: LogoProps) => {
  return (
    <div className={cn("flex items-center gap-3 cursor-pointer group select-none", className)}>
      {/* 🟢 PHẦN ICON: Biểu tượng chữ S với hiệu ứng Glow */}
      <div className="relative w-11 h-11 flex items-center justify-center transition-all duration-300 group-hover:rotate-6 group-hover:scale-110">
        {/* Lớp nền đổ bóng phát sáng xanh phía sau (Ambient Glow) */}
        <div className="absolute inset-0 bg-emerald-500 rounded-2xl blur-lg opacity-20 group-hover:opacity-40 transition-opacity duration-300" />
        
        {/* Khối chính chứa chữ S (Gradient Emerald) */}
        <div className="relative w-full h-full bg-gradient-to-br from-emerald-400 to-emerald-600 rounded-2xl flex items-center justify-center shadow-[0_8px_16px_-6px_rgba(16,185,129,0.5)] border border-emerald-300/20">
          <span className="text-white font-black text-2xl tracking-tighter drop-shadow-sm">
            S
          </span>
        </div>
      </div>

      {/* 📝 PHẦN CHỮ: Thương hiệu Smart-GPLX */}
      {showText && (
        <div className="flex flex-col -space-y-1">
          <span className="text-2xl font-black tracking-tighter text-slate-900 transition-colors group-hover:text-emerald-600">
            Smart<span className="text-emerald-500">GPLX</span>
          </span>
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.3em] pl-0.5">
            AI Integrated
          </span>
        </div>
      )}
    </div>
  );
};