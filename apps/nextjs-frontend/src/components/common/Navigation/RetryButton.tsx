"use client";

import React from "react";
import { RotateCcw } from "lucide-react";
import Button from "@/components/ui/Button/Button";
import { cn } from "@/lib/utils/utils";

export const RetryButton = ({ onClick, className }: { onClick: () => void; className?: string }) => {
  return (
    <Button
      variant="primary"
      size="lg"
      onClick={onClick}
      className={cn(
        "group relative px-10 py-7 rounded-2xl gap-3 font-black overflow-hidden",
        "bg-rose-600 text-white border-none transition-all duration-300",
        "shadow-[0_10px_20px_-5px_rgba(225,29,72,0.3)] hover:bg-rose-700 hover:-translate-y-1 active:scale-95",
        className
      )}
    >
      <RotateCcw className="w-5 h-5 transition-transform duration-700 group-hover:-rotate-180" />
      <span className="relative z-10">Thử lại (Retry)</span>
      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:animate-[shimmer_1.5s_infinite]" />
    </Button>
  );
};