// src/components/ui/Alert.tsx
'use client';

import React, { useState, useEffect } from 'react';
import { alertVariants, dotVariants } from '@/components/ui/Alert/alert.variants';
import { cn } from '@/lib/utils/utils';
import { VariantProps } from 'class-variance-authority';
import { X } from 'lucide-react';

interface AlertProps 
  extends React.HTMLAttributes<HTMLDivElement>, 
    VariantProps<typeof alertVariants> {
  message?: string | null;
  duration?: number; // ms (Ví dụ: 10000 = 10s)
  onClose?: () => void;
  showDot?: boolean;
  
}

export const Alert = ({ 
  message, 
  intent, 
  layout, 
  duration, 
  onClose,
  showDot = true, 
  className, 
  ...props 
}: AlertProps) => {
  // 💡 CHIÊU ĐỘC: State phái sinh để theo dõi sự thay đổi của message
  const [isVisible, setIsVisible] = useState(!!message);
  const [prevMessage, setPrevMessage] = useState(message);

  // 🔄 ĐỒNG BỘ ĐỒNG BỘ (Manual Sync): 
  // Nếu message từ ngoài đổi, cập nhật isVisible ngay TRONG lúc Render.
  // Cách này không gây "Cascading Renders" như useEffect.
  if (message !== prevMessage) {
    setPrevMessage(message);
    setIsVisible(!!message);
  }

  // ⏲️ HẸN GIỜ: Chỉ lo việc đếm ngược để ẩn Alert
  useEffect(() => {
    if (!message || !isVisible || !duration) return;

    const timer = setTimeout(() => {
      setIsVisible(false);
      onClose?.();
    }, duration);

    return () => clearTimeout(timer); // 🧹 Cleanup (Dọn dẹp)
  }, [message, isVisible, duration, onClose]);

  if (!message || !isVisible) return null;

  return (
    <div 
      className={cn(
        alertVariants({ intent, layout }), 
        "animate-in fade-in slide-in-from-top-2 duration-500", 
        className
      )} 
      role="alert" 
      {...props}
    >
      {showDot && layout !== "centered" && (
        <span className={dotVariants({ intent })} />
      )}
      
      <div className="flex-1 text-sm font-bold leading-relaxed">
        {message}
      </div>

      <button 
        type="button"
        onClick={() => setIsVisible(false)}
        className="shrink-0 p-0.5 rounded-lg hover:bg-black/5 transition-colors opacity-40 hover:opacity-100"
      >
        <X className="w-4 h-4" />
      </button>
    </div>
  );
};