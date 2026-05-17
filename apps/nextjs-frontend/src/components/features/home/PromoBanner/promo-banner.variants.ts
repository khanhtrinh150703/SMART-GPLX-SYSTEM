import { cva, type VariantProps } from "class-variance-authority";

// Định nghĩa các phân vùng theme hợp lệ cho toàn bộ khối banner (Strict theme keys definition)
export type PromoBannerTheme = "dark" | "emerald" | "sage";

export const promoBannerVariants = {
  // Khung chứa định vị cấu trúc bên ngoài (Outer layout wrapper)
  wrapper: "max-w-7xl mx-auto px-6 mb-20 relative z-10",

  // Thành phần khung chứa động dựa trên CVA (Dynamic container engine)
  container: cva(
    "rounded-[2.5rem] p-12 flex flex-col md:flex-row items-center justify-between relative overflow-hidden group border transition-all duration-500",
    {
      variants: {
        theme: {
          // 1. Giao diện tối công nghệ (Dark tech theme)
          dark: "bg-slate-900 border-slate-800 shadow-2xl selection:bg-slate-800 selection:text-emerald-400",

          // 2. Giao diện xanh lục bảo đậm (Deep emerald theme)
          emerald:
            "bg-emerald-950 border-emerald-900 shadow-2xl selection:bg-emerald-800 selection:text-white",

          // 3. ĐÃ SỬA: Vibe giữa xanh lá và xanh dương nhẹ nhàng, mượt mà hoàn hảo trên nền trắng (Fresh Mint/Teal Light Accent Theme)
          sage: "bg-gradient-to-br from-emerald-50/90 via-white to-teal-50/90 border-emerald-100 shadow-xl shadow-emerald-950/[0.03] selection:bg-emerald-200 selection:text-emerald-950",
        } satisfies Record<PromoBannerTheme, string>,
      },
      defaultVariants: { theme: "sage" },
    },
  ),

  // Khối sáng chạy ngầm thích ứng theo từng môi trường (Adaptive background organic glow)
  glow: {
    dark: "absolute -right-20 -top-20 w-96 h-96 bg-emerald-500/20 blur-[100px] rounded-full group-hover:bg-emerald-500/30 transition-colors duration-1000",
    emerald:
      "absolute -right-20 -top-20 w-96 h-96 bg-emerald-400/10 blur-[100px] rounded-full group-hover:bg-emerald-400/20 transition-colors duration-1000",
    // ĐH SỬA: Quầng sáng xanh dương lai xanh lá (Teal/Cyan blur) chạy ẩn cực mịn
    sage: "absolute -right-24 -top-24 w-[500px] h-[500px] bg-teal-300/[0.15] blur-[120px] rounded-full group-hover:bg-emerald-300/[0.2] transition-colors duration-1000 pointer-events-none",
  } satisfies Record<PromoBannerTheme, string>,

  // Nhãn danh mục nhỏ phía trên đầu khối (Contextual category badge component)
  badge: {
    dark: "inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-800 text-emerald-400 text-xs font-bold mb-4 border border-slate-700 uppercase tracking-wider",
    emerald:
      "inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-900 text-emerald-300 text-xs font-bold mb-4 border border-emerald-800 uppercase tracking-wider",
    // ĐÃ SỬA: Badge nền trắng nổi bật nhẹ trên nền Mint
    sage: "inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white text-emerald-600 text-xs font-bold mb-4 border border-emerald-200 uppercase tracking-wider shadow-sm select-none",
  } satisfies Record<PromoBannerTheme, string>,

  // Tiêu đề chính phân cấp tương phản (Primary headline text typography)
  title: {
    dark: "text-white text-4xl md:text-5xl font-bold mb-4 tracking-tight leading-tight",
    emerald:
      "text-white text-4xl md:text-5xl font-bold mb-4 tracking-tight leading-tight",
    sage: "text-slate-900 text-4xl md:text-5xl font-black mb-4 tracking-tight leading-tight",
  } satisfies Record<PromoBannerTheme, string>,

  // Điểm nhấn chữ nghệ thuật dạng Gradient (Typographic visual highlight gradient)
  highlight: {
    dark: "text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-teal-300",
    emerald:
      "text-transparent bg-clip-text bg-gradient-to-r from-emerald-300 to-green-300",
    // ĐÃ SỬA: Gradient lai chuẩn bài giữa xanh lá (emerald) và xanh dương (teal) tươi rói
    sage: "text-transparent bg-clip-text bg-gradient-to-r from-emerald-500 to-teal-400",
  } satisfies Record<PromoBannerTheme, string>,

  // Đoạn văn bản mô tả - Áp dụng chính xác class text-slate-500 mượt mà đúng yêu cầu của bạn
  description: {
    dark: "text-slate-400 text-lg font-medium",
    emerald: "text-emerald-100/70 text-lg font-medium",
    sage: "text-lg md:text-xl text-slate-500 font-medium leading-relaxed max-w-2xl",
  } satisfies Record<PromoBannerTheme, string>,

  // Nút bấm hành động chuyển đổi theo ngữ cảnh (Contextual call-to-action primary button)
  button: {
    dark: "rounded-full px-12 py-7 text-lg bg-emerald-600 hover:bg-emerald-500 shadow-[0_0_30px_rgba(5,150,104,0.3)] transition-all",
    emerald:
      "rounded-full px-12 py-7 text-lg bg-white text-emerald-950 hover:bg-emerald-50 shadow-md transition-all",
    // ĐÃ SỬA: Nút bấm chạy dải mượt từ emerald sang teal, đổ bóng dịu mát đổ gục người nhìn
    sage: "rounded-full px-12 py-7 text-lg bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white shadow-lg shadow-emerald-200/60 transition-all duration-300 active:scale-[0.98]",
  } satisfies Record<PromoBannerTheme, string>,
};

export type PromoBannerVariantProps = VariantProps<
  typeof promoBannerVariants.container
>;
