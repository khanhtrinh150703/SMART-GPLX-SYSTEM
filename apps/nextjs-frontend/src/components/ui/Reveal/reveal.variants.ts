import { cva, type VariantProps } from "class-variance-authority";

export const revealVariants = cva(
  "will-change-[transform,opacity]", // Tối ưu hóa hiệu năng render (Hardware acceleration)
  {
    variants: {
      // Bạn có thể thêm các kiểu reveal khác ở đây sau này
      direction: {
        up: "",
        down: "",
        left: "",
        right: "",
      },
    },
    defaultVariants: {
      direction: "up",
    },
  }
);

export type RevealVariants = VariantProps<typeof revealVariants>;