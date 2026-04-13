"use client";

import { Compass } from "lucide-react";
import { containerVariants, iconBoxVariants } from "./global-error.variants";
import { performSmartNavigateBack } from "@/utils/navigation";
import { useActionHandler } from "@/hooks/useActionHandler";
import { Alert } from "@/components/ui/Alert";
import { HomeNavigationButton } from "../Navigation/HomeNavigationButton";
// 🚀 Import cái nút "Lùi xe" mình vừa độ xong
import { NavigationBackButton } from "../Navigation/NavigationBackButton";

export const NotFoundView = () => {
  const { message, setMessage, handleAction } = useActionHandler();

  // Logic điều hướng của ông giữ nguyên để hiện Alert/Delay
  const onBackClick = async () => {
    await handleAction(() => performSmartNavigateBack(), {
      successMsg: "Đang chuyển hướng...",
      delay: 800,
    });
  };

  return (
    <main className={containerVariants({ layout: "full", theme: "light" })}>
      {message && (
        <div className="fixed top-10 w-full max-w-md z-50 animate-in fade-in slide-in-from-top-4 duration-500">
          <Alert
            intent={message.intent}
            message={message.text}
            onClose={() => setMessage(null)}
          />
        </div>
      )}

      <div className="relative mb-12">
        <div className="absolute inset-0 bg-emerald-400 blur-[80px] opacity-10 rounded-full" />
        <div className={iconBoxVariants({ status: "network", size: "xl" })}>
          <Compass
            className="w-20 h-20 text-emerald-500 animate-bounce"
            strokeWidth={1}
          />
        </div>
      </div>

      <div className="space-y-4 max-w-lg flex flex-col items-center">
        <h1 className="text-8xl font-black text-slate-900 tracking-tighter">404</h1>
        <h2 className="text-2xl font-bold text-slate-800 uppercase tracking-wide">
          Chệch làn đường rồi! <span className="text-slate-400 font-medium">(Off Track)</span>
        </h2>
        <p className="text-slate-500 leading-relaxed font-medium px-4 text-center">
          Trang bạn tìm kiếm không tồn tại trong hệ thống <strong className="text-emerald-600">Smart-GPLX</strong>.
        </p>
      </div>

      <div className="mt-12 flex flex-col sm:flex-row gap-4">
        {/* 🏠 Nút về Home: Tự động check Dashboard/Landing */}
        <HomeNavigationButton />

        {/* ⬅️ Nút Quay lại: Vừa có hiệu ứng icon "thụt lùi", vừa chạy logic handleAction của ông */}
        <NavigationBackButton onClick={onBackClick} />
      </div>

      <div className="absolute bottom-8 text-[10px] text-slate-300 font-bold uppercase tracking-[0.4em]">
        Smart GPLX • AI Integrated Platform
      </div>
    </main>
  );
};