"use client";

import { useEffect } from "react";
import { AlertTriangle } from "lucide-react";
import { containerVariants, iconBoxVariants } from "./global-error.variants";
import { HomeNavigationButton } from "../Navigation/HomeNavigationButton";
import { RetryButton } from "../Navigation/RetryButton";

interface GlobalErrorViewProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export const GlobalErrorView = ({ error, reset }: GlobalErrorViewProps) => {
  useEffect(() => {
    // 💡 Tracing Error: Truy vết lỗi nghiêm trọng lên console
    console.error("Critical System Error:", error);
  }, [error]);

  return (
    <main className={containerVariants({ layout: "full", theme: "light" })}>
      
      {/* 🧩 1. Visual Element - Tone đỏ Rose cảnh báo nguy hiểm */}
      <div className="relative mb-12">
        <div className="absolute inset-0 bg-rose-400 blur-[80px] opacity-10 rounded-full" />
        <div className={iconBoxVariants({ status: "server", size: "xl" })}>
          <AlertTriangle className="w-16 h-16 text-rose-500 animate-pulse" strokeWidth={1.5} />
        </div>
      </div>

      {/* 📝 2. Content Section */}
      <div className="space-y-4 max-w-lg flex flex-col items-center text-center">
        <h2 className="text-3xl font-black text-slate-900 tracking-tight">
          Hệ thống gặp sự cố <span className="text-rose-500">(System Failure)</span>
        </h2>
        <p className="text-slate-500 leading-relaxed font-medium px-4">
          Hệ thống **Smart-GPLX** đang gặp một trục trặc kỹ thuật ngoài ý muốn. 
          Đừng lo lắng, dữ liệu của bạn vẫn được bảo vệ an toàn.
        </p>
      </div>

      {/* 🚀 3. Action Buttons - Bộ đôi nút bấm sinh động */}
      <div className="mt-12 flex flex-col sm:flex-row gap-4">
        {/* Nút Retry: Chạy hàm reset() của Next.js */}
        <RetryButton onClick={reset} />
        
        {/* Nút Home: Tự động check về Dashboard hoặc Landing */}
        <HomeNavigationButton variant="secondary" className="border-slate-200 text-slate-600" />
      </div>

      {/* 🏷️ 4. Support ID: Hiển thị tinh tế ở dưới */}
      {error.digest && (
        <div className="absolute bottom-8 left-0 right-0 flex justify-center pointer-events-none">
          <p className="text-[10px] text-slate-300 font-mono uppercase tracking-widest bg-slate-100/40 px-3 py-1 rounded-full border border-slate-200/50">
            Support ID: {error.digest}
          </p>
        </div>
      )}
    </main>
  );
};