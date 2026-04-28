"use client";

import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { CreditCard, Hash, Info, User } from "lucide-react";
import axios from "axios";

// Components
import { BaseModal } from "@/components/common/Modals/BaseModal";
import Button from "@/components/ui/Button/Button";
import { FormField } from "@/components/common/Form/FormField";
import { FormGrid } from "@/components/common/Form/FormGrid";
import { Alert } from "@/components/ui/Alert";

// Types & Schemas
import {
  CreateLicensePayload,
  createLicenseSchema,
} from "../schema/license.schema";

interface CreateLicenseModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: CreateLicensePayload) => Promise<unknown>;
  isLoading: boolean;
}

export default function CreateLicenseModal({
  isOpen,
  onClose,
  onSave,
  isLoading,
}: CreateLicenseModalProps) {
  // 1. Quản lý thông báo lỗi nội bộ (Internal Error State)
  const [message, setMessage] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);

  // 2. Khởi tạo Form
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<CreateLicensePayload>({
    resolver: zodResolver(createLicenseSchema),
    defaultValues: { name: "", description: "", minAge: 18 },
  });

  // 3. Hàm xử lý nộp form (Handle Submit with Error Catching)
  const onSubmit = async (values: CreateLicensePayload) => {
    try {
      setMessage(null); // Xóa lỗi cũ trước khi thử lại

      // Đợi trang cha thực hiện lưu dữ liệu
      await onSave(values);

      // Nếu không có lỗi: Đóng modal (Thành công xử lý ở trang cha qua Toast)
      onClose();
    } catch (error) {
      // Nếu trang cha ném lỗi (mutateAsync fail), Modal sẽ bắt ở đây
      let errorText = "Không thể tạo hạng bằng lái. Vui lòng thử lại!";

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
      title="Thêm mới hạng bằng lái"
      description="Khởi tạo cấu hình hạng bằng mới cho hệ thống"
      icon={CreditCard}
      maxWidth="md"
    >
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
        {/* HIỂN THỊ ALERT (Lỗi tự hiện tự mất theo Modal nhờ vào 'key' ở trang cha) */}
        {message && (
          <Alert
            key={message.text}
            intent={message.type}
            message={message.text}
            duration={10000}
            onClose={() => setMessage(null)}
          />
        )}

        <FormGrid cols={2}>
          <FormField
            label="Mã/Tên hạng bằng"
            icon={Hash}
            placeholder="VD: B1, B2..."
            {...register("name")}
            error={errors.name?.message}
            disabled={isLoading}
            className="uppercase font-black"
          />
          <FormField
            label="Độ tuổi tối thiểu"
            icon={User}
            type="number"
            {...register("minAge", { valueAsNumber: true })}
            error={errors.minAge?.message}
            disabled={isLoading}
          />
        </FormGrid>

        <FormField
          label="Thứ tự hiển thị (Order Index)"
          icon={Hash}
          type="number"
          placeholder="VD: 1"
          {...register("orderIndex", { valueAsNumber: true })}
          error={errors.orderIndex?.message}
          disabled={isLoading}
        />
        
        <FormField
          label="Mô tả quyền hạn"
          icon={Info}
          isTextArea
          placeholder="Mô tả các loại phương tiện được phép điều khiển..."
          {...register("description")}
          error={errors.description?.message}
          disabled={isLoading}
        />

        <div className="pt-4 flex gap-4">
          <button
            type="button"
            onClick={onClose}
            disabled={isLoading}
            className="flex-[0.4] px-6 py-3.5 rounded-2xl border border-slate-200 font-bold text-slate-500 hover:bg-slate-50 transition-all active:scale-95 disabled:opacity-50"
          >
            Hủy bỏ
          </button>
          <Button
            type="submit"
            variant="primary"
            isLoading={isLoading}
            text="Tạo hạng bằng"
            className="flex-1 h-[56px] rounded-2xl shadow-lg shadow-emerald-500/20"
          />
        </div>
      </form>
    </BaseModal>
  );
}
