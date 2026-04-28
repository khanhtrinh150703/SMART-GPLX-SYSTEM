import { cva } from "class-variance-authority";

/**
 * Hệ thống biến thể giao diện cho Thanh công cụ Sinh đề (Variants for Generation Toolbar).
 * Tuân thủ Emerald Design System với bo góc cực lớn và hiệu ứng kính mờ.
 */
export const examGenerationToolbarVariants = {
  // Container tổng bao ngoài (Root Wrapper) - Hiệu ứng trượt từ dưới lên để tạo cảm giác hiện đại
  root: cva([
    "flex flex-col w-full animate-in fade-in slide-in-from-bottom-4 duration-700"
  ]),

  // Nhóm Tabs phân loại ma trận (Stepped Top - Phần bậc thang phía trên)
  tabsContainer: cva([
    "flex items-center w-fit px-3 pt-2.5",
    "bg-white/40 backdrop-blur-2xl", // Hiệu ứng kính mờ mạnh (Strong Glassmorphism)
    "rounded-t-[2.5rem] border-t border-x border-white/60 shadow-sm"
  ]),

  // Nhóm Toolbar chính - Vùng hành động trọng tâm (Main Action Zone)
  mainToolbar: cva([
    "flex flex-col md:flex-row items-center gap-4 p-4",
    "bg-white/90 backdrop-blur-3xl", 
    "shadow-[0_20px_50px_rgba(5,150,105,0.05)]", // Đổ bóng mịn ánh xanh lục (Soft Emerald Shadow)
    "rounded-b-[3rem] rounded-tr-[3rem] border border-white/80"
  ]),

  // Nút Reset bộ lọc (Reset Button)
  resetButton: cva([
    "w-12 h-12 flex items-center justify-center shrink-0",
    "bg-slate-50 text-slate-400 border border-slate-100 rounded-2xl",
    "hover:bg-emerald-50 hover:text-emerald-600 hover:border-emerald-100", // Chuyển sang Emerald khi hover
    "active:scale-95 transition-all duration-300 group"
  ]),

  // Dropdown chọn trường lọc (Filter Select)
  filterSelect: cva([
    "h-12 rounded-2xl border-none bg-slate-100/60",
    "font-bold text-[11px] uppercase tracking-wider px-5",
    "min-w-[160px] focus-within:ring-2 focus-within:ring-emerald-500/20 transition-all"
  ]),

  // Phần hiển thị thống kê ma trận khả dụng (Stats Container)
  statsContainer: cva("mt-3 px-8 flex items-center gap-2"),

  // Văn bản số lượng (Stats Text)
  statsText: cva([
    "text-emerald-700/50 text-[10px] font-black uppercase tracking-[0.25em]",
    "flex items-center gap-2 before:w-1 before:h-1 before:bg-emerald-400 before:rounded-full"
  ])
};