import { cva } from "class-variance-authority";

// Container chính với hiệu ứng Glassmorphism và bo góc cực lớn
export const chartWrapperVariants = cva(
  "flex flex-col sm:flex-row items-center gap-10 w-full p-8 rounded-[3rem] bg-white shadow-soft border border-slate-100 transition-all duration-500",
  {
    variants: {
      isHovered: {
        true: "shadow-emerald-100/50 border-emerald-100",
        false: "",
      },
    },
    defaultVariants: {
      isHovered: false,
    },
  }
);

// Style cho từng dòng chú thích dữ liệu
export const legendItemVariants = cva(
  "flex items-center justify-between w-full p-3 rounded-2xl transition-all duration-300",
  {
    variants: {
      status: {
        active: "bg-slate-50 scale-[1.03] shadow-sm",
        inactive: "opacity-60 grayscale-[30%]",
        idle: "hover:bg-slate-50",
      },
    },
    defaultVariants: {
      status: "idle",
    },
  }
);