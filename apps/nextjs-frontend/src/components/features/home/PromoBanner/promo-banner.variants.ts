import { cva, type VariantProps } from "class-variance-authority";

export const promoBannerVariants = {
  // Khung chứa chính (Container)
  wrapper: "max-w-7xl mx-auto px-6 mb-20 relative z-10",
  
  container: cva(
    "rounded-[2.5rem] p-12 flex flex-col md:flex-row items-center justify-between shadow-2xl relative overflow-hidden group border transition-all duration-500",
    {
      variants: {
        theme: {
          dark: "bg-slate-900 border-slate-800",
          emerald: "bg-emerald-900 border-emerald-800",
        }
      },
      defaultVariants: { theme: "dark" }
    }
  ),

  // Khối sáng xoay phía sau (Rotating Glow)
  glow: "absolute -right-20 -top-20 w-96 h-96 bg-emerald-500/20 blur-[100px] rounded-full group-hover:bg-emerald-500/30 transition-colors duration-1000",
  
  // Badge nhỏ phía trên
  badge: "inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-800 text-emerald-400 text-xs font-bold mb-4 border border-slate-700 uppercase tracking-wider",
  
  // Tiêu đề với Gradient
  title: "text-white text-4xl md:text-5xl font-bold mb-4 tracking-tight",
  highlight: "text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-teal-300",
};

export type PromoBannerVariantProps = VariantProps<typeof promoBannerVariants.container>;