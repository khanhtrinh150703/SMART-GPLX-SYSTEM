"use client";

import React, { useEffect, useState } from "react";
import { siteConfig } from "@/constants/config/site";
import { ChevronLeft } from "lucide-react";
import { Logo } from "../ui/Logo/Logo";
import Button from "@/components/ui/Button/Button";
import { AuthBanner } from "./AuthBanner";
import { usePathname } from "next/navigation";

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
      <div className="absolute top-4 right-4 sm:top-5 sm:right-6 z-50">
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
        
        {/* TỐI ƯU: Giảm nhẹ padding tổng thể của hộp từ p-6/p-8 xuống p-5/p-6 */}
        <div className="w-full max-w-lg max-h-[92vh] relative z-10 bg-white rounded-2xl shadow-soft border border-slate-200/60 flex flex-col min-h-0">
          
          {/* Vùng trên: Giảm pb (padding-bottom) xuống để form con sát lên trên hơn */}
          <div className="w-full flex-1 overflow-y-auto custom-scrollbar p-5 sm:p-6 pb-2 sm:pb-3">
            <div className="lg:hidden mb-2 flex justify-center shrink-0">
              <Logo />
            </div>

            {/* Thu hẹp margin-bottom (mb-4 -> mb-3) của phần tiêu đề */}
            <div className="mb-3 text-center lg:text-left shrink-0">
              <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 mb-0.5 tracking-tight">
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

          {/* Vùng dưới: Giảm nhẹ padding của footer để tiết kiệm diện tích đứng */}
          <div className="w-full px-5 sm:px-6 pb-3 pt-3 border-t border-slate-100 shrink-0 text-center bg-white rounded-b-2xl">
            <p className="text-[10px] text-slate-400 font-bold uppercase tracking-[0.3em]">
              © 2026 Smart GPLX • AI Drive System
            </p>
          </div>
          
        </div>
      </div>
    </div>
  );
}