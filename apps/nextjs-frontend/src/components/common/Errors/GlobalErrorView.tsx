// src/components/common/Errors/GlobalErrorView.tsx
'use client';

import { useEffect } from 'react';
import { AlertTriangle, RefreshCcw, Home } from 'lucide-react';
import Button from '@/components/ui/Button/Button';
import { errorVariants, iconBoxVariants } from './global-error.variants';

interface GlobalErrorViewProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export const GlobalErrorView = ({ error, reset }: GlobalErrorViewProps) => {
  useEffect(() => {
    // 💡 Tracing Error: Log lỗi ra console hoặc dịch vụ giám sát (Sentry)
    console.error("Critical System Error:", error);
  }, [error]);

  return (
    <div className={errorVariants()}>
      {/* 🧩 Visual Element */}
      <div className="relative">
        <div className="absolute inset-0 bg-rose-400 blur-[60px] opacity-10" />
        <div className={iconBoxVariants()}>
          <AlertTriangle className="w-12 h-12 text-rose-500" strokeWidth={1.5} />
        </div>
      </div>

      {/* 📝 Content Section */}
      <h2 className="text-3xl font-black text-slate-900 mb-3 tracking-tight">
        Hệ thống gặp sự cố <span className="text-rose-500">(System Failure)</span>
      </h2>
      <p className="text-slate-500 max-w-md mb-10 leading-relaxed font-medium">
        Hệ thống **Smart-GPLX** đang gặp một chút trục trặc kỹ thuật ngoài ý muốn. Đừng lo lắng, tiến trình học tập của bạn vẫn được bảo vệ.
      </p>

      {/* 🚀 Action Buttons */}
      <div className="flex flex-col sm:flex-row gap-4">
        <Button 
          variant="primary" // Emerald color từ variant của bạn
          onClick={() => reset()} 
          className="px-10 py-4 rounded-2xl gap-2 shadow-emerald-200"
        >
          <RefreshCcw className="w-4 h-4" />
          Thử lại (Retry)
        </Button>
        
        <Button 
          variant="secondary" // Slate color
          onClick={() => window.location.href = '/'}
          className="px-10 py-4 rounded-2xl gap-2"
        >
          <Home className="w-4 h-4" />
          Về trang chủ (Home)
        </Button>
      </div>

      {/* 🏷️ Error ID for support */}
      {error.digest && (
        <p className="mt-12 text-[10px] text-slate-300 font-mono uppercase tracking-widest">
          Error ID: {error.digest}
        </p>
      )}
    </div>
  );
};