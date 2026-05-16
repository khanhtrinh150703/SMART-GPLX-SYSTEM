"use client";

import React, { useMemo, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Zap,
  Info,
  AlertTriangle,
  CheckCircle2,
  Settings,
} from "lucide-react";

// Components UI & Common (Thành phần giao diện & Dùng chung)
import { Alert } from "@/components/ui/Alert";
import Button from "@/components/ui/Button/Button";

// Types & Schemas (Kiểu dữ liệu & Cấu trúc xác thực)
import {
  generateExamSchema,
  GenerateExamInput,
} from "../schema/exam-generation.schema";
import { ISelectionExamMatrix } from "@/types/common.type";

// UI & Styles (Giao diện & Kiểu dáng)
import { generatorFormVariants } from "./automatic-generator-form.variants";
import { cn } from "@/lib/utils/utils";
import axios from "axios";
import { ExamStatus } from "../types/enums";
import { StatusSelect } from "@/components/ui/Status-Select/status-select";
import { DataSelect } from "@/components/ui/Data-Select/data-select";
import { EXAM_STATUS_OPTIONS } from "./constants/status-options";

interface AutomaticGeneratorFormProps {
  matrices: ISelectionExamMatrix[];
  onSubmit: (data: GenerateExamInput) => Promise<void>; // Hàm xử lý gửi dữ liệu (Submit handler)
  isLoading: boolean; // Trạng thái đang tải (Loading state)
  onClose: () => void;
  onClearMessage?: () => void;
}

export const AutomaticGeneratorForm: React.FC<AutomaticGeneratorFormProps> = ({
  matrices,
  onSubmit,
  isLoading,
  onClose,
}) => {
  // --- 1. FORM INITIALIZATION (Khởi tạo biểu mẫu) ---
  const {
    register,
    handleSubmit,
    watch,
    reset,
    control,
    formState: { errors },
  } = useForm<GenerateExamInput>({
    resolver: zodResolver(generateExamSchema),
    defaultValues: {
      name: "",
      matrixId: "",
      status: ExamStatus.DRAFT, // Mặc định là bản nháp để đảm bảo an toàn (Default to Draft for safety)
    },
  });

  // --- 2. LOCAL MESSAGE STATE (Trạng thái thông báo cục bộ) ---
  const [message, setMessage] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);

  // Theo dõi ma trận đang được chọn (Watch currently selected matrix)
  const selectedId = watch("matrixId");
  const selectedMatrix = useMemo(
    () => matrices.find((m) => m.value === selectedId),
    [selectedId, matrices],
  );

  // Chuyển đổi dữ liệu ma trận sang định dạng DataSelect (Mapping matrix data to DataSelect format)
  const matrixOptions = useMemo(
    () =>
      matrices.map((m) => ({
        value: m.value,
        label: `${m.label} (${m.totalQuestions} câu)`, // Hiển thị kèm tổng số câu (Display with total questions)
      })),
    [matrices],
  );

  // --- 3. HANDLE SUBMIT (Hàm xử lý gửi biểu mẫu) ---
  const handleFormSubmit = async (values: GenerateExamInput) => {
    try {
      setMessage(null); // Xóa lỗi cũ (Clear old errors)

      // Gọi hàm onSubmit từ cha (Call parent's onSubmit)
      await onSubmit(values);

      // Nếu thành công thì đóng và reset form (Success: close and reset)
      if (onClose) onClose();
      reset();
    } catch (error: unknown) {
      // Khởi tạo thông báo mặc định (Fallback error message)
      let errorText = "Không thể tạo đề thi tự động. Vui lòng kiểm tra lại!";

      // Bóc tách lỗi từ Backend qua Axios (Extract Backend Error)
      if (axios.isAxiosError(error)) {
        errorText = error.response?.data?.message || errorText;
      }

      setMessage({ type: "error", text: errorText });
    }
  };

  return (
    <div className="flex flex-col gap-6">
      {message && (
        <Alert
          intent={message.type}
          message={message.text}
          onClose={() => setMessage(null)}
          duration={6000}
        />
      )}

      <form
        onSubmit={handleSubmit(handleFormSubmit)}
        className={generatorFormVariants.root()}
      >
        <fieldset disabled={isLoading} className="space-y-6">
          {/* TRƯỜNG 1: TÊN ĐỀ THI (Exam Name) - Chiếm toàn bộ chiều rộng */}
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

          {/* GRID 2 CỘT: MA TRẬN & TRẠNG THÁI (Matrix & Status Grid) */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* TRƯỜNG 2: CHỌN MA TRẬN (Select Matrix) */}
            {/* TRƯỜNG: LỰA CHỌN MA TRẬN CHUẨN (Sử dụng DataSelect Portal) */}
            <Controller
              name="matrixId"
              control={control}
              render={({ field }) => (
                <div className={generatorFormVariants.fieldGroup()}>
                  <DataSelect
                    label="Lựa chọn ma trận chuẩn"
                    placeholder="-- Chọn ma trận đề thi --"
                    size="lg" // Kích thước đồng bộ h-12 (Synchronized size h-12)
                    options={matrixOptions}
                    value={field.value}
                    onChange={field.onChange}
                    error={errors.matrixId?.message}
                    disabled={isLoading} // Khóa khi đang xử lý (Disable while loading)
                  />
                </div>
              )}
            />

            {/* TRƯỜNG 3: TRẠNG THÁI ĐỀ THI (Exam Status) */}
            <Controller
              name="status"
              control={control}
              render={({ field }) => (
                <StatusSelect
                  label="Trạng thái khởi tạo"
                  options={EXAM_STATUS_OPTIONS}
                  value={field.value}
                  size="lg"
                  onChange={field.onChange}
                  error={errors.status?.message}
                />
              )}
            />
          </div>

          {/* 4. HIỂN THỊ THÔNG TIN CHI TIẾT MA TRẬN (Detailed Matrix Stats) */}
          {selectedMatrix && (
            <div className="flex flex-col gap-4 animate-in fade-in slide-in-from-top-2">
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
            className="h-12 px-6 font-bold text-slate-400 hover:bg-slate-100"
          >
            Hủy bỏ
          </Button>

          <Button
            type="submit"
            isLoading={isLoading}
            className="min-w-[160px] h-12 rounded-2xl bg-emerald-600 text-white font-bold shadow-lg shadow-emerald-200 gap-2 hover:bg-emerald-700 active:scale-[0.98] transition-all"
          >
            {!isLoading && <Zap size={18} fill="currentColor" />}
            Sinh đề tự động
          </Button>
        </div>
      </form>
    </div>
  );
};
