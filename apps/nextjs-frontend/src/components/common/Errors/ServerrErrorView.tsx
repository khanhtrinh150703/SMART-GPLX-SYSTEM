"use client";

import React from "react";
import { ServerCrash } from "lucide-react";
import { containerVariants, iconBoxVariants } from "./global-error.variants";
import { HomeNavigationButton } from "../Navigation/HomeNavigationButton";
import { ReloadButton } from "../Navigation/ReloadButton";

export const ServerErrorView = () => {
  return (
    <main className={containerVariants({ layout: "full", theme: "light" })}>
      {/* 🧩 1. Visual Element */}
      <div className="relative mb-12">
        <div className="absolute inset-0 bg-rose-400 blur-[80px] opacity-10 rounded-full" />

        <div className={iconBoxVariants({ status: "server", size: "xl" })}>
          {/* Animate-pulse nhẹ để icon trông như đang "hấp hối" thật */}
          <ServerCrash className="w-16 h-16 text-rose-500 animate-pulse" strokeWidth={1.5} />
        </div>
      </div>

      {/* 📝 2. Content Section */}
      <div className="space-y-4 max-w-lg flex flex-col items-center text-center">
        <h2 className="text-3xl font-black text-slate-900 tracking-tight">
          Máy chủ gặp sự cố <span className="text-rose-500">(Server Error)</span>
        </h2>
        <p className="text-slate-500 leading-relaxed font-medium px-4">
          Động cơ hệ thống **Smart-GPLX** đang được bảo trì đột xuất. 
          Vui lòng thử tải lại trang hoặc quay về bảng điều khiển.
        </p>
      </div>

      {/* 🚀 3. Action Section - Bộ đôi nút bấm Premium */}
      <div className="mt-12 flex flex-col sm:flex-row gap-4">
        {/* Nút Tải lại (Đỏ Rose - Cảnh báo) */}
        <ReloadButton />

        {/* Nút Về nhà (Xanh Emerald - An toàn) */}
        <HomeNavigationButton />
      </div>

      {/* 🏷️ 4. Branding Footer */}
      <div className="absolute bottom-8 text-[10px] text-slate-300 font-bold uppercase tracking-[0.4em]">
        Smart GPLX • System Reliability Monitor
      </div>
    </main>
  );
};