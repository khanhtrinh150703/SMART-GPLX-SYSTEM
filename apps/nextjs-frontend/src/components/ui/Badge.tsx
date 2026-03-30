import React from 'react';

interface BadgeProps {
  children: React.ReactNode;
  variant?: 'default' | 'danger' | 'success';
  className?: string; // Thêm prop này để dễ dàng tùy biến thêm class từ bên ngoài nếu cần
}

export const Badge = ({ children, variant = 'default', className = '' }: BadgeProps) => {
  const variants = {
    // Đã cập nhật màu sắc chuẩn: bg-slate-50, text-slate-600, border-slate-100
    default: 'bg-slate-50 text-slate-600 border-slate-100',
    danger: 'bg-rose-50 text-rose-600 border-rose-100',
    success: 'bg-emerald-50 text-emerald-600 border-emerald-100',
  };

  return (
    <div 
      // Đã cập nhật kích thước chuẩn: px-4 py-1.5, text-sm, font-semibold
      className={`inline-flex items-center px-4 py-1.5 rounded-full text-sm font-semibold shadow-sm border transition-colors ${variants[variant]} ${className}`}
    >
      {children}
    </div>
  );
};