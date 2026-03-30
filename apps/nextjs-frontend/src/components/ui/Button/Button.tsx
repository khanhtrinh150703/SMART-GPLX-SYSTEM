// src/components/ui/Button.tsx
import React from "react";
import { VariantProps } from "class-variance-authority";
import { buttonVariants } from "@/components/ui/Button/button.variants";
import { cn } from "@/lib/utils/utils";

export interface ButtonProps
  extends
    React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  text?: string;
  isLoading?: boolean;
}

export default function Button({
  text,
  isLoading,
  variant,
  size,
  children,
  className,
  disabled,
  ...props
}: ButtonProps) {
  return (
    <button
      // 💡 DUNG HỢP: Gọi class từ variants + class bổ sung từ ngoài
      className={cn(buttonVariants({ variant, size }), className)}
      disabled={disabled || isLoading}
      {...props}
    >
      {/* 🌀 Vòng xoay Spinner */}
      {isLoading && (
        <svg
          className="w-5 h-5 animate-spin text-current"
          fill="none"
          viewBox="0 0 24 24"
        >
          <circle
            className="opacity-25"
            cx="12"
            cy="12"
            r="10"
            stroke="currentColor"
            strokeWidth="4"
          />
          <path
            className="opacity-75"
            fill="currentColor"
            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
          />
        </svg>
      )}

      {/* Hiển thị nội dung: Text (nếu có) hoặc Children */}
      {text || children}
    </button>
  );
}
