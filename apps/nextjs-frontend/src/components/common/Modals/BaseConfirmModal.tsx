// src/components/common/Modals/BaseConfirmModal.tsx
"use client";

import React from "react";
import { AlertTriangle, LucideIcon, Trash2 } from "lucide-react";
import Button from "@/components/ui/Button/Button";
import { BaseModal } from "./BaseModal"; // Tái sử dụng BaseModal đã viết ở câu trước

/**
 * BaseConfirmModalProps - Thuộc tính cho Modal xác nhận hành động
 * @param {string} confirmText - Chữ hiển thị trên nút xác nhận (English: Confirm Label)
 * @param {"danger" | "warning" | "info"} variant - Cấp độ cảnh báo (English: Alert Level)
 */
interface BaseConfirmModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => Promise<void>;
  isLoading: boolean;
  title: string;
  message: string | React.ReactNode;
  confirmText?: string;
  variant?: "danger" | "warning" | "info";
  icon?: LucideIcon;
}

export default function BaseConfirmModal({
  isOpen,
  onClose,
  onConfirm,
  isLoading,
  title,
  message,
  confirmText = "Xác nhận",
  variant = "danger",
  icon: CustomIcon,
}: BaseConfirmModalProps) {
  
  // Cấu hình màu sắc dựa trên variant (English: Variant-based styling)
  const variantConfig = {
    danger: {
      bg: "bg-rose-50",
      text: "text-rose-500",
      button: "bg-rose-500 hover:bg-rose-600 shadow-rose-500/20",
      icon: CustomIcon || AlertTriangle,
    },
    warning: {
      bg: "bg-amber-50",
      text: "text-amber-500",
      button: "bg-amber-500 hover:bg-amber-600 shadow-amber-500/20",
      icon: CustomIcon || AlertTriangle,
    },
    info: {
      bg: "bg-emerald-50",
      text: "text-emerald-500",
      button: "bg-emerald-500 hover:bg-emerald-600 shadow-emerald-500/20",
      icon: CustomIcon || Trash2,
    },
  };

  const config = variantConfig[variant];
  const Icon = config.icon;

  return (
    <BaseModal
      isOpen={isOpen}
      onClose={onClose}
      title={title}
      icon={Icon}
      maxWidth="sm"
    >
      <div className="flex flex-col items-center text-center">
        {/* Icon cảnh báo lớn phía trên (English: Visual Alert) */}
        <div className={`w-20 h-20 ${config.bg} ${config.text} rounded-full flex items-center justify-center mb-6 animate-in zoom-in duration-300`}>
          <Icon size={40} />
        </div>

        <p className="text-slate-500 text-sm leading-relaxed mb-8">
          {message}
        </p>

        <div className="flex w-full gap-3">
          <button
            onClick={onClose}
            disabled={isLoading}
            className="flex-1 px-6 py-3.5 rounded-2xl border border-slate-200 font-bold text-slate-500 hover:bg-slate-50 transition-all active:scale-95 disabled:opacity-50"
          >
            Hủy bỏ
          </button>
          <Button
            isLoading={isLoading}
            onClick={onConfirm}
            className={`flex-1 h-[52px] rounded-2xl text-white font-bold transition-all active:scale-95 shadow-lg ${config.button}`}
            text={confirmText}
          />
        </div>
      </div>
    </BaseModal>
  );
}