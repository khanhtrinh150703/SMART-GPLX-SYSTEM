// src/features/exam-mgmt/components/manual-form/question-orchestrator.variants.ts
import { cva } from "class-variance-authority";

/**
 * @description Các hằng số Tailwind cho bố cục tổng thể (Layout Constants)
 */
export const orchestratorStyles = {
  wrapper: "grid grid-cols-12 gap-8 h-[750px] bg-white p-6 rounded-[2.5rem] border border-slate-100 shadow-soft",
  
  // Cột trái (Pool Table)
  poolSection: "col-span-7 flex flex-col gap-4 border-r border-slate-100 pr-6 overflow-hidden",
  poolHeader: "font-black text-slate-900 uppercase text-xs tracking-[0.2em]",
  tableWrapper: "flex-1 overflow-y-auto rounded-3xl bg-slate-50/50 border border-slate-100 custom-scrollbar",
  thead: "sticky top-0 bg-white/80 backdrop-blur-md shadow-sm z-10",
  th: "p-5 text-left text-slate-400 font-bold uppercase text-[10px] tracking-widest",
  
  // Cột phải (Review Panel)
  reviewSection: "col-span-5 flex flex-col gap-6 overflow-hidden",
  validationBar: "sticky top-0 z-20 bg-slate-900 rounded-3xl p-5 text-white flex justify-between items-center shadow-lg shadow-slate-200",
  reviewList: "flex-1 overflow-y-auto pr-2 flex flex-col gap-8 custom-scrollbar",
  
  // Thẻ câu hỏi (Question Card)
  itemCard: "group bg-white border border-slate-100 p-4 rounded-2xl shadow-sm flex items-center gap-4 hover:border-emerald-200 transition-colors",
};

/**
 * @description Biến thể cho Checkbox (Checkbox Variants)
 */
export const checkboxVariants = cva(
  "w-6 h-6 rounded-lg border-2 flex items-center justify-center transition-all",
  {
    variants: {
      selected: {
        true: "bg-emerald-500 border-emerald-500 text-white",
        false: "border-slate-200 bg-white",
      },
    },
    defaultVariants: {
      selected: false,
    },
  }
);