// src/components/common/Errors/global-error.variants.ts
import { cva } from "class-variance-authority";

export const errorVariants = cva(
    "min-h-[70vh] flex flex-col items-center justify-center text-center px-6 animate-in fade-in duration-700",
    {
        variants: {
            intent: {
                danger: "bg-transparent",
            }
        },
        defaultVariants: {
            intent: "danger",
        }
    }
);

export const iconBoxVariants = cva(
    "relative w-24 h-24 rounded-[2.5rem] bg-white shadow-soft border border-slate-100 flex items-center justify-center mb-8 transform hover:scale-105 transition-transform",
);

export const nfVariants = cva(
    "min-h-screen bg-slate-50 flex flex-col items-center justify-center p-8 text-center animate-in fade-in duration-700",
);

export const nfIconBoxVariants = cva(
    "relative w-40 h-40 bg-white rounded-[3rem] shadow-soft border border-slate-100 flex items-center justify-center transform hover:rotate-6 transition-transform duration-500",
);