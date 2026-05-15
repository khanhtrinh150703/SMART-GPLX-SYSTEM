/**
 * src/features/gplx-test/components/exam-card.variants.ts
 * Hệ thống định nghĩa biến thể cho ExamCard (Thẻ bài thi)
 */
import { cva, type VariantProps } from "class-variance-authority";

export const cardVariants = cva(
  // h-fit: Thẻ chỉ cao bằng nội dung, không được dài thòng
  "group relative w-full h-fit bg-white transition-all duration-500 cursor-pointer border border-slate-100 flex flex-col justify-between overflow-hidden shadow-sm mx-auto",
  {
    variants: {
      state: {
        idle: "hover:border-emerald-500/30 hover:shadow-[0_24px_48px_-12px_rgba(16,185,129,0.15)]",
      },
      size: {
        // sm: Dành cho màn hình nhỏ, thẻ dẹt
        sm: "p-4 py-5 max-w-[380px] rounded-[32px] gap-3", 
        // md: Thẻ rộng ngang thực sự (Landscape)
        md: "p-6 py-6 max-w-[500px] rounded-[40px] gap-4", 
      },
    },
    defaultVariants: {
      state: "idle",
      size: "md",
    },
  }
);

/**
 * difficultyVariants: Biến thể màu sắc dựa trên độ khó (Difficulty Level)
 */
export const difficultyVariants = cva("text-[10px] font-black uppercase px-2 py-0.5 rounded-md", {
  variants: {
    level: {
      easy: "bg-emerald-50 text-emerald-600",
      medium: "bg-amber-50 text-amber-600",
      hard: "bg-rose-50 text-rose-600",
    },
  },
});

export type CardVariantsProps = VariantProps<typeof cardVariants>;