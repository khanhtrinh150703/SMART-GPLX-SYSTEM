import React from 'react';

// Định nghĩa các Thuộc tính truyền vào (Props) cho Nút
export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  text?: string;        // Cho phép truyền chữ qua text="..."
  isLoading?: boolean;  // Cờ hiệu báo đang tải dữ liệu (Loading State)
}

export default function Button({ 
  text, 
  isLoading, 
  children, 
  className = '', 
  disabled, 
  ...props 
}: ButtonProps) {
  return (
    <button
      // Thêm flex và gap-2 để chữ và vòng xoay nằm ngang hàng, căn giữa
      className={`flex items-center justify-center gap-2 ${className}`} 
      disabled={disabled || isLoading} // Tự động khóa nút khi đang tải
      {...props}
    >
      {/* Nếu isLoading là true, hiển thị vòng xoay (Spinner) */}
      {isLoading && (
        <svg 
          className="w-5 h-5 animate-spin text-current" 
          fill="none" 
          viewBox="0 0 24 24"
        >
          <circle 
            className="opacity-25" 
            cx="12" cy="12" r="10" 
            stroke="currentColor" 
            strokeWidth="4"
          ></circle>
          <path 
            className="opacity-75" 
            fill="currentColor" 
            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
          ></path>
        </svg>
      )}

      {/* Ưu tiên hiển thị text, nếu không có text thì hiển thị children */}
      {text || children}
    </button>
  );
}