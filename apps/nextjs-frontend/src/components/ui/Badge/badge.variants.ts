// src/components/ui/badge.variants.ts
import { cva } from "class-variance-authority";

export const badgeVariants = cva(
  // 1. Base Styles: Những gì Badge nào cũng phải có
  "inline-flex items-center px-4 py-1.5 rounded-full text-sm font-semibold shadow-sm border transition-all select-none",
  {
    variants: {
      intent: {
        default: "bg-slate-50 text-slate-600 border-slate-100",
        danger: "bg-rose-50 text-rose-600 border-rose-100",
        success: "bg-emerald-50 text-emerald-600 border-emerald-100",
      },
    },
    defaultVariants: {
      intent: "default",
    },
  }
);

// 💡 Biến thể cho cái "Chấm tròn" (Status Dot)
export const dotVariants = cva("mr-2 w-2 h-2 rounded-full shrink-0", {
  variants: {
    intent: {
      default: "bg-slate-400",
      danger: "bg-rose-500",
      success: "bg-emerald-500",
    },
  },
  defaultVariants: {
    intent: "default",
  },
});