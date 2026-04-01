// src/features/admin-users/components/EditUserModal.tsx
"use client";

import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { X, Save, User, Mail, Phone, ShieldCheck, Info } from "lucide-react";
import { UserResponseDTO } from "@/types/user-respone";
import {
  AdminUserFormValues,
  adminUserSchema,
} from "@/lib/validations/auth.schema";
import Button from "@/components/ui/Button/Button";
import Input from "@/components/ui/Input/Input";
import { AdminUpdateFormValues, adminUpdateSchema } from "@/lib/validations/user.schema";

interface EditUserModalProps {
  isOpen: boolean;
  onClose: () => void;
  user: UserResponseDTO | null;
  // onSave ở đây sẽ nhận data từ form và gọi handleUpdate ở component cha
  onSave: (data: AdminUpdateFormValues) => Promise<void>; 
  isLoading: boolean;
}

export default function EditUserModal({
  isOpen,
  onClose,
  user,
  onSave,
  isLoading,
}: EditUserModalProps) {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<AdminUpdateFormValues>({
    
    resolver: zodResolver(adminUpdateSchema),
  });

  useEffect(() => {
    if (user) {
      reset({
        fullName: user.fullName,
        email: user.email,
        // phone: user.phoneNumber || "",
        // licenseClass: "A1",
        // status: user.status === "active" ? "ACTIVE" : "LOCKED",
      });
    }
  }, [user, reset]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-300">
      <div className="bg-white w-full max-w-lg rounded-[2rem] shadow-2xl border border-slate-100 overflow-hidden animate-in zoom-in-95 slide-in-from-bottom-4 duration-300">
        {/* Header: Gradient nhẹ và Icon tiêu đề */}
        <div className="px-8 py-6 border-b border-slate-100 flex justify-between items-center bg-gradient-to-r from-slate-50 to-white">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-emerald-100 text-emerald-600 rounded-2xl">
              <User size={22} />
            </div>
            <div>
              <h3 className="text-xl font-extrabold text-slate-800">
                Chỉnh sửa học viên
              </h3>
              <p className="text-xs text-slate-500 font-medium">
                Cập nhật thông tin chi tiết hệ thống
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-slate-100 rounded-full text-slate-400 hover:text-slate-600 transition-all"
          >
            <X size={20} />
          </button>
        </div>

        {/* Body: Form với các Icon gợi ý */}
        <form onSubmit={handleSubmit(onSave)} className="p-8 space-y-5">
          {/* Section: Thông tin cá nhân */}
          <div className="space-y-4">
            <div>
              <label className="flex items-center gap-2 text-sm font-bold text-slate-700 mb-1.5 ml-1">
                <User size={14} className="text-slate-400" />
                Họ và tên
              </label>
              <Input
                placeholder="Nhập họ tên đầy đủ"
                disabled={isLoading}
                {...register("fullName")}
                error={errors.fullName?.message}
                className="rounded-2xl border-slate-200 focus:ring-emerald-500/20"
              />
            </div>

            <div>
              <label className="flex items-center gap-2 text-sm font-bold text-slate-700 mb-1.5 ml-1">
                <Mail size={14} className="text-slate-400" />
                Địa chỉ Email
              </label>
              <div className="relative group">
                <Input
                  readOnly
                  disabled={isLoading}
                  {...register("email")}
                  error={errors.email?.message}
                  className="rounded-2xl bg-slate-50 border-slate-200 text-slate-500 cursor-not-allowed italic"
                />
                <div
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-300 group-hover:text-amber-500 transition-colors cursor-help"
                  title="Email không thể thay đổi"
                >
                  <Info size={16} />
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="flex items-center gap-2 text-sm font-bold text-slate-700 mb-1.5 ml-1">
                  <Phone size={14} className="text-slate-400" />
                  Số điện thoại
                </label>
                <div className="relative group">
                  <Input
                    placeholder="84987654321"
                    readOnly
                    className="rounded-2xl bg-slate-50 border-slate-200 text-slate-500 cursor-not-allowed italic"
                    // placeholder="84987654321" // Không nên dùng placeholder để hiển thị dữ liệu chính
                  />
                  <div
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-300 group-hover:text-amber-500 transition-colors cursor-help"
                    title="Thông tin này không thể thay đổi"
                  >
                    <Info size={16} />
                  </div>
                </div>
              </div>
              <div>
                <label className="flex items-center gap-2 text-sm font-bold text-slate-700 mb-1.5 ml-1">
                  <ShieldCheck size={14} className="text-slate-400" />
                  Hạng bằng lái
                </label>
                <select
                  // {...register("licenseClass")}
                  className="w-full h-[52px] px-4 rounded-2xl border border-slate-200 bg-white text-slate-700 focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10 transition-all outline-none"
                >
                  <option value="A1">Hạng A1</option>
                  <option value="A2">Hạng A2</option>
                  <option value="B1">Hạng B1</option>
                  <option value="B2">Hạng B2</option>
                </select>
              </div>
            </div>
          </div>

          {/* Footer: Nút bấm cách điệu */}
          <div className="pt-6 flex gap-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-[0.4] px-6 py-3.5 rounded-2xl border border-slate-200 font-bold text-slate-500 hover:bg-slate-50 hover:text-slate-700 hover:border-slate-300 transition-all active:scale-95"
            >
              Hủy bỏ
            </button>
            <Button
              type="submit"
              variant="primary"
              isLoading={isLoading}
              className="flex-1 h-[56px] rounded-2xl shadow-lg shadow-emerald-500/20 transition-all active:scale-95"
              text="Xác nhận thay đổi"
            />
          </div>
        </form>
      </div>
    </div>
  );
}
