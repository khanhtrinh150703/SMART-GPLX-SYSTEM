// src/components/ui/profile/profile.variants.ts
import { cva } from "class-variance-authority";

export const profileSidebarVariants = cva(
  "w-full p-8 bg-slate-50/50 rounded-[3rem] border border-slate-100 flex flex-col items-center space-y-4 transition-all duration-300",
  {
    variants: {
      status: {
        active: "hover:shadow-emerald-100/50 hover:border-emerald-100",
        inactive: "opacity-75 grayscale-[0.5]",
      },
    },
    defaultVariants: {
      status: "active",
    },
  }
);