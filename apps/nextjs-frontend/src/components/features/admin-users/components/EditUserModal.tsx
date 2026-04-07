// src/features/admin-users/components/EditUserModal.tsx
"use client";

import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { User, Mail } from "lucide-react";
import { BaseModal } from "@/components/common/Modals/BaseModal";
import Button from "@/components/ui/Button/Button";
import Input from "@/components/ui/Input/Input";

import { UserResponseDTO } from "@/types/user-respone";
import { AdminUpdatePayload, adminUpdateSchema } from "../schema/user.schema";

interface EditUserModalProps {
  isOpen: boolean;
  onClose: () => void;
  user: UserResponseDTO | null;
  onSave: (data: AdminUpdatePayload) => Promise<void>;
  isLoading: boolean;
}

export default function EditUserModal({
  isOpen,
  onClose,
  user,
  onSave,
  isLoading,
}: EditUserModalProps) {
  const { register, handleSubmit, reset, formState: { errors } } = useForm<AdminUpdatePayload>({
    resolver: zodResolver(adminUpdateSchema),
  });

  useEffect(() => {
    if (user) reset({ fullName: user.fullName, email: user.email });
  }, [user, reset]);

  return (
    <BaseModal
      isOpen={isOpen}
      onClose={onClose}
      title="Chỉnh sửa học viên"
      description="Cập nhật thông tin chi tiết hệ thống"
      icon={User}
    >
      <form onSubmit={handleSubmit(onSave)} className="space-y-5">
        <div className="space-y-4">
          {/* Trường nhập liệu: Họ tên (Full Name) */}
          <div>
            <label className="flex items-center gap-2 text-sm font-bold text-slate-700 mb-1.5 ml-1">
              <User size={14} className="text-slate-400" /> Họ và tên
            </label>
            <Input
              {...register("fullName")}
              error={errors.fullName?.message}
              disabled={isLoading}
            />
          </div>

          {/* Email (Read Only - Chỉ đọc) */}
          <div>
            <label className="flex items-center gap-2 text-sm font-bold text-slate-700 mb-1.5 ml-1">
              <Mail size={14} className="text-slate-400" /> Email
            </label>
            <Input
              readOnly
              className="bg-slate-50 italic cursor-not-allowed"
              {...register("email")}
            />
          </div>
        </div>

        {/* Nút hành động (Actions) */}
        <div className="pt-4 flex gap-4">
          <button
            type="button"
            onClick={onClose}
            className="flex-[0.4] px-6 py-3.5 rounded-2xl border border-slate-200 font-bold text-slate-500 hover:bg-slate-50 transition-all"
          >
            Hủy bỏ
          </button>
          <Button
            type="submit"
            variant="primary"
            isLoading={isLoading}
            className="flex-1 h-[56px] rounded-2xl"
            text="Xác nhận thay đổi"
          />
        </div>
      </form>
    </BaseModal>
  );
}