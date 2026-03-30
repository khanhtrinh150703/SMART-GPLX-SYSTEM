"use client";

import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import axios from "axios";
import {
  ProfileFormValues,
  profileSchema,
} from "@/lib/validations/auth.schema";
import { Alert } from "@/components/ui/Alert";
import { useUserStore } from "@/store/user/user.store";
import { userService } from "@/services/user/user.service";
import { ProfileSidebar } from "@/components/ui/Profile/ProfileSidebar";
import { AvatarUpload } from "@/components/ui/AvatarUpload";
import Input from "@/components/ui/Input/Input";
import ProfileRoles from "@/components/ui/Profile/ProfileRoles";
import Button from "@/components/ui/Button/Button";
import { UserRole } from "@/types/user.type";

export default function ProfileForm() {
  const [isSaving, setIsSaving] = useState(false);
  const [message, setMessage] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);
  const user = useUserStore((state) => state.user);

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

  const urlPicture = watch("urlPicture");
  const roles = watch("roles");

  useEffect(() => {
    if (user)
      reset({
        fullName: user.fullName || "",
        username: user.username || "",
        email: user.email || "",
        urlPicture: user.urlPicture || "",
        roles: user.roles?.map((r: UserRole) => r.displayName) || [],
      });
  }, [user, reset]);

  const onSubmit = async (data: ProfileFormValues) => {
    try {
      setIsSaving(true);
      setMessage(null);

      // Gọi service xử lý FormData
      console.log("dulieu", data);
      await userService.updateProfile(data);
      setMessage({ type: "success", text: "Cập nhật hồ sơ thành công!" });
    } catch (error) {
      if (axios.isAxiosError(error)) {
        setMessage({
          type: "error",
          text: error.response?.data?.message || "Lỗi hệ thống",
        });
      }
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="bg-white rounded-[2.5rem] shadow-soft border border-slate-100 overflow-hidden">
      <form onSubmit={handleSubmit(onSubmit)} className="p-8 md:p-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
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
          {/* Cột phải: Form Fields */}
          <div className="lg:col-span-9 space-y-8">
            {/* Thông báo từ hệ thống (System Notification) */}
            <Alert
              key={message?.text} // 💡 QUAN TRỌNG: Reset component khi message đổi
              intent={message?.type === "success" ? "success" : "error"}
              message={message?.text}
              duration={10000} // 10 giây tự tắt
              className="mb-8"
              onClose={() => setMessage(null)} // Xóa sạch state ở Page sau khi tắt
            />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Input
                label="Họ và tên"
                {...register("fullName")}
                error={errors.fullName?.message}
              />
              <Input
                label="Tài khoản"
                readOnly
                {...register("username")}
                error={errors.username?.message}
              />
            </div>
            <Input
              label="Email hệ thống"
              readOnly
              className="bg-slate-50 border-dashed"
              {...register("email")}
            />

            <div className="pt-4 border-t border-slate-50">
              <label className="text-sm font-bold text-slate-800 mb-4 block">
                Vai trò (System Roles)
              </label>
              <ProfileRoles roles={roles} />
            </div>

            <div className="flex justify-end pt-4">
              <Button
                type="submit"
                variant="primary"
                size="profile" // 🟢 Gọi đúng cái "biến" mình vừa tạo
                isLoading={isSaving}
              >
                Lưu thay đổi
              </Button>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}
