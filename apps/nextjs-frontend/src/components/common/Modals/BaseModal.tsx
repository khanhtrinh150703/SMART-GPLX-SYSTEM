// src/components/common/Modals/BaseModal.tsx
"use client";

import React from "react";
import { X, LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils/utils";

/**
 * BaseModalProps - Thuộc tính cho khung Modal cơ bản
 * @property {LucideIcon} icon - Icon hiển thị ở tiêu đề (English: Title Icon)
 */
interface BaseModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  description?: string;
  icon: LucideIcon;
  children: React.ReactNode;
  maxWidth?: "sm" | "md" | "lg" | "xl" | "2xl";
}

export const BaseModal = ({
  isOpen,
  onClose,
  title,
  description,
  icon: Icon,
  children,
  maxWidth = "lg",
}: BaseModalProps) => {
  if (!isOpen) return null;

  const maxWidthClasses = {
    sm: "max-w-sm",
    md: "max-w-md",
    lg: "max-w-lg",
    xl: "max-w-xl",
    "2xl": "max-w-2xl",
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-300">
      <div className={cn(
        "bg-white w-full rounded-[2rem] shadow-2xl border border-slate-100 overflow-hidden animate-in zoom-in-95 slide-in-from-bottom-4 duration-300",
        maxWidthClasses[maxWidth]
      )}>
        {/* Header (Phần đầu trang) */}
        <div className="px-8 py-6 border-b border-slate-100 flex justify-between items-center bg-gradient-to-r from-slate-50 to-white">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-emerald-100 text-emerald-600 rounded-2xl">
              <Icon size={22} />
            </div>
            <div>
              <h3 className="text-xl font-extrabold text-slate-800">{title}</h3>
              {description && <p className="text-xs text-slate-500 font-medium">{description}</p>}
            </div>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-slate-100 rounded-full text-slate-400 transition-all">
            <X size={20} />
          </button>
        </div>

        {/* Body (Phần thân chứa Form) */}
        <div className="p-8">{children}</div>
      </div>
    </div>
  );
};