"use client";

import React from "react";
import { siteConfig } from '@/constants/config/site';
import { ChevronLeft, ShieldCheck } from "lucide-react";
import { Logo } from "../ui/Logo/Logo";
import Button from "@/components/ui/Button/Button";

interface AuthLayoutProps {
  children: React.ReactNode;
  title: string;
  subtitle: string;
}

export default function AuthLayout({ children, title, subtitle }: AuthLayoutProps) {
  return (
    <div className="min-h-screen flex bg-[#FCFDFC] font-sans text-slate-800 relative overflow-hidden">
      
      {/* 🟢 NÚT QUAY LẠI (Thiết kế thanh thoát hơn) */}
      <div className="absolute top-8 right-8 z-[100]">
        <Button 
          href="/" 
          variant="ghost" 
          className="text-slate-400 hover:text-emerald-700 hover:bg-emerald-50 gap-2 font-bold transition-all rounded-xl"
        >
          <ChevronLeft className="w-4 h-4" />
          Quay lại
        </Button>
      </div>

      {/* =========================================================
          CỘT TRÁI: Deep Forest Green (Xanh lục sâu lắng)
          ========================================================= */}
      <div className="hidden lg:flex lg:w-[50%] relative bg-[#022c22] items-center justify-center p-20 overflow-hidden">
        {/* Lớp nền Gradient Xanh Lục Sâu (Không còn màu xanh dương) */}
        <div className="absolute inset-0 z-0 bg-gradient-to-br from-[#064e3b] via-[#022c22] to-[#011a13]" />
        
        {/* Lưới Grid mảnh mai */}
        <div className="absolute inset-0 z-0 bg-[linear-gradient(to_right,#ffffff05_1px,transparent_1px),linear-gradient(to_bottom,#ffffff05_1px,transparent_1px)] bg-[size:50px_50px]" />

        {/* Khối sáng Ambient xanh lục nhạt (Soft Glow) */}
        <div className="absolute top-1/3 left-1/4 w-[500px] h-[500px] bg-emerald-500/5 rounded-full blur-[140px]" />

        <div className="relative z-10 w-full max-w-lg">
          {/* Logo - Ép sáng để nổi bật trên nền lục sẫm */}
          <div className="mb-14">
             <Logo className="scale-125 origin-left brightness-[1.1] contrast-[1.2] invert-[0.05]" /> 
          </div>

          <h2 className="text-5xl font-black mb-8 leading-[1.1] text-emerald-50 tracking-tighter">
            {siteConfig.auth.slogan}
          </h2>
          <p className="text-emerald-100/60 text-lg mb-12 leading-relaxed font-medium">
            {siteConfig.auth.description}
          </p>

          {/* 🖼️ AI SYSTEM SHOWCASE (Làm mờ & Dịu hơn) */}
          <div className="relative p-[1px] w-full bg-gradient-to-b from-emerald-400/20 to-transparent rounded-[32px] overflow-hidden group shadow-2xl">
            <div className="bg-[#011a13]/60 backdrop-blur-3xl rounded-[31px] p-8 h-[340px] flex items-center justify-center relative overflow-hidden">
               {/* Ảnh AI System (Giảm độ chói) */}
               {/* <img 
                 src="/images/ai-traffic-showcase.png" 
                 alt="AI System"
                 className="w-full h-full object-cover opacity-30 rounded-2xl grayscale-[0.5] group-hover:grayscale-0 group-hover:opacity-50 transition-all duration-700"
               />
                */}
               {/* Hiệu ứng Quét Xanh Lục mảnh */}
               <div className="absolute inset-x-0 top-0 h-[1.5px] bg-emerald-400/50 shadow-[0_0_10px_#34d399] animate-[scan_4s_linear_infinite]" />
               
               {/* Badge nhỏ xinh */}
               <div className="absolute bottom-10 right-10 flex items-center gap-2 px-3 py-1.5 bg-emerald-950/40 border border-emerald-800/50 rounded-lg backdrop-blur-md">
                  <ShieldCheck className="w-4 h-4 text-emerald-400" />
                  <span className="text-[10px] font-bold text-emerald-200 uppercase tracking-widest">Secure AI Link</span>
               </div>
            </div>
          </div>
        </div>
      </div>

      {/* =========================================================
          CỘT PHẢI: Form Content (Xanh lục nhẹ nhàng)
          ========================================================= */}
      <div className="w-full lg:w-[50%] flex items-center justify-center p-8 sm:p-20 relative bg-white">
        {/* Nền điểm xuyết texture nhẹ cho đỡ trống */}
        <div className="absolute inset-0 opacity-[0.02] pointer-events-none bg-[url('https://www.transparenttextures.com/patterns/pinstriped-suit.png')]" />

        <div className="w-full max-w-sm relative z-10">
          <div className="mb-12 text-center lg:text-left">
            <div className="lg:hidden mb-8 flex justify-center">
              <Logo />
            </div>
            <h1 className="text-4xl font-black text-slate-900 mb-4 tracking-tighter leading-none">
              {title}
            </h1>
            <p className="text-slate-400 text-base font-medium">
              {subtitle}
            </p>
          </div>
          
          <div className="space-y-6">
            {children} 
          </div>

          <p className="mt-16 text-center text-[10px] text-slate-300 font-bold uppercase tracking-[0.4em]">
            © 2026 Smart GPLX • AI Drive System
          </p>
        </div>
      </div>

      <style jsx global>{`
        @keyframes scan {
          0% { top: 0%; }
          100% { top: 100%; }
        }
      `}</style>
    </div>
  );
}