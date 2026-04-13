// src/components/ui/sidebar/sidebar.variants.ts
import { cva } from "class-variance-authority";

// 1. Biến thể cho khung Sidebar
export const sidebarVariants = cva(
  "w-64 h-screen flex flex-col transition-all duration-300 border-r",
  {
    variants: {
      theme: {
        dark: "bg-slate-900 text-slate-300 border-slate-800",
        light: "bg-white text-slate-600 border-slate-200",
      },
    },
    defaultVariants: {
      theme: "dark",
    },
  }
);

// 2. Biến thể cho từng Item (Active/Inactive)
// export const sidebarItemVariants = cva(
//   "flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-all duration-200 group",
//   {
//     variants: {
//       status: {
//         inactive: "text-slate-400 hover:bg-slate-800/50 hover:text-white",
//         active: "bg-emerald-600/10 text-emerald-500 shadow-sm", // Màu thương hiệu Smart-GPLX
//       },
//     },
//     defaultVariants: {
//       status: "inactive",
//     },
//   }
// );

export const sidebarItemVariants = cva(
  "group flex items-center gap-4 px-6 py-3 transition-all duration-500 relative select-none active:scale-[0.95]",
  {
    variants: {
      status: {
        active: [
          "bg-transparent", // Trong suốt hoàn toàn
          "text-emerald-400 font-bold",
        ],
        inactive: [
          "bg-transparent",
          "text-slate-400/70 hover:text-emerald-300",
        ],
      },
    },
    defaultVariants: {
      status: "inactive",
    },
  }
);