"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import axios from "axios";

// UI Components
import Input from "@/components/ui/Input/Input";
import Button from "@/components/ui/Button/Button";
import { Alert } from "@/components/ui/Alert";

// Logic & Validation
import { changePasswordSchema, ChangePasswordValues } from "@/lib/validations/user.schema";
import { userService } from "@/services/user/user.service";

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

export default function ChangePasswordModal({ isOpen, onClose }: Props) {
  // --- States (Trạng thái) ---
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ChangePasswordValues>({
    resolver: zodResolver(changePasswordSchema),
  });

  /**
   * Handle Password Update 
   * (Xử lý cập nhật mật khẩu)
   */
  const onSubmit = async (data: ChangePasswordValues) => {
    try {
      setIsLoading(true);
      setMessage(null); // Clear previous message (Xóa thông báo cũ)

      // UI -> Service Flow
      await userService.changePassword(data);

      setMessage({
        type: "success",
        text: "Mật khẩu đã được thay đổi thành công!",
      });

      reset(); // Reset form fields (Làm trống các trường nhập liệu)

      // Tự động đóng modal sau 2 giây để người dùng kịp đọc thông báo thành công
      setTimeout(() => {
        onClose();
        setMessage(null);
      }, 2000);

    } catch (error) {
      // Error Handling (Xử lý lỗi lớp UI)
      if (axios.isAxiosError(error)) {
        setMessage({
          type: "error",
          text: error.response?.data?.message || "Đã xảy ra lỗi khi đổi mật khẩu.",
        });
      } else {
        setMessage({
          type: "error",
          text: "Lỗi kết nối hệ thống.",
        });
      }
    } finally {
      setIsLoading(false);
    }
  };

  // Tránh render khi modal đóng (Early Return)
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-300">
      <div className="bg-white w-full max-w-md rounded-[2.5rem] shadow-2xl overflow-hidden animate-in zoom-in duration-200">
        <form onSubmit={handleSubmit(onSubmit)} className="p-8 md:p-10">
          <h3 className="text-2xl font-bold text-slate-900 mb-2">Bảo mật tài khoản</h3>
          <p className="text-slate-500 mb-6 text-sm">Vui lòng nhập mật khẩu cũ để xác thực thay đổi.</p>

          {/* 🔔 Alert System (Hệ thống thông báo) */}
          {message && (
            <Alert
              key={message.text}
              intent={message.type === "success" ? "success" : "error"}
              message={message.text}
              duration={10000}
              className="mb-6"
              onClose={() => setMessage(null)}
            />
          )}

          <div className="space-y-5">
            <Input
              type="password"
              label="Mật khẩu hiện tại"
              placeholder="••••••••"
              {...register("oldPassword")}
              error={errors.oldPassword?.message}
            />
            
            <div className="h-px bg-slate-100 my-2" /> {/* Divider (Đường phân cách) */}

            <Input
              type="password"
              label="Mật khẩu mới"
              placeholder="Nhập mật khẩu mới"
              {...register("newPassword")}
              error={errors.newPassword?.message}
            />
            <Input
              type="password"
              label="Xác nhận mật khẩu mới"
              placeholder="Nhập lại mật khẩu mới"
              {...register("confirmPassword")}
              error={errors.confirmPassword?.message}
            />
          </div>

          <div className="flex gap-4 mt-10">
            <Button
              type="button"
              variant="outline"
              className="flex-1 border-slate-200 text-slate-600"
              onClick={() => {
                setMessage(null);
                onClose();
              }}
              disabled={isLoading}
            >
              Hủy bỏ
            </Button>
            <Button
              type="submit"
              variant="primary"
              className="flex-1"
              isLoading={isLoading}
            >
              Cập nhật ngay
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}