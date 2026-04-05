'use client';

import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Loader2, CreditCard, Clock, User, ClipboardCheck, GraduationCap } from 'lucide-react';
import { LicenseFormValues, licenseSchema } from '../schema/license.schema';
import { cn } from '@/lib/utils/utils';

/**
 * LicenseForm - Biểu mẫu quản lý Hạng bằng lái (GPLX)
 * @param {LicenseFormValues} [props.initialData] - Dữ liệu ban đầu (Edit mode)
 * @param {Function} props.onSubmitForm - Hàm xử lý gửi dữ liệu
 */
export function LicenseForm({
  initialData,
  onSubmitForm,
}: {
  initialData?: LicenseFormValues;
  onSubmitForm: (data: LicenseFormValues) => Promise<void>;
}) {
  const [isLoading, setIsLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LicenseFormValues>({
    resolver: zodResolver(licenseSchema),
    defaultValues: initialData || {
      code: '',
      name: '',
      description: '',
      minAge: 18,
      totalQuestions: 25,
      passingScore: 21,
      testDuration: 19,
    },
  });

  const onSubmit = async (values: LicenseFormValues) => {
    try {
      setIsLoading(true);
      await onSubmitForm(values);
    } catch (error) {
      console.error('❌ Lỗi gửi biểu mẫu License:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-6">
      
      {/* SECTION 1: Thông tin cơ bản (Basic Info) */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="flex flex-col gap-2">
          <label className="flex items-center gap-2 font-bold text-slate-800">
            <CreditCard size={16} className="text-emerald-500" />
            Mã hạng (Code)
          </label>
          <input
            {...register('code')}
            className={cn(
              "p-3 rounded-2xl border bg-slate-50 outline-none transition-all focus:ring-2 focus:ring-emerald-500/50 uppercase font-black",
              errors.code ? "border-rose-500" : "border-slate-200"
            )}
            placeholder="VD: A1, B2..."
            disabled={isLoading}
          />
          {errors.code && <span className="text-xs text-rose-500 ml-1">{errors.code.message}</span>}
        </div>

        <div className="md:col-span-2 flex flex-col gap-2">
          <label className="flex items-center gap-2 font-bold text-slate-800">
            <GraduationCap size={16} className="text-emerald-500" />
            Tên hiển thị (Display Name)
          </label>
          <input
            {...register('name')}
            className={cn(
              "p-3 rounded-2xl border bg-slate-50 outline-none transition-all focus:ring-2 focus:ring-emerald-500/50",
              errors.name ? "border-rose-500" : "border-slate-200"
            )}
            placeholder="VD: Hạng B2 - Xe ô tô chở người đến 9 chỗ..."
            disabled={isLoading}
          />
          {errors.name && <span className="text-xs text-rose-500 ml-1">{errors.name.message}</span>}
        </div>
      </div>

      {/* SECTION 2: Cấu hình sát hạch (Examination Config) */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 p-5 bg-emerald-50/50 rounded-[2rem] border border-emerald-100">
        
        {/* Tuổi tối thiểu */}
        <div className="flex flex-col gap-2">
          <label className="flex items-center gap-2 text-xs font-black text-emerald-700 uppercase">
            <User size={14} /> Tuổi tối thiểu
          </label>
          <input
            type="number"
            {...register('minAge', { valueAsNumber: true })}
            className="p-3 rounded-xl border-none bg-white shadow-sm outline-none focus:ring-2 focus:ring-emerald-500/30 font-bold"
            disabled={isLoading}
          />
        </div>

        {/* Tổng số câu hỏi */}
        <div className="flex flex-col gap-2">
          <label className="flex items-center gap-2 text-xs font-black text-emerald-700 uppercase">
            <ClipboardCheck size={14} /> Tổng số câu
          </label>
          <input
            type="number"
            {...register('totalQuestions', { valueAsNumber: true })}
            className="p-3 rounded-xl border-none bg-white shadow-sm outline-none focus:ring-2 focus:ring-emerald-500/30 font-bold"
            disabled={isLoading}
          />
        </div>

        {/* Điểm đạt */}
        <div className="flex flex-col gap-2">
          <label className="flex items-center gap-2 text-xs font-black text-emerald-700 uppercase">
            <Loader2 size={14} /> Điểm đạt
          </label>
          <input
            type="number"
            {...register('passingScore', { valueAsNumber: true })}
            className="p-3 rounded-xl border-none bg-white shadow-sm outline-none focus:ring-2 focus:ring-emerald-500/30 font-bold text-emerald-600"
            disabled={isLoading}
          />
        </div>

        {/* Thời gian thi */}
        <div className="flex flex-col gap-2">
          <label className="flex items-center gap-2 text-xs font-black text-emerald-700 uppercase">
            <Clock size={14} /> TG thi (Phút)
          </label>
          <input
            type="number"
            {...register('testDuration', { valueAsNumber: true })}
            className="p-3 rounded-xl border-none bg-white shadow-sm outline-none focus:ring-2 focus:ring-emerald-500/30 font-bold"
            disabled={isLoading}
          />
        </div>
      </div>

      {/* SECTION 3: Mô tả chi tiết */}
      <div className="flex flex-col gap-2">
        <label className="font-bold text-slate-800 ml-1">Mô tả quyền hạn (Description)</label>
        <textarea
          {...register('description')}
          className="p-4 rounded-[1.5rem] border border-slate-200 bg-slate-50 outline-none transition-all focus:ring-2 focus:ring-emerald-500/50 min-h-[100px] text-sm text-slate-600"
          placeholder="Nhập chi tiết các loại xe được phép điều khiển cho hạng bằng này..."
          disabled={isLoading}
        />
      </div>

      {/* SUBMIT BUTTON */}
      <button
        type="submit"
        disabled={isLoading}
        className="mt-2 flex items-center justify-center gap-2 rounded-2xl bg-emerald-600 px-6 py-4 font-bold text-white shadow-emerald transition-all hover:bg-emerald-700 active:scale-[0.98] disabled:opacity-70 disabled:active:scale-100"
      >
        {isLoading ? (
          <Loader2 className="animate-spin" size={20} />
        ) : (
          <CreditCard size={20} />
        )}
        {isLoading ? 'Đang lưu cấu hình...' : 'Lưu Hạng bằng lái (Save License)'}
      </button>
    </form>
  );
}