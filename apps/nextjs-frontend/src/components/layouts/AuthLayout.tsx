"use client";

import React, { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { siteConfig } from "@/constants/config/site";
import { ChevronLeft } from "lucide-react";
import { Logo } from "../ui/Logo/Logo";
import Button from "@/components/ui/Button/Button";
import { AuthBanner } from "./AuthBanner";

interface AuthLayoutProps {
  children: React.ReactNode;
  title: string;
  subtitle: string;
}

export default function AuthLayout({
  children,
  title,
  subtitle,
}: AuthLayoutProps) {
  const pathname = usePathname();
  const [mounted, setMounted] = useState<boolean>(false);

  useEffect(() => {
    const raf = requestAnimationFrame(() => {
      setMounted(true);
    });
    return () => cancelAnimationFrame(raf);
  }, []);
  if (!mounted) return null;

  const handleBack = (): void => {
    window.location.href = "/";
  };

return (
    <div
      key={pathname}
      className="h-screen w-screen flex bg-slate-50 font-sans text-slate-900 relative overflow-hidden"
    >
      {/* NÚT QUAY LẠI */}
      <div className="absolute top-6 right-6 sm:top-8 sm:right-8 z-50">
        <Button
          onClick={handleBack}
          variant="secondary"
          size="sm"
          className="text-slate-600 hover:text-emerald-700 hover:bg-emerald-50/80 gap-1.5 font-semibold transition-all rounded-xl border border-slate-200/60 shadow-sm"
        >
          <ChevronLeft className="w-4 h-4" />
          Quay lại
        </Button>
      </div>

      {/* CỘT TRÁI BANNER */}
      <AuthBanner
        slogan={siteConfig.auth.slogan}
        description={siteConfig.auth.description}
      />

      {/* CỘT PHẢI FORM */}
      <div className="w-full lg:w-[50%] h-full flex flex-col items-center justify-center p-4 bg-slate-50 overflow-hidden min-h-0">
        
        {/* ĐÃ THAY ĐỔI:
          - Tăng max-h lên [92vh] để hộp trắng cao lên một chút, thoải mái không gian.
          - Đảm bảo cấu trúc justify-between để chia tách phần ruột và phần chân trang (footer).
        */}
        <div className="w-full max-w-lg max-h-[92vh] relative z-10 bg-white p-6 sm:p-8 rounded-2xl shadow-soft border border-slate-200/60 flex flex-col justify-between overflow-y-auto custom-scrollbar">
          
          {/* Vùng trên: Bao gồm tiêu đề và form con */}
          <div className="w-full flex-1 min-h-0">
            <div className="lg:hidden mb-3 flex justify-center shrink-0">
              <Logo />
            </div>

            <div className="mb-4 text-center lg:text-left shrink-0">
              <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 mb-1 tracking-tight">
                {title}
              </h1>
              <p className="text-slate-400 text-xs font-medium leading-relaxed">
                {subtitle}
              </p>
            </div>

            {/* Ruột form con */}
            <div className="w-full">
              {children}
            </div>
          </div>

          {/* Vùng dưới: Footer nằm biệt lập ở đáy, không sợ bất cứ thứ gì đè lên */}
          <div className="w-full pt-4 mt-2 border-t border-slate-100 shrink-0 text-center">
            <p className="text-[10px] text-slate-400 font-bold uppercase tracking-[0.3em]">
              © 2026 Smart GPLX • AI Drive System
            </p>
          </div>
          
        </div>
      </div>
    </div>
  );
}
