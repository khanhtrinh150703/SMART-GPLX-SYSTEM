// src/features/gplx-test/components/exam-room.variants.ts
import { cva } from "class-variance-authority";

/**
 * timerVariants: Định nghĩa phong cách cho cụm đồng hồ.
 * Glassmorphism (Kính mờ), Glow (Phát sáng).
 */
export const timerVariants = cva(
  "flex items-center gap-4 px-6 py-2 rounded-2xl border transition-all duration-500",
  {
    variants: {
      status: {
        normal: "bg-emerald-50/50 border-emerald-100 text-emerald-900 shadow-sm",
        warning: "bg-rose-50/50 border-rose-100 text-rose-600 shadow-rose-100 shadow-lg animate-pulse",
      },
    },
    defaultVariants: {
      status: "normal",
    },
  }
);