"use client";

import React from "react";
import { cn } from "@/lib/utils/utils";
import { 
  statusTabsContainerVariants, 
  statusTabsButtonVariants, 
  type StatusTabsContainerProps 
} from "./status-tab.variants";

/**
 * Cấu trúc dữ liệu cho một tùy chọn (Option structure).
 */
export interface StatusOption<T> {
  id: T;
  label: string;
  color?: string; // Class màu chữ (Ví dụ: text-emerald-600, text-rose-500...)
}

interface StatusTabsProps<T> extends StatusTabsContainerProps {
  options: StatusOption<T>[];
  currentValue: T;
  onChange: (value: T) => void;
  className?: string;
}

/**
 * Component chuyển đổi trạng thái - Phiên bản không viền, tùy biến màu sắc.
 * @template T - Kiểu dữ liệu định danh (Identifier type).
 */
export function StatusTabs<T extends string | number>({
  options,
  currentValue,
  onChange,
  className,
  size, 
  shape,
}: StatusTabsProps<T>) {
  return (
    <div className={cn(statusTabsContainerVariants({ size, shape }), className)}>
      {options.map((option) => {
        const isActive = currentValue === option.id;

        return (
          <button
            key={option.id}
            type="button"
            onClick={() => onChange(option.id)}
            className={cn(
              statusTabsButtonVariants({
                status: isActive ? "active" : "inactive",
                size,
                shape,
              }),
              // Nếu đang active: Ưu tiên dùng màu trong option, nếu không có mặc định dùng emerald
              isActive && (option.color || "text-emerald-600")
            )}
          >
            {option.label}
          </button>
        );
      })}
    </div>
  );
}