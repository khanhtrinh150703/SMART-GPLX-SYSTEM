"use client";

import React from "react";
import { LucideIcon } from "lucide-react";
import { VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils/utils";
import { filterGroupVariants, labelVariants } from "./filter-group.variants";

/**
 * @description Props for the FilterGroup component.
 * (Các thuộc tính cho component FilterGroup.)
 */
interface FilterGroupProps extends VariantProps<typeof filterGroupVariants> {
  label: string;
  icon?: LucideIcon;          // Type-safe icon from Lucide
  children: React.ReactNode;
  className?: string;         // Custom class for the wrapper
  labelClassName?: string;    // Custom class for the label
  intent?: VariantProps<typeof labelVariants>["intent"];
}

/**
 * @description A wrapper component for grouping filter inputs with a labeled header.
 * (Một component bao bọc để nhóm các đầu vào bộ lọc với tiêu đề có nhãn.)
 */
export const FilterGroup: React.FC<FilterGroupProps> = ({
  label,
  icon: Icon,
  children,
  layout,
  spacing,
  intent,
  className,
  labelClassName,
}) => {
  /**
   * Execution Flow (Luồng xử lý):
   * Apply container variants -> Render Icon and Label -> Render Children.
   * (Áp dụng các biến thể vùng chứa -> Hiển thị Icon và Nhãn -> Hiển thị các thành phần con.)
   */

  return (
    <div className={cn(filterGroupVariants({ layout, spacing }), className)}>
      {/* Label Header Section (Phần tiêu đề nhãn) */}
      <div className="flex items-center gap-2 ml-2 mb-1">
        {Icon && (
          <Icon 
            size={12} 
            className={cn(
              intent === "primary" ? "text-emerald-500" : "text-slate-400"
            )} 
          />
        )}
        <label className={cn(labelVariants({ intent }), labelClassName)}>
          {label}
        </label>
      </div>

      {/* Content Section (Phần nội dung bên dưới) */}
      <div className={cn(
        "w-full",
        layout === "horizontal" ? "flex-1" : ""
      )}>
        {children}
      </div>
    </div>
  );
};