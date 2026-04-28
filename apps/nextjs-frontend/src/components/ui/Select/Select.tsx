"use client";

import React, { forwardRef } from "react";
import { ChevronDown, LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils/utils";
import { selectVariants } from "./select.variants";

/**
 * @description Props for the custom Select component.
 * (Các thuộc tính cho component Select tùy chỉnh.)
 */
interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;          // Label displayed above - Nhãn hiển thị bên trên
  error?: string;          // Error message - Thông báo lỗi
  placeholder?: string;    // Custom placeholder text - Nội dung gợi ý tùy chỉnh
  icon?: LucideIcon;       // Lucide icon component - Icon từ thư viện Lucide
  options: { value: string | number; label: string }[]; // Selection options - Danh sách tùy chọn
}

export const Select = forwardRef<HTMLSelectElement, SelectProps>(
  ({ label, error, icon: Icon, options, placeholder, className, ...props }, ref) => {
    
    /**
     * Execution Flow (Luồng xử lý):
     * Check for Icon presence -> Adjust padding via Variants -> Render Label & Input -> Display Error if exists.
     * (Kiểm tra sự tồn tại của Icon -> Điều chỉnh padding qua Variants -> Hiển thị Nhãn & Ô nhập -> Hiển thị lỗi nếu có.)
     */

    return (
      <div className="flex flex-col gap-2 w-full group">
        {/* 1. Label Section (Phần nhãn hiển thị) */}
        {label && (
          <label className="text-sm font-bold text-slate-700 ml-2 transition-colors group-focus-within:text-emerald-600">
            {label}
          </label>
        )}

        <div className="relative">
          {/* 2. Layer/Icon Section (Phần Icon/Lớp phủ bên trái) */}
          {Icon && (
            <div className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-emerald-500 transition-colors pointer-events-none">
              <Icon size={20} strokeWidth={2.5} />
            </div>
          )}

          {/* 3. Main Select Element (Phần tử ô chọn chính) */}
          <select
            ref={ref}
            className={cn(
              selectVariants({ 
                status: error ? "error" : "default",
                hasIcon: !!Icon 
              }),
              "pr-12", // Đảm bảo text không đè lên mũi tên bên phải (Ensure text doesn't overlap the arrow)
              className
            )}
            defaultValue="" // Đảm bảo placeholder hiển thị mặc định (Ensure placeholder shows as default)
            {...props}
          >
            {/* Custom Placeholder Option */}
            <option value="" disabled hidden>
              {placeholder || "-- Chọn một tùy chọn (Select an option) --"}
            </option>
            
            {options.map((opt) => (
              <option key={opt.value} value={opt.value} className="py-2 text-slate-800">
                {opt.label}
              </option>
            ))}
          </select>

          {/* 4. Custom Arrow (Mũi tên tùy chỉnh bên phải) */}
          <div className="absolute right-5 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400 group-focus-within:text-emerald-500 transition-colors">
            <ChevronDown size={20} strokeWidth={2.5} />
          </div>
        </div>

        {/* 5. Error Message (Thông báo lỗi bên dưới) */}
        {error && (
          <p className="text-xs text-rose-500 font-bold ml-2 animate-in fade-in slide-in-from-top-1">
            {error}
          </p>
        )}
      </div>
    );
  }
);

Select.displayName = "Select";