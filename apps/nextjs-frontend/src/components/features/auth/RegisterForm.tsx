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
      await authApi.register({
        username: data.username.trim(),
        email: data.email.trim(),
        fullName: data.fullName,
        password: data.password,
        confirmPassword: data.confirmPassword,
      });

      // Lưu tạm email để điền sẵn ở trang OTP
      localStorage.setItem("register_email", data.email);

      // Chuyển sang trang verify OTP
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
      {/* Thu nhỏ khoảng cách nút Google */}
      <div className="space-y-2">
        <GoogleButton text="Đăng ký với Google" />
      </div>

      <div className="my-3">
        <Divider text="Hoặc đăng ký bằng Email" />
      </div>

      {errorMsg && (
        <Alert
          intent="error"
          message={errorMsg}
          duration={10000}
          className="mb-3 text-xs"
        />
      )}

      {/* Thay space-y-3.5 thành space-y-3 để các ô khít nhau hơn nữa */}
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-3">
        {/* Hàng 1 */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <Input
              label="Tên đăng nhập"
              placeholder="VD: wangwu"
              disabled={isLoading}
              {...register("username")}
            />
            {errors.username && (
              <p className="text-rose-500 text-xs mt-0.5">
                {errors.username.message}
              </p>
            )}
          </div>

          <div>
            <Input
              label="Họ Tên"
              type="text"
              placeholder="Wang Wu"
              disabled={isLoading}
              {...register("fullName")}
            />
            {errors.fullName && (
              <p className="text-rose-500 text-xs mt-0.5">
                {errors.fullName.message}
              </p>
            )}
          </div>
        </div>

        {/* Hàng 2 */}
        <div>
          <Input
            label="Email"
            type="email"
            placeholder="nguyenvana@gmail.com"
            disabled={isLoading}
            {...register("email")}
          />
          {errors.email && (
            <p className="text-rose-500 text-xs mt-0.5">
              {errors.email.message}
            </p>
          )}
        </div>

        {/* Hàng 3 */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <Input
              label="Mật khẩu"
              type="password"
              placeholder="Tạo mật khẩu"
              disabled={isLoading}
              {...register("password")}
            />
            {errors.password && (
              <p className="text-rose-500 text-xs mt-0.5">
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
              <p className="text-rose-500 text-xs mt-0.5">
                {errors.confirmPassword.message}
              </p>
            )}
          </div>
        </div>

        {/* Nút Submit vừa vặn */}
        <div className="w-full pt-2">
          <Button
            variant="primary"
            size="md"
            isLoading={isLoading}
            type="submit"
            className="w-full py-2.5 font-semibold text-sm"
            text={isLoading ? "Đang tạo tài khoản..." : "Tạo tài khoản"}
          />
        </div>
      </form>

      {/* Dòng này nằm cuối Form con, thêm pb-4 để không dính sát vào đường kẻ gạch ngang */}
      <div className="mt-4 text-center text-xs text-slate-500 pb-4">
        Đã có tài khoản?{" "}
        <TextLink
          href="/login"
          intent="primary"
          className="font-semibold text-emerald-600"
        >
          Đăng nhập ngay
        </TextLink>
      </div>
    </div>
  );
}
