"use client";

import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { CreditCard, FileText, Activity, Info, User } from "lucide-react";
import axios from "axios";

// Components
import { BaseModal } from "@/components/common/Modals/BaseModal";
import Input from "@/components/ui/Input/Input";
import { cn } from "@/lib/utils/utils";
import Button from "@/components/ui/Button/Button";
import { Alert } from "@/components/ui/Alert";

// Types & Schemas
import { editLicenseSchema, LicenseFormEditValues } from "../schema/license.schema";
import { LicenseCategory } from "@/types/license-category.types";

/**
 * EditLicenseModal - Modal chỉnh sửa thông tin hạng bằng lái.
 */
interface EditLicenseModalProps {
  isOpen: boolean;
  onClose: () => void;
  license: LicenseCategory | null;
  // Sửa thành Promise<StandardResponse<unknown>> để khớp với mutateAsync
  onSave: (data: LicenseFormEditValues) => Promise<unknown>;
  isLoading: boolean;
}

export default function EditLicenseModal({
  isOpen,
  onClose,
  license,
  onSave,
  isLoading,
}: EditLicenseModalProps) {
  // 1. Quản lý thông báo lỗi nội bộ (Internal Message State)
  const [message, setMessage] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);

  // 2. Cấu hình Form
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<LicenseFormEditValues>({
    resolver: zodResolver(editLicenseSchema),
  });

  // 3. Đồng bộ dữ liệu & Reset lỗi khi mở Modal
  useEffect(() => {
    if (license && isOpen) {
      reset({
        name: license.name,
        description: license.description,
        minAge: license.minAge,
        status: license.status,
      });
    }
  }, [license, isOpen, reset]);

  // 4. Hàm xử lý nộp form cục bộ (Local Submit Handler)
  const handleFormSubmit = async (data: LicenseFormEditValues) => {
    try {
      setMessage(null);
      await onSave(data);
      
      // Nếu thành công (onSave không throw error), đóng Modal
      onClose();
    } catch (error) {
      // Hứng lỗi từ trang cha ném về (Catch error bubbled up from parent)
      let errorText = "Cập nhật thất bại. Vui lòng thử lại!";
      
      if (axios.isAxiosError(error)) {
        errorText = error.response?.data?.message || errorText;
      }
      
      setMessage({ type: "error", text: errorText });
    }
  };

  return (
    <BaseModal
      isOpen={isOpen}
      onClose={onClose}
      title="Chỉnh sửa hạng bằng lái"
      description="Cập nhật quy định và trạng thái hoạt động của hạng bằng"
      icon={CreditCard}
      maxWidth="lg"
    >
      {/* HIỂN THỊ ALERT (Show Alert Notification) */}
      {message && (
        <Alert
          key={message.text}
          intent={message.type}
          message={message.text}
          duration={10000}
          className="mb-8"
          onClose={() => setMessage(null)}
        />
      )}

      <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-6">
        {/* SECTION 1: Thông tin cơ bản */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="md:col-span-2">
            <label className="flex items-center gap-2 text-sm font-bold text-slate-700 mb-1.5 ml-1">
              <FileText size={14} className="text-slate-400" />
              Tên hạng bằng (VD: A1, B2)
            </label>
            <Input
              placeholder="Nhập tên hạng bằng..."
              {...register("name")}
              error={errors.name?.message}
              disabled={isLoading}
            />
          </div>

          <div className="md:col-span-1">
            <label className="flex items-center gap-2 text-sm font-bold text-slate-700 mb-1.5 ml-1">
              <User size={14} className="text-emerald-500" />
              Tuổi tối thiểu
            </label>
            <Input
              type="number"
              placeholder="18"
              {...register("minAge", { valueAsNumber: true })}
              error={errors.minAge?.message}
              disabled={isLoading}
            />
          </div>
        </div>

        {/* SECTION 2: Chi tiết quyền hạn */}
        <div className="space-y-1.5">
          <label className="flex items-center gap-2 text-sm font-bold text-slate-700 ml-1">
            <Info size={14} className="text-slate-400" />
            Mô tả quyền hạn
          </label>
          <textarea
            {...register("description")}
            disabled={isLoading}
            className={cn(
              "w-full p-4 rounded-[2rem] border border-slate-200 min-h-[120px] outline-none focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/5 transition-all text-sm bg-white shadow-sm resize-none",
              errors.description && "border-rose-500 ring-1 ring-rose-500"
            )}
            placeholder="Mô tả các loại phương tiện được phép điều khiển..."
          />
          {errors.description && (
            <p className="text-rose-500 text-xs mt-1 ml-1 font-medium italic">
              {errors.description.message}
            </p>
          )}
        </div>

        {/* SECTION 3: Quản lý Trạng thái */}
        {/* <div className="p-6 bg-slate-50/80 rounded-[2rem] border border-slate-100">
          <label className="flex items-center gap-2 text-xs font-black text-slate-400 uppercase tracking-widest mb-3 ml-1">
            <Activity size={14} /> Trạng thái hệ thống
          </label>
          <select
            {...register("status")}
            disabled={isLoading}
            className="w-full h-[52px] px-4 rounded-2xl border border-slate-200 bg-white text-slate-700 focus:border-emerald-500 outline-none transition-all font-semibold shadow-sm cursor-pointer disabled:opacity-50"
          >
            <option value="active">Đang cấp (Active)</option>
            <option value="inactive">Tạm ngưng (Inactive)</option>
            <option value="deleted">Đã xóa (Deleted)</option>
          </select>
        </div> */}

        {/* Action Buttons */}
        <div className="pt-4 flex items-center gap-4">
          <button
            type="button"
            onClick={onClose}
            disabled={isLoading}
            className="px-8 h-[56px] rounded-2xl border border-slate-200 font-bold text-slate-500 hover:bg-slate-50 transition-all active:scale-95 flex-[0.3] disabled:opacity-50"
          >
            Hủy
          </button>
          <Button
            type="submit"
            isLoading={isLoading}
            className="flex-1 h-[56px] rounded-2xl shadow-lg shadow-emerald-500/20 text-base font-bold"
          >
            Lưu thay đổi hạng bằng
          </Button>
        </div>
      </form>
    </BaseModal>
  );
}