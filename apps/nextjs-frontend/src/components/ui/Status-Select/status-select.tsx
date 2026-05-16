"use client";

import React, {
  useState,
  useRef,
  forwardRef,
  useLayoutEffect,
  useMemo,
  useEffect,
} from "react";
import { ChevronDown, Check } from "lucide-react";
import { cn } from "@/lib/utils/utils";
import { Portal } from "@/components/common/Portal";
import { 
  StatusThemeClasses, 
  defaultStatusTheme, 
  statusSizes, 
  StatusSizeClasses 
} from "./status-theme";

export interface StatusOption {
  value: string;
  label: string;
  icon?: string;
  color: string;
}

interface StatusSelectProps {
  options: StatusOption[];
  value: string;
  onChange: (value: string) => void;
  error?: string;
  label?: string;
  theme?: StatusThemeClasses;
  size?: keyof typeof statusSizes;
}

export const StatusSelect = forwardRef<HTMLButtonElement, StatusSelectProps>(
  ({ 
    options, 
    value, 
    onChange, 
    error, 
    label,
    theme = defaultStatusTheme,
    size = "md" 
  }, ref) => {
    const [isOpen, setIsOpen] = useState(false);
    const triggerRef = useRef<HTMLButtonElement>(null);
    const [coords, setCoords] = useState({ top: 0, left: 0, width: 0 });

    const sizeConfig: StatusSizeClasses = statusSizes[size];

    const selectedOption = useMemo(() => {
      return options.find((opt) => opt.value === value) || options[0];
    }, [options, value]);

    const updatePosition = () => {
      if (triggerRef.current) {
        const rect = triggerRef.current.getBoundingClientRect();
        setCoords({
          top: rect.bottom + 8,
          left: rect.left ,
          width: rect.width,
        });
      }
    };

    useLayoutEffect(() => {
      if (isOpen) updatePosition();
    }, [isOpen]);

    useEffect(() => {
      if (isOpen) {
        window.addEventListener("resize", updatePosition);
        window.addEventListener("scroll", updatePosition);
      }
      return () => {
        window.removeEventListener("resize", updatePosition);
        window.removeEventListener("scroll", updatePosition);
      };
    }, [isOpen]);

    return (
      <div className="relative w-full space-y-2">
        {label && (
          <label className="text-[10px] font-black uppercase tracking-[0.15em] text-slate-400 ml-1 block">
            {label}
          </label>
        )}

        <button
          ref={(node) => {
            triggerRef.current = node;
            if (typeof ref === "function") ref(node);
            else if (ref) ref.current = node;
          }}
          type="button"
          onClick={() => setIsOpen(!isOpen)}
          className={cn(
            "flex items-center justify-between w-full transition-all duration-300",
            "border-2", // Giữ border-2 để không nhảy layout khi báo lỗi
            sizeConfig.trigger,
            isOpen && "shadow-lg shadow-slate-200/50", // Đổ bóng khi mở
            error 
              ? "border-rose-100 bg-rose-50/30" 
              : cn(
                  "border-transparent focus:ring-2", 
                  isOpen ? theme.triggerActiveBg : theme.triggerBg, // Đổi màu nền khi Active
                  theme.triggerFocus,
                  isOpen && "border-slate-100" // Hiện viền rất nhạt khi trắng
                )
          )}
        >
          <div className="flex items-center gap-2">
            {selectedOption.icon && (
              <span className={sizeConfig.statusIconSize}>{selectedOption.icon}</span>
            )}
            <span
              className={cn(
                "font-bold uppercase tracking-wide",
                sizeConfig.triggerText,
                selectedOption.color
              )}
            >
              {selectedOption.label}
            </span>
          </div>
          <ChevronDown
            size={sizeConfig.iconSize}
            className={cn(
              "text-slate-400 transition-transform duration-300",
              isOpen && "rotate-180"
            )}
          />
        </button>

        {error && (
          <p className="text-[10px] text-rose-500 font-bold ml-1 uppercase animate-in fade-in slide-in-from-top-1">
            {error}
          </p>
        )}

        {isOpen && (
          <Portal>
            <div className="fixed inset-0 z-[9998] bg-transparent" onClick={() => setIsOpen(false)} />
            <div
              style={{ top: coords.top, left: coords.left, width: coords.width }}
              className="fixed z-[9999] bg-white/95 backdrop-blur-2xl border border-slate-100 shadow-2xl rounded-3xl overflow-hidden p-2 animate-in fade-in zoom-in-95 duration-200"
            >
              <div className="flex flex-col gap-1 max-h-[300px] overflow-y-auto custom-scrollbar">
                {options.map((opt) => {
                  const isSelected = opt.value === value;
                  return (
                    <button
                      key={opt.value}
                      type="button"
                      onClick={() => {
                        onChange(opt.value);
                        setIsOpen(false);
                      }}
                      className={cn(
                        "flex items-center justify-between transition-all duration-200",
                        sizeConfig.option,
                        isSelected ? theme.optionActiveBg : "hover:bg-slate-50 active:scale-[0.98]"
                      )}
                    >
                      <div className="flex items-center gap-3">
                        {opt.icon && <span className={sizeConfig.statusIconSize}>{opt.icon}</span>}
                        <span
                          className={cn(
                            "font-black uppercase tracking-widest",
                            sizeConfig.optionText,
                            opt.color
                          )}
                        >
                          {opt.label}
                        </span>
                      </div>
                      {isSelected && (
                        <Check size={sizeConfig.iconSize - 2} className={theme.checkIcon} />
                      )}
                    </button>
                  );
                })}
              </div>
            </div>
          </Portal>
        )}
      </div>
    );
  }
);

StatusSelect.displayName = "StatusSelect";