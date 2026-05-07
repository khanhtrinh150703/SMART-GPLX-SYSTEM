// src/features/exam-mgmt/components/manual-form/manual-exam-form.variants.ts
import { cva } from "class-variance-authority";

/**
 * @description Các lớp giao diện cho Container chính (Main Container Classes)
 */
export const formVariants = {
  container: "flex flex-col gap-8 h-full",
  gridWrapper: "grid grid-cols-1 md:grid-cols-4 gap-4 p-6 bg-slate-50 rounded-[2.5rem] border border-slate-100",
  fieldGroup: "flex flex-col gap-1.5",
  label: "text-[10px] font-black text-slate-400 uppercase tracking-widest px-1",
  input: "h-12 px-4 rounded-2xl border-none shadow-sm focus:ring-2 focus:ring-emerald-500 font-bold text-slate-700 transition-all",
  error: "text-[10px] text-rose-500 font-bold uppercase px-1 mt-1",
  footer: "flex items-center gap-4 pt-6 border-t border-slate-100"
};

/**
 * @description Biến thể nút bấm (Button Variants) sử dụng CVA
 */
export const actionButtonVariants = cva(
  "h-14 rounded-2xl font-black uppercase tracking-[0.2em] transition-all active:scale-95 disabled:opacity-50",
  {
    variants: {
      intent: {
        primary: "flex-[2] bg-emerald-600 text-white shadow-lg shadow-emerald-500/20 hover:bg-emerald-700",
        ghost: "flex-1 border border-slate-200 text-slate-500 hover:bg-slate-50",
      },
    },
    defaultVariants: {
      intent: "primary",
    },
  }
);