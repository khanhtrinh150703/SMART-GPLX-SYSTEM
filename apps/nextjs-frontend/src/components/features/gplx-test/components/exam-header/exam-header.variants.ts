import { cva } from "class-variance-authority";

/**
 * headerVariants: Quản lý giao diện Header dựa trên chế độ thi/xem lại
 * Responsive: h-14 trên mobile, h-16 trên desktop. px-4 trên mobile, px-8 trên desktop.
 */
export const headerVariants = cva(
  "h-14 lg:h-16 px-4 lg:px-8 flex items-center justify-between border-b shrink-0 backdrop-blur-md z-10 transition-all sticky top-0",
  {
    variants: {
      mode: {
        testing: "border-slate-50 bg-white/80",
        review: "border-amber-100 bg-amber-50/30",
      },
    },
    defaultVariants: {
      mode: "testing",
    },
  }
);

/**
 * indicatorVariants: Quản lý badge hiển thị số thứ tự câu hỏi
 */
export const indicatorVariants = cva(
  "text-xs lg:text-sm font-black px-3 lg:px-4 py-1 lg:py-1.5 rounded-full border tabular-nums transition-all",
  {
    variants: {
      mode: {
        testing: "text-emerald-600 bg-emerald-50/80 border-emerald-100/50",
        review: "text-amber-600 bg-amber-50 border-amber-200",
      },
    },
    defaultVariants: {
      mode: "testing",
    },
  }
);