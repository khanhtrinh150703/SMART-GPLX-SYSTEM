"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import { useCountdown } from "@/hooks/use-countdown";
import { authService } from "@/services/auth/auth.service";
import { OtpHeader, OtpInput, ResendOtpButton } from "@/components/features/auth/Otp";
import { ProgressBar } from "@/components/ui/ProgressBar";
import { Badge } from "@/components/ui/Badge";
import { Alert } from "@/components/ui/Alert";
import { Label } from "@/components/ui/Label";
import Button from "@/components/ui/Button/Button";



export default function VerifyOtpForm() {
  const router = useRouter();

  // 1. CẤU HÌNH THỜI GIAN
  const RESEND_TIME = 60;
  const EXPIRY_TIME = 300;

  // 2. QUẢN LÝ TRẠNG THÁI
  const [otp, setOtp] = useState<string[]>(Array(6).fill(""));
  const [email, setEmail] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  // 3. CUSTOM HOOKS
  const resendTimer = useCountdown(RESEND_TIME);
  const expiryTimer = useCountdown(EXPIRY_TIME);

  useEffect(() => {
    const storedEmail = localStorage.getItem("register_email");
    if (!storedEmail) {
      router.push("/register");
      return;
    }
    setEmail(storedEmail);
  }, [router]);

  // --- LOGIC KIỂM TRA OTP THỜI GIAN THỰC ---
  useEffect(() => {
    const otpString = otp.join("");

    // Nếu mới bắt đầu hoặc xóa hết thì không hiện lỗi
    if (otpString.length === 0) {
      setErrorMsg(null);
      return;
    }

    // Nếu đang nhập dở (1-5 số)
    if (otpString.length > 0 && otpString.length < 6) {
      setErrorMsg("Vui lòng nhập đầy đủ 6 chữ số OTP.");
    }

    // Đủ 6 số thì xóa lỗi ngay lập tức
    else if (otpString.length === 6) {
      setErrorMsg(null);
    }
  }, [otp]);

  // 4. XỬ LÝ GỬI LẠI MÃ
  const handleResendOtp = async () => {
    setErrorMsg(null);
    setSuccessMsg(null);
    setIsLoading(true);

    try {
      await authService.resendOtp({ email });
      resendTimer.reset(RESEND_TIME);
      expiryTimer.reset(EXPIRY_TIME);
      setOtp(Array(6).fill(""));
      setSuccessMsg("Mã xác xác nhận mới đã được gửi thành công!");
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        setErrorMsg(
          error.response?.data?.message || "Không thể gửi lại mã lúc này.",
        );
      }
    } finally {
      setIsLoading(false);
    }
  };

  // 5. XỬ LÝ XÁC NHẬN (KHI NHẤN NÚT)
  const handleSubmit = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();

    const otpString = otp.join("");
    if (otpString.length < 6) {
      setErrorMsg("Vui lòng nhập đầy đủ 6 chữ số OTP.");
      return;
    }

    setErrorMsg(null);
    setSuccessMsg(null);
    setIsLoading(true);

    try {
      await authService.verifyOtp({ email, otp: otpString });
      localStorage.removeItem("register_email");
      setSuccessMsg("Xác thực thành công! Đang chuyển hướng...");
      setTimeout(() => router.push("/login"), 1500);
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        setErrorMsg(
          error.response?.data?.message ||
            "Mã OTP không hợp lệ hoặc đã hết hạn.",
        );
      } else {
        setErrorMsg("Đã có sự cố bất ngờ xảy ra.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="relative pt-4 w-full animate-in fade-in duration-500">
      {/* THANH TIẾN TRÌNH */}
      <div className="absolute top-0 left-0 w-full">
        <ProgressBar
          current={resendTimer.seconds}
          max={RESEND_TIME}
          color={resendTimer.seconds < 10 ? "rose" : "emerald"}
        />
      </div>

      <form onSubmit={handleSubmit} className="space-y-6 mt-6">
        {/* TIÊU ĐỀ & EMAIL */}
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

        {/* THÔNG BÁO THÀNH CÔNG (Error giờ hiện dưới OTP) */}
        {successMsg && (
          <Alert
            intent="success"
            message="Xác thực mã thành công"
            className="mb-6"
          />
        )}

        {/* Ô NHẬP OTP */}
        <div className="flex flex-col">
          <Label className="text-center">Mã xác thực OTP</Label>

          <OtpInput
            value={otp}
            onChange={setOtp}
            disabled={isLoading || !expiryTimer.isActive}
          />

          {/* 🚀 Cách sửa dùng Alert đã có: Gọn và đồng bộ */}
          <Alert
            intent="error"
            layout="centered"
            message={errorMsg}
            className="mt-4"
          />
        </div>

        {/* NÚT XÁC NHẬN */}
        <Button
          type="submit"
          variant="primary" // 💡 Đã có emerald-600, shadow, active:scale...
          size="lg" // 💡 Đã có w-full, py-4, rounded-xl
          isLoading={isLoading}
          disabled={!expiryTimer.isActive} // 💡 Chỉ cần truyền điều kiện hết hạn (isLoading nút tự xử)
          text={expiryTimer.isActive ? "Xác nhận mã OTP" : "Mã đã hết hạn"}
        />

        {/* NÚT GỬI LẠI */}
        <ResendOtpButton
          onClick={handleResendOtp}
          isActive={resendTimer.isActive}
          seconds={resendTimer.seconds}
          isLoading={isLoading}
        />

        {/* NÚT QUAY LẠI */}
        {/* 🚀 Phiên bản đã "thuần hóa" theo chuẩn Design System */}
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
}
