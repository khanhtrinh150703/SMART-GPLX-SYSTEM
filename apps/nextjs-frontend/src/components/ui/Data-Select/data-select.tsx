// src/components/common/data-select/data-select.tsx
"use client";

import React, {
  useState,
  useRef,
  forwardRef,
  useLayoutEffect,
  useEffect,
  useMemo,
} from "react";
import { ChevronDown, Check } from "lucide-react";
import { cn } from "@/lib/utils/utils";
import { Portal } from "@/components/common/Portal";
import {
  SelectThemeClasses,
  selectSizes,
  defaultEmeraldTheme,
  SelectSizeClasses,
} from "./date-select-theme";

export interface DataOption {
  value: string;
  label: string;
  disabled?: boolean;
}

interface DataSelectProps {
  options: DataOption[];
  value: string;
  onChange: (value: string) => void;
  disabled?: boolean;
  error?: string;
  label?: string;
  placeholder?: string;
  theme?: SelectThemeClasses;
  size?: keyof typeof selectSizes;
}

export const DataSelect = forwardRef<HTMLButtonElement, DataSelectProps>(
  (
    {
      options,
      value,
      onChange,
      disabled,
      error,
      label,
      placeholder,
      theme = defaultEmeraldTheme,
      size = "md",
    },
    ref,
  ) => {
    const [isOpen, setIsOpen] = useState(false);
    const triggerRef = useRef<HTMLButtonElement>(null);
    const [coords, setCoords] = useState({ top: 0, left: 0, width: 0 });
    const [placement, setPlacement] = useState<"bottom" | "top">("bottom");

    const sizeConfig: SelectSizeClasses = selectSizes[size];

    const selected = useMemo(
      () => options.find((opt) => opt.value === value),
      [options, value],
    );

    /**
     * Logic tính toán vị trí thông minh (Smart Positioning Logic)
     */
    const updatePosition = () => {
      if (triggerRef.current) {
        const rect = triggerRef.current.getBoundingClientRect();
        const viewportHeight = window.innerHeight;
        const menuMaxHeight = Math.min(viewportHeight * 0.4, 300); // Giới hạn menu tối đa 40% màn hình

        // Kiểm tra khoảng trống bên dưới nút (Check space below)
        const spaceBelow = viewportHeight - rect.bottom;
        const shouldShowTop =
          spaceBelow < menuMaxHeight && rect.top > spaceBelow;

        if (shouldShowTop) {
          setPlacement("top");
          setCoords({
            top: rect.top + window.scrollY - 8, // Hiện lên trên nút
            left: rect.left + window.scrollX,
            width: rect.width,
          });
        } else {
          setPlacement("bottom");
          setCoords({
            top: rect.bottom + window.scrollY + 8, // Hiện xuống dưới nút
            left: rect.left + window.scrollX,
            width: rect.width,
          });
        }
      }
    };

    useLayoutEffect(() => {
      const raf = requestAnimationFrame(() => {
        if (isOpen) updatePosition();
      });
      return () => cancelAnimationFrame(raf);
    }, [isOpen]);

    useEffect(() => {
      if (isOpen) {
        window.addEventListener("resize", updatePosition);
        window.addEventListener("scroll", updatePosition, { capture: true });
      }
      return () => {
        window.removeEventListener("resize", updatePosition);
        window.removeEventListener("scroll", updatePosition, { capture: true });
      };
    }, [isOpen]);

    const handleSelect = (opt: DataOption) => {
      if (opt.disabled) return;
      onChange(opt.value);
      setIsOpen(false);
    };

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
          disabled={disabled}
          onClick={() => setIsOpen(!isOpen)}
          className={cn(
            "flex items-center justify-between w-full transition-all duration-300 outline-none",
            sizeConfig.trigger,
            disabled
              ? "bg-slate-50 border-slate-100 text-slate-400 cursor-not-allowed opacity-70"
              : cn(
                  isOpen ? theme.triggerActiveBg : theme.triggerBg,
                  "border-transparent focus:ring-2",
                  theme.triggerFocus,
                  error ? "border-rose-100 bg-rose-50/30" : "",
                  isOpen && "shadow-lg shadow-slate-200/50 border-slate-100",
                ),
          )}
        >
          <span
            className={cn(
              "font-bold truncate text-left",
              sizeConfig.triggerText,
              !selected && "text-slate-400",
            )}
          >
            {selected ? selected.label : placeholder || "Chọn dữ liệu..."}
          </span>
          <ChevronDown
            size={sizeConfig.icon}
            className={cn(
              "text-slate-400 transition-transform duration-300 shrink-0",
              isOpen && "rotate-180",
            )}
          />
        </button>

        {error && (
          <p className="text-[10px] text-rose-500 font-bold ml-1 uppercase">
            {error}
          </p>
        )}

        {isOpen && (
          <Portal>
            <div
              className="fixed inset-0 z-[9998]"
              onClick={() => setIsOpen(false)}
            />

            <div
              style={{
                top: coords.top,
                left: coords.left,
                width: coords.width,
                transform: placement === "top" ? "translateY(-100%)" : "none", // Lật menu lên trên nếu cần
              }}
              className={cn(
                "fixed z-[9999] flex flex-col bg-white border border-slate-100 shadow-2xl rounded-3xl overflow-hidden p-2 animate-in fade-in zoom-in-95 duration-200",
              )}
            >
              {/* PHẦN CỐ ĐỊNH CHIỀU CAO VÀ THANH CUỘN (SCROLL FIX) */}
              <div className="flex flex-col gap-1 overflow-y-auto custom-scrollbar max-h-[35vh] min-h-0">
                {options.map((opt) => {
                  const isSelected = opt.value === value;
                  return (
                    <button
                      key={opt.value}
                      type="button"
                      disabled={opt.disabled}
                      onClick={() => handleSelect(opt)}
                      className={cn(
                        "flex items-center justify-between transition-all text-left w-full shrink-0",
                        sizeConfig.option,
                        opt.disabled
                          ? "opacity-40 cursor-not-allowed bg-slate-50/50"
                          : isSelected
                            ? cn(theme.optionActiveBg, theme.optionActiveText)
                            : "hover:bg-slate-50 text-slate-600 active:scale-[0.98]",
                      )}
                    >
                      <span
                        className={cn(
                          "font-bold uppercase tracking-wider whitespace-normal pr-4 leading-tight",
                          sizeConfig.optionText,
                          opt.disabled && "text-slate-400",
                        )}
                      >
                        {opt.label}
                      </span>
                      {isSelected && (
                        <Check
                          size={sizeConfig.icon - 2}
                          className={cn("shrink-0", theme.checkIcon)}
                        />
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
  },
);

DataSelect.displayName = "DataSelect";
