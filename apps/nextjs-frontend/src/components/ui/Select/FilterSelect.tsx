"use client";

import React, { useState, useRef, useEffect, useCallback } from "react";
import { createPortal } from "react-dom";
import { VariantProps } from "class-variance-authority";
import { ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils/utils";
import {
  filterSelectTriggerVariants,
  filterSelectMenuVariants,
} from "./filter-select.variants";

export interface FilterOption {
  label: string;
  value: string;
}

interface FilterSelectProps
  extends
    Omit<React.HTMLAttributes<HTMLButtonElement>, "onChange">,
    VariantProps<typeof filterSelectTriggerVariants> {
  options: FilterOption[];
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}

export const FilterSelect = ({
  options,
  value,
  onChange,
  variant,
  size,
  className,
  placeholder = "Chọn...",
  ...props
}: FilterSelectProps) => {
  const [isOpen, setIsOpen] = useState<boolean>(false);

  // Trạng thái lưu tọa độ hiển thị của menu trên màn hình
  const [menuStyle, setMenuStyle] = useState<React.CSSProperties>({});

  const triggerRef = useRef<HTMLButtonElement>(null);
  const menuRef = useRef<HTMLUListElement>(null);

  const selectedLabel = options.find((opt) => opt.value === value)?.label;

  // Cập nhật vị trí của menu dựa trên nút bấm (Trigger)
  const updatePosition = useCallback(() => {
    if (triggerRef.current) {
      const rect = triggerRef.current.getBoundingClientRect();
      setMenuStyle({
        top: `${rect.bottom + 8}px`, // Cách nút 8px
        left: `${rect.left}px`,
        width: `${rect.width}px`, // Rộng bằng đúng nút bấm
      });
    }
  }, []);

  // Hydration Fix & Event Listeners
  useEffect(() => {
    if (isOpen) {
      updatePosition();

      // Sự kiện xử lý cuộn trang (Scroll) hoặc đổi size màn hình (Resize)
      // Khi người dùng cuộn chuột, đóng dropdown để tránh menu lơ lửng sai vị trí
      const handleScrollOrResize = () => setIsOpen(false);

      window.addEventListener("resize", handleScrollOrResize);
      // Dùng { capture: true } để bắt sự kiện cuộn ở mọi phần tử con trên trang
      window.addEventListener("scroll", handleScrollOrResize, true);

      // Xử lý click ra ngoài (Click Outside)
      const handleOutsideClick = (e: MouseEvent) => {
        if (
          triggerRef.current &&
          !triggerRef.current.contains(e.target as Node) &&
          menuRef.current &&
          !menuRef.current.contains(e.target as Node)
        ) {
          setIsOpen(false);
        }
      };
      document.addEventListener("mousedown", handleOutsideClick);

      return () => {
        window.removeEventListener("resize", handleScrollOrResize);
        window.removeEventListener("scroll", handleScrollOrResize, true);
        document.removeEventListener("mousedown", handleOutsideClick);
      };
    }
  }, [isOpen, updatePosition]);

  const handleSelect = (selectedValue: string) => {
    onChange(selectedValue);
    setIsOpen(false);
  };

  const toggleOpen = () => setIsOpen((prev) => !prev);

  // Portal để đưa Menu ra khỏi DOM hiện tại, gắn thẳng vào body
  const renderMenuPortal = () => {
    if (!isOpen || typeof document === "undefined") return null;

    return createPortal(
      <ul
        ref={menuRef}
        className={cn(filterSelectMenuVariants())}
        style={menuStyle} // Đưa tọa độ vào style inline
        role="listbox"
      >
        {options.map((opt) => {
          const isSelected = opt.value === value;
          return (
            <li
              key={opt.value}
              role="option"
              aria-selected={isSelected}
              onClick={() => handleSelect(opt.value)}
              className={cn(
                "px-4 py-3 text-sm cursor-pointer transition-colors duration-150",
                "hover:bg-emerald-50 hover:text-emerald-700",
                isSelected
                  ? "bg-emerald-600 text-white font-medium hover:bg-emerald-700 hover:text-white"
                  : "text-slate-700",
              )}
            >
              {opt.label}
            </li>
          );
        })}
      </ul>,
      document.body,
    );
  };

  return (
    <>
      <button
        ref={triggerRef}
        type="button"
        onClick={toggleOpen}
        className={cn(
          filterSelectTriggerVariants({ variant, size }),
          className,
        )}
        aria-haspopup="listbox"
        aria-expanded={isOpen}
        {...props}
      >
        <span className={cn("truncate", !selectedLabel && "text-slate-400")}>
          {selectedLabel || placeholder}
        </span>
        <ChevronDown
          className={cn(
            "text-emerald-600 transition-transform duration-300",
            isOpen ? "rotate-180" : "",
          )}
          size={size === "sm" ? 16 : size === "lg" ? 24 : 20}
        />
      </button>

      {/* Gọi hàm render Portal */}
      {renderMenuPortal()}
    </>
  );
};
