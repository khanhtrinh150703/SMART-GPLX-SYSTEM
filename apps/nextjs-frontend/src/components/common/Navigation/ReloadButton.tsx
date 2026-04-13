"use client";

import React from "react";
import { RefreshCcw } from "lucide-react";
import Button from "@/components/ui/Button/Button";
import { cn } from "@/lib/utils/utils";

export const ReloadButton = ({ className }: { className?: string }) => {
  const handleReload = () => window.location.reload();

  return (
    <Button
      variant="primary"
      size="lg"
      onClick={handleReload}
      className={cn(
        "group relative px-12 py-7 rounded-2xl gap-3 font-black overflow-hidden",
        "bg-rose-600 text-white border-none transition-all duration-300",
        "shadow-[0_10px_20px_-5px_rgba(225,29,72,0.3)]", // Shadow màu đỏ Rose
        "hover:bg-rose-700 hover:shadow-rose-400/40 hover:-translate-y-1",
        "active:scale-95",
        className
      )}
    >
      {/* 🔄 ICON: Xoay vòng khi hover */}
      <RefreshCcw 
        className="w-5 h-5 transition-transform duration-700 ease-in-out group-hover:rotate-180" 
      />
      
      <span className="relative z-10">Tải lại trang</span>

      {/* Hiệu ứng Shimmer lướt qua cho "chiến" */}
      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:animate-[shimmer_1.5s_infinite]" />
    </Button>
  );
};