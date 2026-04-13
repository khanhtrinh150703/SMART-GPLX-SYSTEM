import { cva } from "class-variance-authority";

/**
 * Select Variants (Biến thể của ô chọn)
 * Định nghĩa các trạng thái: Mặc định, Focus, Error
 */
export const selectVariants = cva(
  "w-full h-14 px-5 bg-white border-2 transition-all duration-300 outline-none appearance-none cursor-pointer",
  {
    variants: {
      status: {
        default: "border-slate-100 text-slate-700 hover:border-emerald-200 focus:border-emerald-500 focus:shadow-[0_0_15px_rgba(16,185,129,0.1)]",
        error: "border-rose-200 text-rose-500 focus:border-rose-500",
      },
      rounded: {
        xl: "rounded-2xl",
        "3xl": "rounded-[2rem]", // Phong cách Organic (Hữu cơ)
      }
    },
    defaultVariants: {
      status: "default",
      rounded: "3xl",
    },
  }
);