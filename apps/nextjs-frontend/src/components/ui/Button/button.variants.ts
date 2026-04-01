// src/components/ui/button.variants.ts
import { cva } from "class-variance-authority";

export const buttonVariants = cva(
  // 1. Base Styles: Nút nào cũng phải có (Flex, căn giữa, bo góc, transition)
  "inline-flex items-center justify-center gap-2 rounded-xl font-semibold transition-all shadow-soft disabled:opacity-60 disabled:cursor-not-allowed active:scale-95 whitespace-nowrap",
  {
    variants: {
      variant: {
        primary: "bg-emerald-600 text-white hover:bg-emerald-700 shadow-emerald-500/20",
        secondary: "bg-slate-100 text-slate-900 hover:bg-slate-200",
        outline: "border-2 border-emerald-600 text-emerald-600 hover:bg-emerald-50",
        ghost: "bg-transparent text-slate-500 hover:bg-slate-100 hover:text-slate-800 shadow-none",
        ghost_danger: "bg-transparent text-slate-500 hover:bg-rose-50 hover:text-rose-600 shadow-none",
      },
      size: {
        sm: "px-4 py-2 text-xs",
        md: "px-6 py-3 text-sm",
        lg: "w-full py-3.5 text-base", // Dùng cho nút full-width của cậu
        profile: "min-w-[200px] py-3 text-base",
      },
    },
    defaultVariants: {
      variant: "primary",
      size: "md",
    },
  }
);