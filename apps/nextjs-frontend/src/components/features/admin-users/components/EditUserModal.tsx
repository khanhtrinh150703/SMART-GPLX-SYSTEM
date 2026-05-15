"use client";

import React, { useEffect, useState } from "react";
import { useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { User, ShieldCheck, Check } from "lucide-react";

import { BaseModal } from "@/components/common/Modals/BaseModal";
import { FormField } from "@/components/common/Form/FormField";
import { Alert } from "@/components/ui/Alert/Alert";
import Button from "@/components/ui/Button/Button";
import { cn } from "@/lib/utils/utils";

import { UserResponseDTO } from "@/components/features/admin-users/types/user-respone";
import {
  AdminUpdatePayload,
  updateAdminRequestSchema,
} from "../schema/user.schema";
import axios from "axios";

interface EditUserModalProps {
  isOpen: boolean;
  onClose: () => void;
  user: UserResponseDTO | null;
  onSave: (data: AdminUpdatePayload) => Promise<unknown>;
  isLoading: boolean;
  roleOptions: { value: string; label: string }[];
}

export default function EditUserModal({
  isOpen,
  onClose,
  user,
  onSave,
  isLoading,
  roleOptions,
}: EditUserModalProps) {
  // 1. Quản lý thông báo dựa trên intent (Chuẩn hóa)
  const [message, setMessage] = useState<{
    type: "success" | "error" | "warning";
    text: string;
  } | null>(null);
  const {
    register,
    handleSubmit,
    reset,
    setValue,
    control, // 1. Lấy control ở đây
    formState: { errors },
  } = useForm<AdminUpdatePayload>({
    resolver: zodResolver(updateAdminRequestSchema),
    defaultValues: { roles: [] },
  });

  // 2. Thay thế watch("roles") bằng useWatch
  const selectedRoles = useWatch({
    control,
    name: "roles",
    defaultValue: [], // Giá trị mặc định khi chưa có dữ liệu
  });

  // 2. Đồng bộ hóa dữ liệu khi Modal mở
  useEffect(() => {
    if (user && isOpen) {
      // Đưa vào đây để "lách" việc update đồng bộ
      requestAnimationFrame(() => {
        setMessage(null);
        reset({
          fullName: user.fullName,
          roles: user.roles?.map((r) => r.id) || [],
        });
      });
    }
  }, [user, isOpen, reset, setMessage]);

  // 3. Xử lý Submit và bóc tách lỗi từ Axios
  const handleInternalSubmit = async (data: AdminUpdatePayload) => {
    try {
      setMessage(null); // Xóa lỗi cũ trước khi thử lại

      // Đợi trang cha thực hiện lưu dữ liệu
      await onSave(data);

      // Nếu không có lỗi: Đóng modal (Thành công xử lý ở trang cha qua Toast)
      onClose();
      reset();
    } catch (error) {
      // Nếu trang cha ném lỗi (mutateAsync fail), Modal sẽ bắt ở đây
      let errorText = "Không thể tạo hạng bằng lái. Vui lòng thử lại!";

      if (axios.isAxiosError(error)) {
        errorText = error.response?.data?.message || errorText;
      }

      setMessage({ type: "error", text: errorText });
    }
  };
  const handleToggleRole = (roleId: string) => {
    if (isLoading) return;
    const newRoles = selectedRoles.includes(roleId)
      ? selectedRoles.filter((id) => id !== roleId)
      : [...selectedRoles, roleId];
    setValue("roles", newRoles, { shouldValidate: true });
  };

  return (
    <BaseModal
      isOpen={isOpen}
      onClose={onClose}
      title="Chỉnh sửa học viên"
      description="Quản lý thông tin và quyền hạn (Access Control)"
      icon={User}
    >
      <form
        onSubmit={handleSubmit(handleInternalSubmit)}
        className="space-y-6 pt-2"
      >
        {/* ALERT BOX */}
        {message && (
          <Alert
            key={message.text}
            intent={message.type}
            message={message.text}
            duration={10000}
            onClose={() => setMessage(null)}
          />
        )}

        <div className="space-y-6">
          <FormField
            label="Họ và tên học viên"
            icon={User}
            placeholder="Nhập họ tên..."
            {...register("fullName")}
            error={errors.fullName?.message}
            disabled={isLoading}
          />

          <div className="flex flex-col gap-3">
            <label className="flex items-center gap-2 text-sm font-bold text-slate-700 ml-1">
              <ShieldCheck size={16} className="text-emerald-500" /> Vai trò hệ
              thống
            </label>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {roleOptions.map((role) => {
                const isActive = selectedRoles.includes(role.value);
                return (
                  <div
                    key={role.value}
                    onClick={() => handleToggleRole(role.value)}
                    className={cn(
                      "group flex items-center gap-3 p-4 cursor-pointer transition-all duration-300",
                      "rounded-[1.5rem] border-2 active:scale-[0.96] select-none",
                      isActive
                        ? "bg-emerald-600/5 border-emerald-500 shadow-sm"
                        : "bg-white border-slate-100 hover:border-emerald-200",
                    )}
                  >
                    <div
                      className={cn(
                        "w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all",
                        isActive
                          ? "bg-emerald-500 border-emerald-500"
                          : "border-slate-200",
                      )}
                    >
                      {isActive && (
                        <Check
                          size={14}
                          className="text-white"
                          strokeWidth={3}
                        />
                      )}
                    </div>
                    <span
                      className={cn(
                        "text-sm font-bold",
                        isActive ? "text-emerald-700" : "text-slate-500",
                      )}
                    >
                      {role.label}
                    </span>
                  </div>
                );
              })}
            </div>
            {errors.roles && (
              <p className="text-[11px] text-rose-500 font-medium ml-1 italic">
                {errors.roles.message}
              </p>
            )}
          </div>
        </div>

        <div className="pt-4 flex gap-4">
          <button
            type="button"
            onClick={onClose}
            className="flex-1 px-6 py-4 rounded-[2rem] border border-slate-200 font-bold text-slate-400 hover:bg-slate-50 transition-all"
          >
            Đóng
          </button>
          <Button
            type="submit"
            variant="primary"
            isLoading={isLoading}
            className="flex-[1.5] h-[64px] rounded-[2rem] shadow-xl shadow-emerald-200/40"
            text="Xác nhận cập nhật"
          />
        </div>
      </form>
    </BaseModal>
  );
}
