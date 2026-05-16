"use client";

import React from "react";
import { motion } from "framer-motion";
import { statusFilterVariants, tabItemVariants } from "./status-filter.variants";
import { cn } from "@/lib/utils/utils";

// 1. Dùng Generic Type <T> để nhận diện chính xác kiểu chữ được truyền vào (VD: "all" | "passed" | "failed")
export interface StatusOption<T extends string = string> {
  value: T; // (Nếu ông dùng 'id' ở file cha thì đổi chữ value thành id nhé)
  label: string;
  activePillClass?: string; 
}

interface StatusFilterProps<T extends string> {
  options: StatusOption<T>[];
  currentStatus: T;
  onChange: (value: T) => void;
  className?: string;
}

// 2. Component Generic
export const StatusFilter = <T extends string>({
  options = [],
  currentStatus,
  onChange,
  className,
}: StatusFilterProps<T>) => {
  return (
    <div className={cn(statusFilterVariants(), className)}>
      {options.map((option) => {
        const isActive = currentStatus === option.value;

        return (
          <div
            key={String(option.value)}
            // Gỡ sạch "status as any", chỉ truyền đúng isActive vì ta chỉ đổi chữ khi chọn/không chọn
            className={cn(tabItemVariants({ isActive }))}
            onClick={() => onChange(option.value)}
          >
            <span className="relative z-20 transition-colors duration-300">
              {option.label}
            </span>

            {isActive && (
              <motion.div
                layoutId="active-pill"
                className={cn(
                  "absolute inset-0 z-10 rounded-xl",
                  option.activePillClass || "bg-white shadow-sm"
                )}
                transition={{ type: "spring", bounce: 0.15, duration: 0.5 }}
              />
            )}
          </div>
        );
      })}
    </div>
  );
};