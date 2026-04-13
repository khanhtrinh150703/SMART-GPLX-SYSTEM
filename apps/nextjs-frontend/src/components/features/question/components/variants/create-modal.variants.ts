// src/features/question/components/create-modal.variants.ts
import { cva } from "class-variance-authority";

export const createModalVariants = {
  // Container chính của Form
  form: cva("grid grid-cols-12 gap-6 lg:gap-10 py-2"),

  // Cột trái: Cấu hình câu hỏi
  leftCol: cva("col-span-12 lg:col-span-7 space-y-8"),

  // Cột phải: Đáp án và ảnh
  rightCol: cva("col-span-12 lg:col-span-5 space-y-8"),

  // Input wrapper (Dịch: Lớp bọc ô nhập liệu)
  inputGroup: cva("space-y-3"),

  // Nhãn (Dịch: Field Label)
  label: cva("text-xs font-black text-slate-500 uppercase tracking-[0.15em] flex items-center gap-2"),

  // Ô nhập văn bản (Dịch: Text Area & Select Style)
  inputField: cva([
    "w-full rounded-[1.5rem] border border-slate-200 bg-slate-50/50 outline-none transition-all",
    "focus:bg-white focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-500/50 font-medium"
  ]),

  // Khu vực cuộn đáp án (Dịch: Scrollable Answer Area)
  answerScroll: cva("space-y-4 max-h-[500px] overflow-y-auto pr-3 custom-scrollbar")
};