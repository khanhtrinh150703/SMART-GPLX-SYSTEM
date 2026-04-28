import { cva } from "class-variance-authority";

export const examMatrixToolbarVariants = {
  // Container tổng bao ngoài (Root Wrapper)
  root: cva("flex flex-col w-full animate-in fade-in slide-in-from-top-4 duration-700"),

  // Nhóm Tabs (Phần ngắn phía trên - Stepped Top)
  tabsContainer: cva([
    "flex items-center w-fit px-2 pt-2",
    "bg-white/60 backdrop-blur-xl", // Hiệu ứng kính mờ (Glassmorphism)
    "rounded-t-[2rem] border-t border-x border-white"
  ]),

  // Nhóm Toolbar chính (Phần dài phía dưới - Stepped Bottom)
  mainToolbar: cva([
    "flex flex-col md:flex-row items-center gap-3 p-3",
    "bg-white/80 backdrop-blur-xl shadow-soft", // shadow-soft: Đổ bóng mịn
    "rounded-b-[2.5rem] rounded-tr-[2.5rem] border border-white"
  ]),

  // Nút Reset (Reset Button)
  resetButton: cva([
    "w-12 h-12 flex items-center justify-center shrink-0",
    "bg-white text-slate-400 border border-slate-100 rounded-2xl",
    "hover:bg-rose-50 hover:text-rose-500 active:scale-90 transition-all group"
  ]),

  // Filter Select (Dropdown bộ lọc)
  filterSelect: cva([
    "h-11 rounded-2xl border-none bg-slate-100/50",
    "font-bold text-[11px] uppercase tracking-tight px-4",
    "w-10", // Thêm dòng này: Chiều rộng khoảng 208px
    "min-w-[130px]" // Đảm bảo chiều rộng tối thiểu không bị co lại
  ]),
  // Phần hiển thị số lượng (Stats Container)
  statsContainer: cva("mt-2 px-6"),

  // Văn bản số lượng (Stats Text)
  statsText: cva("text-slate-400 text-[10px] font-black uppercase tracking-[0.2em]")
};