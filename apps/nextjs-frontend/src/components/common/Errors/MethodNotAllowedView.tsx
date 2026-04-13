"use client";

import React from "react";
import { Ban } from "lucide-react";
import { containerVariants, iconBoxVariants } from "./global-error.variants";
// 🚀 TRIỆU HỒI: Nút bấm thông minh "có não"
import { HomeNavigationButton } from "../Navigation/HomeNavigationButton";

/**
 * MethodNotAllowedView - Xử lý lỗi HTTP 405
 * Chiến lược: Chỉ cung cấp lối thoát duy nhất về Home để reset flow.
 */
export const MethodNotAllowedView = () => {
  return (
    <main className={containerVariants({ layout: "full", theme: "light" })}>
      {/* 🧩 1. Visual Element (Sử dụng tone Slate trung tính nhưng dứt khoát) */}
      <div className="relative mb-12">
        <div className="absolute inset-0 bg-slate-400 blur-[80px] opacity-10 rounded-full" />

        <div className={iconBoxVariants({ status: "neutral", size: "xl" })}>
          {/* Thêm chút hiệu ứng xoay nhẹ để icon Ban trông bớt "tĩnh" */}
          <Ban
            className="w-16 h-16 text-slate-500 hover:rotate-45 transition-transform duration-500"
            strokeWidth={1.5}
          />
        </div>
      </div>

      {/* 📝 2. Content Section */}
      <div className="space-y-4 max-w-lg flex flex-col items-center text-center">
        <h2 className="text-3xl font-black text-slate-900 tracking-tight">
          Hành động không hợp lệ{" "}
          <span className="text-slate-500">(Invalid Method)</span>
        </h2>

        <p className="text-slate-500 leading-relaxed font-medium px-4">
          Yêu cầu bạn vừa thực hiện không được hệ thống **Smart-GPLX** hỗ trợ.
          Để đảm bảo an toàn, vui lòng quay về trang chủ và thực hiện lại thao
          tác.
        </p>
      </div>

      {/* 🚀 3. Action Section - SỬ DỤNG COMPONENT ĐÃ ĐÓNG GÓI */}
      <div className="mt-12">
        {/* 🎯 Nút này đã có sẵn: Shimmer effect, Icon nhún nhảy và Smart Routing */}
        <HomeNavigationButton label="Về trang chủ hệ thống" />
      </div>

      {/* 🏷️ 4. Branding Footer */}
      <div className="absolute bottom-8 text-[10px] text-slate-300 font-bold uppercase tracking-[0.4em] pointer-events-none">
        Smart GPLX • Protocol Safety System
      </div>
    </main>
  );
};
