"use client";

import React from "react";
import Link from "next/link";
import { Home } from "lucide-react";
import Button from "@/components/ui/Button/Button";
import { useUserStore } from "@/store/user/user.store";
import { cn } from "@/lib/utils/utils";

interface HomeNavigationButtonProps {
  className?: string;
  label?: string;
  variant?: "primary" | "secondary" | "outline" | "ghost"; // 🚀 Thêm dòng này vào
}

export const HomeNavigationButton = ({
  className,
  label,
  variant = "primary", // Thiết lập giá trị mặc định là primary
}: HomeNavigationButtonProps) => {

  const { user } = useUserStore();

  const destination = user ? "/dashboard" : "/";
  const displayLabel = label || (user ? "Về bảng điều khiển" : "Về trang chủ");

  return (
    <Link href={destination}>
      <Button
        variant={variant}
        size="lg"
        // 🚀 CHIÊU ĐỘC: Thêm class "group" để điều khiển icon bên trong
        className={cn(
          "group relative px-10 py-7 rounded-2xl gap-3 font-black overflow-hidden",
          "bg-emerald-600 text-white border-none transition-all duration-300",
          "shadow-[0_10px_20px_-5px_rgba(16,185,129,0.3)]",
          "hover:bg-emerald-700 hover:shadow-emerald-400/40 hover:-translate-y-1", // Nút nhích lên 1 tí
          "active:scale-95",
          className
        )}
      >
        {/* 🏠 ICON: Sẽ xoay và nảy lên khi nút được hover */}
        <Home 
          className={cn(
            "w-6 h-6 transition-all duration-500 ease-out",
            "group-hover:rotate-12 group-hover:scale-110 group-hover:-translate-y-0.5", // Xoay 1 góc & phóng to nhẹ
            "text-emerald-100 group-hover:text-white"
          )} 
        />
        
        <span className="relative z-10 tracking-tight">
          {displayLabel}
        </span>

        {/* ✨ Một chút hiệu ứng ánh sáng chạy ngầm cho đỡ chán */}
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:animate-[shimmer_1.5s_infinite]" />
      </Button>
    </Link>
  );
};