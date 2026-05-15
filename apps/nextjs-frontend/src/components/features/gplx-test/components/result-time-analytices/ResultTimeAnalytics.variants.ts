import { cva } from "class-variance-authority";

/**
 * Time Card Variants - Emerald System Design
 * Các biến thể của thẻ thời gian theo hệ thống thiết kế Emerald
 */
export const timeCardVariants = cva(
  "flex items-center gap-4 p-5 backdrop-blur-md border rounded-3xl transition-all duration-300 hover:shadow-md",
  {
    variants: {
      type: {
        spent: "bg-white/70 border-emerald-100/50 text-slate-800",
        remaining: "bg-white/70 border-blue-100/50 text-slate-800",
      },
    },
    defaultVariants: {
      type: "spent",
    },
  }
);

/**
 * Icon Wrapper Variants
 * Các biến thể cho khung bọc biểu tượng
 */
export const iconWrapperVariants = cva(
  "p-3 rounded-2xl transition-colors duration-300",
  {
    variants: {
      type: {
        spent: "bg-emerald-50 text-emerald-600 group-hover:bg-emerald-100",
        remaining: "bg-blue-50 text-blue-500 group-hover:bg-blue-100",
      },
    },
  }
);