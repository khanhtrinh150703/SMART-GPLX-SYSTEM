// components/ui/Input.tsx
import React from 'react';

// Định nghĩa các thuộc tính mà Ô nhập liệu này có thể nhận
interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;  // Tên hiển thị trên đầu ô nhập liệu
  error?: string; // Hiển thị lỗi màu đỏ (nếu có)
}

export default function Input({ label, error, ...props }: InputProps) {
  return (
    <div className="flex flex-col gap-1 mb-2">
      {/* KHÔNG DÙNG text-gray-700 NỮA -> Dùng text-text-main */}
      <label className="text-sm font-medium text-text-main">
        {label}
      </label>
      
      <input
        {...props}
        // KHÔNG DÙNG rounded-md NỮA -> Dùng rounded-theme
        className={`px-3 py-2 border rounded-theme focus:outline-none focus:ring-2 transition-all bg-surface text-text-main ${
          error 
            // Bị lỗi thì viền và vòng sáng dùng màu danger
            ? 'border-danger focus:ring-danger/50 focus:border-danger' 
            // Bình thường thì viền và vòng sáng dùng màu primary
            : 'border-gray-300 focus:ring-primary/50 focus:border-primary' 
        }`}
      />
      
      {/* KHÔNG DÙNG text-red-500 NỮA -> Dùng text-danger */}
      {error && <span className="text-xs text-danger mt-1">{error}</span>}
    </div>
  );
}