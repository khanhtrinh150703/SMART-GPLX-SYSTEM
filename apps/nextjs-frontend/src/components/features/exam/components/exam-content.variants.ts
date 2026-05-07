// src/features/exam-mgmt/components/exam-content.variants.ts
import { cva } from "class-variance-authority";

/**
 * @description Các biến thể giao diện cho bộ khung quản lý (Management Layout Variants)
 */
export const containerVariants = cva("flex flex-col gap-8 w-full animate-in fade-in duration-700");

export const toolbarVariants = cva(
  "flex items-center gap-4 bg-white/80 backdrop-blur-md p-3 rounded-[2rem] shadow-soft border border-slate-100"
);

export const actionButtonVariants = cva(
  "h-12 rounded-2xl font-bold text-[13px] uppercase tracking-wide transition-all active:scale-95 flex items-center gap-2",
  {
    variants: {
      intent: {
        manual: "px-6 border-slate-200 text-slate-600 hover:border-emerald-200 hover:text-emerald-600 border",
        auto: "px-8 bg-emerald-600 hover:bg-emerald-700 text-white shadow-lg shadow-emerald-500/20",
      },
    },
    defaultVariants: {
      intent: "manual",
    },
  }
);