// src/features/chapter/components/EditChapterModal.tsx
"use client";

import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { BookOpen, Hash, FileText, Activity, Info } from "lucide-react";
import { BaseModal } from "@/components/common/Modals/BaseModal";
import Button from "@/components/ui/Button/Button";
import Input from "@/components/ui/Input/Input";
import { cn } from "@/lib/utils/utils";
import {
  chapterEditSchema,
  ChapterFormEditValues,
} from "../schema/chapter.schema";
import { Chapter } from "@/types/chapter.types";
import { Alert } from "@/components/ui/Alert";

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
    type: "success" | "error";
    text: string;
  } | null>(null);
  // Reset form khi dữ liệu chapter thay đổi (English: Hydration / Reactive updates)
  useEffect(() => {
    if (chapter) {
      reset({
        name: chapter.name,
        description: chapter.description,
        orderIndex: chapter.orderIndex,
        status: chapter.status,
      });
    }
  }, [chapter, reset]);

  const onSubmit = async (data: ChapterFormEditValues) => {
    try {
      await onSave(data); // Đợi API chạy xong
      onClose(); // Nếu thành công thì đóng Modal
    } catch (error) {
      // (Tùy chọn) Xử lý lỗi nếu onSave thất bại, Modal sẽ không bị đóng
      console.error("Lỗi khi lưu:", error);
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
        <div>
          <label className="flex items-center gap-2 text-sm font-bold text-slate-700 mb-1.5 ml-1">
            <FileText size={14} className="text-slate-400" />
            Tiêu đề chương
          </label>
          <Input
            placeholder="Ví dụ: Khái niệm và quy tắc giao thông"
            {...register("name")}
            error={errors.name?.message}
            disabled={isLoading}
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          {/* Thứ tự hiển thị */}
          <div>
            <label className="flex items-center gap-2 text-sm font-bold text-slate-700 mb-1.5 ml-1">
              <Hash size={14} className="text-slate-400" />
              Thứ tự (Order)
            </label>
            <Input
              type="number"
              {...register("orderIndex")}
              error={errors.orderIndex?.message}
              disabled={isLoading}
            />
          </div>

          {/* Trạng thái
          <div>
            <label className="flex items-center gap-2 text-sm font-bold text-slate-700 mb-1.5 ml-1">
              <Activity size={14} className="text-slate-400" />
              Trạng thái
            </label>
            <select
              {...register("status")}
              className="w-full h-[52px] px-4 rounded-2xl border border-slate-200 bg-white text-slate-700 focus:border-emerald-500 outline-none transition-all"
            >
              <option value="draft">Bản nháp (Draft)</option>
              <option value="active">Hoạt động (Active)</option>
              <option value="deleted">Đã xóa (Deleted)</option>
            </select>
          </div> */}
        </div>

        {/* Mô tả chi tiết */}
        <div>
          <label className="flex items-center gap-2 text-sm font-bold text-slate-700 mb-1.5 ml-1">
            <Info size={14} className="text-slate-400" />
            Mô tả chương
          </label>
          <textarea
            {...register("description")}
            className={cn(
              "w-full p-4 rounded-2xl border border-slate-200 min-h-[100px] outline-none focus:border-emerald-500 transition-all",
              errors.description && "border-rose-500",
            )}
            placeholder="Nhập mô tả tóm tắt nội dung chương..."
          />
          {errors.description && (
            <p className="text-rose-500 text-xs mt-1 ml-1">
              {errors.description.message}
            </p>
          )}
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
