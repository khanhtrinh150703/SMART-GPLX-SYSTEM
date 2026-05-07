"use client";

import React, { useCallback, useMemo } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  ClipboardCheck,
  AlertCircle,
  ChevronDown,
  Settings,
} from "lucide-react";

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
      examMatrixId: initialData?.examMatrixId ?? null,
      questionIds: initialData?.questions?.map((q) => q.questionId) ?? [],
    }),
    [initialData],
  );

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<ICreateManualExamDTO>({
    resolver: zodResolver(manualExamSchema),
    defaultValues,
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

  const [totalTarget, minCritical] = watch([
    "totalQuestions",
    "minCriticalQuestions",
  ]);

  // 🌟 TỐI ƯU QUAN TRỌNG: Ghi nhớ (Memoize) các object truyền xuống Component con
  // Tránh việc tạo Object mới mỗi lần form re-render khiến Component con re-render oan
  const orchestratorStats = useMemo(
    () => ({ count, criticalCount }),
    [count, criticalCount],
  );
  const orchestratorConfig = useMemo(
    () => ({ total: totalTarget, minCritical }),
    [totalTarget, minCritical],
  );

  const FORM_FIELDS = [
    { id: "totalQuestions", label: "Tổng số câu" },
    { id: "durationMinutes", label: "Thời gian (Phút)" },
    { id: "minCriticalQuestions", label: "Câu điểm liệt" },
    { id: "passingScore", label: "Điểm đạt" },
  ] as const;

  const labelClass =
    "text-[10px] font-black uppercase tracking-[0.15em] text-slate-400 ml-1 block mb-2";

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="relative space-y-8 pb-24"
    >
      <fieldset disabled={isLoading} className="space-y-8">
        {/* PHẦN 1: CẤU HÌNH (CONFIGURATION) */}
        <div className="space-y-5">
          <div className="flex items-center gap-2 text-emerald-600/80 border-b border-slate-50 pb-3">
            <Settings size={16} strokeWidth={2.5} />
            <span className="font-black uppercase tracking-[0.2em] text-[11px]">
              Thông số cấu hình
            </span>
          </div>
          {errors.questionIds && (
            <div className="mt-4 p-3 rounded-xl bg-rose-50 border border-rose-100 flex items-center gap-2 text-rose-600">
              <AlertCircle size={14} strokeWidth={2.5} />
              <span className="text-[10px] font-black uppercase tracking-wider">
                {errors.questionIds.message}
              </span>
            </div>
          )}
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

            <div className="md:col-span-2">
              <label className={labelClass}>Hạng bằng lái</label>
              <div className="relative">
                <select
                  {...register("licenseCategoryId")}
                  disabled={isEditMode || isLoading}
                  className={cn(
                    inputVariants({
                      intent: errors.licenseCategoryId ? "error" : "primary",
                      isDisabled: isEditMode,
                    }),
                    "appearance-none cursor-pointer",
                  )}
                >
                  <option value="">Chọn hạng bằng...</option>
                  {licenses.map((lic) => (
                    <option key={lic.value} value={lic.value}>
                      {lic.label}
                    </option>
                  ))}
                </select>
                <ChevronDown
                  size={14}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none"
                />
              </div>
            </div>

            {FORM_FIELDS.map((field) => {
              const fieldName = field.id as keyof ICreateManualExamDTO;
              const hasError = !!errors[fieldName];

              return (
                <div key={field.id}>
                  <label className={labelClass}>{field.label}</label>
                  <input
                    type="number"
                    {...register(fieldName, { valueAsNumber: true })}
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
              Lựa chọn câu hỏi (Question Selection)
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
      </fieldset>

      <footer className="sticky bottom-0 left-0 right-0 p-4 bg-white/90 backdrop-blur-xl border-t border-slate-50 z-20 -mx-2 flex gap-3">
        <Button
          type="button"
          variant="ghost"
          onClick={onClose}
          className="flex-1 h-12 rounded-2xl bg-slate-100 text-slate-500 text-xs font-black uppercase tracking-widest hover:bg-slate-200 transition-all"
        >
          Hủy bỏ (Cancel)
        </Button>
        <Button
          type="submit"
          className="flex-[2] h-12 rounded-2xl shadow-emerald-200 shadow-xl text-xs font-black uppercase tracking-widest bg-emerald-600 hover:bg-emerald-700 text-white transition-all active:scale-[0.98]"
          isLoading={isLoading}
        >
          {isEditMode ? "Cập nhật thay đổi" : "Tạo đề thi mới"}
        </Button>
      </footer>
    </form>
  );
}
