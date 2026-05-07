"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import axios from "axios";

// Đảm bảo dùng đường dẫn Absolute Import (@/...) thống nhất
import { GoogleButton, Divider } from "@/components/features/auth/SocialLogin/SocialLogin";
import { Alert } from "@/components/ui/Alert";
import Button from "@/components/ui/Button/Button";
import Input from "@/components/ui/Input/Input";
import TextLink from "@/components/ui/TextLink/TextLink";
import { useAuthSync } from "@/hooks/use-auth-sync";
import { LoginSchemaType } from "@/lib/validations/auth.schema";
import { loginSchema } from "@/lib/validations/common";
import { authService } from "@/services/auth/auth.service";


export default function LoginForm() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // 1. Kích hoạt Hook Đồng bộ hóa liên Tab (Cross-tab Sync)
  useAuthSync();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginSchemaType>({
    resolver: zodResolver(loginSchema),
  });

  // 2. Hàm xử lý gửi biểu mẫu (Submit Handler)
  const onSubmit = async (data: LoginSchemaType) => {
    setErrorMsg(null);
    setIsLoading(true);

    try {
      // Tầng UI chỉ gọi Service, không tự can thiệp vào Zustand Store
      await authService.login({
        username: data.username.trim(),
        password: data.password,
      });
      
      router.push("/overview");
    } catch (error: unknown) {
      // Xử lý lỗi an toàn kiểu dữ liệu (Type-Safe Error Handling)
      if (axios.isAxiosError(error)) {
        setErrorMsg(error.response?.data?.message || "Thông tin đăng nhập không chính xác.");
      } else {
        setErrorMsg("Đã xảy ra lỗi kết nối. Vui lòng thử lại sau.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full">
      <div className="space-y-3">
        <GoogleButton text="Đăng nhập với Google" />
      </div>

      <Divider text="Hoặc dùng tài khoản hệ thống" />

      {/* Cảnh báo lỗi từ máy chủ (Server Error Alert) */}
      {errorMsg && (
        <Alert
          intent="error" // Biến thể màu đỏ Rose-500
          message={errorMsg}
          className="mb-6"
          duration={10000}
        />
      )}

      {/* Biểu mẫu đăng nhập (Login Form) */}
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
        <div>
          <Input
            label="Tên đăng nhập"
            type="text"
            placeholder="Nhập tên đăng nhập của bạn"
            disabled={isLoading}
            {...register("username")}
            error={errors.username?.message} 
          />
        </div>

        <div>
          <Input
            label="Mật khẩu"
            type="password"
            placeholder="••••••••"
            disabled={isLoading}
            {...register("password")}
            error={errors.password?.message} // SỬA LẠI: Đồng bộ cách hiển thị lỗi giống username
          />

          <div className="mt-2 flex justify-end">
            <TextLink href="/forgot-password" intent="primary">
              Quên mật khẩu?
            </TextLink>
          </div>
        </div>

        <div className="flex justify-end pt-2">
          <Button
            type="submit"
            variant="primary"
            size="lg"
            isLoading={isLoading}
            className="w-full" // Thay thế size nếu size="lg" không bao gồm w-full
          >
            {isLoading ? "Đang xác thực..." : "Đăng nhập"}
          </Button>
        </div>
      </form>

      <div className="mt-8 text-center text-sm text-slate-600">
        Chưa có tài khoản?{" "}
        <TextLink href="/register" intent="primary">
          Đăng ký ngay
        </TextLink>
      </div>
    </div>
  );
}