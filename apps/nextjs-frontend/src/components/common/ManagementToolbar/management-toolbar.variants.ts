import { cva, type VariantProps } from "class-variance-authority";

/**
 * Biến thể cho Ô nhập tìm kiếm (Search Input Variants).
 * Thiết kế không viền, bóng đổ cực nhẹ, hiện khung khi focus.
 */
export const searchInputVariants = cva(
  "pl-11 pr-4 py-2.5 rounded-2xl outline-none transition-all duration-300 w-64 md:w-80 text-sm font-medium",
  {
    variants: {
      variant: {
        ambient: "bg-slate-100/50 text-slate-700 focus:bg-white focus:shadow-[0_2px_10px_-3px_rgba(0,0,0,0.06)] focus:ring-4 focus:ring-emerald-500/5",
        solid: "bg-white border border-slate-200 focus:border-emerald-500",
      }
    },
    defaultVariants: {
      variant: "ambient",
    }
  }
);

/**
 * Biến thể cho Nút hành động (Action Button Variants).
 */
export const toolbarButtonVariants = cva(
  "flex items-center gap-2 px-5 py-2.5 rounded-2xl font-bold text-sm transition-all duration-200 active:scale-[0.96] disabled:opacity-70",
  {
    variants: {
      intent: {
        // Nút chính (Primary): Màu Emerald dịu
        primary: "bg-emerald-600 hover:bg-emerald-700 text-white shadow-sm hover:shadow-md",
        // Nút phụ (Secondary): Hiện khung mờ khi rê chuột (Hover frame)
        secondary: "bg-transparent text-slate-500 hover:bg-white/80 hover:text-slate-800 hover:shadow-[0_2px_8px_-2px_rgba(0,0,0,0.05)]",
      },
      size: {
        sm: "px-4 py-2 text-xs",
        md: "px-5 py-2.5 text-sm",
      }
    },
    defaultVariants: {
      intent: "primary",
      size: "md",
    }
  }
);

export type ToolbarButtonProps = VariantProps<typeof toolbarButtonVariants>;