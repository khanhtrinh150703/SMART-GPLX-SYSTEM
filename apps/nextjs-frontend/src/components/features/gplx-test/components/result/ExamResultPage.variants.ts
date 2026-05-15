import { cva, type VariantProps } from "class-variance-authority";

export const resultPageVariants = cva(
  "relative w-full h-fit flex flex-col items-center justify-start pb-20 p-4 md:p-8 font-sans",
  {
    variants: {
      // Variant để chỉnh Padding Top (Khoảng cách đệm phía trên)
      paddingTop: {
        none: "pt-0",
        small: "pt-10",
        medium: "pt-20", // Giá trị hiện tại của sếp
        large: "pt-32",
        viewport: "pt-[5vh]", // Theo tỷ lệ màn hình
      },
    },
    defaultVariants: {
      paddingTop: "medium",
    },
  }
);

export type ResultPageVariantsProps = VariantProps<typeof resultPageVariants>;