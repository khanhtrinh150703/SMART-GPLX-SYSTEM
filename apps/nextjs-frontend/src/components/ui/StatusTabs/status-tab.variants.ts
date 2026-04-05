import { cva, type VariantProps } from "class-variance-authority";

/**
 * Biến thể cho khung chứa (Container Variants).
 */
export const statusTabsContainerVariants = cva(
  "flex gap-1.5 p-1 bg-slate-100/50 w-fit transition-all duration-300",
  {
    variants: {
      size: {
        sm: "rounded-xl",
        md: "rounded-2xl", 
        lg: "rounded-[1.75rem]",
      },
      shape: {
        rounded: "",
        full: "rounded-full",
      },
    },
    defaultVariants: {
      size: "md",
      shape: "rounded",
    },
  }
);

/**
 * Biến thể cho nút bấm (Button Variants).
 */
export const statusTabsButtonVariants = cva(
  "px-6 py-2 text-sm font-bold transition-all duration-200 active:scale-[0.97] flex items-center justify-center whitespace-nowrap",
  {
    variants: {
      status: {
        // Active: Trắng tinh khôi, nổi bật sẵn
        active: "bg-white shadow-[0_2px_8px_-2px_rgba(0,0,0,0.06)]",
        
        // Inactive: Khi rê chuột (Hover) sẽ hiện lên "khung" nền trắng mờ
        inactive: [
          "text-slate-400", 
          "hover:text-slate-700", 
          "hover:bg-white/40",      // Hiện "khung" nền trắng mờ (Glassmorphism hover)
          "hover:shadow-sm",        // Đổ bóng cực nhẹ khi hover
          "hover:backdrop-blur-sm"  // Làm mờ nhẹ hậu cảnh dưới nút
        ].join(" "),
      },
      size: {
        sm: "px-4 py-1.5 text-xs rounded-lg",
        md: "px-6 py-2 text-sm rounded-xl",
        lg: "px-8 py-3 text-base rounded-2xl",
      },
      shape: {
        rounded: "",
        full: "rounded-full",
      },
    },
    defaultVariants: {
      status: "inactive",
      size: "md",
      shape: "rounded",
    },
  }
);

export type StatusTabsContainerProps = VariantProps<typeof statusTabsContainerVariants>;