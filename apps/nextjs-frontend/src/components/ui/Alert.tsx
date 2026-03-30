'use client';

import React from 'react';

interface AlertProps {
  message: string;
  type: 'success' | 'error' | 'warning';
}

export const Alert = ({ message, type }: AlertProps) => {
  // Bản đồ màu sắc (Color Mapping) dựa trên tiêu chuẩn dự án
  const config = {
    success: 'bg-emerald-50 border-emerald-200 text-emerald-700',
    error: 'bg-rose-50 border-rose-200 text-rose-700 animate-shake', // Thêm hiệu ứng rung nếu muốn
    warning: 'bg-amber-50 border-amber-200 text-amber-700',
  };

  return (
    <div className={`p-4 border rounded-2xl text-sm font-medium shadow-sm transition-all animate-in slide-in-from-top-2 ${config[type]}`}>
      <div className="flex items-center gap-2">
        {type === 'success' && <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />}
        {type === 'error' && <span className="w-1.5 h-1.5 rounded-full bg-rose-500" />}
        {message}
      </div>
    </div>
  );
};