import { cva } from "class-variance-authority";

// Biến nút to thành một cái Badge nhỏ gọn, tinh xảo
export const toggleBadgeVariants = cva(
  "inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-[13px] font-bold transition-all active:scale-95 border",
  {
    variants: {
      isOpen: {
        true: "bg-amber-50 text-amber-700 border-amber-200 shadow-inner",
        false: "bg-white text-slate-500 border-slate-200 hover:border-amber-300 hover:text-amber-600 hover:bg-amber-50/30 shadow-sm",
      },
    },
    defaultVariants: {
      isOpen: false,
    },
  }
);

// Khối nội dung giống một tờ giấy ghi chú (Hint Note) thay vì một khối Block nặng nề
export const contentBoxVariants = cva(
  "w-full p-4 lg:p-5 bg-gradient-to-br from-amber-50/40 to-white border border-amber-200/60 rounded-[1.25rem] shadow-sm relative overflow-hidden"
);