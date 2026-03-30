// src/components/common/Errors/NotFoundView.tsx
'use client';

import Link from 'next/link';
import { Home, Compass } from 'lucide-react';
import Button from '@/components/ui/Button/Button';
import { nfIconBoxVariants, nfVariants } from './global-error.variants';

export const NotFoundView = () => {
  return (
    <div className={nfVariants()}>
      {/* 🧩 1. Visual Element (Yếu tố thị giác) */}
      <div className="relative mb-12">
        {/* Glow effect phía sau */}
        <div className="absolute inset-0 bg-emerald-400 blur-[80px] opacity-10 rounded-full" />
        
        <div className={nfIconBoxVariants()}>
          <Compass className="w-20 h-20 text-emerald-500 animate-bounce" strokeWidth={1} />
        </div>
      </div>

      {/* 📝 2. Content Section (Phần nội dung) */}
      <div className="space-y-4 max-w-lg">
        <h1 className="text-8xl font-black text-slate-900 tracking-tighter">
          404
        </h1>
        <h2 className="text-2xl font-bold text-slate-800 uppercase tracking-wide">
          Chệch làn đường rồi! <span className="text-slate-400 font-medium">(Off Track)</span>
        </h2>
        <p className="text-slate-500 leading-relaxed font-medium">
          Trang bạn đang tìm kiếm không tồn tại hoặc đã được chuyển hướng sang một địa chỉ URL mới trong hệ thống **Smart-GPLX**.
        </p>
      </div>

      {/* 🚀 3. Action Section (Phần hành động) */}
      <div className="mt-12 flex flex-col sm:flex-row gap-4">
        <Link href="/">
          <Button 
            variant="primary" 
            size="lg" 
            className="rounded-2xl px-10 gap-2 shadow-emerald-200/50"
          >
            <Home className="w-5 h-5" />
            Về Trang Chủ (Back to Home)
          </Button>
        </Link>
        
        <Button 
          variant="secondary" 
          size="lg" 
          className="rounded-2xl px-10"
          onClick={() => window.history.back()}
        >
          Quay lại (Go Back)
        </Button>
      </div>

      {/* 🏷️ 4. Branding Footer */}
      <div className="absolute bottom-8 text-[10px] text-slate-300 font-bold uppercase tracking-[0.4em]">
        Smart GPLX • AI Integrated Platform
      </div>
    </div>
  );
};