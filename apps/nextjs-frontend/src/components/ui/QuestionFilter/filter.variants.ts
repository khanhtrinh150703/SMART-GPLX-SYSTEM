import { cva, type VariantProps } from "class-variance-authority";

// Biến thể cho container chính của bộ lọc
export const filterVariants = cva(
  "flex flex-col pt-6 mt-2 border-t border-slate-200 animate-in slide-in-from-top-2",
  {
    variants: {
      layout: {
        grid: "w-full gap-6",
        sidebar: "w-64 p-4 gap-4 bg-white shadow-lg",
        compact: "w-full gap-4 bg-slate-50/50 p-5 rounded-[2rem] border-none",
      },
    },
    defaultVariants: {
      layout: "grid",
    },
  }
);

// Biến thể cho lưới hiển thị các ô lọc
export const gridVariants = cva("grid gap-6", {
  variants: {
    layout: {
      grid: "grid-cols-1 md:grid-cols-2 lg:grid-cols-4",
      sidebar: "grid-cols-1",
      compact: "grid-cols-1 md:grid-cols-3",
    },
  },
  defaultVariants: {
    layout: "grid",
  },
});

export type FilterVariantProps = VariantProps<typeof filterVariants>;