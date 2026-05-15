"use client";

import React, { useCallback, useMemo, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { ClipboardCheck, Settings } from "lucide-react";

import Button from "@/components/ui/Button/Button";

// Types & Schemas
import { SelectionData } from "@/types/common.type";
import { IExamQuestionSummary } from "@/components/features/question/types/question-summary.types";
import { manualExamSchema } from "../../schema/exam.schema";
import { IExamResponse, ICreateManualExamDTO } from "../../types/exam.types";
import { QuestionOrchestrator } from "./QuestionOrchestrator";
import { useManualExamLogic } from "../../hook/use-manual-exam-logic";
import { RepositoryToolbar } from "./RepositoryToolbar";
import { cn } from "@/lib/utils/utils";
import { inputVariants } from "./input.variants";
import axios from "axios";
import { Alert } from "@/components/ui/Alert";
import { FORM_FIELDS } from "../config/form-fields";
import { ExamStatus } from "../../types/enums";
import { StatusSelect } from "@/components/ui/Status-Select/status-select";
import { EXAM_STATUS_OPTIONS } from "../constants/status-options";
import { DataSelect } from "@/components/ui/Data-Select/data-select";

interface ManualExamFormProps {
  initialData?: IExamResponse | null;
  onSubmit: (data: ICreateManualExamDTO) => void;
  isLoading?: boolean;
  pool: IExamQuestionSummary[];
  licenses: SelectionData[];
  onClose: () => void;
}

export function ManualExamForm({
  initialData,
  onSubmit,
  isLoading = false,
  pool,
  licenses,
  onClose,
}: ManualExamFormProps) {
  const isEditMode = !!initialData?.id;

  const defaultValues = useMemo(
    (): ICreateManualExamDTO => ({
      name: initialData?.name ?? "",
      licenseCategoryId: initialData?.licenseCategoryId ?? "",
      totalQuestions: initialData?.totalQuestions ?? 35,
      passingScore: initialData?.passingScore ?? 32,
      durationMinutes: initialData?.durationMinutes ?? 20,
      minCriticalQuestions: initialData?.minCriticalQuestions ?? 5,
      status: initialData?.status ?? ExamStatus.DRAFT,
      examMatrixId: initialData?.examMatrixId ?? null,
      isEdited: initialData?.isEdited ?? false,
      isChapter: initialData?.isChapter ?? false,
      questionIds: initialData?.questions?.map((q) => q.questionId) ?? [],
    }),
    [initialData],
  );

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    reset,
    control,
    formState: { errors, isValid },
  } = useForm<ICreateManualExamDTO>({
    resolver: zodResolver(manualExamSchema),
    defaultValues,
    mode: "onChange",
  });

  const {
    filteredPool,
    searchTerm,
    setSearchTerm,
    selectedChapters,
    setSelectedChapters,
    chapters,
    selectedLicenses,
    setSelectedLicenses,
    licenseCategories,
    onlyCritical,
    setOnlyCritical,
    clearAllFilters,
    selectedIds,
    toggleQuestion,
    handleReorder,
    count,
    criticalCount,
    groupedSelected,
  } = useManualExamLogic(pool, defaultValues.questionIds, setValue);

  const handleApplyFilters = useCallback(
    (filters: {
      chapters: string[];
      licenses: string[];
      critical: boolean;
    }) => {
      setSelectedChapters(filters.chapters);
      setSelectedLicenses(filters.licenses);
      setOnlyCritical(filters.critical);
    },
    [setSelectedChapters, setSelectedLicenses, setOnlyCritical],
  );

  const [totalTarget, minCritical, examMatrixId, isEdited, isChapter] = watch([
    "totalQuestions",
    "minCriticalQuestions",
    "examMatrixId",
    "isEdited",
    "isChapter"
  ]);

  const [message, setMessage] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);

  const handleFormSubmit = async (values: ICreateManualExamDTO) => {
    try {
      setMessage(null);

      // 🛡️ BƯỚC 1: KIỂM TRA TỔNG SỐ CÂU
      if (count !== totalTarget) {
        const diff = totalTarget - count;
        throw new Error(
          `Tổng số câu chưa khớp! Bạn cần ${diff > 0 ? "thêm" : "bớt"} ${Math.abs(diff)} câu nữa (Hiện tại: ${count}/${totalTarget})`,
        );
      }

      // 🛡️ BƯỚC 2: KIỂM TRA CÂU ĐIỂM LIỆT
      if (criticalCount !== minCritical) {
        const diff = minCritical - criticalCount;
        throw new Error(
          `Số câu điểm liệt chưa chuẩn! ${diff > 0 ? `Cần chọn thêm ${diff} câu` : `Phải bỏ bớt ${Math.abs(diff)} câu`} (Hiện tại: ${criticalCount}/${minCritical})`,
        );
      }

      // 🛡️ BƯỚC 3: NẾU VƯỢT QUA TẤT CẢ -> GỬI DATA
      await onSubmit(values);

      if (onClose) onClose();
      reset();
    } catch (error: unknown) {
      let errorText = "Không thể lưu đề thi. Vui lòng kiểm tra lại!";

      if (error instanceof Error) {
        errorText = error.message;
      }

      if (axios.isAxiosError(error)) {
        errorText = error.response?.data?.message || errorText;
      }

      setMessage({ type: "error", text: errorText });
    }
  };

  const onInvalid = (formErrors: typeof errors) => {
    if (formErrors.questionIds) {
      setMessage({
        type: "error",
        text: formErrors.questionIds.message as string,
      });
    } else if (Object.keys(formErrors).length > 0) {
      setMessage({
        type: "error",
        text: "Vui lòng kiểm tra lại các thông số cấu hình đề thi!",
      });
    }
  };

  const canSubmit = useMemo(() => {
    return isValid && count === totalTarget && criticalCount === minCritical;
  }, [isValid, count, totalTarget, criticalCount, minCritical]);

  const disabledReason = useMemo(() => {
    if (canSubmit) return null;

    if (!isValid) {
      if (errors.name) return errors.name.message;
      if (errors.licenseCategoryId) return errors.licenseCategoryId.message;
      if (errors.status) return errors.status.message;
      if (errors.totalQuestions) return errors.totalQuestions.message;
      if (errors.passingScore) return errors.passingScore.message;
      if (errors.durationMinutes) return errors.durationMinutes.message;
      return "Vui lòng kiểm tra lại các thông số cấu hình";
    }

    if (count !== totalTarget)
      return `Số lượng câu hỏi chưa khớp (${count}/${totalTarget})`;

    if (criticalCount !== minCritical)
      return `Số câu điểm liệt chưa chuẩn (${criticalCount}/${minCritical})`;

    return null;
  }, [
    canSubmit,
    isValid,
    errors,
    count,
    totalTarget,
    criticalCount,
    minCritical,
  ]);

  const orchestratorStats = useMemo(
    () => ({ count, criticalCount }),
    [count, criticalCount],
  );
  const orchestratorConfig = useMemo(
    () => ({ total: totalTarget, minCritical }),
    [totalTarget, minCritical],
  );

  const labelClass =
    "text-[10px] font-black uppercase tracking-[0.15em] text-slate-400 ml-1 block mb-2";

  return (
    <form
      onSubmit={handleSubmit(handleFormSubmit, onInvalid)}
      // ROOT CAUSE FIX: Sử dụng flex-col h-full thay vì pb-24
      className="relative flex flex-col h-full"
    >
      {/* VÙNG NỘI DUNG CUỘN (Scrollable Area) */}
      <div className="flex-1 space-y-8">
        <fieldset disabled={isLoading} className="space-y-8">
          {message && (
            <Alert
              intent={message.type}
              message={message.text}
              onClose={() => setMessage(null)}
              duration={10000}
            />
          )}

          {/* PHẦN 1: CẤU HÌNH (CONFIGURATION) */}
          <div className="space-y-5">
            <div className="flex items-center justify-between border-b border-slate-50 pb-3">
              <div className="flex items-center gap-2 text-emerald-600/80">
                <Settings size={16} strokeWidth={2.5} />
                <span className="font-black uppercase tracking-[0.2em] text-[11px]">
                  Thông số cấu hình
                </span>
              </div>

              <div className="flex items-center gap-2">
                {/* 1. Hiển thị loại đề dựa trên isChapter */}
                {isChapter ? (
                  <span className="px-2.5 py-1 rounded-md bg-emerald-50 text-emerald-600 text-[10px] font-bold uppercase tracking-wider shadow-sm border border-emerald-100">
                    Theo chương học
                  </span>
                ) : (
                  <span className="px-2.5 py-1 rounded-md bg-blue-50 text-blue-600 text-[10px] font-bold uppercase tracking-wider shadow-sm border border-blue-100">
                    Theo hạng bằng
                  </span>
                )}

                {/* 2. Hiển thị nguồn gốc đề (Thủ công hay Tự tạo từ Ma trận) */}
                {!examMatrixId ? (
                  <span className="px-2.5 py-1 rounded-md bg-slate-100 text-slate-500 text-[10px] font-bold uppercase tracking-wider shadow-sm">
                    Đề thủ công
                  </span>
                ) : (
                  <span className="px-2.5 py-1 rounded-md bg-indigo-50 text-indigo-600 text-[10px] font-bold uppercase tracking-wider shadow-sm">
                    Đề tự tạo
                  </span>
                )}

                {/* 3. Trạng thái đã chỉnh sửa */}
                {isEdited && (
                  <span className="px-2.5 py-1 rounded-md bg-amber-50 text-amber-600 text-[10px] font-bold uppercase tracking-wider shadow-sm animate-in fade-in zoom-in-95">
                    Đã chỉnh sửa nội dung
                  </span>
                )}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="md:col-span-2">
                <label className={labelClass}>Tên định danh đề thi</label>
                <input
                  {...register("name")}
                  className={cn(
                    inputVariants({
                      intent: errors.name ? "error" : "primary",
                      isDisabled: isLoading,
                    }),
                  )}
                  placeholder="Nhập tên đề thi..."
                />
                {errors.name && (
                  <p className="text-[10px] text-rose-500 font-bold mt-1.5 uppercase">
                    {errors.name.message}
                  </p>
                )}
              </div>

              <Controller
                name="licenseCategoryId"
                control={control}
                render={({ field }) => (
                  <div className="md:col-span-1">
                    <DataSelect
                      label="Hạng bằng lái"
                      placeholder="Chọn hạng bằng..."
                      options={licenses}
                      size="sm"
                      value={field.value}
                      onChange={field.onChange}
                      disabled={isEditMode || isLoading}
                      error={errors.licenseCategoryId?.message}
                    />
                  </div>
                )}
              />

              <Controller
                name="status"
                control={control}
                render={({ field }) => (
                  <div className="md:col-span-1">
                    <StatusSelect
                      label="Trạng thái"
                      size="sm"
                      options={EXAM_STATUS_OPTIONS}
                      value={field.value}
                      onChange={field.onChange}
                      error={errors.status?.message}
                    />
                  </div>
                )}
              />

              {FORM_FIELDS.map((field) => {
                const fieldName = field.id as keyof ICreateManualExamDTO;
                const hasError = !!errors[fieldName];

                return (
                  <div key={field.id}>
                    <label className={labelClass}>{field.label}</label>
                    <input
                      type="number"
                      {...register(fieldName, {
                        setValueAs: (v) => (v === "" ? 0 : Number(v)),
                      })}
                      className={cn(
                        inputVariants({
                          intent: hasError ? "error" : "primary",
                          isDisabled: isLoading,
                        }),
                      )}
                    />
                    {hasError && (
                      <p className="text-[9px] text-rose-500 font-bold mt-1.5 uppercase">
                        {errors[fieldName]?.message}
                      </p>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* PHẦN 2: LỰA CHỌN CÂU HỎI (SELECTION) */}
          <div className="space-y-5">
            <div className="flex items-center gap-2 text-indigo-500/80 border-b border-slate-50 pb-3">
              <ClipboardCheck size={16} strokeWidth={2.5} />
              <span className="font-black uppercase tracking-[0.2em] text-[11px]">
                Lựa chọn câu hỏi
              </span>
            </div>

            <RepositoryToolbar
              searchTerm={searchTerm}
              onSearchChange={setSearchTerm}
              chapters={chapters}
              selectedChapters={selectedChapters}
              licenseCategories={licenseCategories}
              selectedLicenses={selectedLicenses}
              onlyCritical={onlyCritical}
              onApplyFilters={handleApplyFilters}
              onClearFilters={clearAllFilters}
              selectedCount={selectedIds.length}
            />

            <QuestionOrchestrator
              pool={filteredPool}
              selectedIds={selectedIds}
              groupedSelected={groupedSelected}
              onToggle={toggleQuestion}
              onReorder={handleReorder}
              stats={orchestratorStats}
              config={orchestratorConfig}
            />
          </div>

          {/* KHÔNG GIAN ĐỆM GIẢ (Spacer) - Ngăn nội dung bị che khuất */}
          <div className="h-20" aria-hidden="true" />
        </fieldset>
      </div>

      {/* FOOTER ĐIỀU HƯỚNG & HÀNH ĐỘNG (Sticky Bottom Fix) */}
      <footer className="sticky bottom-0 left-0 right-0 py-3.5 px-6 bg-white/85 backdrop-blur-md border-t border-slate-100/60 z-20 -mx-6 flex gap-3 items-center">
        <Button
          type="button"
          variant="ghost"
          onClick={onClose}
          className="flex-1 h-12 rounded-full bg-slate-100 text-slate-500 text-[11px] font-black uppercase tracking-widest hover:bg-slate-200 transition-all active:scale-[0.98]"
        >
          Hủy bỏ
        </Button>

        <div className="flex-[2]">
          <Button
            type="submit"
            disabled={!canSubmit || isLoading}
            className={cn(
              "w-full h-12 rounded-full transition-all duration-300 shadow-none border active:scale-[0.98]",
              canSubmit
                ? "bg-emerald-600 text-white shadow-xl shadow-emerald-500/20 border-emerald-700"
                : cn(
                    "bg-rose-50 text-rose-600 border-rose-100 cursor-not-allowed",
                    "animate-in fade-in slide-in-from-bottom-1",
                  ),
            )}
          >
            {isLoading ? (
              <span className="flex items-center justify-center gap-2 text-[11px] font-black uppercase tracking-widest text-slate-400">
                <div className="w-3 h-3 border-2 border-slate-300 border-t-transparent rounded-full animate-spin"></div>
                Đang xử lý...
              </span>
            ) : !canSubmit ? (
              <span className="text-xs font-black uppercase tracking-wider px-2 leading-tight">
                ⚠️ {disabledReason}
              </span>
            ) : isEditMode ? (
              "Cập nhật thay đổi"
            ) : (
              "Tạo đề thi mới"
            )}
          </Button>
        </div>
      </footer>
    </form>
  );
}
