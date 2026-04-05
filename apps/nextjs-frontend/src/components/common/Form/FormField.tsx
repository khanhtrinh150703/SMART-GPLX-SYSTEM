// src/components/common/Form/FormField.tsx
"use client";

import React, { forwardRef } from "react";
import { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils/utils";

// Định nghĩa Union Type cho các phần tử Form (English: Element Union Type)
type FormElement = HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement;

// Tận dụng Utility Types của React để gộp các Attributes
interface FormFieldProps extends React.InputHTMLAttributes<FormElement> {
  label: string;
  icon?: LucideIcon;
  error?: string;
  isTextArea?: boolean;
  isSelect?: boolean;
  children?: React.ReactNode;
}

export const FormField = forwardRef<FormElement, FormFieldProps>(
  ({ label, icon: Icon, error, isTextArea, isSelect, className, children, ...props }, ref) => {
    
    // Class dùng chung (Common Classes)
    const inputClasses = cn(
      "w-full p-3 rounded-2xl border bg-slate-50 outline-none transition-all focus:ring-4 focus:ring-emerald-500/10 text-sm",
      error ? "border-rose-500 focus:border-rose-500" : "border-slate-200 focus:border-emerald-500",
      props.disabled && "opacity-60 cursor-not-allowed bg-slate-100",
      className
    );

    return (
      <div className="flex flex-col gap-1.5 w-full">
        {/* Label & Icon */}
        <label className="flex items-center gap-2 text-sm font-bold text-slate-700 ml-1">
          {Icon && <Icon size={14} className="text-slate-400" />}
          {label}
        </label>

        {/* Logic Render không dùng 'any' (English: Type-safe conditional rendering) */}
        {isTextArea ? (
          <textarea 
            ref={ref as React.ForwardedRef<HTMLTextAreaElement>} 
            className={cn(inputClasses, "min-h-[100px] resize-none")} 
            {...(props as React.TextareaHTMLAttributes<HTMLTextAreaElement>)} 
          />
        ) : isSelect ? (
          <select 
            ref={ref as React.ForwardedRef<HTMLSelectElement>} 
            className={inputClasses} 
            {...(props as React.SelectHTMLAttributes<HTMLSelectElement>)}
          >
            {children}
          </select>
        ) : (
          <input 
            ref={ref as React.ForwardedRef<HTMLInputElement>} 
            className={inputClasses} 
            {...(props as React.InputHTMLAttributes<HTMLInputElement>)} 
          />
        )}

        {/* Error Message */}
        {error && (
          <span className="text-[11px] text-rose-500 font-medium ml-1 animate-in fade-in slide-in-from-top-1">
            {error}
          </span>
        )}
      </div>
    );
  }
);

FormField.displayName = "FormField";