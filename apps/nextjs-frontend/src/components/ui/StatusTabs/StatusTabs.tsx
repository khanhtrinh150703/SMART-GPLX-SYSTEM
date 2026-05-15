"use client";

import React from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils/utils";
import { 
  statusTabsContainerVariants, 
  statusTabsButtonVariants, 
  type StatusTabsContainerProps 
} from "./status-tab.variants";

export interface StatusOption<T> {
  id: T;
  label: string;
  color?: string; // Dùng cái này làm class màu nền (Pill) luôn
}

interface StatusTabsProps<T> extends StatusTabsContainerProps {
  options: StatusOption<T>[];
  currentValue: T;
  onChange: (value: T) => void;
  className?: string;
}

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

        // Xử lý màu nền Pill: 
        // Nếu là 'all' thì tự ốp màu xám, các tab khác thì lấy từ thuộc tính `color`
        const pillBgClass = option.id === "all" 
          ? (option.color || "bg-slate-500 shadow-lg shadow-slate-200/60")
          : (option.color || "bg-white shadow-sm");

        return (
          <button
            key={option.id}
            type="button"
            onClick={() => onChange(option.id)}
            className={cn(
              "relative",
              statusTabsButtonVariants({
                status: isActive ? "active" : "inactive",
                size,
                shape,
              }),
              // Active thì auto chữ trắng, không active thì màu xám nhạt
              isActive ? "text-white" : "text-slate-500 hover:text-slate-700" 
            )}
          >
            {/* HIỆU ỨNG NỀN CHẠY */}
            {isActive && (
              <motion.div
                layoutId="status-tabs-active-bg"
                className={cn(
                  "absolute inset-0 z-0",
                  shape === "full" ? "rounded-full" : "rounded-xl",
                  pillBgClass // Bơm thẳng màu nền vào đây
                )}
                transition={{ type: "spring", bounce: 0.2, duration: 0.5 }}
              />
            )}

            <span className="relative z-10">{option.label}</span>
          </button>
        );
      })}
    </div>
  );
}