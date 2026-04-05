"use client";

import React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { CreditCard, Hash, Info, User } from "lucide-react";
import { BaseModal } from "@/components/common/Modals/BaseModal";
import Button from "@/components/ui/Button/Button";
import { FormField } from "@/components/common/Form/FormField";
import { FormGrid } from "@/components/common/Form/FormGrid";
import { CreateLicensePayload, createLicenseSchema } from "../schema/license.schema";


interface CreateLicenseModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: CreateLicensePayload) => Promise<void>;
  isLoading: boolean;
}

export default function CreateLicenseModal({ 
  isOpen, 
  onClose, 
  onSave, 
  isLoading 
}: CreateLicenseModalProps) {
  
  // Khởi tạo React Hook Form
  const { 
    register, 
    handleSubmit, 
    reset, 
    formState: { errors } 
  } = useForm<CreateLicensePayload>({
    resolver: zodResolver(createLicenseSchema),
    defaultValues: { 
      name: "", 
      description: "", 
      minAge: 18 // Giá trị mặc định phổ biến nhất
    } 
  });

  // Xử lý sự kiện gửi (Submit Event)
  const onSubmit = async (data: CreateLicensePayload) => {
    await onSave(data);
    reset(); // Xóa trắng form sau khi thêm thành công
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
        
        {/* SỬ DỤNG GENERIC FORM TOOLKIT: Chia 2 cột cho Name và Age */}
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
            {...register("minAge")}
            error={errors.minAge?.message}
            disabled={isLoading}
          />
        </FormGrid>

        {/* Input dạng Textarea cho mô tả */}
        <FormField
          label="Mô tả quyền hạn"
          icon={Info}
          isTextArea
          placeholder="VD: Xe mô tô hai bánh có dung tích xi lanh từ 50 cm3 đến dưới 175 cm3."
          {...register("description")}
          error={errors.description?.message}
          disabled={isLoading}
        />

        {/* Nút Submit (Nút Gửi) */}
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
            text="Tạo hạng bằng" 
            className="flex-1 h-[56px] rounded-2xl shadow-lg shadow-emerald-500/20 active:scale-[0.98]" 
          />
        </div>
      </form>
    </BaseModal>
  );
}