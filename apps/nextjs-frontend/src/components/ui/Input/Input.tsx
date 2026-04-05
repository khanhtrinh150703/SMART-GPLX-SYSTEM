// src/components/ui/Input.tsx
import React, { forwardRef } from 'react';
import { VariantProps } from 'class-variance-authority';
import { errorStyles, inputVariants, labelStyles } from '@/components/ui/Input/input.variants';
import { cn } from '@/lib/utils/utils';

interface InputProps 
  extends React.InputHTMLAttributes<HTMLInputElement>, 
    VariantProps<typeof inputVariants> {
  label?: string;
  error?: string;
  icon?: React.ReactNode;
}

const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, icon, className, intent, status, ...props }, ref) => {
    
    // Tự động chuyển sang intent "error" nếu có tin nhắn lỗi truyền vào
    const currentIntent = error ? "error" : (intent || "default");
    // Tự động chuyển status "disabled" nếu props disabled hoặc readOnly là true
    const currentStatus = (props.disabled || props.readOnly) ? "disabled" : (status || "active");

    return (
      <div className="flex flex-col w-full">
        {/* Label */}
        {label && (
          <label className={labelStyles}>
            {label}
          </label>
        )}
        
        <div className="relative group w-full">
          <input
            ref={ref}
            {...props}
            // 💡 DUNG HỢP: Gọi variant + merge thêm padding nếu có icon + merge className ngoài
            className={cn(
              inputVariants({ intent: currentIntent, status: currentStatus }),
              icon && "pr-12",
              className
            )}
          />
          
          {/* Icon bên phải */}
          {icon && (
            <div className="absolute right-5 top-1/2 -translate-y-1/2 text-slate-400 transition-colors group-focus-within:text-emerald-500">
              {icon}
            </div>
          )}
        </div>
        
        {/* Thông báo lỗi */}
        {error && (
          <p className={errorStyles}>
            {error}
          </p>
        )}
      </div>
    );
  }
);

Input.displayName = 'Input';

export default Input;