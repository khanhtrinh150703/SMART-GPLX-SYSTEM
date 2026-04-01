// src/components/features/admin-users/components/DeleteConfirmModal.tsx
"use client";

import React from "react";
import { AlertTriangle, X } from "lucide-react";
import Button from "@/components/ui/Button/Button";

interface DeleteConfirmModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => Promise<void>;
  isLoading: boolean;
  userName: string;
}

/**
 * Mục đích (Purpose): Modal xác nhận trước khi thực hiện hành động xóa tài khoản (Destructive Action).
 */
export default function DeleteConfirmModal({ isOpen, onClose, onConfirm, isLoading, userName }: DeleteConfirmModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white w-full max-w-md rounded-3xl shadow-soft overflow-hidden animate-in zoom-in-95 duration-200">
        <div className="p-6 text-center">
          <div className="w-16 h-16 bg-rose-50 text-rose-500 rounded-full flex items-center justify-center mx-auto mb-4">
            <AlertTriangle size={32} />
          </div>
          <h3 className="text-xl font-bold text-slate-900 mb-2">Xác nhận xóa tài khoản</h3>
          <p className="text-slate-500 text-sm mb-6">
            Bạn có chắc chắn muốn xóa tài khoản của <span className="font-bold text-slate-800">{userName}</span>? 
            Hành động này không thể hoàn tác .
          </p>
          
          <div className="flex gap-3">
            <button
              onClick={onClose}
              disabled={isLoading}
              className="flex-1 px-6 py-3 rounded-xl border border-slate-200 font-bold text-slate-600 hover:bg-slate-50 transition-all disabled:opacity-50"
            >
              Hủy bỏ
            </button>
            <Button
              variant="primary" // Hoặc "danger" nếu bạn có variant này
              size="md"
              isLoading={isLoading}
              onClick={onConfirm}
              text="Đồng ý xóa"
            />
          </div>
        </div>
      </div>
    </div>
  );
}