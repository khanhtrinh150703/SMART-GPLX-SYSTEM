import { cva } from "class-variance-authority";

// Centralized style configuration for Question Forms
// (Cấu hình phong cách tập trung cho các biểu mẫu Câu hỏi)
export const questionFormVariants = {
  // Bố cục chính (Main layout)
  form: "grid grid-cols-12 gap-8",
  leftCol: "col-span-12 lg:col-span-7 space-y-8 flex flex-col",
  rightCol: "col-span-12 lg:col-span-5 space-y-8 flex flex-col",
  
  // Nhóm nhập liệu (Input groups)
  inputGroup: "space-y-2.5 flex flex-col",
  label: "flex items-center gap-2 text-[13px] font-black text-slate-700 uppercase tracking-tight ml-1",
  inputField: "w-full rounded-[2rem] border-2 border-slate-100 bg-white focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/5 outline-none transition-all placeholder:text-slate-300 font-semibold text-slate-700",
  
  // Vùng cuộn đáp án (Answer scrollable area)
  answerScroll: "space-y-4 max-h-[400px] overflow-y-auto custom-scrollbar pr-2",

  // Biến thể thẻ đáp án (Answer card variants)
  answerCard: cva(
    "p-5 rounded-[2rem] border-2 transition-all space-y-4",
    {
      variants: {
        status: {
          normal: "border-slate-100 bg-white",
          correct: "border-emerald-500 bg-emerald-50/20",
          error: "border-rose-500 bg-rose-50/20",
        },
      },
      defaultVariants: {
        status: "normal",
      },
    }
  ),

  // Nút chọn đáp án đúng (Check button variants)
  checkButton: cva(
    "w-10 h-10 rounded-2xl flex items-center justify-center shrink-0 font-black transition-all",
    {
      variants: {
        isActive: {
          true: "bg-emerald-500 text-white shadow-lg",
          false: "bg-slate-100 text-slate-400 hover:bg-slate-200",
        },
      },
      defaultVariants: {
        isActive: false,
      },
    }
  ),
};