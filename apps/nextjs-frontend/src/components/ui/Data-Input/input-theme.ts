// src/components/common/data-input/input-theme.ts

export interface FormComponentTheme {
  bg: string;
  activeBg: string;
  focusRing: string;
  border: string;
  activeBorder: string;
  text: string;
  placeholder: string;
}

export const slateInputTheme: FormComponentTheme = {
  bg: "bg-slate-100/50",
  activeBg: "bg-white",
  focusRing: "focus:ring-slate-400/20",
  border: "border-transparent",
  activeBorder: "border-slate-100",
  text: "text-slate-900",
  placeholder: "placeholder:text-slate-400",
};

// Bạn có thể dễ dàng tạo thêm theme Emerald nếu muốn đồng bộ màu chủ đạo
export const emeraldInputTheme: FormComponentTheme = {
  bg: "bg-emerald-50/30",
  activeBg: "bg-white",
  focusRing: "focus:ring-emerald-500/20",
  border: "border-transparent",
  activeBorder: "border-emerald-100",
  text: "text-slate-900",
  placeholder: "placeholder:text-emerald-300",
};