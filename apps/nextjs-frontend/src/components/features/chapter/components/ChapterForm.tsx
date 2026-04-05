'use client';

import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Loader2 } from 'lucide-react';
import { ChapterFormValues, chapterSchema } from '../schema/chapter.schema';
import { cn } from '@/lib/utils/utils';

/**
 * Giao diện biểu mẫu (Form UI) để tạo hoặc chỉnh sửa Chương học (Chapter).
 * Nằm ở lớp UI (UI Tier), làm nhiệm vụ thu thập dữ liệu và gọi Service.
 * * @param {Object} props - Thuộc tính truyền vào component.
 * @param {ChapterFormValues} [props.initialData] - Dữ liệu ban đầu nếu ở chế độ chỉnh sửa (Edit mode).
 * @param {(data: ChapterFormValues) => Promise<void>} props.onSubmitForm - Hàm xử lý gửi dữ liệu (Submit handler).
 * @returns {JSX.Element} Biểu mẫu Chapter.
 */
export function ChapterForm({
  initialData,
  onSubmitForm,
}: {
  initialData?: ChapterFormValues;
  onSubmitForm: (data: ChapterFormValues) => Promise<void>;
}) {
  // Quản lý trạng thái tải (Loading state)
  const [isLoading, setIsLoading] = useState(false);

  // Khởi tạo React Hook Form
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ChapterFormValues>({
    resolver: zodResolver(chapterSchema),
    defaultValues: initialData || {
      title: '',
      description: '',
      order: 1,
    },
  });

  /**
   * Hàm xử lý khi người dùng nhấn Gửi (Submit).
   * Lớp UI (UI Tier) là nơi duy nhất được dùng try/catch.
   * * @param {ChapterFormValues} values - Dữ liệu từ biểu mẫu đã qua kiểm duyệt (Validated data).
   */
  const onSubmit = async (values: ChapterFormValues) => {
    try {
      setIsLoading(true);
      await onSubmitForm(values);
    } catch (error) {
      console.error('Lỗi khi gửi biểu mẫu (Form submission error):', error);
      // Xử lý thông báo lỗi (Toast error) tại đây
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-6">
      {/* Khối nhập liệu (Input Wrapper) */}
      <div className="flex flex-col gap-2">
        <label className="font-semibold text-slate-900">Tên chương (Chapter Name)</label>
        <input
          {...register('title')}
          className={cn(
            "p-3 rounded-2xl border bg-slate-50 outline-none transition-all focus:ring-2 focus:ring-emerald-500/50",
            errors.title ? "border-rose-500" : "border-slate-200"
          )}
          placeholder="VD: Khái niệm và quy tắc giao thông đường bộ..."
          disabled={isLoading}
        />
        {/* Hiển thị lỗi (Error message) */}
        {errors.title && <span className="text-sm text-rose-500">{errors.title.message}</span>}
      </div>

      <div className="flex flex-col gap-2">
        <label className="font-semibold text-slate-900">Mô tả (Description)</label>
        <textarea
          {...register('description')}
          className="p-3 rounded-2xl border border-slate-200 bg-slate-50 outline-none transition-all focus:ring-2 focus:ring-emerald-500/50 min-h-[100px]"
          placeholder="Mô tả nội dung chương học..."
          disabled={isLoading}
        />
      </div>

      <div className="flex flex-col gap-2">
        <label className="font-semibold text-slate-900">Thứ tự (Order)</label>
        <input
          type="number"
          {...register('order', { valueAsNumber: true })}
          className={cn(
            "p-3 rounded-2xl border bg-slate-50 outline-none transition-all focus:ring-2 focus:ring-emerald-500/50",
            errors.order ? "border-rose-500" : "border-slate-200"
          )}
          disabled={isLoading}
        />
        {errors.order && <span className="text-sm text-rose-500">{errors.order.message}</span>}
      </div>

      {/* Nút gửi (Submit Button) - Emerald Theme, Interaction active:scale */}
      <button
        type="submit"
        disabled={isLoading}
        className="mt-2 flex items-center justify-center gap-2 rounded-2xl bg-emerald-600 px-6 py-3 font-semibold text-white shadow-soft transition-all hover:bg-emerald-700 active:scale-[0.98] disabled:opacity-70 disabled:active:scale-100"
      >
        {isLoading && <Loader2 className="animate-spin" size={20} />}
        {isLoading ? 'Đang lưu (Saving)...' : 'Lưu Chương học (Save Chapter)'}
      </button>
    </form>
  );
}