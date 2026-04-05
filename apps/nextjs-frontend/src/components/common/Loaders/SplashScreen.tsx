import React from "react";
import { Loader2, ShieldCheck, LucideIcon } from "lucide-react";

/**
 * Thuộc tính của SplashScreen (English: SplashScreen Props)
 * @param {string} message - Lời nhắn hiển thị khi đang tải (Mặc định: Đang tải dữ liệu hệ thống...)
 * @param {LucideIcon} icon - Biểu tượng hiển thị ở giữa (Mặc định: ShieldCheck)
 */
interface SplashScreenProps {
  message?: string;
  icon?: LucideIcon;
}

export default function SplashScreen({
  message = "Đang tải dữ liệu hệ thống...",
  icon: Icon = ShieldCheck,
}: SplashScreenProps) {
  return (
    <div className="flex flex-col items-center justify-center w-full min-h-[70vh] animate-in fade-in duration-500">
      <div className="flex flex-col items-center gap-5">
        {/* Khối Logo đập nhịp */}
        <div className="p-5 bg-white/60 backdrop-blur-md rounded-[2rem] shadow-soft border border-white/80 animate-pulse">
          <Icon size={48} className="text-emerald-500 drop-shadow-sm" />
        </div>
        
        {/* Thông tin Text */}
        <div className="text-center space-y-2">
          <h2 className="text-2xl font-black text-slate-800 tracking-tight">
            Smart-GPLX <span className="text-emerald-500">.</span>
          </h2>
          <div className="flex items-center justify-center gap-2 text-slate-500 font-medium">
            <Loader2 className="animate-spin text-emerald-500" size={16} />
            <span>{message}</span>
          </div>
        </div>
      </div>
    </div>
  );
}