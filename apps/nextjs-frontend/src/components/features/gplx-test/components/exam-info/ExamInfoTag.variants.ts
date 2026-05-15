import { cva, type VariantProps } from "class-variance-authority";

/**
 * Exam Tag Variants - Visual Hierarchy Optimization
 * Các biến thể nhãn thông tin - Tối ưu hóa phân cấp thị giác
 */
export const examTagVariants = cva(
  "flex items-center gap-2.5 backdrop-blur-md border rounded-2xl shadow-soft transition-all duration-300",
  {
    variants: {
      theme: {
        slate: "bg-white/70 border-slate-200 text-slate-700",
        emerald: "bg-emerald-50/80 border-emerald-200 text-emerald-700",
      },
      size: {
        md: "px-5 py-2.5 text-sm", // Size cũ
        lg: "px-6 py-3.5 text-base", // Size mới: Cao hơn, rộng hơn (Taller & Wider)
      },
    },
    defaultVariants: {
      theme: "slate",
      size: "lg", // Mặc định dùng size lớn cho Dashboard một trang
    },
  }
);

export type ExamTagVariantsProps = VariantProps<typeof examTagVariants>;