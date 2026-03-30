// src/components/ui/error-message.variants.ts
import { cva } from "class-variance-authority";

export const errorVariants = cva(
  "text-sm font-semibold text-center transition-all",
  {
    variants: {
      intent: {
        pulse: "text-rose-600 animate-pulse", // 💡 Đỏ rực và nhấp nháy
        static: "text-rose-500",               // 💡 Đỏ thường, không nháy
        warning: "text-amber-600",             // 💡 Màu cảnh báo cam
      },
    },
    defaultVariants: {
      intent: "pulse",
    },
  }
);