"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";

// --- IMPORT ATOMIC COMPONENTS ---
import { ProgressBar } from "../../ui/Progress-Bar";
import { OtpHeader } from "../../ui/Otp-Header";
import { Badge } from "../../ui/Badge";
import { Alert } from "../../ui/Alert";
import Button from "../../ui/Button";
import { OtpInput } from "../../ui/Otp-Input";

// --- IMPORT LOGIC & TYPES ---
import { useCountdown } from "@/src/hooks/use-countdown";
import { authService } from "@/src/services/auth/auth.service";
import { ResendOtpButton } from "../../ui/Resend-Otp-Button";

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
            <Badge variant={expiryTimer.seconds < 30 ? "danger" : "default"}>
              <span
                className={`mr-2 w-2 h-2 rounded-full ${expiryTimer.isActive ? "bg-emerald-500 animate-pulse" : "bg-slate-400"}`}
              />
              {expiryTimer.isActive
                ? `Mã hết hạn trong: ${expiryTimer.formatTime()}`
                : "Mã đã hết hạn"}
            </Badge>
          </div>
        </div>

        {/* THÔNG BÁO THÀNH CÔNG (Error giờ hiện dưới OTP) */}
        <div className="space-y-3">
          {successMsg && <Alert type="success" message={successMsg} />}
        </div>

        {/* Ô NHẬP OTP */}
        <div className="flex flex-col">
          <label className="block text-sm font-bold text-slate-800 mb-3 text-center">
            Mã xác thực OTP
          </label>

          <OtpInput
            value={otp}
            onChange={setOtp}
            disabled={isLoading || !expiryTimer.isActive}
          />

          {/* HIỂN THỊ LỖI REAL-TIME: Đỏ rực, đậm, không xám */}
          {errorMsg && (
            <p className="text-rose-600 text-sm mt-4 text-center font-semibold animate-pulse">
              {errorMsg}
            </p>
          )}
        </div>

        {/* NÚT XÁC NHẬN */}
        <Button
          type="submit"
          isLoading={isLoading}
          disabled={!expiryTimer.isActive || isLoading}
          className="w-full bg-emerald-600 hover:bg-emerald-700 text-white py-4 rounded-xl font-bold transition-all shadow-lg active:scale-[0.98]"
        >
          {expiryTimer.isActive ? "Xác nhận mã OTP" : "Mã đã hết hạn"}
        </Button>

        {/* NÚT GỬI LẠI */}
        <ResendOtpButton
          onClick={handleResendOtp}
          isActive={resendTimer.isActive}
          seconds={resendTimer.seconds}
          isLoading={isLoading}
        />

        {/* NÚT QUAY LẠI */}
        <button
          type="button"
          onClick={() => router.back()}
          className="w-full text-slate-500 text-sm font-bold hover:text-slate-800 transition-colors"
        >
          Quay lại trang trước
        </button>
      </form>
    </div>
  );
}
