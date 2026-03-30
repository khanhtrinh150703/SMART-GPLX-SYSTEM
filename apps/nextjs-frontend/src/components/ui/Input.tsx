import React, { forwardRef } from 'react';

// Cập nhật Props để linh hoạt hơn
interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string; // Đổi thành optional để dùng được ở những chỗ không cần label
  error?: string;
  icon?: React.ReactNode; // Thêm khả năng chèn Icon (như cái khóa ở email)
}

const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, icon, className, ...props }, ref) => {
    return (
      <div className="flex flex-col gap-2">
        {/* Label - Dùng italic và màu slate-700 để khớp với Profile */}
        {label && (
          <label className="text-sm font-bold text-slate-700 ml-1 italic">
            {label}
          </label>
        )}
        
        <div className="relative group">
          <input
            ref={ref} // Rất quan trọng cho react-hook-form
            {...props}
            className={`
              w-full px-5 py-4 outline-none transition-all
              /* BO GÓC & FONT: Khớp với form Profile */
              rounded-2xl font-medium placeholder:text-slate-400
              
              /* TRẠNG THÁI: ReadOnly / Disabled */
              ${(props.disabled || props.readOnly) 
                ? 'bg-slate-100 text-slate-500 cursor-not-allowed border-slate-200' 
                : 'bg-slate-50 text-slate-800 focus:bg-white focus:ring-4 focus:ring-emerald-500/10'
              }
              
              /* MÀU VIỀN VÀ TRẠNG THÁI LỖI */
              border ${error ? 'border-rose-500' : 'border-slate-200 focus:border-emerald-500'}
              
              /* Nếu có icon bên phải, đẩy padding-right ra để không đè chữ */
              ${icon ? 'pr-12' : ''}
              
              /* Cho phép ghi đè className từ bên ngoài */
              ${className || ''}
            `}
          />
          
          {/* Hỗ trợ chèn Icon bên phải */}
          {icon && (
            <div className="absolute right-5 top-1/2 -translate-y-1/2 text-slate-400">
              {icon}
            </div>
          )}
        </div>
        
        {/* THÔNG BÁO LỖI */}
        {error && (
          <p className="text-rose-500 text-xs font-bold mt-1 ml-1">
            {error}
          </p>
        )}
      </div>
    );
  }
);

Input.displayName = 'Input'; // Cần thiết khi dùng forwardRef

export default Input;