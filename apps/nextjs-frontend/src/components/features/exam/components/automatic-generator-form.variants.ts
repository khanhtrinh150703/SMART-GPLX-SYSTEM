import { cva } from "class-variance-authority";

/**
 * Hệ thống biến thể giao diện cho Form sinh đề (Variants for Generation Form).
 * Tập trung vào trải nghiệm nhập liệu mượt mà và trực quan.
 */
export const generatorFormVariants = {
  // Container bao ngoài của form (Form Wrapper)
  root: cva("flex flex-col gap-8 w-full"),

  // Nhóm các trường nhập liệu (Field Group)
  fieldGroup: cva("flex flex-col gap-2.5"),

  // Nhãn của trường (Label)
  label: cva("text-xs font-black uppercase tracking-[0.15em] text-slate-500 ml-1"),

  // Ô nhập liệu và Chọn (Input & Select)
  input: cva([
    "w-full h-14 px-5 rounded-2xl bg-slate-50 border border-slate-100",
    "text-slate-900 font-medium placeholder:text-slate-400",
    "focus:bg-white focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-500/50",
    "transition-all duration-300 outline-none"
  ]),

  // Khu vực thông báo lỗi (Error Message)
  error: cva("text-rose-500 text-[11px] font-bold ml-1 animate-in slide-in-from-top-1"),

  // Chân trang chứa nút hành động (Footer Actions)
  footer: cva("flex items-center justify-end gap-3 pt-6 border-t border-slate-100"),

  // Biến thể cho thẻ hiển thị thông tin ma trận (Matrix Info Card)
  infoCard: cva([
    "p-4 rounded-2xl bg-emerald-50/50 border border-emerald-100/50",
    "flex items-start gap-3 transition-colors"
  ])
};