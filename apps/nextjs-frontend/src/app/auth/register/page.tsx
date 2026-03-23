"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation"; // Đúng import cho App Router
import AuthLayout from "@/src/components/layouts/AuthLayout";
import { authApi } from "@/src/api/auth/auth.api";
import { GoogleButton, Divider } from "@/src/components/ui/SocialLogin";
import Input from "@/src/components/ui/Input";
import Button from "@/src/components/ui/Button";
import { siteConfig } from "@/src/config/site";
import axios from "axios";

export default function RegisterPage() {
  const router = useRouter(); // ← Thêm cái này vào (nguyên nhân lỗi chính)

  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);

    // Validate cơ bản
    if (formData.password !== formData.confirmPassword) {
      setErrorMsg("Mật khẩu xác nhận không khớp!");
      return;
    }

    if (formData.password.length < 6) {
      setErrorMsg("Mật khẩu phải có ít nhất 6 ký tự!");
      return;
    }

    setIsLoading(true);

    try {
      const response = await authApi.register({
        username: formData.username.trim(),
        email: formData.email.trim(),
        password: formData.password,
      });

      console.log("Đăng ký thành công:", response);

      // Chuyển sang trang verify OTP (hoặc trang nào bạn muốn)
      router.push("/auth/verify-otp");

      // Optional: có thể lưu tạm email để điền sẵn ở trang OTP
      localStorage.setItem("register_email", formData.email);
    } catch (error: unknown) {
      // Sửa chữ 'any' thành 'unknown'

      // Kiểm tra xem đây có đúng là lỗi do gọi API (Axios) gây ra không
      if (axios.isAxiosError(error)) {
        // Lúc này TypeScript đã hiểu 'error' chính là AxiosError
        const backendMessage = error.response?.data?.message;
        setErrorMsg(
          backendMessage || "Máy chủ đang bảo trì. Vui lòng thử lại.",
        );
      }
      // Kiểm tra xem có phải lỗi code Frontend thông thường không
      else if (error instanceof Error) {
        setErrorMsg(error.message);
      }
      // Các trường hợp ngoại lệ khác
      else {
        setErrorMsg("Đã có sự cố bất ngờ xảy ra.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AuthLayout
      title="Tạo tài khoản"
      subtitle={`Chào mừng bạn đến với ${siteConfig.appName}`}
    >
      <div className="space-y-3">
        <GoogleButton text="Đăng ký với Google" />
      </div>

      <Divider text="Hoặc đăng ký bằng Email" />

      {errorMsg && (
        <div className="bg-red-50 border border-red-400 text-red-700 px-4 py-3 rounded relative text-sm">
          {errorMsg}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-5">
        <Input
          label="Tên đăng nhập"
          name="username"
          value={formData.username}
          onChange={handleChange}
          placeholder="VD: trinh_cau_vang"
          required
          disabled={isLoading}
        />

        <Input
          label="Email"
          name="email"
          type="email"
          value={formData.email}
          onChange={handleChange}
          placeholder="nguyenvana@gmail.com"
          required
          disabled={isLoading}
        />

        <Input
          label="Mật khẩu"
          name="password"
          type="password"
          value={formData.password}
          onChange={handleChange}
          placeholder="Tạo mật khẩu"
          required
          disabled={isLoading}
        />

        <Input
          label="Xác nhận mật khẩu"
          name="confirmPassword"
          type="password"
          value={formData.confirmPassword}
          onChange={handleChange}
          placeholder="Nhập lại mật khẩu"
          required
          disabled={isLoading}
        />

        <div className="pt-4">
          <Button
            text={isLoading ? "Đang tạo tài khoản..." : "Tạo tài khoản"}
            type="submit"
            disabled={isLoading}
            className="w-full bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg py-3 font-semibold transition-all shadow-md disabled:opacity-60 disabled:cursor-not-allowed"
          />
        </div>
      </form>

      <div className="mt-8 text-center text-sm text-gray-600">
        Đã có tài khoản?{" "}
        <Link
          href="/auth/login"
          className="text-emerald-600 font-semibold hover:underline"
        >
          Đăng nhập ngay
        </Link>
      </div>
    </AuthLayout>
  );
}
