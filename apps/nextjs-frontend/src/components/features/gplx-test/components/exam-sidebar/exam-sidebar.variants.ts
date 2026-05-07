import { cva } from "class-variance-authority";

/**
 * asideVariants: Quản lý styling cho khung Sidebar chính
 * Responsive: Mặc định ẩn trên mobile (translate-x-full), hiện khi mở (isMobileOpen: true)
 * Trên Desktop (lg): Luôn hiện, kích thước cố định 340px.
 */
export const asideVariants = cva(
  "fixed inset-y-0 right-0 z-50 flex flex-col shrink-0 overflow-hidden bg-white shadow-soft transition-transform duration-500 ease-in-out lg:relative lg:translate-x-0 lg:w-[340px] lg:rounded-3xl lg:border lg:border-slate-100",
  {
    variants: {
      isMobileOpen: {
        true: "translate-x-0 w-[85%] sm:w-[340px]", // Mở trên mobile
        false: "translate-x-full lg:translate-x-0", // Đóng trên mobile
      },
    },
    defaultVariants: {
      isMobileOpen: false,
    },
  }
);

/**
 * timerVariants: Hiển thị trạng thái màu sắc của bộ đếm thời gian
 */
export const timerVariants = cva(
  "text-[44px] font-black tabular-nums tracking-tighter transition-all duration-500 leading-none",
  {
    variants: {
      status: {
        review: "text-slate-300", // Chế độ xem lại (Review)
        low: "text-rose-500 drop-shadow-[0_0_15px_rgba(244,63,94,0.3)] animate-pulse", // Sắp hết giờ (Low time)
        normal: "text-emerald-700", // Bình thường
      },
    },
    defaultVariants: {
      status: "normal",
    },
  }
);