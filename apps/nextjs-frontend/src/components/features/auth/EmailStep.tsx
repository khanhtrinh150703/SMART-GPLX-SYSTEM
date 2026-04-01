"use client";

import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import axios from "axios";
import { useRouter } from "next/navigation";
import { authService } from "@/services/auth/auth.service";
import { Alert } from "@/components/ui/Alert";
import Input from "@/components/ui/Input/Input";
import Button from "@/components/ui/Button/Button";
import { EmailFormValues, emailSchema } from "@/lib/validations/user.schema";
import { AuthHeader } from "@/components/layouts/AuthHeader";


interface EmailStepProps {
  onSuccess: (email: string) => void;
}

export const EmailStep = ({ onSuccess }: EmailStepProps) => {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<EmailFormValues>({
    resolver: zodResolver(emailSchema),
  });

  const onSubmit = async (data: EmailFormValues) => {
    setIsLoading(true);
    setServerError(null);
    try {
      await authService.requestForgotPassword({ email: data.email });
      onSuccess(data.email);
    } catch (error) {
      if (axios.isAxiosError(error)) {
        setServerError(error.response?.data?.message || "Email không tồn tại");
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
      {/* 🚀 Phiên bản "Sạch như lau" - Đúng chuẩn Senior Smart-GPLX */}
      <AuthHeader
        title="Quên mật khẩu?"
        description="Nhập email của bạn để nhận mã xác thực (OTP)"
      />

      {/* 🚀 Cách sửa mới: Gọn, sạch và chuyên nghiệp */}
      {serverError && (
        <Alert
          intent="error"
          message={serverError}
          className="mb-8" // 💡 Đẩy margin vào đây, không cần div bọc ngoài nữa
        />
      )}

      {/* SỬA TẠI ĐÂY: Tăng space-y-6 lên space-y-10 để Input và Button cách xa nhau */}
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-10">
        <div className="relative">
          <Input
            label="Địa chỉ Email"
            type="email"
            placeholder="example@gmail.com"
            disabled={isLoading}
            {...register("email")}
            error={errors.email?.message}
          />
        </div>

        <div className="flex flex-col gap-4">
          {/* 1. NÚT CHÍNH: Dùng hệ thống Variant & Size đã định nghĩa */}
          <Button
            type="submit"
            variant="primary"
            size="lg" // 💡 lg đã có w-full, py-3.5, font-semibold
            isLoading={isLoading}
            text={isLoading ? "Đang gửi mã..." : "Gửi mã xác thực"}
          />

          {/* 2. NÚT PHỤ: Dùng Button Component với variant "ghost" */}
          <Button
            type="button"
            variant="ghost" // 💡 Tạo một variant nhẹ nhàng cho các nút quay lại
            size="md"
            onClick={() => router.push("/login")}
            className="text-slate-500 hover:text-slate-800 font-bold"
          >
            Quay lại đăng nhập
          </Button>
        </div>
      </form>
    </div>
  );
};
