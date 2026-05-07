"use client";

import React, { useMemo } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Zap, Info, ChevronDown, AlertTriangle, CheckCircle2, Settings } from "lucide-react";

// Components UI & Common
import { Alert } from "@/components/ui/Alert";

// Types & Schemas
import {
  generateExamSchema,
  GenerateExamInput,
} from "./exam-generation.schema";

// UI & Styles
import { generatorFormVariants } from "./automatic-generator-form.variants";
import { cn } from "@/lib/utils/utils";
import { ISelectionExamMatrix } from "@/types/common.type";
import Button from "@/components/ui/Button/Button";

interface AutomaticGeneratorFormProps {
  matrices: ISelectionExamMatrix[];
  onSubmit: (data: GenerateExamInput) => Promise<void>; // Hàm xử lý gửi dữ liệu (Submit handler)
  isLoading: boolean; // Trạng thái đang tải (Loading state)
  onClose: () => void;
  apiMessage?: { intent: "success" | "error" | "warning"; text: string } | null;
  onClearMessage?: () => void;
}

export const AutomaticGeneratorForm: React.FC<AutomaticGeneratorFormProps> = ({
  matrices,
  onSubmit,
  isLoading,
  onClose,
  apiMessage,
  onClearMessage,
}) => {
  // --- 1. FORM INITIALIZATION (Khởi tạo biểu mẫu) ---
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<GenerateExamInput>({
    resolver: zodResolver(generateExamSchema),
    defaultValues: {
      name: "",
      matrixId: "",
    },
  });

  // Theo dõi ma trận đang được chọn (Watch currently selected matrix)
  const selectedId = watch("matrixId");
  const selectedMatrix = useMemo(
    () => matrices.find((m) => m.value === selectedId),
    [selectedId, matrices],
  );
  console.log(selectedMatrix)

  return (
    <div className="flex flex-col gap-6">
      {/* HIỂN THỊ THÔNG BÁO LỖI/THÀNH CÔNG TỪ CHA */}
      {apiMessage && (
        <Alert
          intent={apiMessage.intent}
          message={apiMessage.text}
          onClose={onClearMessage}
          duration={6000}
        />
      )}

      <form
        onSubmit={handleSubmit(onSubmit)}
        className={generatorFormVariants.root()}
      >
        <fieldset disabled={isLoading} className="space-y-6">
          {/* TRƯỜNG: TÊN ĐỀ THI */}
          <div className={generatorFormVariants.fieldGroup()}>
            <label className={generatorFormVariants.label()}>
              Tên đề thi hiển thị
            </label>
            <input
              {...register("name")}
              placeholder="Ví dụ: Đề ôn tập cuối khóa..."
              className={cn(
                generatorFormVariants.input(),
                errors.name && "border-rose-200 bg-rose-50/30", // Chỉ ghi đè khi có lỗi (Override on error)
              )}
            />
            {errors.name && (
              <span className={generatorFormVariants.error()}>
                {errors.name.message}
              </span>
            )}
          </div>

          {/* TRƯỜNG: CHỌN MA TRẬN */}
          <div className={generatorFormVariants.fieldGroup()}>
            <label className={generatorFormVariants.label()}>
              Lựa chọn ma trận chuẩn
            </label>
            <div className="relative">
              <select
                {...register("matrixId")}
                className={cn(
                  generatorFormVariants.input(),
                  "appearance-none cursor-pointer pr-12",
                )}
              >
                <option value="">-- Chọn ma trận đề thi --</option>
                {matrices.map((matrix) => (
                  <option key={matrix.value} value={matrix.value}>
                    {matrix.label} ({matrix.totalQuestions} câu)
                  </option>
                ))}
              </select>
              <ChevronDown
                className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none"
                size={18}
              />
            </div>
            {errors.matrixId && (
              <span className={generatorFormVariants.error()}>
                {errors.matrixId.message}
              </span>
            )}
          </div>

          {/* HIỂN THỊ THÔNG TIN CHI TIẾT MA TRẬN (INFO CARD) */}
          {/* 3. THÔNG TIN CHI TIẾT MA TRẬN (SỬ DỤNG ĐÚNG DỮ LIỆU CÓ SẴN) */}
          {selectedMatrix && (
            <div className="flex flex-col gap-4">
              {/* Label cho phần preview */}
              <label className={generatorFormVariants.label()}>
                Chi tiết cấu trúc ma trận (Detailed Matrix Stats)
              </label>

              <div className="grid grid-cols-2 gap-4">
                {/* Thẻ 1: Thông số thời gian & Hạng bằng */}
                <div
                  className={cn(
                    generatorFormVariants.infoCard(),
                    "flex-col items-start gap-1",
                  )}
                >
                  <div className="flex items-center gap-2 text-emerald-600 mb-1">
                    <Info size={16} />
                    <span className="text-[10px] font-black uppercase tracking-wider">
                      Cơ bản (Basic)
                    </span>
                  </div>
                  <p className="text-sm font-bold text-slate-800">
                    {selectedMatrix.licenseCategoryName}
                  </p>
                  <p className="text-xs text-slate-500">
                    Thời gian: {selectedMatrix.durationMinutes} phút
                  </p>
                </div>

                {/* Thẻ 2: Cấu trúc điểm đạt */}
                <div
                  className={cn(
                    generatorFormVariants.infoCard(),
                    "flex-col items-start gap-1",
                  )}
                >
                  <div className="flex items-center gap-2 text-blue-500 mb-1">
                    <CheckCircle2 size={16} />
                    <span className="text-[10px] font-black uppercase tracking-wider">
                      Chỉ tiêu (Target)
                    </span>
                  </div>
                  <p className="text-sm font-bold text-slate-800">
                    {selectedMatrix.passingScore}/
                    {selectedMatrix.totalQuestions} Câu
                  </p>
                  <p className="text-xs text-slate-500">
                    Điểm đạt yêu cầu (Passing score)
                  </p>
                </div>

                {/* Thẻ 3: Ràng buộc điểm liệt */}
                <div
                  className={cn(
                    generatorFormVariants.infoCard(),
                    "flex-col items-start gap-1 bg-amber-50/50 border-amber-100/50",
                  )}
                >
                  <div className="flex items-center gap-2 text-amber-500 mb-1">
                    <AlertTriangle size={16} />
                    <span className="text-[10px] font-black uppercase tracking-wider">
                      Bắt buộc (Critical)
                    </span>
                  </div>
                  <p className="text-sm font-bold text-amber-900">
                    {selectedMatrix.minCriticalQuestions} Câu điểm liệt
                  </p>
                  <p className="text-xs text-amber-700/70 text-left leading-tight">
                    Bắt buộc đúng hoàn toàn (Strictly required)
                  </p>
                </div>

                {/* Thẻ 4: Thông tin hệ thống */}
                <div
                  className={cn(
                    generatorFormVariants.infoCard(),
                    "flex-col items-start gap-1",
                  )}
                >
                  <div className="flex items-center gap-2 text-slate-400 mb-1">
                    <Settings size={16} />
                    <span className="text-[10px] font-black uppercase tracking-wider">
                      Hệ thống (System)
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <p className="text-sm font-bold text-slate-800">
                      {selectedMatrix.isDefault ? "Mặc định" : "Tùy chỉnh"}
                    </p>
                    {selectedMatrix.isDefault && (
                      <span className="px-1.5 py-0.5 bg-emerald-500 text-[8px] text-white font-black rounded-md uppercase">
                        Standard
                      </span>
                    )}
                  </div>
                  <p className="text-[10px] text-slate-400">
                    Khởi tạo:{" "}
                    {new Date(selectedMatrix.createdAt).toLocaleDateString(
                      "vi-VN",
                    )}
                  </p>
                </div>
              </div>
            </div>
          )}
        </fieldset>

        {/* CHÂN TRANG (FOOTER ACTIONS) */}
        <div className={generatorFormVariants.footer()}>
          <Button
            type="button"
            variant="ghost"
            onClick={onClose}
            disabled={isLoading}
            className="h-12 px-6 font-bold text-slate-400"
          >
            Hủy bỏ
          </Button>

          <Button
            type="submit"
            isLoading={isLoading}
            className="min-w-[160px] h-12 rounded-2xl bg-emerald-600 text-white font-bold shadow-lg shadow-emerald-200 gap-2"
          >
            {!isLoading && <Zap size={18} fill="currentColor" />}
            Sinh đề tự động
          </Button>
        </div>
      </form>
    </div>
  );
};
