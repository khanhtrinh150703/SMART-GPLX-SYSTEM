"use client";

import React from "react";
import { WifiOff } from "lucide-react";
import { Alert } from "@/components/ui/Alert/Alert";
import { useActionHandler } from "@/hooks/useActionHandler";
import { performSmartNavigateBack } from "@/utils/navigation";
import { containerVariants, iconBoxVariants } from "./global-error.variants";

// 🚀 TRIỆU HỒI: Bộ 3 nút bấm quyền lực
import { ReloadButton } from "../Navigation/ReloadButton";
import { NavigationBackButton } from "../Navigation/NavigationBackButton";
import { HomeNavigationButton } from "../Navigation/HomeNavigationButton";

export const NetworkErrorView = () => {
  const { message, setMessage, handleAction } = useActionHandler();

  const onBackClick = async () => {
    await handleAction(() => performSmartNavigateBack(), {
      successMsg: "Đang chuyển hướng...",
      delay: 800,
    });
  };

  return (
    <main className={containerVariants({ layout: "full", theme: "light" })}>
      {/* 🚨 ALERT: Thông báo trạng thái */}
      {message && (
        <div className="fixed top-8 w-full max-w-md z-50 animate-in fade-in slide-in-from-top-4 duration-500">
          <Alert
            intent={message.intent}
            message={message.text}
            onClose={() => setMessage(null)}
          />
        </div>
      )}

      {/* 🧩 1. Visual Element (Sử dụng Tone Emerald để tạo cảm giác "Hy vọng kết nối lại") */}
      <div className="relative mb-8">
        <div className="absolute inset-0 bg-emerald-400 blur-[80px] opacity-10 rounded-full" />

        <div className={iconBoxVariants({ status: "network", size: "xl" })}>
          {/* Thêm chút hiệu ứng pulse nhẹ như tín hiệu đang dò tìm */}
          <WifiOff
            className="w-16 h-16 text-emerald-500 animate-pulse"
            strokeWidth={1.5}
          />
        </div>
      </div>

      {/* 📝 2. Content Section */}
      <div className="space-y-3 text-center max-w-sm">
        <h2 className="text-2xl font-bold text-slate-900 tracking-tight">
          Mất kết nối tín hiệu{" "}
          <span className="text-emerald-500">(Offline)</span>
        </h2>
        <p className="text-slate-500 leading-relaxed font-medium px-2">
          Đường truyền Internet của bạn đang bị gián đoạn. Vui lòng kiểm tra lại
          để tiếp tục kỳ thi trên{" "}
          <strong className="text-emerald-600">Smart-GPLX</strong>.
        </p>
      </div>

      {/* 🚀 3. Action Section (Sử dụng các Component đã đóng gói) */}
      <div className="mt-10 flex flex-col gap-4">
        {/* Hàng nút chính: Thử lại & Quay lại */}
        <div className="flex flex-col sm:flex-row gap-4">
          {/* Nút Reload: Icon xoay 180 độ khi hover */}
          <ReloadButton />

          {/* Nút Back: Icon thụt lùi và nhún nhảy + Logic Smart Back của ông */}
          <NavigationBackButton onClick={onBackClick} />
        </div>

        {/* Nút Home: Safety Exit (Dành cho ai muốn bỏ cuộc về trang chủ luôn) */}
        <div className="flex justify-center">
          <HomeNavigationButton
            variant="ghost"
            className="text-slate-400 shadow-none hover:bg-transparent"
            label="Hoặc về trang chủ"
          />
        </div>
      </div>

      {/* 🏷️ 4. Branding Footer */}
      <div className="absolute bottom-8 text-[10px] text-slate-300 font-bold uppercase tracking-[0.4em]">
        Smart GPLX • Offline Resilience Mode
      </div>
    </main>
  );
};
