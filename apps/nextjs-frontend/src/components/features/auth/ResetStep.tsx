"use client";

import { useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import axios from "axios";
import { useRouter } from "next/navigation";

// --- IMPORT ATOMIC COMPONENTS ---
import { ProgressBar } from "../../ui/Progress-Bar";
import { Badge } from "../../ui/Badge";
import { Alert } from "../../ui/Alert";
import Button from "../../ui/Button";
import { OtpInput } from "../../ui/Otp-Input";
import Input from "../../ui/Input"; // Sử dụng đúng component Input của bạn

// --- IMPORT LOGIC & TYPES ---
import { useCountdown } from "@/src/hooks/use-countdown";
import { authService } from "@/src/services/auth/auth.service";
import {
  resetPasswordSchema,
  ResetPasswordSchemaType,
} from "@/src/lib/validations/auth.schema";
import { ResendOtpButton } from "../../ui/Resend-Otp-Button";

interface ResetStepProps {
  email: string;
  onBack: () => void;
}

interface ApiErrorResponse {
  message?: string;
}

export const ResetStep = ({ email, onBack }: ResetStepProps) => {
  const router = useRouter();

  // 1. QUẢN LÝ TRẠNG THÁI
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [serverError, setServerError] = useState<string | null>(null);

  // 2. CẤU HÌNH ĐẾM NGƯỢC
  const RESEND_TIME = 60;
  const EXPIRY_TIME = 300;
  const resendTimer = useCountdown(RESEND_TIME);
  const expiryTimer = useCountdown(EXPIRY_TIME);

  // 3. CẤU HÌNH FORM
  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<ResetPasswordSchemaType>({
    resolver: zodResolver(resetPasswordSchema),
    mode: "onChange",
    defaultValues: {
      otp: "",
      newPassword: "",
      confirmPassword: "",
    },
  });

  // 4. XỬ LÝ GỬI LẠI MÃ
  const handleResendOtp = async () => {
    try {
      setIsLoading(true);
      setServerError(null);
      // await authService.forgotPassword({ email });
      resendTimer.reset(RESEND_TIME);
      expiryTimer.reset(EXPIRY_TIME);
    } catch (error) {
      setServerError("Không thể gửi lại mã, vui lòng thử lại sau.");
    } finally {
      setIsLoading(false);
    }
  };

  // 5. XỬ LÝ SUBMIT
  const onSubmit = async (data: ResetPasswordSchemaType) => {
    setIsLoading(true);
    setServerError(null);
    try {
      await authService.resetPassword({
        email,
        otp: data.otp,
        newPassword: data.newPassword,
      });
      router.push("/login?resetSuccess=true");
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        const serverMsg = (error.response?.data as ApiErrorResponse)?.message;
        setServerError(serverMsg || "Mã OTP không hợp lệ hoặc đã hết hạn");
      } else {
        setServerError("Đã xảy ra lỗi không xác định");
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="relative pt-4 w-full animate-in fade-in duration-500">
      {/* PROGRESS BAR */}
      <div className="absolute top-0 left-0 w-full">
        <ProgressBar
          current={resendTimer.seconds}
          max={RESEND_TIME}
          color={resendTimer.seconds < 10 ? "rose" : "emerald"}
        />
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 mt-6">
        {/* HEADER */}
        <div className="text-center mb-6">
          <h2 className="text-2xl font-bold text-slate-800">
            Đặt lại mật khẩu
          </h2>
          <p className="text-sm text-slate-500 mt-1">
            Mã OTP đã được gửi đến{" "}
            <span className="font-semibold text-slate-700">{email}</span>
          </p>

          <div className="mt-4 flex justify-center">
            <Badge variant={expiryTimer.seconds < 30 ? "danger" : "default"}>
              <span
                className={`mr-2 w-2 h-2 rounded-full ${expiryTimer.isActive ? "bg-emerald-500 animate-pulse" : "bg-gray-400"}`}
              />
              {expiryTimer.isActive
                ? `Mã hết hạn trong: ${expiryTimer.formatTime()}`
                : "Mã đã hết hạn"}
            </Badge>
          </div>
        </div>

        {serverError && <Alert type="error" message={serverError} />}

        {/* OTP INPUT */}
        <div>
          <label className="block text-sm font-semibold text-gray-800 mb-3 text-center">
            Mã xác thực OTP
          </label>

          <Controller
            name="otp"
            control={control}
            render={({ field }) => (
              <OtpInput
                disabled={isLoading || !expiryTimer.isActive}
                value={field.value
                  .split("")
                  .concat(Array(6).fill(""))
                  .slice(0, 6)}
                onChange={(vals) => field.onChange(vals.join(""))}
              />
            )}
          />

          {errors.otp && (
            <p className="text-rose-600 text-sm mt-4 text-center font-semibold animate-pulse">
              {errors.otp.message}
            </p>
          )}
        </div>

        {/* PHẦN MẬT KHẨU - SỬ DỤNG COMPONENT INPUT CỦA BẠN */}
        <div className="space-y-4">
          <Input
            label="Mật khẩu mới"
            type="password"
            placeholder="••••••••"
            disabled={isLoading}
            {...register("newPassword")}
            // Truyền trực tiếp message của error vào đây
            error={errors.newPassword?.message}
          />

          <Input
            label="Xác nhận mật khẩu"
            type="password"
            placeholder="••••••••"
            disabled={isLoading}
            {...register("confirmPassword")}
            error={errors.confirmPassword?.message}
          />
        </div>

        {/* ACTION BUTTONS */}
        <Button
          type="submit"
          isLoading={isLoading}
          disabled={!expiryTimer.isActive || isLoading}
          className="w-full bg-emerald-600 hover:bg-emerald-700 text-white py-4 rounded-xl font-bold transition-colors"
        >
          {expiryTimer.isActive ? "Xác nhận thay đổi" : "Mã đã hết hạn"}
        </Button>

        <ResendOtpButton
          onClick={handleResendOtp}
          isActive={resendTimer.isActive}
          seconds={resendTimer.seconds}
          isLoading={isLoading}
        />

        <button
          type="button"
          onClick={onBack}
          className="w-full text-slate-400 text-sm font-medium hover:text-slate-600 transition-colors"
        >
          Quay lại
        </button>
      </form>
    </div>
  );
};
