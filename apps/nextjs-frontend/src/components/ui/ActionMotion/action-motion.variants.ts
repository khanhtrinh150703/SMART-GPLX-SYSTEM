import { Variants } from "framer-motion";
import { SHARED_SPRING } from "./action-motion.constants";
import { cva } from "class-variance-authority";

export const buttonTapVariants: Variants = {
  initial: {
    scale: 1,
    filter: "brightness(1)",
    boxShadow: "0 1px 2px rgba(0,0,0,0.05)",
  },
  hover: {
    scale: 1,
    boxShadow: "0 4px 6px -1px rgba(0,0,0,0.1), 0 2px 4px -1px rgba(0,0,0,0.06)",
  },
  tap: {
    scale: 0.9,
    filter: "brightness(0.8)",
    boxShadow: "0 0 0 rgba(0,0,0,0)",
  },
};

export const iconVariants: Variants = {
  initial: { left: "8px", x: 0, rotate: 0 },
  hover: (d: string) => ({
    left: d,
    rotate: 900,
    transition: SHARED_SPRING,
  }),
};

export const veilVariants: Variants = {
  initial: { width: "0%", opacity: 0 },
  hover: {
    width: "100%",
    opacity: 1,
    transition: SHARED_SPRING
  },
};

export const originalTextVariants: Variants = {
  initial: { x: 0, opacity: 1 },
  hover: {
    x: "200%",
    opacity: 0,
    transition: { ...SHARED_SPRING, stiffness: 100 },
  },
};

export const whiteTextVariants: Variants = {
  initial: { x: "-100%", opacity: 0 },
  hover: {
    x: 0,
    opacity: 1,
    transition: { ...SHARED_SPRING, delay: 0.1 }
  },
};

// 
/** 
 * Manage button sizes and shapes (Quản lý kích thước và hình dáng nút) 
 */
export const buttonSizeVariants = cva(
  "group relative flex items-center justify-center rounded-full overflow-hidden transition-all duration-300 shadow-sm",
  {
    variants: {
      size: {
        sm: "h-9 min-w-[10rem] text-[11px]",   // Nhỏ gọn
        md: "h-11 min-w-[14rem] text-[12px]",  // Sleek (Chuẩn hiện tại)
        lg: "h-14 min-w-[16rem] text-[14px]",  // To hơn chút
        xl: "h-[3.75rem] min-w-[18rem] text-[14px]", // Hardcore (60px)
      }
    },
    defaultVariants: {
      size: "md",
    }
  }
);

/** 
 * Adjusted Icon sizes based on button size (Điều chỉnh cỡ Icon dựa trên cỡ nút) 
 */
export const iconContainerSizes = {
  sm: "w-7 h-7 left-1",
  md: "w-8 h-8 left-1.5",
  lg: "w-10 h-10 left-2",
  xl: "w-11 h-11 left-2",
};