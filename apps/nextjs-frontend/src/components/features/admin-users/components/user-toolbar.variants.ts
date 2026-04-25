// src/features/user-management/components/user-toolbar.variants.ts
import { cva } from "class-variance-authority";

export const userToolbarVariants = {
  // Container tổng (Dịch: Root Wrapper)
  root: cva("flex flex-col w-full animate-in fade-in slide-in-from-top-4 duration-700"),

  // Nhóm Tabs phía trên - Phần ngắn của chữ L (Dịch: Stepped Top Container)
  tabsContainer: cva([
    "flex items-center w-fit px-2 pt-2",
    "bg-white/60 backdrop-blur-xl", // Hiệu ứng kính mờ
    "rounded-t-[2rem] border-t border-x border-white shadow-[-10px_-10px_30px_-15px_rgba(0,0,0,0.05)]"
  ]),

  // Nhóm Toolbar phía dưới - Phần dài của chữ L (Dịch: Stepped Bottom Container)
  mainToolbar: cva([
    "flex flex-col md:flex-row items-center gap-3 p-3",
    "bg-white/80 backdrop-blur-xl shadow-soft", // shadow-soft: Đổ bóng mịn
    "rounded-b-[2.5rem] rounded-tr-[2.5rem] border border-white"
  ]),

  // Nút Reset (Dịch: Refresh Filter Button)
  resetButton: cva([
    "w-12 h-12 flex items-center justify-center shrink-0",
    "bg-white text-slate-400 border border-slate-100 rounded-2xl",
    "hover:bg-rose-50 hover:text-rose-500 active:scale-90 transition-all group"
  ]),

  // Filter Select (Dịch: Search Field Dropdown)
  filterSelect: cva([
    "h-11 rounded-2xl border-none bg-slate-100/50",
    "font-bold text-[11px] uppercase tracking-tight px-4"
  ])
};