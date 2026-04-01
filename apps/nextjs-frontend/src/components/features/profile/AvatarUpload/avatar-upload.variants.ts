// src/components/ui/avatar/avatar-upload.variants.ts
import { cva } from "class-variance-authority";

export const avatarContainerVariants = cva(
  "relative w-32 h-32 md:w-36 md:h-36 rounded-[2.5rem] overflow-hidden bg-emerald-50 border-4 border-white shadow-soft transition-all duration-500 group-hover:scale-105 group-hover:shadow-emerald-200/60",
  {
    variants: {
      status: {
        default: "",
        disabled: "opacity-50 cursor-not-allowed",
        uploading: "blur-sm scale-110",
      },
    },
    defaultVariants: {
      status: "default",
    },
  }
);

export const actionButtonVariants = cva(
  "absolute p-2.5 shadow-xl transition-all z-30 active:scale-95",
  {
    variants: {
      intent: {
        camera: "bottom-2 right-2 bg-white text-slate-500 hover:text-emerald-600 hover:scale-110 rounded-2xl border border-slate-100",
        delete: "top-2 right-2 bg-rose-500 text-white hover:bg-rose-600 hover:scale-110 rounded-xl shadow-lg",
      },
    },
    defaultVariants: {
      intent: "camera",
    },
  }
);