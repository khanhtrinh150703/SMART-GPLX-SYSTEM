"use client";

import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { 
  CreditCard, Hash, FileText, Activity, Info, 
  User, Clock, ClipboardCheck 
} from "lucide-react";
import { BaseModal } from "@/components/common/Modals/BaseModal";
import Button from "@/components/ui/Button/Button";
import Input from "@/components/ui/Input/Input";
import { License } from "./license.config";
import { cn } from "@/lib/utils/utils";
import { licenseEditSchema, LicenseFormEditValues } from "../schema/license.schema";

/**
 * EditLicenseModal - Modal chỉnh sửa thông tin và cấu hình hạng bằng lái (GPLX)
 */
interface EditLicenseModalProps {
  isOpen: boolean;
  onClose: () => void;
  license: License | null;
  onSave: (data: LicenseFormEditValues) => Promise<void>;
  isLoading: boolean;
}

export default function EditLicenseModal({
  isOpen,
  onClose,
  license,
  onSave,
  isLoading,
}: EditLicenseModalProps) {
  // Khởi tạo Form với Schema của License
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<LicenseFormEditValues>({
    resolver: zodResolver(licenseEditSchema),
  });

  // Đồng bộ dữ liệu khi mở Modal (Hydration)
  useEffect(() => {
    if (license) {
      reset({
        code: license.code,
        name: license.name,
        description: license.description,
        minAge: license.minAge,
        totalQuestions: license.totalQuestions,
        passingScore: license.passingScore,
        testDuration: license.testDuration,
        status: license.status,
      });
    }
  }, [license, reset]);

  return (
    <BaseModal
      isOpen={isOpen}
      onClose={onClose}
      title="Chỉnh sửa hạng bằng lái"
      description="Cập nhật quy định và cấu hình bộ đề sát hạch"
      icon={CreditCard}
      maxWidth="xl" // Tăng độ rộng để chứa các Grid thông số
    >
      <form onSubmit={handleSubmit(onSave)} className="space-y-6">
        
        {/* SECTION 1: Định danh hạng bằng (Identification) */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="md:col-span-1">
            <label className="flex items-center gap-2 text-sm font-bold text-slate-700 mb-1.5 ml-1">
              <Hash size={14} className="text-emerald-500" />
              Mã hạng (Code)
            </label>
            <Input
              placeholder="VD: A1, B2..."
              {...register("code")}
              error={errors.code?.message}
              disabled={isLoading}
              className="uppercase font-black"
            />
          </div>
          <div className="md:col-span-2">
            <label className="flex items-center gap-2 text-sm font-bold text-slate-700 mb-1.5 ml-1">
              <FileText size={14} className="text-slate-400" />
              Tên hiển thị
            </label>
            <Input
              placeholder="VD: Xe mô tô hạng A1"
              {...register("name")}
              error={errors.name?.message}
              disabled={isLoading}
            />
          </div>
        </div>

        {/* SECTION 2: Cấu hình kỹ thuật (Technical Config) */}
        <div className="p-5 bg-slate-50/80 rounded-[2rem] border border-slate-100 grid grid-cols-2 md:grid-cols-4 gap-4">
          <div>
            <label className="flex items-center gap-2 text-[10px] font-black text-slate-400 uppercase tracking-wider mb-1.5 ml-1">
              <User size={12} /> Tuổi tối thiểu
            </label>
            <Input
              type="number"
              {...register("minAge")}
              error={errors.minAge?.message}
              disabled={isLoading}
              className="bg-white"
            />
          </div>
          <div>
            <label className="flex items-center gap-2 text-[10px] font-black text-slate-400 uppercase tracking-wider mb-1.5 ml-1">
              <ClipboardCheck size={12} /> Tổng số câu
            </label>
            <Input
              type="number"
              {...register("totalQuestions")}
              error={errors.totalQuestions?.message}
              disabled={isLoading}
              className="bg-white"
            />
          </div>
          <div>
            <label className="flex items-center gap-2 text-[10px] font-black text-emerald-600 uppercase tracking-wider mb-1.5 ml-1">
              <Activity size={12} /> Điểm đạt
            </label>
            <Input
              type="number"
              {...register("passingScore")}
              error={errors.passingScore?.message}
              disabled={isLoading}
              className="bg-white border-emerald-100 focus:ring-emerald-500/10 text-emerald-600 font-bold"
            />
          </div>
          <div>
            <label className="flex items-center gap-2 text-[10px] font-black text-slate-400 uppercase tracking-wider mb-1.5 ml-1">
              <Clock size={12} /> TG thi (Phút)
            </label>
            <Input
              type="number"
              {...register("testDuration")}
              error={errors.testDuration?.message}
              disabled={isLoading}
              className="bg-white"
            />
          </div>
        </div>

        {/* SECTION 3: Mô tả & Trạng thái */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="md:col-span-2">
            <label className="flex items-center gap-2 text-sm font-bold text-slate-700 mb-1.5 ml-1">
              <Info size={14} className="text-slate-400" />
              Mô tả quyền hạn
            </label>
            <textarea
              {...register("description")}
              className={cn(
                "w-full p-4 rounded-2xl border border-slate-200 min-h-[100px] outline-none focus:border-emerald-500 transition-all text-sm",
                errors.description && "border-rose-500"
              )}
              placeholder="Nhập chi tiết các loại xe được điều khiển..."
            />
            {errors.description && <p className="text-rose-500 text-xs mt-1 ml-1">{errors.description.message}</p>}
          </div>
          <div className="md:col-span-1">
            <label className="flex items-center gap-2 text-sm font-bold text-slate-700 mb-1.5 ml-1">
              <Activity size={14} className="text-slate-400" />
              Trạng thái
            </label>
            <select
              {...register("status")}
              className="w-full h-[52px] px-4 rounded-2xl border border-slate-200 bg-white text-slate-700 focus:border-emerald-500 outline-none transition-all font-medium"
            >
              <option value="active">Đang cấp (Active)</option>
              <option value="draft">Tạm ngưng (Draft)</option>
              <option value="deleted">Thùng rác (Deleted)</option>
            </select>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="pt-4 flex gap-4">
          <button
            type="button"
            onClick={onClose}
            className="flex-[0.3] px-6 py-3.5 rounded-2xl border border-slate-200 font-bold text-slate-500 hover:bg-slate-50 transition-all active:scale-95"
          >
            Hủy
          </button>
          <Button
            type="submit"
            variant="primary"
            isLoading={isLoading}
            className="flex-1 h-[56px] rounded-2xl shadow-lg shadow-emerald-500/20 active:scale-[0.98]"
            text="Lưu cấu hình bằng lái"
          />
        </div>
      </form>
    </BaseModal>
  );
}