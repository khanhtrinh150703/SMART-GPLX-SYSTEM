import { cva } from "class-variance-authority";

export const historyToolbarVariants = {
  root: cva("flex flex-col w-full animate-in fade-in slide-in-from-top-4 duration-500 gap-0"),

  // Nhóm Tabs: Bo tròn mạnh phần đỉnh (3xl ~ 24px)
  tabsContainer: cva([
    "flex items-center w-fit px-5 py-2", 
    "bg-white/70 backdrop-blur-lg", 
    "rounded-t-[24px] border-t border-x border-white/80",
    "relative z-10 -mb-[1px]" 
  ]),

  // Nhóm Toolbar: Bo tròn đồng bộ với Tabs (3xl)
  mainToolbar: cva([
    "flex flex-col md:flex-row items-center gap-3 p-2.5", 
    "bg-white/90 backdrop-blur-xl shadow-[0_8px_30px_rgb(0,0,0,0.04)]", 
    "rounded-b-[24px] rounded-tr-[24px] border border-white",
    "w-full"
  ]),

  // Search Group: Bo tròn dạng viên thuốc (rounded-full) nhìn sẽ rất "mượt"
  searchGroup: cva([
    "flex flex-1 items-center h-11 bg-slate-50/50 rounded-full",
    "border border-slate-100/80 transition-all duration-200 px-1",
  ]),

  // Reset Button: Bo tròn hoàn toàn hoặc 2xl
  resetButton: cva([
    "w-11 h-11 flex items-center justify-center shrink-0", 
    "bg-white text-slate-400 border border-slate-100 rounded-full shadow-sm",
    "hover:text-emerald-600 hover:border-emerald-200 hover:bg-emerald-50 active:scale-95 transition-all group"
  ])
};