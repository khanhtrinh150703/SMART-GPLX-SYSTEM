import { cva } from "class-variance-authority";

/** 
 * Các biến thể giao diện cho thẻ bài thi và trạng thái.
 * (Interface variants for exam cards and status badges)
 */
export const historyVariants = cva(
  "transition-all duration-300 rounded-3xl border",
  {
    variants: {
      intent: {
        container: "bg-white/80 backdrop-blur-md border-slate-100 shadow-soft p-6",
        item: "bg-white border-transparent hover:border-emerald-200 hover:shadow-md active:scale-[0.99]",
      },
      status: {
        pass: "bg-emerald-50 text-emerald-600 border-emerald-100", // Đỗ (Passed)
        fail: "bg-rose-50 text-rose-600 border-rose-100",           // Trượt (Failed)
      }
    },
    defaultVariants: {
      intent: "container",
    }
  }
);