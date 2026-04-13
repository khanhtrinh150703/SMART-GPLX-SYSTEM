import { cva } from "class-variance-authority";

export const toolbarVariants = {
  // Container chính: Kính mờ, bo góc lớn, cân bằng khoảng cách
  wrapper: cva([
    "flex flex-col lg:flex-row justify-between items-center gap-4",
    "bg-white/40 backdrop-blur-md p-4 rounded-[2.5rem] border border-white/60 shadow-soft"
  ]),

  // Nhóm bên phải: Chứa Reset, Filter và Search
  actionGroup: cva("flex flex-1 items-center justify-end gap-3 w-full"),

  // Nút Reset: Tinh tế hơn, không quá "cứng"
  resetBtn: cva([
    "p-3 bg-white hover:bg-rose-50 text-slate-400 hover:text-rose-50",
    "rounded-2xl border border-white shadow-sm transition-all",
    "active:scale-90 active:bg-rose-100 group"
  ])
};