"use client";

import React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { UserPlus, User, Mail, Lock, ShieldCheck } from "lucide-react";
import { BaseModal } from "@/components/common/Modals/BaseModal";
import Button from "@/components/ui/Button/Button";
import { FormField } from "@/components/common/Form/FormField";
import { FormGrid } from "@/components/common/Form/FormGrid";
import { CreateUserPayload, createUserSchema } from "../schema/user.schema";



interface CreateUserModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: CreateUserPayload) => Promise<void>; 
  isLoading: boolean;
}

export default function CreateUserModal({
  isOpen,
  onClose,
  onSave,
  isLoading,
}: CreateUserModalProps) {
  
  // Khởi tạo React Hook Form
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<CreateUserPayload>({
    resolver: zodResolver(createUserSchema),
    defaultValues: {
      username: "",
      fullName: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
  });

  // Sự kiện Gửi biểu mẫu (Submit Event)
  const onSubmit = async (data: CreateUserPayload) => {
    await onSave(data);
    reset(); // Làm sạch biểu mẫu (Clear form) sau khi thêm thành công
  };

  return (
    <BaseModal
      isOpen={isOpen}
      onClose={onClose}
      title="Thêm mới Người dùng"
      description="Cấp tài khoản truy cập hệ thống Smart-GPLX cho học viên hoặc quản trị viên."
      icon={UserPlus}
      maxWidth="lg" // Tăng kích thước Modal lên Large (Lớn) vì có nhiều trường nhập liệu
    >
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
        
        {/* Hàng 1: Tên đăng nhập & Họ tên */}
        <FormGrid cols={2}>
          <FormField
            label="Tên đăng nhập (Username)"
            icon={User}
            placeholder="VD: admin3"
            {...register("username")}
            error={errors.username?.message}
            disabled={isLoading}
          />
          <FormField
            label="Họ và tên (Full Name)"
            icon={ShieldCheck}
            placeholder="VD: Wangwu"
            {...register("fullName")}
            error={errors.fullName?.message}
            disabled={isLoading}
          />
        </FormGrid>

        {/* Hàng 2: Email (Chiếm trọn 1 dòng) */}
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
            label="Mật khẩu (Password)"
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
        </FormGrid>

        {/* Nút Hành động (Action Buttons) */}
        <div className="pt-4 flex gap-4">
          <button
            type="button"
            onClick={() => {
              onClose();
              reset(); // Reset form nếu người dùng bấm Hủy (Cancel)
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