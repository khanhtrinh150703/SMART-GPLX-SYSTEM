import React, { forwardRef } from "react";
import { ChevronLeft } from "lucide-react"; 
import { cn } from "@/lib/utils/utils";
import { GlassBackButtonProps, glassBackVariants } from "./variant";

/**
 * GlassBackButton Component - Minimalist Compact
 * Thành phần nút quay lại với phong cách tối giản, nhỏ gọn
 */
export const GlassBackButton = forwardRef<HTMLButtonElement, GlassBackButtonProps>(
  ({ className, theme, size, children = "Quay lại", ...props }, ref) => {
    return (
      <button
        ref={ref}
        className={cn(glassBackVariants({ theme, size }), className)}
        {...props}
      >
        <ChevronLeft 
          className="w-4 h-4 transition-transform duration-300 group-hover:-translate-x-1" 
          strokeWidth={2.2} 
        />
        
        <span className="font-bold tracking-tight text-[12px] leading-none">
          {children}
        </span>
      </button>
    );
  }
);

GlassBackButton.displayName = "GlassBackButton";