// src/components/ui/input.variants.ts
import { cva } from "class-variance-authority";

export const inputVariants = cva(
  // 1. Base Styles: Những gì mà Input nào cũng phải có
  "w-full px-5 py-4 outline-none transition-all rounded-2xl font-medium placeholder:text-slate-400 border",
  {
    variants: {
      intent: {
        default: "bg-slate-50 text-slate-800 border-slate-200 focus:bg-white focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-500",
        error: "bg-rose-50/30 text-slate-800 border-rose-500 focus:ring-4 focus:ring-rose-500/10",
      },
      status: {
        active: "cursor-text",
        disabled: "bg-slate-100 text-slate-500 cursor-not-allowed border-slate-200 select-none",
      }
    },
    defaultVariants: {
      intent: "default",
      status: "active",
    },
  }
);

// Biến cho Label (cho đồng bộ)
export const labelStyles = "text-sm font-bold text-slate-700 ml-1 italic mb-2 block";
// Biến cho Error Message
export const errorStyles = "text-rose-500 text-xs font-bold mt-1 ml-1 animate-in fade-in slide-in-from-top-1";