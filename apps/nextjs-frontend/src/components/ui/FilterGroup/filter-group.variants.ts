import { cva } from "class-variance-authority";

/**
 * @description Variants for the FilterGroup component.
 * (Các biến thể cho component FilterGroup.)
 */
export const filterGroupVariants = cva("flex flex-col", {
  variants: {
    layout: {
      vertical: "gap-3",
      horizontal: "flex-row items-center gap-4",
    },
    spacing: {
      sm: "mb-4",
      md: "mb-6",
      lg: "mb-8",
    },
  },
  defaultVariants: {
    layout: "vertical",
    spacing: "md",
  },
});

export const labelVariants = cva(
  "text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] select-none",
  {
    variants: {
      intent: {
        default: "text-slate-400",
        primary: "text-emerald-600",
      },
    },
    defaultVariants: {
      intent: "default",
    },
  }
);