import { cva } from "class-variance-authority";

export const filterSelectVariants = cva(
  // Base styles (CSS dùng chung cho mọi biến thể)
  "outline-none font-bold cursor-pointer transition-all duration-200 focus:ring-2 focus:ring-offset-1 appearance-none w-full",
  {
    variants: {
      // 1. CÁC TÙY CHỌN MÀU SẮC / PHONG CÁCH
      variant: {
        default: "bg-white border border-slate-200 text-slate-600 hover:border-emerald-500 shadow-sm focus:ring-emerald-500/20",
        solid: "bg-slate-100 border border-transparent text-slate-700 hover:bg-slate-200 focus:ring-slate-400/20",
        ghost: "bg-transparent border border-transparent text-slate-600 hover:bg-slate-50 hover:text-slate-900 focus:ring-slate-200",
        emerald: "bg-emerald-50 border border-emerald-200 text-emerald-700 hover:bg-emerald-100 focus:ring-emerald-500/30",
        danger: "bg-rose-50 border border-rose-200 text-rose-700 hover:bg-rose-100 focus:ring-rose-500/30",
      },
      // 2. CÁC TÙY CHỌN KÍCH THƯỚC
      size: {
        sm: "h-8 px-3 text-xs rounded-xl",
        base: "h-10 px-3.5 text-sm rounded-xl",
        md: "h-11 px-4 text-sm rounded-2xl", // Size mặc định bạn đang dùng
        lg: "h-14 px-6 text-base rounded-[1.5rem]",
      },
    },
    // Giá trị mặc định nếu lúc gọi Component không truyền vào
    defaultVariants: {
      variant: "default",
      size: "md",
    },
  }
);