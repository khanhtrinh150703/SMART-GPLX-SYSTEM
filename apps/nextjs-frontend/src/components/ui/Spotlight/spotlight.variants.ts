import { cva } from "class-variance-authority";

export const spotlightVariants = cva(
  "relative overflow-hidden rounded-[2rem] border border-slate-200 bg-white/80 backdrop-blur-sm transition-shadow duration-500 hover:shadow-2xl hover:shadow-emerald-500/10",
  {
    variants: {
      size: {
        default: "w-full h-full",
        fit: "w-fit h-fit",
      },
    },
    defaultVariants: {
      size: "default",
    },
  }
);