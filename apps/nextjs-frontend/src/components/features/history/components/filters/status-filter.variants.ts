import { cva } from "class-variance-authority";

export const statusFilterVariants = cva(
  "relative flex items-center p-1 bg-slate-100/50 backdrop-blur-sm rounded-2xl border border-slate-200/50",
  {
    variants: {
      size: {
        default: "h-12",
        sm: "h-10",
      },
    },
    defaultVariants: {
      size: "default",
    },
  },
);

export const tabItemVariants = cva(
  "relative z-10 flex-1 px-4 h-full flex items-center justify-center text-[13px] font-black uppercase tracking-wider transition-colors duration-300 cursor-pointer whitespace-nowrap",
  {
    variants: {
      isActive: {
        true: "text-white",
        false: "text-slate-500 hover:text-slate-700",
      },
    },
    defaultVariants: {
      isActive: false,
    },
  },
);
