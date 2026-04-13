
// Định nghĩa các loại (Types)
// Thêm các kiểu mới vào Type (Update types)
export type TableVariant =
  | "default"
  | "striped"
  | "bordered"
  | "ghost"
  | "glass-emerald" // Style xanh lá nhẹ nhàng hợp với bằng lái
  | "modern-dark"    // Chế độ tối sang trọng
  | "minimal-flat"   // Siêu phẳng, cực kỳ gọn
  | "neo-brutalism";
export type TableSize = "sm" | "md" | "lg";

// Cấu hình Kích thước (Size Configuration)
export const TABLE_SIZES: Record<TableSize, { th: string; td: string; text: string }> = {
  sm: { th: "px-4 py-2", td: "px-4 py-2", text: "text-[11px]" },
  md: { th: "px-6 py-4", td: "px-6 py-4", text: "text-sm" },
  lg: { th: "px-8 py-6", td: "px-8 py-6", text: "text-base" },
};


export const TABLE_VARIANTS: Record<TableVariant, string> = {
  // 1. Kính mờ truyền thống (Glassmorphism)
  default: "bg-white/50 backdrop-blur-md border-white/60 shadow-soft",

  // 2. Kẻ sọc công sở (Classic Striped)
  striped: "bg-white border-slate-200 shadow-sm [&_tbody_tr:nth-child(even)]:bg-slate-50/80",

  // 3. Có khung rõ ràng (Structured)
  bordered: "bg-white border-slate-200 [&_td]:border-l [&_td]:border-slate-100 [&_th]:border-l [&_th]:border-slate-100",

  // 4. Tàng hình (Minimalist)
  ghost: "bg-transparent border-transparent shadow-none",

  // 5. Xanh lục bảo (Emerald Breeze) - Rất hợp với tone Smart-GPLX của bạn
  "glass-emerald": "bg-emerald-50/20 backdrop-blur-xl border-emerald-100/50 shadow-lg shadow-emerald-500/5 [&_th]:text-emerald-700",

  // 6. Chế độ tối (Deep Night)
  "modern-dark": "bg-slate-900 border-slate-800 shadow-2xl [&_th]:text-slate-400 [&_td]:text-slate-300 [&_td]:border-slate-800 [&_tbody_tr:hover]:bg-slate-800/50",

  // 7. Phẳng lặng (Minimal Flat) - Loại bỏ mọi hiệu ứng thừa, cực kỳ sạch
  "minimal-flat": "bg-slate-50/50 border-slate-200 shadow-none [&_thead]:bg-slate-100/50",

  // 8. Đậm chất đồ họa (Neo-Brutalism) - Dành cho giao diện cá tính
  "neo-brutalism": "bg-white border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] [&_th]:border-b-2 [&_th]:border-black",
};