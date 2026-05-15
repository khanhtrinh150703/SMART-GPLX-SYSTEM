import { cva } from "class-variance-authority";

// filter-select.variants.ts
export const filterSelectTriggerVariants = cva(
  // Đổi base từ rounded-full về rounded-2xl để khớp với ManagementToolbar
  "relative inline-flex items-center justify-between min-w-[140px] px-4 transition-all duration-200 cursor-pointer outline-none active:scale-[0.98] rounded-2xl",
  {
    variants: {
      variant: {
        // XÓA sạch "rounded-2xl" ở các variant con để nó kế thừa từ base phía trên cho sạch code
        default:
          "bg-slate-50 border border-slate-200 text-slate-900 shadow-sm focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 hover:bg-emerald-50/50",
        glass: "bg-white/70 backdrop-blur-md border-white/20 shadow-soft",
        solid:
          "bg-slate-100 border border-transparent text-slate-700 hover:bg-slate-200 focus:ring-slate-400/20",
        ghost:
          "bg-transparent border border-transparent text-slate-600 hover:bg-slate-50 hover:text-slate-900 focus:ring-slate-200",
        emerald:
          "bg-emerald-50 border border-emerald-200 text-emerald-700 hover:bg-emerald-100 focus:ring-emerald-500/30",
        danger:
          "bg-rose-50 border border-rose-200 text-rose-700 hover:bg-rose-100 focus:ring-rose-500/30",
      },
      size: {
        sm: "h-10 text-sm",
        md: "h-12 text-sm font-bold", // NÂNG CẤP: Chỉnh thành h-12 và font-bold để khớp ô tìm kiếm
        lg: "h-14 text-lg px-6 gap-6 rounded-3xl",
      },
      fullWidth: {
        true: "w-full",
        false: "w-fit",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "md",
      fullWidth: false,
    },
  },
);
// Menu bây giờ sẽ được định vị bằng Fixed (Cố định theo màn hình) thay vì Absolute
export const filterSelectMenuVariants = cva(
  "fixed bg-white border border-slate-100 rounded-2xl shadow-[0_10px_40px_-10px_rgba(0,0,0,0.15)] z-[9999] overflow-hidden origin-top animate-in fade-in zoom-in-95 duration-200",
  {
    variants: {},
    defaultVariants: {},
  },
);
