// src/features/exam-management/components/matrix-form.variants.ts
import { cva } from 'class-variance-authority';

export const inputVariants = cva(
  'w-full h-12 px-4 rounded-2xl bg-slate-50 border-none ring-1 ring-slate-200 focus:ring-2 focus:ring-emerald-500 transition-all outline-none text-slate-900 placeholder:text-slate-400',
  {
    variants: {
      hasError: {
        true: 'ring-rose-500 focus:ring-rose-500',
        false: 'ring-slate-200',
      },
    },
    defaultVariants: {
      hasError: false,
    },
  }
);