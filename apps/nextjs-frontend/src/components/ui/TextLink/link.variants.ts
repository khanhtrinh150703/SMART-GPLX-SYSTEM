// src/components/ui/link.variants.ts
import { cva } from "class-variance-authority";

export const linkVariants = cva(
  "transition-colors duration-200 font-semibold",
  {
    variants: {
      intent: {
        primary: "text-emerald-600 hover:text-emerald-700 hover:underline",
        secondary: "text-slate-500 hover:text-slate-700",
        danger: "text-rose-500 hover:text-rose-600",
      },
      size: {
        sm: "text-sm",
        md: "text-base",
      }
    },
    defaultVariants: {
      intent: "primary",
      size: "sm",
    },
  }
);