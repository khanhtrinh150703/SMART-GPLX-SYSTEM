"use client";

import React from "react";
import { VariantProps } from "class-variance-authority";
import { ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils/utils"; // Hàm nối class của bạn
import { filterSelectVariants } from "./filter-select.variants";

export interface FilterOption {
  label: string;
  value: string;
}

// Kế thừa các thuộc tính của Select HTML + Các Variant từ CVA
interface FilterSelectProps
  extends Omit<React.SelectHTMLAttributes<HTMLSelectElement>, "onChange" | "size">,
    VariantProps<typeof filterSelectVariants> {
  options: FilterOption[];
  value: string;
  onChange: (value: string) => void;
}

export const FilterSelect = ({
  options,
  value,
  onChange,
  variant,
  size,
  className,
  ...props
}: FilterSelectProps) => {
  return (
    <div className="relative inline-flex items-center min-w-[120px]">
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        // Kết hợp Variant + Size + Custom Class truyền từ ngoài vào
        // Thêm pr-10 để chữ không bị lẹm vào cái Icon mũi tên
        className={cn(filterSelectVariants({ variant, size }), "pr-10", className)}
        {...props}
      >
        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
      
      {/* Icon mũi tên custom, chèn lên trên thẻ select */}
      <ChevronDown 
        className="absolute right-3 pointer-events-none text-slate-400" 
        size={size === "sm" ? 14 : size === "lg" ? 20 : 16} 
      />
    </div>
  );
};