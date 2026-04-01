"use client";

import { useState } from "react";
import { useRouter } from "next/navigation"; // Bộ điều hướng (Router)
import axios from "axios";
import { useForm } from "react-hook-form"; // Thư viện quản lý biểu mẫu
import { zodResolver } from "@hookform/resolvers/zod"; // Trình giải quyết Zod
import {
  registerSchema,
  RegisterSchemaType,
} from "@/lib/validations/auth.schema";
import { authApi } from "@/api/auth/auth.api";
import { Divider, GoogleButton } from "@/components/features/auth/SocialLogin";
import { Alert } from "@/components/ui/Alert";
import Input from "@/components/ui/Input/Input";
import Button from "@/components/ui/Button/Button";
import TextLink from "@/components/ui/TextLink/TextLink";

export default function RegisterForm() {
  const router = useRouter();

  // Trạng thái (State) quản lý UI khi gọi API
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // Khởi tạo React Hook Form với Zod
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterSchemaType>({
    resolver: zodResolver(registerSchema),
  });

  // Xử lý gửi biểu mẫu (Submit Handler)
  const onSubmit = async (data: RegisterSchemaType) => {
    setErrorMsg(null);
    setIsLoading(true);

    try {
      // Gọi API Đăng ký
      const response = await authApi.register({
        username: data.username.trim(),
        email: data.email.trim(),
        fullName: data.fullName,
        password: data.password,
      });

      console.log("Đăng ký thành công:", response);

      // Lưu tạm email để điền sẵn ở trang OTP
      localStorage.setItem("register_email", data.email);

      // Chuyển sang trang verify OTP
      // LƯU Ý: Vì bạn đã dùng Route Group (auth), đường dẫn phải là /verify-otp (bỏ chữ auth)
      router.push("/verify");
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        const backendMessage = error.response?.data?.message;
        setErrorMsg(
          backendMessage || "Máy chủ đang bảo trì. Vui lòng thử lại.",
        );
      } else if (error instanceof Error) {
        setErrorMsg(error.message);
      } else {
        setErrorMsg("Đã có sự cố bất ngờ xảy ra.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full">
      <div className="space-y-3">
        <GoogleButton text="Đăng ký với Google" />
      </div>

      <Divider text="Hoặc đăng ký bằng Email" />

      {/* Cảnh báo lỗi từ máy chủ (Server Error Alert) */}
      {errorMsg && (
        <Alert
          intent="error"
          message={errorMsg}
          className="mb-6" // Thêm margin nếu cần
        />
      )}
      {/* Form đăng ký */}
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
        <div>
          <Input
            label="Tên đăng nhập"
            placeholder="VD: wangwu"
            disabled={isLoading}
            {...register("username")}
          />
          {/* Lỗi hiển thị nội tuyến (Inline-error) */}
          {errors.username && (
            <p className="text-rose-500 text-sm mt-1">
              {errors.username.message}
            </p>
          )}
        </div>

        <div>
          <Input
            label="Email"
            type="email"
            placeholder="nguyenvana@gmail.com"
            disabled={isLoading}
            {...register("email")}
          />
          {errors.email && (
            <p className="text-rose-500 text-sm mt-1">{errors.email.message}</p>
          )}
        </div>

        <div>
          <Input
            label="Họ Tên"
            type="fullName"
            placeholder="Wang Wu"
            disabled={isLoading}
            {...register("fullName")}
          />
          {errors.email && (
            <p className="text-rose-500 text-sm mt-1">{errors.email.message}</p>
          )}
        </div>

        <div>
          <Input
            label="Mật khẩu"
            type="password"
            placeholder="Tạo mật khẩu"
            disabled={isLoading}
            {...register("password")}
          />
          {errors.password && (
            <p className="text-rose-500 text-sm mt-1">
              {errors.password.message}
            </p>
          )}
        </div>

        <div>
          <Input
            label="Xác nhận mật khẩu"
            type="password"
            placeholder="Nhập lại mật khẩu"
            disabled={isLoading}
            {...register("confirmPassword")}
          />
          {errors.confirmPassword && (
            <p className="text-rose-500 text-sm mt-1">
              {errors.confirmPassword.message}
            </p>
          )}
        </div>

        <div className="pt-4">
          <Button
            variant="primary"
            size="lg" // size "lg" trong file variants đã có w-full và py-3.5
            isLoading={isLoading}
            type="submit"
            text={isLoading ? "Đang tạo tài khoản..." : "Tạo tài khoản"}
          />
        </div>
      </form>

      {/* 🚀 Phiên bản Senior: Gọn gàng, đồng bộ và cực kỳ chuyên nghiệp */}
      <div className="mt-8 text-center text-sm text-slate-600">
        Đã có tài khoản?{" "}
        <TextLink href="/login" intent="primary">
          Đăng nhập ngay
        </TextLink>
      </div>
    </div>
  );
}
