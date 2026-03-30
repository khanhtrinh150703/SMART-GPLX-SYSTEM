// src/components/ui/alert.variants.ts
import { cva } from "class-variance-authority";

export const alertVariants = cva(
  // 1. Base Styles: Những gì Alert nào cũng phải có
  "p-4 border rounded-2xl text-sm font-medium shadow-sm transition-all flex items-center gap-3 animate-in fade-in slide-in-from-top-2 duration-300",
  {
    variants: {
      intent: {
        success: "bg-emerald-50 border-emerald-100 text-emerald-700",
        error: "bg-rose-50 border-rose-100 text-rose-700 animate-shake", // Hiệu ứng rung khi có lỗi
        warning: "bg-amber-50 border-amber-100 text-amber-700",
      },
      layout: {
        default: "text-left font-medium",
        centered: "text-center justify-center font-bold", // 🟢 Gom hết font-bold và center vào đây
      }
    },
    defaultVariants: {
      intent: "success",
    },
  }
);

// Biến thể cho cái "Chấm tròn" (Status Dot) để nhìn cho chuyên nghiệp
export const dotVariants = cva("w-1.5 h-1.5 rounded-full shrink-0", {
  variants: {
    intent: {
      success: "bg-emerald-500",
      error: "bg-rose-500",
      warning: "bg-amber-500",
    },
  },
  defaultVariants: {
    intent: "success",
  },
});