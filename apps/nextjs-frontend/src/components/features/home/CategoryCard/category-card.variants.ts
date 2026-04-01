import { cva, type VariantProps } from "class-variance-authority";

export const categoryCardVariants = {
  // Container chính (Giao điểm của Spotlight và Layout)
  container: "p-8 flex flex-col justify-between h-full group cursor-pointer",
  
  // Ruy băng chéo góc
  ribbon: "absolute top-0 left-0 bg-emerald-600 text-white text-xs font-bold px-10 py-1.5 rotate-[-45deg] -translate-x-8 translate-y-5 shadow-md z-10",
  
  // Nhãn tên hạng (A1/B2)
  badge: cva(
    "absolute top-6 right-6 font-bold px-4 py-1.5 rounded-xl z-10 text-sm transition-colors",
    {
      variants: {
        intent: {
          emerald: "bg-slate-100 text-slate-600 group-hover:bg-emerald-100 group-hover:text-emerald-700",
          teal: "bg-slate-100 text-slate-600 group-hover:bg-teal-100 group-hover:text-teal-700",
        },
      },
      defaultVariants: { intent: "emerald" },
    }
  ),

  // Vùng sáng phía sau ảnh xe
  glow: cva(
    "absolute inset-0 rounded-full blur-3xl transition-colors duration-700",
    {
      variants: {
        intent: {
          emerald: "bg-emerald-500/5 group-hover:bg-emerald-500/10",
          teal: "bg-teal-500/5 group-hover:bg-teal-500/10",
        },
      },
      defaultVariants: { intent: "emerald" },
    }
  ),
};

export type CategoryCardProps = VariantProps<typeof categoryCardVariants.badge>;