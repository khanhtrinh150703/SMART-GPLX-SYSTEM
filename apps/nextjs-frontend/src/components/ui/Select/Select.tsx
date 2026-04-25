"use client";

import React, { forwardRef } from "react";
import { ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils/utils";
import { selectVariants } from "./select.variants";

/**
 * Select Props (Thuộc tính ô chọn)
 */
interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;          // Nhãn hiển thị bên trên
  error?: string;          // Thông báo lỗi
  options: { value: string | number; label: string }[]; // Danh sách tùy chọn
}

export const Select = forwardRef<HTMLSelectElement, SelectProps>(
  ({ label, error, options, className, ...props }, ref) => {
    return (
      <div className="flex flex-col gap-2 w-full group">
        {label && (
          <label className="text-sm font-bold text-slate-700 ml-2 transition-colors group-focus-within:text-emerald-600">
            {label}
          </label>
        )}

        <div className="relative">
          <select
            ref={ref}
            className={cn(
              selectVariants({ status: error ? "error" : "default" }),
              className
            )}
            {...props}
          >
            {/* 💡 Placeholder - Tùy chọn mặc định */}
            <option value="" disabled hidden>
              -- Chọn chương học (Select Chapter) --
            </option>
            
            {options.map((opt) => (
              <option key={opt.value} value={opt.value} className="py-2">
                {opt.label}
              </option>
            ))}
          </select>

          {/* 🧩 Custom Arrow (Mũi tên tùy chỉnh) */}
          <div className="absolute right-5 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400 group-focus-within:text-emerald-500 transition-colors">
            <ChevronDown size={20} strokeWidth={2.5} />
          </div>
        </div>

        {/* 📝 Error Message (Thông báo lỗi) */}
        {error && (
          <p className="text-xs text-rose-500 font-medium ml-2 animate-in fade-in slide-in-from-top-1">
            {error}
          </p>
        )}
      </div>
    );
  }
);

Select.displayName = "Select";