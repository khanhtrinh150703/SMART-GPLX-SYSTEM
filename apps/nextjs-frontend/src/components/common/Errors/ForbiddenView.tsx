"use client";

import React from "react";
import { ShieldAlert } from "lucide-react";
import { containerVariants, iconBoxVariants } from "./global-error.variants";
// 🚀 TRIỆU HỒI: Nút "Về nhà" thông minh, có Shimmer và Icon nhún nhảy
import { HomeNavigationButton } from "../Navigation/HomeNavigationButton";

/**
 * ForbiddenView - Xử lý lỗi HTTP 403
 * Chiến lược: Chặn đứng vòng lặp History bằng cách chỉ cung cấp lối thoát an toàn về Dashboard/Landing.
 */
export const ForbiddenView = () => {
  return (
    <main className={containerVariants({ layout: "full", theme: "light" })}>
      
      {/* 🧩 1. Visual Element (Sử dụng Tone Amber cảnh báo) */}
      <div className="relative mb-12">
        {/* Glow hiệu ứng phía sau - Amber tạo cảm giác "Cảnh báo/Dừng lại" */}
        <div className="absolute inset-0 bg-amber-400 blur-[80px] opacity-10 rounded-full" />

        <div className={iconBoxVariants({ status: "forbidden", size: "xl" })}>
          {/* Thêm chút hiệu ứng nháy nhẹ cho icon Shield để tăng tính cảnh báo */}
          <ShieldAlert className="w-16 h-16 text-amber-500 animate-pulse" strokeWidth={1.5} />
        </div>
      </div>

      {/* 📝 2. Content Section */}
      <div className="space-y-4 max-w-lg flex flex-col items-center text-center">
        <h2 className="text-3xl font-black text-slate-900 tracking-tight">
          Khu vực hạn chế <span className="text-amber-500">(Restricted)</span>
        </h2>

        <p className="text-slate-500 leading-relaxed font-medium px-4">
          Hệ thống xác nhận bạn không có quyền hạn để đi vào làn đường này. 
          Vui lòng quay về trang chủ hoặc liên hệ quản trị viên <strong className="text-emerald-600">Smart-GPLX</strong>.
        </p>
      </div>

      {/* 🚀 3. Action Section - SỬ DỤNG COMPONENT ĐÃ ĐÓNG GÓI */}
      <div className="mt-12 flex justify-center">
        {/* Nút này tự động lo việc check Role để đưa về Dashboard hay Landing */}
        <HomeNavigationButton 
          label="Về trang chủ hệ thống" 
          className="bg-amber-500 hover:bg-amber-600 shadow-amber-200/50" 
        />
      </div>

      {/* 🏷️ 4. Branding Footer */}
      <div className="absolute bottom-8 text-[10px] text-slate-300 font-bold uppercase tracking-[0.4em] pointer-events-none text-center px-4">
        Smart GPLX • Access Control List (ACL) Secured
      </div>
    </main>
  );
};