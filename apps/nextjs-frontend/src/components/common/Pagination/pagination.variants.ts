import { cva } from "class-variance-authority";

export const paginationButtonVariants = cva(
  "px-5 py-2.5 text-sm font-bold transition-all duration-200 active:scale-95 disabled:opacity-30 disabled:pointer-events-none flex items-center gap-2",
  {
    variants: {
      intent: {
        // Nút màu trắng mờ, hiện khung khi hover
        secondary: "bg-white/40 backdrop-blur-md text-slate-600 hover:bg-white hover:shadow-soft border border-white/60 rounded-2xl",
        // Nút nổi bật (Nếu cậu muốn dùng cho số trang)
        primary: "bg-emerald-600 text-white shadow-soft hover:bg-emerald-700 rounded-2xl",
      },
    },
    defaultVariants: {
      intent: "secondary",
    },
  }
);