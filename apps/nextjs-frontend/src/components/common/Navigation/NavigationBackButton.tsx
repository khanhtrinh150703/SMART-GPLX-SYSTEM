"use client";

import React from "react";
import { ArrowLeft } from "lucide-react";
import Button from "@/components/ui/Button/Button";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils/utils";

interface NavigationBackButtonProps {
  className?: string;
  label?: string;
  // Cho phép truyền logic quay lại tùy chỉnh nếu cần
  onClick?: () => void;
}

/**
 * NavigationBackButton - Nút quay lại thông minh
 * Hiệu ứng Icon thụt lùi và nhún nhảy cực sinh động.
 */
export const NavigationBackButton = ({
  className,
  label = "Quay lại (Go Back)",
  onClick,
}: NavigationBackButtonProps) => {
  const router = useRouter();

  // Logic mặc định là lùi 1 bước trong lịch sử trình duyệt
  const handleBack = () => {
    if (onClick) return onClick();
    router.back();
  };

  return (
    <Button
      variant="secondary"
      size="lg"
      onClick={handleBack}
      // 🚀 CHIÊU ĐỘC: Dùng "group" để điều khiển icon ArrowLeft
      className={cn(
        "group relative px-10 py-7 rounded-2xl gap-3 font-bold transition-all duration-300",
        "border-slate-200 text-slate-600 bg-white hover:bg-slate-50",
        "hover:shadow-[0_10px_15px_-3px_rgba(0,0,0,0.05)]",
        "active:scale-95",
        className
      )}
    >
      {/* ⬅️ ICON: Sẽ thụt lùi về bên trái và xoay nhẹ khi hover */}
      <ArrowLeft 
        className={cn(
          "w-5 h-5 transition-all duration-500 ease-out",
          "group-hover:-translate-x-2 group-hover:-rotate-12", // Thụt lùi 8px và xoay trái
          "text-slate-400 group-hover:text-emerald-600"
        )} 
      />
      
      <span className="relative z-10">
        {label}
      </span>

      {/* Một dải highlight nhẹ ở viền khi hover cho nó "Pro" */}
      <div className="absolute inset-0 rounded-2xl border-2 border-transparent group-hover:border-emerald-500/10 transition-colors" />
    </Button>
  );
};