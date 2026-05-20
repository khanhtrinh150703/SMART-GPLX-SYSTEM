"use client";

import React, { useEffect, useState } from "react";
import { useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import axios from "axios";
import {
  UserPlus,
  Mail,
  Lock,
  ShieldCheck,
  User as UserIcon,
  Check,
} from "lucide-react";
import { BaseModal } from "@/components/common/Modals/BaseModal";
import Button from "@/components/ui/Button/Button";
import { FormField } from "@/components/common/Form/FormField";
import { FormGrid } from "@/components/common/Form/FormGrid";
import { CreateUserPayload, createUserSchema } from "../schema/user.schema";
import { Alert } from "@/components/ui/Alert";
import { User } from "@/types/user.type";
import { cn } from "@/lib/utils/utils";

interface CreateUserModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: CreateUserPayload) => Promise<User>;
  isLoading: boolean;
  roleOptions: { value: string; label: string }[];
}

export default function CreateUserModal({
  isOpen,
  onClose,
  onSave,
  isLoading,
  roleOptions,
}: CreateUserModalProps) {
  const ADMIN_ID =
    roleOptions.find((r) => r.label === "ADMIN")?.value || "ADMIN";
  const STUDENT_ID =
    roleOptions.find((r) => r.label === "STUDENT")?.value || "STUDENT";
  // Khởi tạo React Hook Form
  const {
    register,
    handleSubmit,
    reset,
    control,
    setValue,
    getValues,
    formState: { errors },
  } = useForm<CreateUserPayload>({
    resolver: zodResolver(createUserSchema),
    defaultValues: {
      username: "",
      fullName: "",
      email: "",
      password: "",
      confirmPassword: "",
      roles: [STUDENT_ID],
    },
  });

  const [message, setMessage] = useState<{
    type: "success" | "error" | "warning";
    text: string;
  } | null>(null);

  useEffect(() => {
    if (isOpen) {
      reset({
        username: "",
        fullName: "",
        email: "",
        password: "",
        confirmPassword: "",
        roles: [STUDENT_ID], // <--- Đổi chữ "STUDENT" thành STUDENT_ID ở đây
      });
    }
  }, [isOpen, reset, STUDENT_ID]);

  const selectedRoles = useWatch({
    control,
    name: "roles",
    defaultValue: [],
  }) as string[];

  const handleToggleRole = (roleId: string) => {
    if (isLoading) return;
    const currentRoles = getValues("roles") || [];

    // TRƯỜNG HỢP 1: Click vào ADMIN
    if (roleId === ADMIN_ID) {
      // Đang có ADMIN thì gỡ (về ID của STUDENT). Chưa có thì gán duy nhất ID của ADMIN
      setValue(
        "roles",
        currentRoles.includes(ADMIN_ID) ? [STUDENT_ID] : [ADMIN_ID],
        { shouldValidate: true },
      );
      return;
    }

    // TRƯỜNG HỢP 2: Click vào quyền khác
    let newRoles = [...currentRoles];

    if (newRoles.includes(ADMIN_ID)) {
      newRoles = [roleId]; // Xóa ADMIN đi, chỉ nhận quyền vừa bấm
    } else {
      if (newRoles.includes(roleId)) {
        newRoles = newRoles.filter((id) => id !== roleId); // Đã có thì gỡ
      } else {
        newRoles.push(roleId); // Chưa có thì thêm
      }
    }

    if (newRoles.length === 0) {
      newRoles = [STUDENT_ID];
    }

    setValue("roles", newRoles, { shouldValidate: true });
  };

  const onSubmit = async (data: CreateUserPayload) => {
    try {
      setMessage(null);
      await onSave(data);
      setMessage({ type: "success", text: "Thêm mới học viên thành công!" });
      reset();
    } catch (error: unknown) {
      let errorText = "Đã xảy ra lỗi không xác định hệ thống.";
      if (axios.isAxiosError(error)) {
        errorText =
          error.response?.data?.message || "Không thể kết nối đến máy chủ API.";
      } else if (error instanceof Error) {
        errorText = error.message;
      }
      setMessage({ type: "error", text: errorText });
    }
  };

  return (
    <BaseModal
      isOpen={isOpen}
      onClose={onClose}
      title="Thêm mới Người dùng"
      description="Cấp tài khoản truy cập hệ thống Smart-GPLX cho học viên hoặc quản trị viên."
      icon={UserPlus}
      maxWidth="lg"
    >
      {message && (
        <Alert
          key={message.text}
          intent={message.type}
          message={message.text}
          duration={6000}
          onClose={() => setMessage(null)}
        />
      )}

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
        {/* Hàng 1: Tên đăng nhập & Họ tên */}
        <FormField
          label="Tên đăng nhập "
          icon={UserIcon}
          placeholder="VD: admin3"
          {...register("username")}
          error={errors.username?.message}
          disabled={isLoading}
        />
        <FormField
          label="Họ và tên "
          icon={ShieldCheck}
          placeholder="VD: Wangwu"
          {...register("fullName")}
          error={errors.fullName?.message}
          disabled={isLoading}
        />
        {/* Hàng 2: Email */}
        <FormField
          label="Địa chỉ Email"
          icon={Mail}
          type="email"
          placeholder="VD: Wangwu@gmail.com"
          {...register("email")}
          error={errors.email?.message}
          disabled={isLoading}
        />
        {/* Hàng 3: Mật khẩu & Xác nhận mật khẩu */}
        <FormGrid cols={2}>
          <FormField
            label="Mật khẩu "
            icon={Lock}
            type="password"
            placeholder="Nhập mật khẩu..."
            {...register("password")}
            error={errors.password?.message}
            disabled={isLoading}
          />
          <FormField
            label="Xác nhận mật khẩu"
            icon={Lock}
            type="password"
            placeholder="Nhập lại mật khẩu..."
            {...register("confirmPassword")}
            error={errors.confirmPassword?.message}
            disabled={isLoading}
          />
        </FormGrid>{" "}
        {/* Hàng 4: Khu vực chọn Vai trò Hệ thống (Bố cục dàn trang rộng rãi, thoáng đãng) */}
        <div className="flex flex-col gap-3 pt-1">
          <label className="flex items-center gap-2 text-sm font-bold text-slate-700 ml-1">
            <ShieldCheck size={16} className="text-emerald-500" /> Vai trò hệ
            thống
          </label>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {roleOptions.map((role) => {
              const isActive = (selectedRoles || []).includes(role.value);
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
                      <Check size={14} className="text-white" strokeWidth={3} />
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
        {/* Nút Hành động */}
        <div className="pt-4 flex gap-4">
          <button
            type="button"
            onClick={() => {
              onClose();
              reset();
              setMessage(null);
            }}
            disabled={isLoading}
            className="flex-[0.4] px-6 py-3.5 rounded-2xl border border-slate-200 font-bold text-slate-500 hover:bg-slate-50 transition-all active:scale-95"
          >
            Hủy bỏ
          </button>
          <Button
            type="submit"
            variant="primary"
            isLoading={isLoading}
            text="Tạo tài khoản"
            className="flex-1 h-[56px] rounded-2xl shadow-lg shadow-emerald-500/20 active:scale-[0.98]"
          />
        </div>
      </form>
    </BaseModal>
  );
}
