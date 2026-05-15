// src/components/common/status-select/status-theme.ts

export interface StatusThemeClasses {
  triggerBg: string;       // Màu nền mặc định (VD: xám nhạt)
  triggerActiveBg: string; // Màu nền khi mở dropdown (VD: trắng)
  triggerFocus: string;
  optionActiveBg: string;
  checkIcon: string;
}

export interface StatusSizeClasses {
  trigger: string;
  triggerText: string;
  option: string;
  optionText: string;
  iconSize: number;
  statusIconSize: string;
}

export const defaultStatusTheme: StatusThemeClasses = {
  triggerBg: "bg-slate-100/50", // Mặc định xám xanh nhẹ cho đồng bộ
  triggerActiveBg: "bg-white",   // Chuyển trắng khi nhấn
  triggerFocus: "hover:border-emerald-200 focus:ring-emerald-500/20",
  optionActiveBg: "bg-emerald-50/50",
  checkIcon: "text-emerald-500",
};

// Bạn có thể tạo thêm Slate Theme riêng cho Status nếu muốn
export const slateStatusTheme: StatusThemeClasses = {
  triggerBg: "bg-slate-100/50",
  triggerActiveBg: "bg-white",
  triggerFocus: "hover:border-slate-300 focus:ring-slate-400/20",
  optionActiveBg: "bg-slate-200/50",
  checkIcon: "text-slate-600",
};

export const statusSizes = {
  sm: {
    trigger: "h-10 px-3 rounded-xl",
    triggerText: "text-[11px]",
    option: "px-3 py-2 rounded-lg",
    optionText: "text-[10px]",
    iconSize: 14,
    statusIconSize: "text-base",
  },
  md: {
    trigger: "h-12 px-4 rounded-2xl",
    triggerText: "text-xs",
    option: "px-4 py-3 rounded-xl",
    optionText: "text-[11px]",
    iconSize: 18,
    statusIconSize: "text-lg",
  },
  lg: {
    trigger: "h-14 px-5 rounded-[22px]",
    triggerText: "text-sm",
    option: "px-5 py-4 rounded-2xl",
    optionText: "text-xs",
    iconSize: 20,
    statusIconSize: "text-xl",
  },
};