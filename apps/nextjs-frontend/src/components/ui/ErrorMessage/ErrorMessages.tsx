// src/components/ui/ErrorMessage.tsx
import React from 'react';
import { VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils/utils';
import { errorVariants } from './error-message.variants';

interface ErrorMessageProps 
  extends React.HTMLAttributes<HTMLParagraphElement>, 
    VariantProps<typeof errorVariants> {
  message?: string;
}

export const ErrorMessage = ({ message, intent, className, ...props }: ErrorMessageProps) => {
  if (!message) return null; // 💡 Không có lỗi thì biến mất luôn, không chiếm chỗ

  return (
    <p 
      className={cn(errorVariants({ intent }), "mt-4", className)} 
      {...props}
    >
      {message}
    </p>
  );
};