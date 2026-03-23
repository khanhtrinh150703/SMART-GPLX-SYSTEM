"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Button from "@/src/components/ui/Button";
import axios from "axios";
import { authApi } from "@/src/api/auth/auth.api"; // Import API service của bạn

export default function VerifyOTPPage() {
  const router = useRouter();
  const [otp, setOtp] = useState(["", "", "", "", "", ""]); // Giả sử OTP có 6 số
  const [timeLeft, setTimeLeft] = useState(60); // 60 giây đếm ngược

  // State quản lý gọi API
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // Logic đếm ngược (Countdown)
  useEffect(() => {
    if (timeLeft <= 0) return;
    const timer = setInterval(() => setTimeLeft((prev) => prev - 1), 1000);
    return () => clearInterval(timer);
  }, [timeLeft]);

  // Xử lý nhập liệu từng ô (Auto focus ô tiếp theo)
  const handleOtpChange = (element: HTMLInputElement, index: number) => {
    if (isNaN(Number(element.value))) return;

    const newOtp = [...otp];
    newOtp[index] = element.value;
    setOtp(newOtp);

    // Tự động nhảy sang ô kế tiếp
    if (element.nextSibling && element.value !== "") {
      (element.nextSibling as HTMLInputElement).focus();
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    const otpString = otp.join("");

    // Kiểm tra xem đã nhập đủ 6 số chưa
    if (otpString.length < 6) {
      setErrorMsg("Vui lòng nhập đầy đủ 6 số OTP.");
      return;
    }

    setIsLoading(true);

    try {
      // 1. Lấy email đã lưu tạm từ trang Đăng ký
      const email = localStorage.getItem("register_email");

      if (!email) {
        setErrorMsg("Không tìm thấy email cần xác thực. Vui lòng đăng ký lại.");
        setIsLoading(false);
        return;
      }

      // 2. Gọi API xác thực (Bạn nhớ thêm hàm verifyOtp vào file auth.api.ts nhé)
      await authApi.verifyOtp({
        email: email,
        otp: otpString,
      });

      // Xóa email lưu tạm cho sạch sẽ
      localStorage.removeItem("register_email");

      // 3. Chuyển hướng tới trang Đăng nhập
      router.push("/auth/login");
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        const backendMessage = error.response?.data?.message;
        setErrorMsg(backendMessage || "Mã OTP không hợp lệ hoặc đã hết hạn.");
      } else {
        setErrorMsg("Đã có sự cố bất ngờ xảy ra.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#f8fafc]">
      {/* Trang trí nền bằng các đốm màu Blur nhẹ */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden z-0">
        <div className="absolute top-[-10%] right-[-5%] w-80 h-80 bg-emerald-100 rounded-full blur-[100px]"></div>
        <div className="absolute bottom-[-10%] left-[-5%] w-80 h-80 bg-blue-100 rounded-full blur-[100px]"></div>
      </div>

      <div className="relative z-10 w-full max-w-md p-8 bg-white/80 backdrop-blur-xl border border-white rounded-3xl shadow-2xl shadow-emerald-200/20">
        {/* Thanh đếm ngược phía trên cùng */}
        <div className="absolute top-0 left-0 w-full h-1.5 bg-gray-100 rounded-t-3xl overflow-hidden">
          <div
            className={`h-full transition-all duration-1000 ease-linear ${timeLeft < 10 ? "bg-red-500" : "bg-emerald-500"}`}
            style={{ width: `${(timeLeft / 60) * 100}%` }}
          ></div>
        </div>

        <div className="text-center mb-8 pt-4">
          <h1 className="text-2xl font-bold text-gray-900">Xác thực mã OTP</h1>
          <p className="text-gray-500 text-sm mt-2">
            Mã xác nhận đã được gửi đến email của bạn.
          </p>

          <div
            className={`mt-4 inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${timeLeft < 10 ? "bg-red-50 text-red-600" : "bg-emerald-50 text-emerald-600"}`}
          >
            <svg
              className="w-4 h-4 mr-1.5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            00:{timeLeft < 10 ? `0${timeLeft}` : timeLeft}
          </div>
        </div>

        {/* Khung hiển thị lỗi nếu nhập sai OTP */}
        {errorMsg && (
          <div className="mb-6 bg-red-50 border border-red-400 text-red-700 px-4 py-3 rounded-lg text-sm text-center">
            {errorMsg}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-8">
          <div className="flex justify-between gap-2">
            {otp.map((data, index) => (
              <input
                key={index}
                type="text"
                maxLength={1}
                // FIXED: Thêm text-gray-900 vào đây để chữ hiện rõ ràng, đen đậm
                className="w-12 h-14 sm:w-14 sm:h-16 text-center text-2xl font-bold text-gray-900 border-2 border-gray-200 rounded-xl focus:border-emerald-500 focus:ring-0 transition-all outline-none bg-white"
                value={data}
                onChange={(e) => handleOtpChange(e.target, index)}
                onFocus={(e) => e.target.select()}
                disabled={isLoading}
              />
            ))}
          </div>

          <div className="space-y-4">
            <Button
              text={isLoading ? "Đang xử lý..." : "Xác nhận"}
              type="submit"
              disabled={isLoading}
              className="w-full bg-gray-900 hover:bg-black text-white rounded-xl py-4 font-bold shadow-lg transition-transform active:scale-[0.98] disabled:opacity-70"
            />

            <div className="text-center">
              <button
                type="button"
                disabled={timeLeft > 0 || isLoading}
                className={`text-sm font-semibold ${timeLeft > 0 ? "text-gray-300 cursor-not-allowed" : "text-emerald-600 hover:text-emerald-700"}`}
              >
                Gửi lại mã xác nhận
              </button>
            </div>
          </div>
        </form>

        <div className="mt-8 pt-6 border-t border-gray-100 text-center">
          <button
            onClick={() => router.back()}
            className="text-sm text-gray-500 hover:text-gray-700 flex items-center justify-center mx-auto transition-colors"
          >
            <svg
              className="w-4 h-4 mr-1"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M10 19l-7-7m0 0l7-7m-7 7h18"
              />
            </svg>
            Quay lại
          </button>
        </div>
      </div>
    </div>
  );
}
