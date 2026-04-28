import { cva } from "class-variance-authority";

export const inputVariants = cva(
  "w-full h-11 px-6 rounded-2xl border-2 bg-slate-50/50 transition-all outline-none font-bold text-slate-700",
  {
    variants: {
      status: {
        default: "border-transparent focus:border-emerald-500 focus:bg-white",
        error: "border-rose-500 bg-rose-50/10 focus:bg-white",
      },
    },
    defaultVariants: {
      status: "default",
    },
  }
);