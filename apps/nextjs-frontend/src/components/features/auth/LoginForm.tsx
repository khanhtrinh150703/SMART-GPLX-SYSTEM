"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import axios from "axios";

// Đảm bảo sử dụng Absolute Import (@/...) thống nhất (Unified Absolute Imports)
import {
  GoogleButton,
  Divider,
} from "@/components/features/auth/SocialLogin/SocialLogin";
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
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // 1. Kích hoạt Hook Đồng bộ hóa liên Tab (Cross-tab Synchronization Hook)
  useAuthSync();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginSchemaType>({
    resolver: zodResolver(loginSchema),
  });

  // 2. Hàm xử lý gửi biểu mẫu (Submit Handler Function)
  const onSubmit = async (data: LoginSchemaType) => {
    setErrorMsg(null);
    setIsLoading(true);

    try {
      // Tuân thủ luồng 3 lớp: UI -> Service -> API (3-Tier Flow compliance)
      await authService.login({
        username: data.username.trim(),
        password: data.password,
      });

      router.push("/overview");
    } catch (error: unknown) {
      // Xử lý lỗi an toàn kiểu dữ liệu bằng Type Guard (Type-Safe Error Handling)
      if (axios.isAxiosError(error)) {
        setErrorMsg(
          error.response?.data?.message ||
            "Thông tin đăng nhập không chính xác.",
        );
      } else {
        setErrorMsg("Đã xảy ra lỗi kết nối. Vui lòng thử lại sau.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    // Sử dụng không gian đồng bộ trên toàn form (Unified container form layout)
    <div className="w-full space-y-6">
      {/* KHỐI ĐĂNG NHẬP MẠNG XÃ HỘI (Social Login Action Block) */}
      <div className="w-full">
        <GoogleButton text="Đăng nhập với Google" />
      </div>

      {/* THANH PHÂN TÁCH KHÔNG GIAN THỊ GIÁC (Visual Hierarchy Divider) */}
      <Divider text="Hoặc dùng tài khoản hệ thống" />

      {/* CẢNH BÁO LỖI HỆ THỐNG (Server-side Error Alert Display) */}
      {/* Đặt ngay trên các ô nhập liệu giúp người dùng thấy ngay lý do thất bại (Contextual awareness placement) */}
      {errorMsg && (
        <Alert
          intent="error" // Biến thể màu đỏ Rose-500 của hệ thống thiết kế
          message={errorMsg}
          className="w-full animate-fade-in"
          duration={7000}
        />
      )}

      {/* BIỂU MẪU NHẬP LIỆU CHÍNH (Primary Credentials Input Form) */}
      {/* Tăng khoảng cách gap lên space-y-5 để form thông thoáng, giảm áp lực điền dữ liệu (Form cognitive load reduction) */}
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
        {/* Trường nhập Tên đăng nhập (Username Input Field) */}
        <Input
          label="Tên đăng nhập"
          type="text"
          placeholder="Nhập tên đăng nhập của bạn"
          disabled={isLoading}
          {...register("username")}
          error={errors.username?.message}
        />

        {/* Trường nhập Mật khẩu (Password Input Field) */}
        <div className="space-y-2">
          <Input
            label="Mật khẩu"
            type="password"
            placeholder="••••••••"
            disabled={isLoading}
            {...register("password")}
            error={errors.password?.message}
          />

          {/* KHỐI LIÊN KẾT PHỤ TRỢ (Auxiliary Functional Row) */}
          {/* Sắp xếp căn phải tinh tế, tạo điểm neo thị giác (Visual anchor pointer) */}
          <div className="flex justify-end items-center pt-0.5">
            <TextLink
              href="/forgot-password"
              intent="primary"
              className="text-xs font-semibold hover:underline"
            >
              Quên mật khẩu?
            </TextLink>
          </div>
        </div>

        {/* HÀNH ĐỘNG CHÍNH: NÚT ĐĂNG NHẬP (Primary Submission Action) */}
        {/* Loại bỏ div bọc flex-end thừa vì nút đã chiếm 100% chiều rộng (Redundant flex layout removal) */}
        <div className="pt-2">
          <Button
            type="submit"
            variant="primary"
            size="lg"
            isLoading={isLoading}
            className="w-full shadow-soft transition-all duration-200 active:scale-[0.99]"
          >
            {isLoading ? "Đang xác thực tài khoản..." : "Đăng nhập"}
          </Button>
        </div>
      </form>

      {/* ĐIỀU HƯỚNG CHUYỂN TRANG (Secondary Call-to-Action Navigation) */}
      {/* Tách biệt rõ ràng với form chính bằng khoảng cách lớn để tránh bấm nhầm (Clear action demarcation) */}
      <div className="pt-2 text-center text-sm text-slate-500 font-medium">
        Chưa có tài khoản?{" "}
        <TextLink href="/register" intent="primary" className="font-bold">
          Đăng ký ngay
        </TextLink>
      </div>
    </div>
  );
}
