"use client";

import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import axios from "axios";

// Core UI & Utilities
import { Alert } from "@/components/ui/Alert";
import Input from "@/components/ui/Input/Input";
import { AvatarUpload } from "@/components/features/profile/components/AvatarUpload";

// Business Logic & Types (Lớp nghiệp vụ và Kiểu dữ liệu)
import { useUserStore } from "@/store/user/user.store";
import { UserRole } from "@/types/user.type";
import {
  ProfileFormValues,
  profileSchema,
} from "@/lib/validations/user.schema";

// Features (Thành phần tính năng)
import Button from "@/components/ui/Button/Button";
import { ProfileSidebar } from "./ProfileSidebar";
import ProfileRoles from "./ProfileRoles";
import ChangePasswordModal from "./ChangePasswordModal";
import { profileService } from "../service/profile.service";
import SplashScreen from "@/components/common/Loaders/SplashScreen";

export default function ProfileForm() {
  // --- States (Trạng thái) ---
  const [isMounted, setIsMounted] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false); // Trạng thái đóng/mở Modal
  const [message, setMessage] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);

  const user = useUserStore((state) => state.user);

  // --- Form Initialization (Khởi tạo biểu mẫu) ---
  const {
    register,
    handleSubmit,
    watch,
    reset,
    setValue,
    formState: { errors },
  } = useForm<ProfileFormValues>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      fullName: "",
      username: "",
      email: "",
      urlPicture: "",
      roles: [],
    },
  });

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const urlPicture = watch("urlPicture");
  const roles = watch("roles");

  // Sync user data to form (Đồng bộ dữ liệu người dùng vào biểu mẫu)
  useEffect(() => {
    if (user) {
      reset({
        fullName: user.fullName || "",
        username: user.username || "",
        email: user.email || "",
        urlPicture: user.urlPicture || "",
        roles: user.roles?.map((r: UserRole) => r.displayName) || [],
      });
    }
  }, [user, reset]);

  /**
   * Update Profile Handler
   * (Xử lý cập nhật thông tin cá nhân)
   */
  const onSubmit = async (data: ProfileFormValues) => {
    try {
      setIsSaving(true);
      setMessage(null);

      // UI Component -> Service (Luồng 3 lớp)
      await profileService.updateProfile(data);
      setMessage({ type: "success", text: "Cập nhật hồ sơ thành công!" });
    } catch (error) {
      if (axios.isAxiosError(error)) {
        setMessage({
          type: "error",
          text: error.response?.data?.message || "Lỗi hệ thống khi cập nhật",
        });
      }
    } finally {
      setIsSaving(false);
    }
  };

  if (!user) return <SplashScreen variant="profile" />;

  return (
    <div className="bg-white rounded-[2.5rem] shadow-soft border border-slate-100 overflow-hidden">
      {/* Form chính chỉ xử lý Update Profile. 
          Nút Đổi mật khẩu là type="button" để không trigger submit form này.
      */}
      <form onSubmit={handleSubmit(onSubmit)} className="p-8 md:p-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          {/* Cột trái: Sidebar & Avatar */}
          <div className="lg:col-span-3 flex flex-col items-center">
            <ProfileSidebar isActive={true}>
              <AvatarUpload
                value={urlPicture}
                onChange={(file) =>
                  setValue("urlPicture", file || "", { shouldValidate: true })
                }
              />
            </ProfileSidebar>
          </div>

          {/* Cột phải: Form Fields (Các trường nhập liệu) */}
          <div className="lg:col-span-9 space-y-8">
            <Alert
              key={message?.text}
              intent={message?.type === "success" ? "success" : "error"}
              message={message?.text}
              duration={5000}
              className="mb-8"
              onClose={() => setMessage(null)}
            />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Input
                label="Họ và tên"
                {...register("fullName")}
                error={errors.fullName?.message}
                placeholder="Nguyễn Văn A"
              />
              <Input
                label="Tài khoản (Username)"
                readOnly
                className="bg-slate-50 cursor-not-allowed"
                {...register("username")}
                error={errors.username?.message}
              />
            </div>

            <Input
              label="Email hệ thống"
              readOnly
              className="bg-slate-50 border-dashed cursor-not-allowed"
              {...register("email")}
            />

            <div className="pt-4 border-t border-slate-50">
              <label className="text-sm font-bold text-slate-800 mb-4 block">
                Vai trò (System Roles)
              </label>
              <ProfileRoles roles={roles} />
            </div>

            {/* Change Password Trigger (Nút kích hoạt đổi mật khẩu) */}
            <div className="flex justify-end mt-2">
              <button
                type="button"
                onClick={() => setIsPasswordModalOpen(true)}
                className="text-emerald-600 font-semibold hover:text-emerald-700 transition-colors text-sm underline-offset-4 hover:underline"
              >
                Cập nhật mật khẩu ?
              </button>
            </div>

            <div className="flex justify-end pt-4">
              <Button
                type="submit"
                variant="primary"
                size="profile"
                isLoading={isSaving}
              >
                Lưu thay đổi hồ sơ
              </Button>
            </div>
          </div>
        </div>
      </form>

      {/* Change Password Modal (Modal đổi mật khẩu)
          Đặt bên ngoài <form> để cô lập hoàn toàn Logic và Validation.
      */}
      <ChangePasswordModal
        isOpen={isPasswordModalOpen}
        onClose={() => setIsPasswordModalOpen(false)}
      />
    </div>
  );
}
