"use client";

import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import axios from "axios";
import { useRouter } from "next/navigation";

// --- IMPORT ATOMIC COMPONENTS ---
import Input from "../../ui/Input";
import Button from "../../ui/Button";
import { Alert } from "../../ui/Alert";

// --- IMPORT LOGIC & TYPES ---
import { authService } from "@/src/services/auth/auth.service";
import { ForgotPasswordPayload } from "@/src/types/auth.type";

const emailSchema = z.object({
  email: z
    .string()
    .email("Địa chỉ Email không hợp lệ")
    .min(1, "Vui lòng nhập Email"),
});

type EmailFormValues = z.infer<typeof emailSchema>;

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
      <div className="text-center mb-10">
        {" "}
        {/* Tăng mb từ 8 lên 10 cho thoáng tiêu đề */}
        <h2 className="text-2xl font-extrabold text-slate-800">
          Quên mật khẩu?
        </h2>
        <p className="text-slate-500 mt-3 font-medium">
          Nhập email của bạn để nhận mã xác thực (OTP)
        </p>
      </div>

      {serverError && (
        <div className="mb-8">
          {" "}
          {/* Tăng khoảng cách dưới thông báo lỗi */}
          <Alert type="error" message={serverError} />
        </div>
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
          {/* NÚT BẤM: Tăng py-4 lên py-5 hoặc h-14 để "giãn kích cỡ" cho sang */}
          <Button
            type="submit"
            isLoading={isLoading}
            className="w-full bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl py-3 font-semibold transition-all shadow-soft disabled:opacity-70 disabled:cursor-not-allowed"
          >
            {isLoading ? "Đang gửi mã..." : "Gửi mã xác thực"}
          </Button>

          {/* NÚT QUAY LẠI: Cách một khoảng nhẹ so với nút chính */}
          <button
            type="button"
            onClick={() => router.push("/login")}
            className="w-full text-slate-500 text-sm font-bold hover:text-slate-800 transition-colors py-2"
          >
            Quay lại đăng nhập
          </button>
        </div>
      </form>
    </div>
  );
};
