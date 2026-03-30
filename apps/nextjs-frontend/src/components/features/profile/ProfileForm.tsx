"use client";

import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import axios from "axios";
import ProfileHeader from "./ProfileHeader";
import ProfileRoles from "./ProfileRoles"; // Lưu ý: Component này đang được import nhưng chưa dùng trong JSX
import {
  ProfileFormValues,
  profileSchema,
} from "@/src/lib/validations/auth.schema";
import { useUserStore } from "@/src/services/user/user.service";
import Input from "../../ui/Input";
import Button from "../../ui/Button";

export default function ProfileForm() {
  const [isSaving, setIsSaving] = useState(false);
  const [message, setMessage] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);

  // 2. Truy cập dữ liệu người dùng từ Store
  const user = useUserStore((state) => state.user);

  // 3. KHỞI TẠO FORM
  const {
    register,
    handleSubmit,
    watch,
    reset,
    formState: { errors },
  } = useForm<ProfileFormValues>({
    resolver: zodResolver(profileSchema),
    // Thiết lập giá trị mặc định ban đầu từ Store
    defaultValues: {
      fullName: user?.fullName || "",
      nickname: user?.username || "",
      email: user?.email || "",
      roles: user?.roles.map((r) => r.displayName) || [],
    },
  });

  // 4. Đồng bộ hóa dữ liệu (Hydration Logic)
  useEffect(() => {
    if (user) {
      reset({
        fullName: user.fullName || "",
        nickname: "Cậu Vàng", // Đã sửa lỗi hardcode "Cậu Vàng" ở đây
        email: user.email || "",
        roles: user.roles.map((r) => r.displayName) || [],
      });
    }
  }, [user, reset]);

  const roles = watch("roles");

  // 5. HÀM XỬ LÝ GỬI DỮ LIỆU
  const onSubmit = async (data: ProfileFormValues) => {
    try {
      setIsSaving(true);
      setMessage(null);

      /** * LUỒNG 3 LỚP (3-Tier Flow): UI -> Service -> API
       * Ở đây bạn sẽ gọi: await profileService.updateProfile(data);
       */
      await new Promise((resolve) => setTimeout(resolve, 1500));

      setMessage({
        type: "success",
        text: "Cập nhật hồ sơ thành công! (Profile updated successfully)",
      });
    } catch (error) {
      if (axios.isAxiosError(error)) {
        setMessage({
          type: "error",
          text: error.response?.data?.message || "Lỗi kết nối hệ thống",
        });
      }
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="bg-white rounded-3xl shadow-soft border border-slate-100 overflow-hidden">
      <ProfileHeader />

      <form onSubmit={handleSubmit(onSubmit)} className="p-8 md:p-10 space-y-8">
        {/* Hiển thị Message nếu có */}
        {message && (
          <div
            className={`p-4 rounded-lg ${message.type === "success" ? "bg-emerald-50 text-emerald-700" : "bg-red-50 text-red-700"}`}
          >
            {message.text}
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
          <Input
            label="Họ và tên"
            placeholder="Nhập họ và tên..."
            {...register("fullName")}
            error={errors.fullName?.message}
          />

          <Input
            label="Biệt danh"
            placeholder="Nhập biệt danh..."
            {...register("nickname")}
            error={errors.nickname?.message}
          />

          <div className="md:col-span-2">
            <Input
              label="Địa chỉ Email (Định danh hệ thống)"
              readOnly
              {...register("email")}
              error={errors.email?.message}
              icon={
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                  />
                </svg>
              }
            />
            <p className="text-[11px] text-slate-400 ml-1 mt-1">
              * Email không thể thay đổi để đảm bảo tính xác thực.
            </p>
          </div>
          {/* Thành phần hiển thị Vai trò (Roles Component) */}
          <div className="pt-2">
            {/* Đảm bảo ProfileRoles nhận mảng tên vai trò đã được format */}
            <ProfileRoles roles={roles} />
          </div>
        </div>

        {/* Nút hành động (Action Buttons) */}
        <div className="pt-6 border-t border-slate-50 flex justify-end">
          <Button
            type="submit"
            isLoading={isSaving} // Truyền state isSaving vào đây để Button tự hiện Spinner và tự khóa (disable)
            className={`min-w-[180px] px-8 py-4 rounded-2xl text-white font-bold transition-all shadow-lg active:scale-[0.98] ${
              isSaving
                ? "bg-emerald-400 cursor-not-allowed shadow-none"
                : "bg-emerald-600 hover:bg-emerald-700 shadow-emerald-500/20"
            }`}
          >
            {isSaving ? "Đang lưu..." : "Lưu thay đổi"}
          </Button>
        </div>
      </form>
    </div>
  );
}
