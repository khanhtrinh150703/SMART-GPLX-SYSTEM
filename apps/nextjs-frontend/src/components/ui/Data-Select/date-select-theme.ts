// src/components/common/data-select/select-theme.ts

export interface SelectThemeClasses {
  triggerBg: string;
  triggerActiveBg: string; // Thêm thuộc tính màu nền khi mở/nhấn
  triggerFocus: string; 
  optionActiveBg: string; 
  optionActiveText: string; 
  checkIcon: string; 
}

// Cập nhật cho slateTheme (Màu xám bạn đang dùng)
export const slateTheme: SelectThemeClasses = {
  triggerBg: "bg-slate-100/50",
  triggerActiveBg: "bg-white", // Chuyển sang trắng khi nhấn
  triggerFocus: "hover:border-slate-300 focus:ring-slate-400/20",
  optionActiveBg: "bg-slate-200/50",
  optionActiveText: "text-slate-900",
  checkIcon: "text-slate-600",
};

// Đừng quên cập nhật các theme khác nếu bạn muốn đồng bộ
export const defaultEmeraldTheme: SelectThemeClasses = {
  triggerBg: "bg-slate-100/50",
  triggerActiveBg: "bg-white",
  triggerFocus: "hover:border-emerald-200 focus:ring-emerald-500/20",
  optionActiveBg: "bg-emerald-50",
  optionActiveText: "text-emerald-700",
  checkIcon: "text-emerald-500",
};

// ... (Giữ nguyên phần selectSizes bên dưới)
export interface SelectSizeClasses {
  trigger: string;
  triggerText: string;
  option: string;
  optionText: string;
  icon: number;
}

export const selectSizes = {
  sm: {
    trigger: "h-10 px-3 rounded-xl",
    triggerText: "text-xs",
    option: "px-3 py-2 rounded-lg",
    optionText: "text-[10px]",
    icon: 14,
  },
  md: {
    trigger: "h-12 px-4 rounded-2xl",
    triggerText: "text-sm",
    option: "px-4 py-3 rounded-xl",
    optionText: "text-xs",
    icon: 16,
  },
  lg: {
    trigger: "h-14 px-5 rounded-[20px]",
    triggerText: "text-base",
    option: "px-5 py-4 rounded-2xl",
    optionText: "text-sm",
    icon: 18,
  }
};