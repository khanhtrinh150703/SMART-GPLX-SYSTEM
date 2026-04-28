// src/components/common/Modals/BaseModal.tsx
"use client";

import React, { useEffect } from "react";
import { X, LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils/utils";
import { baseModalVariants as variants } from "./base-modal.variants";
// QUAN TRỌNG: Phải import cái Alert vào đây (Import the Alert component)
import { Alert } from "@/components/ui/Alert";

/**
 * BaseModalProps - Thuộc tính cho khung Modal cơ bản
 * @property {LucideIcon} icon - Icon hiển thị ở tiêu đề
 * @property {string} maxWidth - Độ rộng tối đa của Modal
 */
export interface BaseModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  description?: string;
  icon: LucideIcon;
  children: React.ReactNode;
  maxWidth?:
    | "sm"
    | "md"
    | "lg"
    | "xl"
    | "2xl"
    | "3xl"
    | "4xl"
    | "5xl"
    | "6xl"
    | "7xl";
  className?: string;

  // --- BỔ SUNG 2 DÒNG NÀY ĐỂ NHẬN THÔNG BÁO TỪ CHA TRUYỀN XUỐNG ---
  message?: { intent: "success" | "error" | "warning"; text: string } | null;
  onMessageClose?: () => void;
}

export const BaseModal = ({
  isOpen,
  onClose,
  title,
  description,
  icon: Icon,
  children,
  maxWidth = "lg",
  className,
  // --- BỔ SUNG Ở ĐÂY ĐỂ LẤY BIẾN RA DÙNG ---
  message,
  onMessageClose,
}: BaseModalProps) => {
  // Khóa cuộn trang nền khi mở Modal
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className={variants.overlay()}>
      {/* Click ra ngoài để đóng Modal */}
      <div className="absolute inset-0 z-0" onClick={onClose} />

      {/* Khung Modal chính */}
      <div
        className={cn(
          variants.contentWrapper({ maxWidth }),
          "relative z-10 flex flex-col",
          className,
        )}
      >
        {/* Header (Phần đầu trang) */}
        <div className={variants.header()}>
          <div className={variants.titleGroup()}>
            <div className={variants.iconWrapper()}>
              <Icon size={22} />
            </div>
            <div>
              <h3 className={variants.titleText()}>{title}</h3>
              {description && (
                <p className={variants.descText()}>{description}</p>
              )}
            </div>
          </div>
          <button onClick={onClose} className={variants.closeButton()}>
            <X size={20} />
          </button>
        </div>

        {/* --- KHU VỰC HIỂN THỊ LỖI (ALERT SECTION) --- */}
        {/* Nếu có message được ném vào, nó sẽ hiện ở ngay dưới Header */}
        {message && (
          <div className="px-6 pt-4 animate-in fade-in slide-in-from-top-2 duration-300">
            <Alert
              intent={message.intent}
              message={message.text}
              onClose={onMessageClose}
              duration={10000}
            />
          </div>
        )}

        {/* Body (Phần thân chứa Form/Nội dung) */}
        {/* Lớp flex-1 và overflow-y-auto giúp nội dung tự cuộn */}
        <div className={cn(variants.body(), "flex-1 overflow-y-auto")}>
          {children}
        </div>
      </div>
    </div>
  );
};
