"use client";

import React, { useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  AlertTriangle, 
  LucideIcon, 
  Trash2, 
  Info, 
  X, 
  AlertCircle, 
} from "lucide-react";
import Button from "@/components/ui/Button/Button";
import { cn } from "@/lib/utils/utils";
import { backdropVariants, modalVariants } from "./base-modal.variants";

// --- ANIMATION VARIANTS (Biến thể hoạt họa) ---
const alertVariants = {
  hidden: { opacity: 0, y: -20, scale: 0.95 },
  visible: { opacity: 1, y: 0, scale: 1 },
  exit: { opacity: 0, scale: 0.9, transition: { duration: 0.2 } }
};

interface BaseConfirmModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => Promise<void> | void;
  isLoading: boolean;
  title: string;
  message: string | React.ReactNode;
  confirmText?: string;
  variant?: "danger" | "warning" | "info";
  icon?: LucideIcon;

  // --- API MESSAGE PROPS (Thông báo từ hệ thống) ---
  apiMessage?: { intent: "success" | "error" | "warning" | "info"; text: string } | null;
  onApiMessageClose?: () => void;
}

/**
 * @description Modal xác nhận hành động tối giản, mượt mà (Minimalist Smooth Confirm Modal)
 * Tuân thủ Emerald Theme & Strict Typing.
 */
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
  apiMessage,
  onApiMessageClose,
}: BaseConfirmModalProps) {

  // 1. Cấu hình màu sắc theo biến thể (Variant Configuration)
  const variantConfig = {
    danger: {
      bg: "bg-rose-50",
      text: "text-rose-500",
      btn: "bg-rose-500 hover:bg-rose-600 shadow-rose-100",
      icon: CustomIcon || Trash2,
    },
    warning: {
      bg: "bg-amber-50",
      text: "text-amber-500",
      btn: "bg-amber-500 hover:bg-amber-600 shadow-amber-100",
      icon: CustomIcon || AlertTriangle,
    },
    info: {
      bg: "bg-emerald-50",
      text: "text-emerald-500",
      btn: "bg-emerald-600 hover:bg-emerald-700 shadow-emerald-100",
      icon: CustomIcon || Info,
    },
  };

  // 2. Cấu hình màu sắc cho Alert hệ thống (Intent Mapping)
  const intentConfig = {
    error: "bg-rose-50 border-rose-100 text-rose-600",
    success: "bg-emerald-50 border-emerald-100 text-emerald-600",
    warning: "bg-amber-50 border-amber-100 text-amber-600",
    info: "bg-blue-50 border-blue-100 text-blue-600",
  };

  const config = variantConfig[variant];
  const Icon = config.icon;

  // Tự động đóng thông báo lỗi sau 5 giây (Auto-close side effect)
  useEffect(() => {
    if (apiMessage && onApiMessageClose) {
      const timer = setTimeout(() => {
        onApiMessageClose();
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [apiMessage, onApiMessageClose]);

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          
          {/* BACKDROP (Lớp nền mờ) */}
          <motion.div
            className="absolute inset-0 bg-slate-900/40 backdrop-blur-[6px]"
            variants={backdropVariants}
            initial="hidden"
            animate="visible"
            exit="hidden"
            onClick={!isLoading ? onClose : undefined}
          />

          {/* MAIN MODAL CONTAINER (Khung chứa Modal chính) */}
          <motion.div
            layout // Layout Projection: Tự động tính toán lại vị trí khi nội dung thay đổi
            variants={modalVariants}
            initial="hidden"
            animate="visible"
            exit="hidden"
            className="relative w-full max-w-sm bg-white rounded-[2.5rem] p-8 shadow-2xl border border-slate-100 flex flex-col items-center text-center overflow-hidden"
          >
            {/* VISUAL ICON (Biểu tượng thị giác) */}
            <motion.div 
              layout
              className={cn("w-20 h-20 rounded-3xl flex items-center justify-center mb-6", config.bg, config.text)}
            >
              <Icon size={40} strokeWidth={1.5} />
            </motion.div>

            {/* CONTENT (Nội dung văn bản) */}
            <motion.div layout className="mb-8">
              <h3 className="text-xl font-black text-slate-900 mb-2 tracking-tight">
                {title}
              </h3>
              <div className="text-slate-500 font-medium text-sm leading-relaxed px-2">
                {message}
              </div>
            </motion.div>

            {/* API MESSAGE ALERT (Thông báo phản hồi từ hệ thống) */}
            <AnimatePresence mode="popLayout">
              {apiMessage && (
                <motion.div
                  key="api-alert"
                  variants={alertVariants}
                  initial="hidden"
                  animate="visible"
                  exit="exit"
                  className={cn(
                    "w-full mb-6 p-4 rounded-2xl border flex items-start gap-3 relative transition-colors",
                    intentConfig[apiMessage.intent]
                  )}
                >
                  <AlertCircle size={18} className="shrink-0 mt-0.5" />
                  
                  <div className="flex-1 text-left">
                    <p className="text-[10px] font-black uppercase tracking-wider leading-tight">
                      Hệ thống thông báo
                    </p>
                    <p className="text-xs font-bold mt-1 opacity-90 leading-snug">
                      {apiMessage.text}
                    </p>
                  </div>

                  {onApiMessageClose && (
                    <button
                      type="button" // Prevent default submit (Ngăn chặn tự động gửi form)
                      onClick={onApiMessageClose}
                      className="p-1 hover:bg-black/5 rounded-lg transition-colors"
                    >
                      <X size={14} />
                    </button>
                  )}
                </motion.div>
              )}
            </AnimatePresence>

            {/* ACTIONS (Các nút hành động) */}
            <motion.div layout className="flex w-full gap-3">
              <button
                type="button" // Tránh trigger submit form cha
                onClick={onClose}
                disabled={isLoading}
                className="flex-1 h-14 rounded-2xl border border-slate-200 font-bold text-slate-500 hover:bg-slate-50 transition-all active:scale-[0.96] disabled:opacity-50"
              >
                Hủy
              </button>
              
              <Button
                type="button" // Phân tách rõ ràng với submit của form chính
                isLoading={isLoading}
                onClick={onConfirm}
                className={cn(
                  "flex-[1.5] h-14 rounded-2xl text-white font-bold transition-all active:scale-[0.96] shadow-lg", 
                  config.btn
                )}
              >
                {confirmText}
              </Button>
            </motion.div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}