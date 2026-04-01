// src/components/ui/Badge.tsx
import React from 'react';
import { VariantProps } from 'class-variance-authority';
import { badgeVariants, dotVariants } from '@/components/ui/Badge/badge.variants';
import { cn } from '@/lib/utils/utils';

interface BadgeProps 
  extends React.HTMLAttributes<HTMLDivElement>, 
    VariantProps<typeof badgeVariants> {
  showDot?: boolean; // 💡 Có hiện chấm tròn không?
  pulse?: boolean;   // 💡 Chấm tròn có nhấp nháy không?
}

export const Badge = ({ children, intent, showDot, pulse, className, ...props }: BadgeProps) => {
  return (
    <div 
      className={cn(badgeVariants({ intent }), className)} 
      {...props}
    >
      {/* 🔴 Tự động hiển thị chấm tròn với màu khớp theo intent */}
      {showDot && (
        <span className={cn(
          dotVariants({ intent }), 
          pulse && "animate-pulse" // 💡 Nhấp nháy nếu pulse={true}
        )} />
      )}
      {children}
    </div>
  );
};