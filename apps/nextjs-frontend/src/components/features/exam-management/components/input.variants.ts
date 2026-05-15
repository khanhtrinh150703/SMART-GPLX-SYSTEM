import { cva } from "class-variance-authority";

/**
 * Cấu hình các biến thể cho Input (Input Variants Configuration)
 * Giúp quản lý trạng thái hiển thị tập trung, tránh viết Tailwind quá dài trong JSX.
 */
export const inputVariantForms = cva(
  "w-full h-10 px-4 rounded-xl text-sm font-medium transition-all outline-none border-none ring-offset-2",
  {
    variants: {
      intent: {
        primary: "bg-slate-100/50 text-slate-700 focus:bg-white focus:ring-2 focus:ring-emerald-500/20 placeholder:text-slate-400 hover:bg-slate-100",
        error: "bg-rose-50 text-rose-600 ring-1 ring-rose-500/20 focus:ring-rose-500/30",
      },
      isDisabled: {
        true: "opacity-60 cursor-not-allowed bg-slate-100 text-slate-400",
        false: "",
      },
    },
    defaultVariants: {
      intent: "primary",
      isDisabled: false,
    },
  }
);