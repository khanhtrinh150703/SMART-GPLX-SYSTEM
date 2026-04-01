import { cva, type VariantProps } from "class-variance-authority";

export const featureCardVariants = {
  // Container chính (Tận dụng lại SpotlightCard bên trong component)
  container: "p-8 flex flex-col items-center text-center group cursor-pointer h-full",
  
  // Icon Wrapper với các biến thể màu sắc (Intent)
  iconWrapper: cva(
    "w-16 h-16 rounded-2xl flex items-center justify-center mb-6 transition-all duration-300 group-hover:scale-110 group-hover:rotate-3",
    {
      variants: {
        intent: {
          emerald: "bg-emerald-100/50 text-emerald-600",
          blue: "bg-blue-100/50 text-blue-600",
          amber: "bg-amber-100/50 text-amber-600",
          // Dễ dàng thêm các màu khác tại đây
        },
      },
      defaultVariants: {
        intent: "emerald",
      },
    }
  ),

  // Nút hành động "Xem chi tiết"
  action: "mt-auto flex items-center gap-1 text-sm font-semibold text-slate-500 group-hover:text-emerald-600 transition-colors bg-slate-50 px-5 py-2.5 rounded-full group-hover:bg-emerald-50",
};

export type FeatureCardVariantProps = VariantProps<typeof featureCardVariants.iconWrapper>;