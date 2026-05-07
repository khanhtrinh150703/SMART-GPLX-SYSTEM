import { cva } from "class-variance-authority";

/**
 * navVariants: Container chính của phần điều hướng
 * Responsive: h-18 trên mobile, h-20 trên desktop. px-4 trên mobile, px-8 trên desktop.
 */
export const navVariants = cva(
  "h-18 lg:h-20 bg-white border-t border-slate-50 px-4 lg:px-8 flex items-center justify-between shrink-0 sticky bottom-0 z-30",
  {
    variants: {
      mode: {
        testing: "bg-white",
        review: "bg-white/95 backdrop-blur-sm",
      },
    },
    defaultVariants: {
      mode: "testing",
    },
  },
);

/**
 * nextButtonVariants: Logic styling cho nút "Tiếp theo"
 */
export const nextButtonVariants = cva(
  "flex items-center gap-2 px-4 lg:px-6 py-2.5 rounded-xl text-white text-sm font-bold transition-all duration-300 active:scale-95 disabled:opacity-30 disabled:hover:translate-y-0 disabled:hover:shadow-none",
  {
    variants: {
      isReview: {
        true: "bg-slate-800 hover:bg-slate-900 shadow-sm",
        false:
          "bg-emerald-500 hover:bg-emerald-600 shadow-md hover:-translate-y-0.5",
      },
    },
    defaultVariants: {
      isReview: false,
    },
  },
);
