import { cva } from "class-variance-authority";

/**
 * CVA Variant - Quản lý phong cách tập trung
 * Separation of Concerns: Tách biệt logic hiển thị khỏi logic xử lý.
 */
export const buttonVariants = cva(
  // Base: Thêm rounded-2xl cho đúng chuẩn Emerald Theme
  "inline-flex items-center justify-center gap-2 rounded-2xl font-bold transition-all shadow-soft disabled:opacity-60 disabled:cursor-not-allowed active:scale-[0.97] whitespace-nowrap",
  {
    variants: {
      variant: {
        // OPTION 1: Soft Emerald - Nhẹ nhàng, không bị chọi màu
        // Nút chính: Có chiều sâu và điểm nhấn (Emphasis)
       highlight: "bg-emerald-50 text-emerald-700 hover:bg-emerald-600 hover:text-white hover:shadow-[0_10px_20px_-5px_rgba(16,185,129,0.3)] shadow-[0_4px_12px_rgba(16,185,129,0.08)] transition-all duration-300",

        // OPTION 2: Glassmorphism - Cảm giác công nghệ cao (Premium)
        glass: "bg-white/40 backdrop-blur-md border border-emerald-500/20 text-emerald-600 hover:bg-emerald-500/10 shadow-none",
        // Màu đặc (Solid)
        primary: "bg-emerald-600 text-white hover:bg-emerald-700 shadow-emerald-500/20",
        secondary: "bg-slate-100 text-slate-900 hover:bg-slate-200",
        // Viền (Outline) - Dùng cho Header để tránh "lạc quẻ"
        outline: "border-2 border-emerald-600 text-emerald-600 hover:bg-emerald-50 shadow-none",
        // Trong suốt (Ghost)
        ghost: "bg-transparent text-slate-500 hover:bg-slate-100 hover:text-slate-800 shadow-none",
        // Nguy hiểm (Danger)
        danger: "bg-transparent text-slate-500 hover:bg-rose-50 hover:text-rose-600 shadow-none",

        ghost_danger: "bg-transparent text-slate-500 hover:bg-rose-50 hover:text-rose-600 shadow-none",
      },
      size: {
        // Dùng Height (h-) để đảm bảo đồng nhất với các UI khác (Input, Select)
        sm: "h-9 px-4 text-xs",
        md: "h-11 px-6 text-sm",
        lg: "h-14 px-8 text-base",
        profile: "h-12 min-w-[200px] px-6 text-base",
      },
      // Thêm variant riêng cho việc chiếm toàn bộ chiều ngang
      fullWidth: {
        true: "w-full",
        false: "",
      },
    },
    defaultVariants: {
      variant: "primary",
      size: "md",
      fullWidth: false,
    },
  }
);