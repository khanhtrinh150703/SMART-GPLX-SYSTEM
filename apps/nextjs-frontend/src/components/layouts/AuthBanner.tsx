"use client";

import React from "react";
import { Logo } from "../ui/Logo/Logo";

interface AuthBannerProps {
  slogan: string;
  description: string;
}

export function AuthBanner({ slogan, description }: AuthBannerProps) {
  return (
    // Đã sửa: Ép chiều cao h-full và giữ tỷ lệ 50% duy nhất tại đây (Fixed 50% viewport width and full height)
    <div className="hidden lg:flex lg:w-[50%] h-full relative bg-emerald-950 items-center justify-center p-16 xl:p-20 overflow-hidden">
      {/* LỚP NỀN GRADIENT DOANH NGHIỆP (Corporate Premium Gradient) */}
      <div className="absolute inset-0 z-0 bg-gradient-to-br from-emerald-800 via-emerald-900 to-emerald-950" />

      {/* HIỆU ỨNG ÁNH SÁNG KHUẾCH TÁN (Soft Radial Ambient Glow) */}
      <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_30%_20%,rgba(52,211,153,0.12),transparent_60%)] pointer-events-none z-0" />

      {/* KHỐI NỘI DUNG CHÍNH (Main Content Container Block) */}
      <div className="relative z-10 w-full max-w-md space-y-10 flex flex-col justify-center">
        {/* ĐỊNH VỊ THƯƠNG HIỆU (Brand Identity Typography) */}
        {/* Thu nhỏ scale về 110% origin-left để logo không bị chạm đỉnh khung hình khi co giãn */}
        <div className="inline-block">
          <Logo className="scale-110 origin-left" />
        </div>

        {/* NỘI DUNG CHỮ (Visual Typographic Content) */}
        <div className="space-y-4">
          <h2 className="text-4xl xl:text-5xl font-black text-white tracking-tighter leading-[1.2]">
            {slogan}
          </h2>
          <p className="text-emerald-100/70 text-base xl:text-lg leading-relaxed font-normal">
            {description}
          </p>
        </div>

        {/* THỂ THÔNG TIN TỐI GIẢN CHUẨN ÔN THI (Minimalist Document Info Card) */}
        <div className="relative w-full rounded-2xl bg-white/[0.03] border border-white/10 p-6 xl:p-8 shadow-md backdrop-blur-sm">
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-400 shadow-[0_0_6px_rgba(52,211,153,0.5)]" />
              <span className="text-xs font-bold text-emerald-300 uppercase tracking-widest">
                Tài liệu chuẩn quy chuẩn
              </span>
            </div>

            <p className="text-sm text-emerald-50/80 leading-relaxed font-medium">
              Cung cấp trọn bộ dữ liệu 600 câu hỏi ôn tập lý thuyết sát hạch cấp
              giấy phép lái xe chính thức, giúp người học dễ dàng luyện đề, ghi
              nhớ mẹo và tự tin vượt qua kỳ thi.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
