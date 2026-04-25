// src/features/question/components/question-toolbar.variants.ts
import { cva } from "class-variance-authority";

export const questionToolbarVariants = {
  // Container tổng (Root Wrapper)
  root: cva("flex flex-col w-full animate-in fade-in slide-in-from-top-4 duration-700"),

  // Nhóm Tabs phía trên (L-Top)
  tabsContainer: cva([
    "flex items-center w-fit px-2 pt-2",
    "bg-white/60 backdrop-blur-xl",
    "rounded-t-[2.5rem] border-t border-x border-white shadow-[-10px_-10px_30px_-15px_rgba(0,0,0,0.05)]"
  ]),

  // Nhóm Toolbar chính phía dưới (L-Bottom)
  mainToolbar: cva([
    "flex flex-col md:flex-row items-center gap-4 p-3",
    "bg-white/80 backdrop-blur-xl shadow-soft",
    "rounded-b-[2.5rem] rounded-tr-[2.5rem] border border-white"
  ]),

  // Nút Toggle lọc nâng cao (Dịch: Advanced Filter Toggle)
  filterButton: cva([
    "h-12 px-6 rounded-2xl flex items-center gap-2 transition-all shrink-0 font-bold text-[13px] uppercase tracking-wide",
    "border-2 shadow-sm active:scale-95"
  ]),

  // Nút Reset chuẩn vuông (Dịch: Global Reset)
  resetButton: cva([
    "w-12 h-12 flex items-center justify-center shrink-0",
    "bg-white text-slate-400 border border-slate-100 rounded-2xl",
    "hover:bg-rose-50 hover:text-rose-500 active:scale-90 transition-all group"
  ])
};