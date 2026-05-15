// src/components/common/status-select/status-select.variants.ts
import { cva } from "class-variance-authority";

export const statusSelectVariants = cva(
  "flex items-center justify-between w-full px-4 h-12 transition-all duration-300 rounded-2xl border-2 bg-white/50 backdrop-blur-xl",
  {
    variants: {
      intent: {
        primary: "border-slate-100 hover:border-emerald-200 focus:border-emerald-500",
        error: "border-rose-100 bg-rose-50/30 text-rose-600 hover:border-rose-300",
      },
    },
    defaultVariants: {
      intent: "primary",
    },
  }
);