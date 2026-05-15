import { cva } from "class-variance-authority";

/**
 * Container variants for Result Actions
 * Biến thể khung chứa cho các nút hành động kết quả
 */
export const actionContainerVariants = cva(
  "w-full max-w-md flex shrink-0 transition-all duration-300",
  {
    variants: {
      layout: {
        responsive: "flex-col md:flex-row gap-3 md:gap-4", // Mobile: 2 hàng (Column), Desktop: 1 hàng (Row)
      },
    },
    defaultVariants: {
      layout: "responsive",
    },
  }
);