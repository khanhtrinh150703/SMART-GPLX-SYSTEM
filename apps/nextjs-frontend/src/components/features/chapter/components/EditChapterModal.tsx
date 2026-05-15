// src/features/chapter/components/EditChapterModal.tsx
"use client";

import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { BookOpen, Hash, FileText, Info, Fingerprint } from "lucide-react";
import { BaseModal } from "@/components/common/Modals/BaseModal";
import Button from "@/components/ui/Button/Button";
import {
  chapterEditSchema,
  ChapterFormEditValues,
} from "../schema/chapter.schema";
import { Chapter } from "@/components/features/chapter/types/chapter.types";
import { Alert } from "@/components/ui/Alert";
import { FormField } from "@/components/common/Form/FormField";
import axios from "axios";

// Định nghĩa Schema cho Chapter (English: Validation Schema)

interface EditChapterModalProps {
  isOpen: boolean;
  onClose: () => void;
  chapter: Chapter | null;
  onSave: (data: ChapterFormEditValues) => Promise<unknown>;
  isLoading: boolean;
}

export default function EditChapterModal({
  isOpen,
  onClose,
  chapter,
  onSave,
  isLoading,
}: EditChapterModalProps) {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ChapterFormEditValues>({
    resolver: zodResolver(chapterEditSchema),
  });

  const [message, setMessage] = useState<{
    type: "success" | "error" | "warning";
    text: string;
  } | null>(null);
  useEffect(() => {
    if (chapter) {
      reset({
        name: chapter.name,
        description: chapter.description,
        orderIndex: chapter.orderIndex,
        status: chapter.status,
        code: chapter.code,
      });
    }
  }, [chapter, reset]);

  const onSubmit = async (data: ChapterFormEditValues) => {
    try {
      setMessage(null); // Xóa lỗi cũ trước khi thử lại

      // Đợi trang cha thực hiện lưu dữ liệu
      await onSave(data);

      // Nếu không có lỗi: Đóng modal (Thành công xử lý ở trang cha qua Toast)
      onClose();
      reset();
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
      title="Chỉnh sửa chương học"
      description="Cập nhật nội dung đào tạo lý thuyết"
      icon={BookOpen}
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
        {/* Tiêu đề chương */}

        <FormField
          label="Tên chương học (Name)"
          icon={FileText}
          placeholder="VD: Khái niệm và quy tắc giao thông đường bộ."
          {...register("name")}
          error={errors.name?.message}
          disabled={isLoading}
        />

        <FormField
          label="Mã số (Code)"
          icon={Fingerprint}
          placeholder="VD: CH01"
          {...register("code")}
          error={errors.code?.message}
          disabled={isLoading}
        />

        <div className="grid grid-cols-2 gap-4">
          {/* Thứ tự hiển thị */}
          <div>
            <FormField
              label="Thứ tự hiển thị (Order Index)"
              icon={Hash}
              type="number"
              placeholder="VD: 1"
              {...register("orderIndex", { valueAsNumber: true })}
              error={errors.orderIndex?.message}
              disabled={isLoading}
            />
          </div>
        </div>

        {/* Mô tả chi tiết */}
        <div>
          <FormField
            label="Mô tả chi tiết (Description)"
            icon={Info}
            isTextArea
            placeholder="VD: Chương 1: Bao gồm các định nghĩa cơ bản và quy tắc ưu tiên"
            {...register("description")}
            error={errors.description?.message}
            disabled={isLoading}
          />
        </div>

        {/* Action Buttons */}
        <div className="pt-4 flex gap-4">
          <button
            type="button"
            onClick={onClose}
            className="flex-[0.4] px-6 py-3.5 rounded-2xl border border-slate-200 font-bold text-slate-500 hover:bg-slate-50 transition-all"
          >
            Hủy
          </button>
          <Button
            type="submit"
            variant="primary"
            isLoading={isLoading}
            className="flex-1 h-[56px] rounded-2xl shadow-lg shadow-emerald-500/20"
            text="Lưu thay đổi"
          />
        </div>
      </form>
    </BaseModal>
  );
}
