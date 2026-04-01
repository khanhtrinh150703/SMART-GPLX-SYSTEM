// src/components/ui/typography.variants.ts
import { cva } from "class-variance-authority";

export const headingVariants = cva(
  "text-slate-800 tracking-tight",
  {
    variants: {
      intent: {
        h1: "text-3xl font-black md:text-4xl",
        h2: "text-2xl font-extrabold md:text-3xl", // Tiêu đề cậu đang dùng
        h3: "text-xl font-bold",
      },
    },
    defaultVariants: {
      intent: "h2",
    },
  }
);

export const textVariants = cva(
  "font-medium transition-colors",
  {
    variants: {
      intent: {
        description: "text-slate-500 mt-3", // Đoạn mô tả màu xám nhẹ
        error: "text-rose-500 text-sm",
        label: "text-slate-700 text-sm font-bold italic",
      },
    },
    defaultVariants: {
      intent: "description",
    },
  }
);