"use client"; // Đánh dấu đây là Component phía máy khách (Client Component) để dùng Hooks

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation"; // Bộ điều hướng (Router)
import axios from "axios"; // Thư viện gọi HTTP (HTTP Client)
import { useForm } from "react-hook-form"; // Thư viện quản lý biểu mẫu (Form Library)
import { zodResolver } from "@hookform/resolvers/zod"; // Trình giải quyết Zod (Zod Resolver)
import * as z from "zod"; // Thư viện kiểm tra dữ liệu (Validation library)
import { GoogleButton, Divider } from "@/src/components/ui/SocialLogin";
import Input from "@/src/components/ui/Input";
import Button from "@/src/components/ui/Button";
import { authService } from "@/src/services/auth/auth.service";

// 1. Định nghĩa Lược đồ kiểm tra (Validation Schema) ngay tại đây hoặc import từ thư mục lib/validations
const loginSchema = z.object({
  username: z.string().min(1, { message: "Vui lòng nhập tên đăng nhập." }),
  password: z.string().min(1, { message: "Vui lòng nhập mật khẩu." }),
});

// Nội suy kiểu dữ liệu (Type Inference) từ Lược đồ
type LoginFormData = z.infer<typeof loginSchema>;

export default function LoginForm() {
  const router = useRouter();

  // State (Trạng thái) quản lý UI khi gọi API
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // Khởi tạo React Hook Form
  const {
    register, // Hàm đăng ký input (Register function)
    handleSubmit, // Hàm xử lý gửi form (Submit handler)
    formState: { errors }, // Trạng thái lỗi của form (Form errors)
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  });

  // 2. Xử lý submit (Đã bỏ qua phần validate thủ công vì Zod đã lo)
  /**
   * Hàm xử lý Gửi Form (Submit Handler)
   * Đã được tinh chỉnh để tuân thủ tính Đóng gói (Encapsulation)
   */
  const onSubmit = async (data: LoginFormData) => {
    // 1. Khởi tạo trạng thái (Reset States)
    setErrorMsg(null);
    setIsLoading(true);

    try {
      /**
       * LUỒNG 3 LỚP (3-Tier Flow): UI -> Service -> API
       * Mọi logic lưu localStorage và setUser đã được đóng gói bên trong authService.login
       */
      const authData = await authService.login({
        username: data.username.trim(),
        password: data.password,
      });

      // 2. Nếu đăng nhập thành công, điều hướng về trang Dashboard
      // Dùng '/' hoặc '/dashboard' tùy vào cấu hình Route Group của bạn
      if (authData) {
        router.push("/");
      }
    } catch (error: unknown) {
      /**
       * Xử lý lỗi tại UI (UI Error Handling)
       * Sử dụng axios.isAxiosError để lấy message chuẩn xác từ Backend
       */
      if (axios.isAxiosError(error)) {
        // Backend Message: Thông báo từ máy chủ
        const backendMessage = error.response?.data?.message;
        setErrorMsg(
          backendMessage || "Tên đăng nhập hoặc mật khẩu không chính xác.",
        );
      } else {
        setErrorMsg("Đã có sự cố kết nối đến máy chủ (Network Error).");
      }
    } finally {
      // 3. Kết thúc trạng thái tải (Loading State)
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full">
      <div className="space-y-3">
        <GoogleButton text="Đăng nhập với Google" />
      </div>

      <Divider text="Hoặc dùng tài khoản hệ thống" />

      {/* Khung hiển thị lỗi từ Server (Server Error Alert) */}
      {errorMsg && (
        <div className="mb-6 bg-rose-50 border border-rose-400 text-rose-700 px-4 py-3 rounded-lg text-sm text-center">
          {errorMsg}
        </div>
      )}

      {/* Form đăng nhập */}
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
        <div>
          <Input
            label="Tên đăng nhập"
            type="text"
            placeholder="Nhập tên đăng nhập của bạn"
            disabled={isLoading}
            {...register("username")} // Kết nối input với Hook Form
          />
          {/* Lỗi hiển thị nội tuyến (Inline-error) từ Zod */}
          {errors.username && (
            <p className="text-rose-500 text-sm mt-1">
              {errors.username.message}
            </p>
          )}
        </div>

        <div>
          <Input
            label="Mật khẩu"
            type="password"
            placeholder="••••••••"
            disabled={isLoading}
            {...register("password")}
          />
          {errors.password && (
            <p className="text-rose-500 text-sm mt-1">
              {errors.password.message}
            </p>
          )}

          <div className="flex justify-end mt-2">
            <Link
              href="/forgot-password"
              className="text-sm text-emerald-600 hover:text-emerald-700 hover:underline transition-colors"
            >
              Quên mật khẩu?
            </Link>
          </div>
        </div>

        <div className="pt-2">
          <Button
            text={isLoading ? "Đang xác thực..." : "Đăng nhập"}
            type="submit"
            disabled={isLoading}
            className="w-full bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl py-3 font-semibold transition-all shadow-soft disabled:opacity-70 disabled:cursor-not-allowed"
          />
        </div>
      </form>

      <div className="mt-8 text-center text-sm text-gray-600">
        Chưa có tài khoản?{" "}
        <Link
          href="/register"
          className="text-emerald-600 font-semibold hover:text-emerald-700 hover:underline transition-colors"
        >
          Đăng ký ngay
        </Link>
      </div>
    </div>
  );
}
