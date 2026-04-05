import { cva, type VariantProps } from "class-variance-authority";

/**
 * Biến thể cho khung bao ngoài của Bảng (Table Container Variants).
 */
export const tableContainerVariants = cva(
  "relative overflow-hidden transition-all duration-500",
  {
    variants: {
      variant: {
        // Phong cách nhẹ nhàng: Nền trắng mờ, không viền cứng
        ambient: "bg-white/70 backdrop-blur-xl shadow-soft rounded-[2.5rem] border border-white/60",
        solid: "bg-white shadow-md rounded-3xl border border-slate-100",
      },
    },
    defaultVariants: {
      variant: "ambient",
    },
  }
);

/**
 * Biến thể cho từng dòng trong bảng (Row Variants).
 */
export const tableRowVariants = cva(
  "transition-colors duration-200 group",
  {
    variants: {
      status: {
        normal: "hover:bg-emerald-50/40", // Hiện khung màu lục nhạt khi rê chuột (Hover)
        active: "bg-emerald-50/20",
      },
    },
    defaultVariants: {
      status: "normal",
    },
  }
);

export type TableContainerProps = VariantProps<typeof tableContainerVariants>;