"use client";

import React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { BookOpen, Hash, FileText, Info } from "lucide-react";
import { z } from "zod";

import { BaseModal } from "@/components/common/Modals/BaseModal";
import Button from "@/components/ui/Button/Button";
import { FormField } from "@/components/common/Form/FormField";
import { CreateChapterPayload, createChapterSchema } from "../schema/chapter.schema";

interface CreateChapterModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: CreateChapterPayload) => Promise<void>;
  isLoading: boolean;
}

export default function CreateChapterModal({
  isOpen,
  onClose,
  onSave,
  isLoading,
}: CreateChapterModalProps) {
  // Khởi tạo React Hook Form
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<CreateChapterPayload>({
    resolver: zodResolver(createChapterSchema),
    defaultValues: {
      name: "",
      description: "",
      orderIndex: 1, // Mặc định là chương 1
    },
  });

  // Xử lý Submit
  const onSubmit = async (data: CreateChapterPayload) => {
    await onSave(data);
    reset(); // Reset trắng form sau khi thêm thành công để sẵn sàng thêm chương tiếp theo
  };

  return (
    <BaseModal
      isOpen={isOpen}
      onClose={onClose}
      title="Thêm mới Chương học"
      description="Tạo chương học mới cho hệ thống đào tạo lý thuyết"
      icon={BookOpen}
      maxWidth="md"
    >
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
        
        {/* ÁP DỤNG FORM FIELD VẠN NĂNG */}
        
        <FormField
          label="Tên chương học (Name)"
          icon={FileText}
          placeholder="VD: Khái niệm và quy tắc giao thông đường bộ."
          {...register("name")}
          error={errors.name?.message}
          disabled={isLoading}
        />

        <FormField
          label="Thứ tự hiển thị (Order Index)"
          icon={Hash}
          type="number"
          placeholder="VD: 1"
          {...register("orderIndex")}
          error={errors.orderIndex?.message}
          disabled={isLoading}
        />

        <FormField
          label="Mô tả chi tiết (Description)"
          icon={Info}
          isTextArea
          placeholder="VD: Chương 1: Bao gồm các định nghĩa cơ bản và quy tắc ưu tiên"
          {...register("description")}
          error={errors.description?.message}
          disabled={isLoading}
        />

        {/* Nút thao tác (Action Buttons) */}
        <div className="pt-4 flex gap-4">
          <button
            type="button"
            onClick={onClose}
            disabled={isLoading}
            className="flex-[0.4] px-6 py-3.5 rounded-2xl border border-slate-200 font-bold text-slate-500 hover:bg-slate-50 transition-all active:scale-95"
          >
            Hủy bỏ
          </button>
          <Button
            type="submit"
            variant="primary"
            isLoading={isLoading}
            text="Lưu chương mới"
            className="flex-1 h-[56px] rounded-2xl shadow-lg shadow-emerald-500/20 active:scale-[0.98]"
          />
        </div>
      </form>
    </BaseModal>
  );
}