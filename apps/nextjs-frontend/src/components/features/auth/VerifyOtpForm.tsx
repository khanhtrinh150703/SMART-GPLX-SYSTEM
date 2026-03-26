"use client"; // Bắt buộc dùng vì có State (Trạng thái) và Effect (Hiệu ứng phụ)

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation"; // Bộ điều hướng (Router)
import axios from "axios";

import Button from "@/src/components/ui/Button";
import { authApi } from "@/src/api/auth/auth.api";

export default function VerifyOtpForm() {
  const router = useRouter();

  // Trạng thái (State) quản lý OTP và Thời gian
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [timeLeft, setTimeLeft] = useState(60); // 60 giây đếm ngược

  // Trạng thái quản lý gọi API và Thông báo
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null); // Thêm trạng thái thành công (Success state)

  // Logic đếm ngược (Countdown Timer)
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

    // Xóa thông báo lỗi/thành công khi người dùng bắt đầu nhập lại
    if (errorMsg) setErrorMsg(null);
    if (successMsg) setSuccessMsg(null);

    // Tự động nhảy sang ô kế tiếp (Next Sibling Focus)
    if (element.nextSibling && element.value !== "") {
      (element.nextSibling as HTMLInputElement).focus();
    }
  };

  // --- TÍNH NĂNG MỚI: Xử lý gửi lại mã (Resend OTP Handler) ---
  const handleResendOtp = async () => {
    setErrorMsg(null);
    setSuccessMsg(null);
    setIsLoading(true);

    try {
      const email = localStorage.getItem("register_email");

      if (!email) {
        setErrorMsg("Không tìm thấy email. Vui lòng quay lại trang đăng ký.");
        setIsLoading(false);
        return;
      }

      // Gọi API gửi lại mã (Bạn nhớ thêm hàm resendOtp vào file auth.api.ts)
      await authApi.resendOtp({ email });

      // Cài đặt lại giao diện (Reset UI)
      setTimeLeft(60); // Khởi động lại đếm ngược 60 giây
      setOtp(["", "", "", "", "", ""]); // Xóa trắng 6 ô OTP cũ
      setSuccessMsg("Mã xác nhận mới đã được gửi đến email của bạn!"); // Hiện thông báo xanh
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        const backendMessage = error.response?.data?.message;
        setErrorMsg(
          backendMessage ||
            "Không thể gửi lại mã lúc này. Vui lòng thử lại sau.",
        );
      } else {
        setErrorMsg("Đã có sự cố bất ngờ xảy ra.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  // Xử lý sự kiện gửi biểu mẫu xác nhận (Submit Handler)
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    setSuccessMsg(null);
    const otpString = otp.join("");

    // Kiểm tra tính hợp lệ (Validation)
    if (otpString.length < 6) {
      setErrorMsg("Vui lòng nhập đầy đủ 6 số OTP.");
      return;
    }

    setIsLoading(true);

    try {
      const email = localStorage.getItem("register_email");

      if (!email) {
        setErrorMsg("Không tìm thấy email cần xác thực. Vui lòng đăng ký lại.");
        setIsLoading(false);
        return;
      }

      // Gọi API xác thực (Verify API Call)
      await authApi.verifyOtp({
        email: email,
        otp: otpString,
      });

      // Xóa email lưu tạm cho sạch sẽ
      localStorage.removeItem("register_email");

      // Chuyển hướng tới trang Đăng nhập
      router.push("/login");
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
    <>
      {/* Thanh tiến trình đếm ngược (Progress Bar) */}
      <div className="absolute top-0 left-0 w-full h-1.5 bg-gray-100 rounded-t-3xl overflow-hidden">
        <div
          className={`h-full transition-all duration-1000 ease-linear ${timeLeft < 10 ? "bg-rose-500" : "bg-emerald-500"}`}
          style={{ width: `${(timeLeft / 60) * 100}%` }}
        ></div>
      </div>

      {/* Header của form */}
      <div className="text-center mb-8 pt-4">
        <h1 className="text-2xl font-bold text-gray-900">Xác thực mã OTP</h1>
        <p className="text-gray-500 text-sm mt-2">
          Mã xác nhận đã được gửi đến email của bạn.
        </p>

        {/* Cục hiển thị thời gian */}
        <div
          className={`mt-4 inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
            timeLeft < 10
              ? "bg-rose-50 text-rose-600"
              : "bg-emerald-50 text-emerald-600"
          }`}
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

      {/* Khung hiển thị thông báo thành công (Success Alert) */}
      {successMsg && (
        <div className="mb-6 bg-emerald-50 border border-emerald-400 text-emerald-700 px-4 py-3 rounded-xl text-sm text-center font-medium shadow-soft">
          {successMsg}
        </div>
      )}

      {/* Cảnh báo lỗi (Error Alert) */}
      {errorMsg && (
        <div className="mb-6 bg-rose-50 border border-rose-400 text-rose-700 px-4 py-3 rounded-xl text-sm text-center font-medium shadow-soft">
          {errorMsg}
        </div>
      )}

      {/* Form nhập OTP */}
      <form onSubmit={handleSubmit} className="space-y-8">
        <div className="flex justify-between gap-2">
          {otp.map((data, index) => (
            <input
              key={index}
              type="text"
              maxLength={1}
              className="w-12 h-14 sm:w-14 sm:h-16 text-center text-2xl font-bold text-gray-900 border-2 border-gray-200 rounded-xl focus:border-emerald-500 focus:ring-0 transition-all outline-none bg-white"
              value={data}
              onChange={(e) => handleOtpChange(e.target, index)}
              onFocus={(e) => e.target.select()} // Bôi đen (Select all) khi click vào ô
              disabled={isLoading}
            />
          ))}
        </div>

        <div className="space-y-4">
          <Button
            text="Xác nhận" // Chữ mặc định hiển thị lên màn hình
            type="submit"
            isLoading={isLoading} // Truyền State (trạng thái) đang tải vào đây
            className="w-full bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl py-4 font-bold shadow-soft transition-transform active:scale-[0.98] disabled:opacity-70"
          />

          <div className="text-center">
            {/* Đã gán sự kiện onClick vào nút này */}
            <button
              type="button"
              onClick={handleResendOtp}
              disabled={timeLeft > 0 || isLoading}
              className={`text-sm font-semibold transition-colors ${
                timeLeft > 0
                  ? "text-gray-300 cursor-not-allowed"
                  : "text-emerald-600 hover:text-emerald-700"
              }`}
            >
              Gửi lại mã xác nhận
            </button>
          </div>
        </div>
      </form>

      {/* Nút quay lại (Back Button) */}
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
    </>
  );
}
