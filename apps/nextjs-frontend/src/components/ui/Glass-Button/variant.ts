import { cva, type VariantProps } from "class-variance-authority";

/**
 * Glass Back Button Variants - Compact & Centered
 * Các biến thể của nút quay lại - Nhỏ gọn & Cân bằng
 */
export const glassBackVariants = cva(
  "group flex items-center justify-center backdrop-blur-md transition-all duration-300 active:scale-[0.97] rounded-2xl border shadow-sm",
  {
    variants: {
      theme: {
        emerald: "bg-emerald-50/40 border-emerald-200/20 text-emerald-700 hover:bg-emerald-50/70",
        slate: "bg-white/40 border-slate-200/50 text-slate-500 hover:bg-white/80 hover:text-slate-900",
      },
      size: {
        // Thu nhỏ px để nút không bị dài quá (Shrink horizontal padding)
        sm: "px-4 py-1.5 text-xs gap-2",
        md: "px-6 py-2.5 text-[13px] gap-2.5", 
        lg: "px-8 py-3 text-base gap-3",
      },
    },
    defaultVariants: {
      theme: "slate",
      size: "md",
    },
  }
);

export type GlassBackButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & 
  VariantProps<typeof glassBackVariants>;