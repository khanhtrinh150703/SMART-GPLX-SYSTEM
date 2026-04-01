"use client";

import { useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import axios from "axios";
import { useRouter } from "next/navigation";
import { useCountdown } from "@/hooks/use-countdown";
import { resetPasswordSchema, ResetPasswordSchemaType } from "@/lib/validations/auth.schema";
import { authService } from "@/services/auth/auth.service";
import { ProgressBar } from "@/components/ui/ProgressBar";
import { OtpHeader, OtpInput, ResendOtpButton } from "@/components/features/auth/Otp";
import { Badge } from "@/components/ui/Badge";
import { Alert } from "@/components/ui/Alert";
import { Label } from "@/components/ui/Label";
import Input from "@/components/ui/Input/Input";
import Button from "@/components/ui/Button/Button";
import { ErrorMessage } from "@/components/ui/ErrorMessage";



interface ResetStepProps {
  email: string;
  onBack: () => void;
}

interface ApiErrorResponse {
  message?: string;
}

export const ResetStep = ({ email }: ResetStepProps) => {
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
      setServerError("Không thể gửi lại mã, vui lòng thử lại sau." );
      console.log(error)
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
          {/* <h2 className="text-2xl font-bold text-slate-800">
            Đặt lại mật khẩu
          </h2> */}
          <div className="text-center">
            <OtpHeader email={email} />
            <div className="mt-4 flex justify-center">
              <Badge
                // 💡 Tự động đổi màu dựa trên thời gian
                intent={expiryTimer.seconds < 30 ? "danger" : "default"}
                showDot
                pulse={expiryTimer.isActive} // 💡 Chỉ nháy khi timer đang chạy
              >
                {expiryTimer.isActive
                  ? `Mã hết hạn trong: ${expiryTimer.formatTime()}`
                  : "Mã đã hết hạn"}
              </Badge>
            </div>
          </div>
        </div>

        {/* 🚀 Cách sửa mới: Gọn, sạch và chuyên nghiệp */}
        {serverError && (
          <Alert
            intent="error"
            message={serverError}
            className="mb-8" // 💡 Đẩy margin vào đây, không cần div bọc ngoài nữa
          />
        )}

        {/* OTP INPUT */}
        <div>
          <Label className="text-center">Mã xác thực OTP</Label>

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
          {/* 🚀 Phiên bản "Senior" - Cực kỳ chuyên nghiệp */}
          <ErrorMessage message={errors.otp?.message} intent="pulse" />
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
          variant="primary" // 💡 Đã bao gồm màu emerald, hover, shadow và transition
          size="lg" // 💡 Đã bao gồm w-full, py-4 (hoặc h-14), rounded-xl và font-bold
          isLoading={isLoading}
          disabled={!expiryTimer.isActive} // 💡 Chỉ cần truyền điều kiện hết hạn (isLoading nút tự xử lý rồi)
          text={expiryTimer.isActive ? "Xác nhận thay đổi" : "Mã đã hết hạn"}
        />

        <ResendOtpButton
          onClick={handleResendOtp}
          isActive={resendTimer.isActive}
          seconds={resendTimer.seconds}
          isLoading={isLoading}
        />

        <Button
          type="button"
          variant="ghost" // 💡 Đã có sẵn màu slate, hiệu ứng hover và transition
          size="md" // 💡 Kích thước vừa phải cho nút phụ
          onClick={() => router.back()}
          className="w-full font-bold" // 💡 Chỉ thêm w-full để dàn hàng ngang nếu cần
        >
          Quay lại trang trước
        </Button>
      </form>
    </div>
  );
};
