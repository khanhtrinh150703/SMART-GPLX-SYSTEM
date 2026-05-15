"use client";

import React, { forwardRef, useState } from "react";
import { cn } from "@/lib/utils/utils";

import { FormComponentTheme, slateInputTheme } from "./input-theme";
import { selectSizes } from "../Data-Select/date-select-theme";

interface DataInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  sizeName?: keyof typeof selectSizes; // Tránh trùng tên với attribute 'size' của input
  theme?: FormComponentTheme;
}

export const DataInput = forwardRef<HTMLInputElement, DataInputProps>(
  (
    { 
      label, 
      error, 
      sizeName = "md", 
      theme = slateInputTheme, 
      className, 
      onFocus, 
      onBlur, 
      ...props 
    }, 
    ref
  ) => {
    const [isFocused, setIsFocused] = useState(false);
    const sizeConfig = selectSizes[sizeName];

    const handleFocus = (e: React.FocusEvent<HTMLInputElement>) => {
      setIsFocused(true);
      onFocus?.(e);
    };

    const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
      setIsFocused(false);
      onBlur?.(e);
    };

    return (
      <div className="w-full space-y-2">
        {label && (
          <label className="text-[10px] font-black uppercase tracking-[0.15em] text-slate-400 ml-1 block">
            {label}
          </label>
        )}
        
        <input
          ref={ref}
          onFocus={handleFocus}
          onBlur={handleBlur}
          className={cn(
            "w-full transition-all duration-300 font-bold outline-none border-2",
            sizeConfig.trigger,
            sizeConfig.triggerText,
            theme.placeholder,
            theme.text,
            // Logic thay đổi nền khi Focus giống hệt DataSelect khi Open
            isFocused ? cn(theme.activeBg, theme.activeBorder, "shadow-lg shadow-slate-200/50") : theme.bg,
            !isFocused && theme.border,
            "focus:ring-2",
            theme.focusRing,
            // Style khi có lỗi
            error ? "border-rose-100 bg-rose-50/30" : "",
            className
          )}
          {...props}
        />

        {error && (
          <p className="text-[10px] text-rose-500 font-bold ml-1 uppercase animate-in fade-in slide-in-from-top-1">
            {error}
          </p>
        )}
      </div>
    );
  }
);

DataInput.displayName = "DataInput";