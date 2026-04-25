"use client";

import React from "react";
import { AlertTriangle, LucideIcon, Trash2, Info } from "lucide-react";
import Button from "@/components/ui/Button/Button";
import { BaseModal } from "./BaseModal";
import { cn } from "@/lib/utils/utils";

/**
 * BaseConfirmModalProps - Thuộc tính cho Modal xác nhận hành động
 */
interface BaseConfirmModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => Promise<void> | void; // Sửa type cho chuẩn
  isLoading: boolean;
  title: string;
  message: string | React.ReactNode; // Nội dung câu hỏi xác nhận
  confirmText?: string;
  variant?: "danger" | "warning" | "info";
  icon?: LucideIcon;
  
  // --- BỔ SUNG 2 DÒNG NÀY ĐỂ FIX LỖI TYPE (Add these to fix the TS error) ---
  apiMessage?: { intent: "success" | "error" | "warning"; text: string } | null;
  onApiMessageClose?: () => void;
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
  // --- BỔ SUNG Ở ĐÂY ĐỂ NHẬN PROPS (Extract the new props) ---
  apiMessage,
  onApiMessageClose,
}: BaseConfirmModalProps) {
  
  // Cấu hình Style và Icon dựa trên variant
  const variantConfig = {
    danger: {
      bg: "bg-rose-50",
      text: "text-rose-500",
      button: "bg-rose-500 hover:bg-rose-600 shadow-rose-500/20",
      icon: CustomIcon || Trash2,
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
      icon: CustomIcon || Info,
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
      message={apiMessage}
      onMessageClose={onApiMessageClose}
    >
      <div className="flex flex-col items-center text-center p-2">
        {/* 1. Icon cảnh báo lớn (Visual Alert) */}
        <div
          className={cn(
            "w-20 h-20 rounded-full flex items-center justify-center mb-6 animate-in zoom-in duration-300",
            config.bg,
            config.text
          )}
        >
          <Icon size={40} />
        </div>

        {/* 2. Nội dung thông báo (Message Body) */}
        <div className="mb-8 px-2">
          <h3 className="text-xl font-bold text-slate-900 mb-2">{title}</h3>
          <div className="text-slate-500 font-medium leading-relaxed">
            {message}
          </div>
        </div>

        {/* 3. Cụm nút bấm (Action Buttons) */}
        <div className="flex w-full gap-3">
          <button
            type="button"
            onClick={onClose}
            disabled={isLoading}
            className="flex-1 px-6 py-3.5 rounded-2xl border border-slate-200 font-bold text-slate-500 hover:bg-slate-50 transition-all active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Hủy bỏ
          </button>
          
          <Button
            isLoading={isLoading}
            onClick={onConfirm}
            className={cn(
              "flex-1 h-[56px] rounded-2xl text-white font-bold transition-all active:scale-95 shadow-lg",
              config.button
            )}
            text={confirmText}
          />
        </div>
      </div>
    </BaseModal>
  );
}