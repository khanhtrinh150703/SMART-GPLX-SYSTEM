import { cva } from "class-variance-authority";

/**
 * answerVariants: Quản lý styling cho khung câu trả lời
 */
export const answerVariants = cva(
  "w-full text-left p-5 lg:p-6 rounded-[1.5rem] font-bold transition-all duration-300 flex items-center justify-between border group relative overflow-hidden active:scale-[0.98]",
  {
    variants: {
      status: {
        // Trạng thái bình thường khi đang làm bài
        idle: "bg-white border-slate-200/60 hover:border-emerald-200 hover:bg-slate-50/50 text-slate-700 shadow-sm",

        // Trạng thái đang được chọn (trong lúc làm bài)
        selected:
          "bg-white border-emerald-500 text-emerald-900 shadow-[0_10px_25px_-5px_rgba(16,185,129,0.1)] scale-[1.01] z-10",

        // Chế độ Review: Hiển thị đáp án ĐÚNG
        correct:
          "bg-emerald-50/50 border-emerald-300 text-emerald-900 shadow-none ring-1 ring-emerald-100",

        // Chế độ Review: Hiển thị đáp án người dùng chọn SAI
        wrong: "bg-rose-50/50 border-rose-200 text-rose-900 shadow-none",

        disabled: "bg-transparent border-slate-100 text-slate-500",
      },
    },
    defaultVariants: {
      status: "idle",
    },
  },
);

/**
 * dotVariants: Quản lý styling cho vòng tròn chỉ số bên phải
 */
export const dotVariants = cva(
  "relative z-10 w-6 h-6 shrink-0 rounded-full border transition-all flex items-center justify-center",
  {
    variants: {
      status: {
        idle: "border-slate-200 bg-slate-50 group-hover:border-emerald-300",
        selected: "border-emerald-500 bg-emerald-500 text-white",
        correct: "border-emerald-400 bg-emerald-400 text-white",
        wrong: "border-rose-400 bg-rose-400 text-white",
        disabled: "border-slate-200 bg-slate-50 text-slate-500",
      },
    },
    defaultVariants: {
      status: "idle",
    },
  },
);
