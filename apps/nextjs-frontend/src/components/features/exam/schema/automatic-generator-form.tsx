"use client";

import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Zap, Info, Loader2 } from "lucide-react";
import axios from "axios";

// Components UI & Common
import { Alert } from "@/components/ui/Alert";
import { buttonVariants } from "@/components/ui/Button";

// Types & Schemas
import {
  generateExamSchema,
  GenerateExamInput,
} from "../schema/exam-generation.schema";
import { IExamMatrixResponse } from "../../exam-management/types/exam-management";
import { useExamGenerator } from "../hook/use-exam-generator";

// UI & Styles
import { generatorFormVariants as variants } from "./automatic-generator-form.variants";
import { cn } from "@/lib/utils/utils";

/**
 * @description Form xử lý sinh đề thi tự động (Automatic Exam Generation Form).
 * @param matrices - Danh sách ma trận để người dùng lựa chọn (List of matrices for selection).
 * @param onClose - Hàm đóng Modal sau khi xử lý thành công (Function to close Modal on success).
 */
interface Props {
  matrices: IExamMatrixResponse[];
  onClose: () => void;
}

export const AutomaticGeneratorForm: React.FC<Props> = ({
  matrices,
  onClose,
}) => {
  // --- 1. HOOKS & STATES ---
  const { isGenerating, actions: { generateAuto } } = useExamGenerator();
  
  // Trạng thái thông báo lỗi/thành công (Notification state for success/error)
  const [message, setMessage] = useState<{
    intent: "success" | "error" | "warning";
    text: string;
  } | null>(null);

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
  const selectedMatrixId = watch("matrixId");
  const selectedMatrix = matrices.find((m) => m.id === selectedMatrixId);

  // --- 2. HÀNH ĐỘNG (ACTION HANDLERS) ---
  const onSubmit = async (data: GenerateExamInput) => {
    try {
      setMessage(null); // Reset thông báo trước khi gọi API
      
      // Thực hiện gọi service sinh đề (Execute generation service)
      await generateAuto(data);
      onClose(); 
    } catch (error: unknown) {
      // Xử lý lỗi từ Axios (Handle Axios errors specifically)
      if (axios.isAxiosError(error)) {
        setMessage({
          intent: "error",
          text: error.response?.data?.message || "Lỗi máy chủ (Server Error)",
        });
      } else {
        setMessage({
          intent: "error",
          text: "Đã xảy ra lỗi không xác định.",
        });
      }
    }
  };

  // --- 3. GIAO DIỆN (RENDER LOGIC) ---
  return (
    <div className="flex flex-col gap-6">
      {/* Hiển thị Alert nếu có lỗi (Display Alert if message exists) */}
      {message && (
        <Alert
          intent={message.intent}
          message={message.text}
          onClose={() => setMessage(null)}
          duration={10000}
        />
      )}

      <form onSubmit={handleSubmit(onSubmit)} className={variants.root()}>
        {/* 1. Nhập tên đề thi */}
        <div className={variants.fieldGroup()}>
          <label className={variants.label()}>Tên đề thi hiển thị</label>
          <input
            {...register("name")}
            placeholder="Ví dụ: Đề ôn tập cuối khóa hạng B2..."
            className={cn(
              variants.input(),
              errors.name && "border-rose-200 bg-rose-50/30",
            )}
            disabled={isGenerating}
          />
          {errors.name && (
            <span className={variants.error()}>{errors.name.message}</span>
          )}
        </div>

        {/* 2. Chọn Ma trận */}
        <div className={variants.fieldGroup()}>
          <label className={variants.label()}>Lựa chọn ma trận chuẩn</label>
          <select
            {...register("matrixId")}
            className={cn(variants.input(), "appearance-none cursor-pointer")}
            disabled={isGenerating}
          >
            <option value="">-- Chọn ma trận đề thi --</option>
            {matrices.map((matrix) => (
              <option key={matrix.id} value={matrix.id}>
                {matrix.name} ({matrix.totalQuestions} câu)
              </option>
            ))}
          </select>
          {errors.matrixId && (
            <span className={variants.error()}>{errors.matrixId.message}</span>
          )}
        </div>

        {/* 3. Thông tin chi tiết ma trận (Preview) */}
        {selectedMatrix && (
          <div className={variants.infoCard()}>
            <div className="p-2 bg-emerald-100 rounded-xl text-emerald-600">
              <Info size={20} />
            </div>
            <div className="flex flex-col gap-1">
              <h4 className="text-sm font-bold text-emerald-900">
                Thông tin cấu trúc
              </h4>
              <p className="text-xs text-emerald-700/70 leading-relaxed">
                Hạng bằng:{" "}
                <span className="font-bold">
                  {selectedMatrix.licenseCategoryName}
                </span>{" "}
                • Thời gian:{" "}
                <span className="font-bold">
                  {selectedMatrix.durationMinutes} phút
                </span>{" "}
                • Điểm đạt:{" "}
                <span className="font-bold">
                  {selectedMatrix.passingScore}/{selectedMatrix.totalQuestions}
                </span>
              </p>
            </div>
          </div>
        )}

        {/* 4. Chân trang (Footer Actions) */}
        <div className={variants.footer()}>
          <button
            type="button"
            onClick={onClose}
            className={cn(buttonVariants({ variant: "ghost" }))}
            disabled={isGenerating}
          >
            Hủy bỏ
          </button>
          <button
            type="submit"
            disabled={isGenerating}
            className={cn(
              buttonVariants({ variant: "primary" }),
              "min-w-[160px] gap-2 rounded-2xl shadow-emerald-200",
            )}
          >
            {isGenerating ? (
              <Loader2 className="animate-spin" size={18} />
            ) : (
              <Zap size={18} fill="currentColor" />
            )}
            {isGenerating ? "Đang khởi tạo..." : "Xác nhận Sinh đề"}
          </button>
        </div>
      </form>
    </div>
  );
};