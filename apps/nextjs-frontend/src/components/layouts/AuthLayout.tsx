"use client";

import React, { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { siteConfig } from '@/constants/config/site';
import { ChevronLeft } from "lucide-react";
import { Logo } from "../ui/Logo/Logo";
import Button from "@/components/ui/Button/Button";
import { AuthBanner } from "./AuthBanner"; 

interface AuthLayoutProps {
  children: React.ReactNode;
  title: string;
  subtitle: string;
}

export default function AuthLayout({ children, title, subtitle }: AuthLayoutProps) {
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
    <div key={pathname} className="h-screen w-screen flex bg-slate-50 font-sans text-slate-900 relative overflow-hidden">
      
      {/* NÚT QUAY LẠI TUYỆT ĐỐI (Absolute Fixed Escape Button) */}
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

      {/* =========================================================
          CỘT TRÁI BANNER: Gọi trực tiếp không bọc div trung gian thừa thãi (Direct Clean Component Call)
          ========================================================= */}
      <AuthBanner 
        slogan={siteConfig.auth.slogan} 
        description={siteConfig.auth.description} 
      />

      {/* =========================================================
          CỘT PHẢI FORM: Chiếm chuẩn 50% không gian còn lại (Symmetrical Right Column Content)
          ========================================================= */}
      <div className="w-full lg:w-[50%] h-full flex flex-col items-center justify-center p-6 sm:p-10 bg-slate-50 overflow-hidden min-h-0">
        <div className="w-full max-w-md relative z-10 bg-white p-8 sm:p-10 rounded-3xl shadow-soft border border-slate-200/60 flex flex-col justify-center">
          
          <div className="lg:hidden mb-6 flex justify-center">
            <Logo />
          </div>

          <div className="mb-6 text-center lg:text-left">
            <h1 className="text-3xl font-extrabold text-slate-900 mb-2 tracking-tight">
              {title}
            </h1>
            <p className="text-slate-500 text-sm font-medium leading-relaxed">
              {subtitle}
            </p>
          </div>
          
          <div className="space-y-6">
            {children} 
          </div>

          <p className="mt-8 text-center text-[10px] text-slate-400 font-bold uppercase tracking-[0.3em]">
            © 2026 Smart GPLX • AI Drive System
          </p>
        </div>
      </div>

    </div>
  );
}