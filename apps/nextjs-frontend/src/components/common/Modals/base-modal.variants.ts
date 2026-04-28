// src/components/common/Modals/base-modal.variants.ts
import { cva } from "class-variance-authority";

export const baseModalVariants = {
  // Lớp phủ nền mờ (Dịch: Overlay Backdrop)
  overlay: cva(
    "fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-300"
  ),

  // Khung Modal chính (Dịch: Main Modal Container)
  // Thêm max-h-[95vh] và flex-col để tránh tràn màn hình
  contentWrapper: cva(
    "bg-white w-full rounded-[2rem] shadow-2xl border border-slate-100 flex flex-col overflow-hidden animate-in zoom-in-95 slide-in-from-bottom-4 duration-300 max-h-[95vh]",
    {
      variants: {
        maxWidth: {
          sm: "max-w-sm",
          md: "max-w-md",
          lg: "max-w-lg",
          xl: "max-w-xl",
          "2xl": "max-w-2xl",
          "3xl": "max-w-3xl",
          "4xl": "max-w-4xl",
          "5xl": "max-w-5xl",
          "6xl": "max-w-6xl", // Bổ sung size 6xl
          "7xl": "max-w-7xl", // Bổ sung size 7xl cho Form khổng lồ
        },
      },
      defaultVariants: {
        maxWidth: "lg",
      },
    }
  ),

  // Phần đầu trang (Dịch: Modal Header)
  header: cva(
    "px-6 py-5 md:px-8 md:py-6 border-b border-slate-100 flex justify-between items-center bg-gradient-to-r from-slate-50 to-white shrink-0"
  ),

  // Cụm tiêu đề (Dịch: Title Group)
  titleGroup: cva("flex items-center gap-3"),
  
  // Vùng chứa Icon (Dịch: Icon Wrapper)
  iconWrapper: cva("p-2.5 bg-emerald-100 text-emerald-600 rounded-2xl shrink-0"),

  // Tiêu đề chính (Dịch: Main Title)
  titleText: cva("text-xl font-extrabold text-slate-800"),

  // Mô tả (Dịch: Description Text)
  descText: cva("text-xs text-slate-500 font-medium mt-0.5"),

  // Nút đóng (Dịch: Close Button)
  closeButton: cva(
    "p-2 hover:bg-rose-50 rounded-full text-slate-400 hover:text-rose-500 transition-all shrink-0 active:scale-90"
  ),

  // Phần thân (Dịch: Modal Body)
  body: cva("p-6 md:p-8 flex-1 overflow-y-auto custom-scrollbar"),
};