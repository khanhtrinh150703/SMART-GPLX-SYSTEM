import { cva, type VariantProps } from "class-variance-authority";

export const aiPreviewVariants = cva(
  "mt-20 rounded-[2.5rem] p-1.5 shadow-2xl overflow-hidden relative group border",
  {
    variants: {
      theme: {
        emerald: "bg-[#0f172a] border-slate-800 shadow-emerald-900/20",
        blue: "bg-[#0f172a] border-slate-800 shadow-blue-900/20",
        rose: "bg-[#1a0f0f] border-rose-900/30 shadow-rose-900/20",
      }
    },
    defaultVariants: {
      theme: "emerald"
    }
  }
);

export const scanLineVariants = cva(
  "absolute top-0 left-0 w-full h-[2px] z-10 shadow-[0_0_20px_2px]",
  {
    variants: {
      theme: {
        emerald: "bg-emerald-500/50 shadow-emerald-500",
        blue: "bg-blue-500/50 shadow-blue-500",
        rose: "bg-rose-500/50 shadow-rose-500",
      }
    },
    defaultVariants: {
      theme: "emerald"
    }
  }
);

export type AiPreviewVariants = VariantProps<typeof aiPreviewVariants>;