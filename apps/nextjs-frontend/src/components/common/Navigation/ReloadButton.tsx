"use client";

import React from "react";
import { RefreshCcw } from "lucide-react";
import Button from "@/components/ui/Button/Button";
import { cn } from "@/lib/utils/utils";

export const ReloadToPreviousButton = ({ className }: { className?: string }) => {
  
  const handleReloadToPrevious = () => {
    // document.referrer là URL của trang mà user vừa ở đó trước khi đến trang lỗi này
    const previousPage = document.referrer;

    if (previousPage) {
      // Điều hướng về trang cũ và buộc trình duyệt load lại từ đầu
      window.location.href = previousPage;
    } else {
      // Nếu không có lịch sử (ví dụ user dán link lỗi vào), đưa về trang chủ
      window.location.href = "/";
    }
  };

  return (
    <Button
      variant="primary"
      size="lg"
      onClick={handleReloadToPrevious}
      className={cn(
        "group relative px-12 py-7 rounded-2xl gap-3 font-black overflow-hidden",
        "bg-rose-600 text-white border-none transition-all duration-300",
        "shadow-[0_10px_20px_-5px_rgba(225,29,72,0.3)]",
        "hover:bg-rose-700 hover:-translate-y-1",
        "active:scale-95",
        className
      )}
    >
      <RefreshCcw className="w-5 h-5 transition-transform duration-700 group-hover:rotate-180" />
      <span className="relative z-10">Tải lại trang trước đó</span>
      
      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:animate-[shimmer_1.5s_infinite]" />
    </Button>
  );
};