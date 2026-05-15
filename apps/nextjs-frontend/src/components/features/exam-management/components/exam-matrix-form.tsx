"use client";

import React, { useMemo, useState } from "react";
import { useForm, useFieldArray, useWatch, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Plus, Trash2, Settings, PieChart, Info } from "lucide-react";
import { cn } from "@/lib/utils/utils";
import {
  examMatrixSchema,
  ExamMatrixFormValues,
} from "../schema/exam-matrix.schema";
import Button from "@/components/ui/Button/Button";
import { SelectionData } from "@/types/common.type";
import axios from "axios";
import { Alert } from "@/components/ui/Alert";
import { FORM_FIELDS } from "../config/form-fields";
import { inputVariantForms } from "./input.variants";
import { DataSelect } from "@/components/ui/Data-Select/data-select";
import { slateTheme } from "@/components/ui/Data-Select/date-select-theme";

interface Props {
  initialData?: ExamMatrixFormValues;
  onSubmit: (data: ExamMatrixFormValues) => void;
  onClose?: () => void;
  isLoading?: boolean;
  chapters: SelectionData[];
  licenses: SelectionData[];
}

// Helper component: Hiển thị thông báo lỗi
const FormError = ({ message }: { message?: string }) => {
  if (!message) return null;
  return (
    <p className="text-[10px] text-rose-500 mt-1.5 font-medium ml-1 animate-in fade-in slide-in-from-top-1 uppercase tracking-wide">
      {message}
    </p>
  );
};

export function ExamMatrixForm({
  initialData,
  onSubmit,
  onClose,
  isLoading,
  chapters,
  licenses,
}: Props) {
  // --- 1. FORM INITIALIZATION ---
  const {
    register,
    control,
    handleSubmit,
    reset,
    formState: { errors, isValid },
  } = useForm<ExamMatrixFormValues>({
    mode: "onChange",
    resolver: zodResolver(examMatrixSchema),
    defaultValues: initialData || {
      name: "",
      licenseCategoryId: "",
      totalQuestions: 35,
      passingScore: 32,
      durationMinutes: 22,
      minCriticalQuestions: 1,
      isDefault: false,
      isChapter: false,
      details: [{ chapterId: "", percentage: 0 }],
    },
  });

  const [message, setMessage] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);

  const { fields, append, remove } = useFieldArray({
    control,
    name: "details",
  });

  const detailsWatch = useWatch({ control, name: "details", defaultValue: [] });
  const isEditMode = !!initialData;

  // --- 2. LOGIC TÍNH TOÁN & SẮP XẾP ---
  const sortedChapterOptions = useMemo(() => {
    return [...chapters].sort(
      (a, b) => (Number(a.orderIndex) || 0) - (Number(b.orderIndex) || 0),
    );
  }, [chapters]);

  const sortedFields = useMemo(() => {
    return fields
      .map((field, index) => ({ ...field, originalIndex: index }))
      .sort((a, b) => {
        const chapterA = chapters.find(
          (c) => c.value === detailsWatch[a.originalIndex]?.chapterId,
        );
        const chapterB = chapters.find(
          (c) => c.value === detailsWatch[b.originalIndex]?.chapterId,
        );
        const orderA = Number(chapterA?.orderIndex) || 999;
        const orderB = Number(chapterB?.orderIndex) || 999;
        return orderA - orderB;
      });
  }, [fields, detailsWatch, chapters]);

  const totalPercentage = useMemo(() => {
    if (!Array.isArray(detailsWatch)) return 0;
    return detailsWatch.reduce(
      (acc, curr) => acc + (Number(curr?.percentage) || 0),
      0,
    );
  }, [detailsWatch]);

  const isInvalidPercentage = totalPercentage !== 100;

  // --- 3. LOGIC HIỂN THỊ LỖI CHO NÚT SUBMIT (DÀNH RIÊNG CHO EXAM MATRIX) ---
  const canSubmit = isValid && !isInvalidPercentage;

  const disabledReason = useMemo(() => {
    if (canSubmit) return null;

    if (!isValid) {
      if (errors.name) return errors.name.message;
      if (errors.licenseCategoryId) return errors.licenseCategoryId.message;
      if (errors.totalQuestions) return errors.totalQuestions.message;
      if (errors.passingScore) return errors.passingScore.message;
      if (errors.durationMinutes) return errors.durationMinutes.message;
      if (errors.minCriticalQuestions)
        return errors.minCriticalQuestions.message;

      // Bắt lỗi chi tiết từng hàng của mảng "details"
      if (errors.details && Array.isArray(errors.details)) {
        for (let i = 0; i < errors.details.length; i++) {
          const detailError = errors.details[i];
          if (detailError?.chapterId) return detailError.chapterId.message;
          if (detailError?.percentage) return detailError.percentage.message;
        }
      }

      if (errors.details?.root) return errors.details.root.message;

      return "Vui lòng kiểm tra lại các thông số cấu hình";
    }

    if (totalPercentage !== 100) {
      return `Tổng tỉ trọng phân bổ chưa chuẩn (${totalPercentage}% / 100%)`;
    }

    return null;
  }, [canSubmit, isValid, errors, totalPercentage]);

  // --- 4. HANDLERS ---
  const handleFormSubmit = async (values: ExamMatrixFormValues) => {
    try {
      setMessage(null);
      await onSubmit(values);
      if (onClose) onClose();
      reset();
    } catch (error) {
      let errorText = "Không thể lưu ma trận đề thi. Vui lòng thử lại!";
      if (axios.isAxiosError(error)) {
        errorText = error.response?.data?.message || errorText;
      }
      setMessage({ type: "error", text: errorText });
    }
  };

  // --- 5. STYLING CLASSES ---
  const commonInputClass = (hasError: boolean, isDisabled: boolean) =>
    cn(
      "w-full h-10 px-4 rounded-xl text-sm font-medium transition-all outline-none border-none",
      "bg-slate-100/50 text-slate-700 placeholder:text-slate-400",
      "hover:bg-slate-100 focus:bg-white focus:ring-2",
      hasError
        ? "focus:ring-rose-500/20 text-rose-600 bg-rose-50"
        : "focus:ring-emerald-500/20",
      isDisabled && "opacity-60 cursor-not-allowed bg-slate-100 text-slate-400",
    );

  const labelClass =
    "text-[10px] font-black uppercase tracking-[0.15em] text-slate-400 ml-1 block mb-1.5";

  return (
    <form
      onSubmit={handleSubmit(handleFormSubmit)}
      className="relative flex flex-col h-full"
    >
      <div className="flex-1 space-y-8">
        <fieldset disabled={isLoading} className="space-y-8">
          {message && (
            <Alert
              key={message.text}
              intent={message.type}
              message={message.text}
              duration={10000}
              className="mb-8"
              onClose={() => setMessage(null)}
            />
          )}

          {/* ========================================== */}
          {/* SECTION 1: THÔNG SỐ CƠ BẢN                 */}
          {/* ========================================== */}
          <div className="space-y-5">
            <div className="flex flex-wrap items-center justify-between border-b border-slate-50 pb-3 gap-y-3">
              <div className="flex items-center gap-2 text-emerald-600/80 shrink-0">
                <Settings size={16} strokeWidth={2.5} />
                <span className="font-black uppercase tracking-[0.2em] text-[11px]">
                  Thông số cơ bản
                </span>
              </div>

              <div className="flex flex-wrap items-center justify-end gap-3">
                <label className="flex items-center gap-2 cursor-pointer group shrink-0">
                  <span className="text-[10px] font-black uppercase tracking-widest text-slate-400 group-hover:text-emerald-500 transition-colors">
                    Theo chương
                  </span>
                  <div className="relative shrink-0">
                    <input
                      type="checkbox"
                      {...register("isChapter")}
                      className="sr-only peer"
                    />
                    <div className="w-10 h-5 bg-slate-200 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-emerald-500"></div>
                  </div>
                </label>

                <div className="hidden sm:block w-px h-4 bg-slate-200/60" />

                <label className="flex items-center gap-2 cursor-pointer group shrink-0">
                  <span className="text-[10px] font-black uppercase tracking-widest text-slate-400 group-hover:text-emerald-500 transition-colors">
                    Thiết lập mặc định
                  </span>
                  <div className="relative shrink-0">
                    <input
                      type="checkbox"
                      {...register("isDefault")}
                      className="sr-only peer"
                    />
                    <div className="w-10 h-5 bg-slate-200 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-emerald-500"></div>
                  </div>
                </label>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-x-4 gap-y-5 items-start">
              <div className="md:col-span-2">
                <label className={labelClass}>Tên định danh ma trận</label>
                <input
                  {...register("name")}
                  placeholder="VD: Đề thi B2 - Quý 1/2026"
                  className={commonInputClass(!!errors.name, false)}
                />
                <FormError message={errors.name?.message} />
              </div>

              <div className="md:col-span-2">
                <Controller
                  name="licenseCategoryId"
                  control={control}
                  render={({ field }) => (
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
                  )}
                />
              </div>

              {FORM_FIELDS.map((field) => {
                const fieldName = field.id as keyof ExamMatrixFormValues;
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
                        inputVariantForms({
                          intent: hasError ? "error" : "primary",
                          isDisabled: isLoading,
                        }),
                      )}
                    />
                    <FormError message={errors[fieldName]?.message} />
                  </div>
                );
              })}
            </div>
          </div>

          {/* ========================================== */}
          {/* SECTION 2: PHÂN BỔ CHƯƠNG                  */}
          {/* ========================================== */}
          <div className="space-y-5">
            <div className="flex justify-between items-center border-b border-slate-50 pb-3">
              <div className="flex items-center gap-2 text-indigo-500/80">
                <PieChart size={16} strokeWidth={2.5} />
                <span className="font-black uppercase tracking-[0.2em] text-[11px]">
                  Cấu trúc chương học
                </span>
              </div>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => append({ chapterId: "", percentage: 0 })}
                className="h-7 px-3 rounded-lg border-none bg-emerald-50 text-emerald-600 hover:bg-emerald-100 text-[10px] font-black uppercase tracking-wider transition-all active:scale-[0.98]"
              >
                <Plus size={12} className="mr-1" strokeWidth={3} /> Thêm hàng
              </Button>
            </div>

            <div className="space-y-4">
              {sortedFields.map((field) => {
                const detailErrors = errors.details?.[field.originalIndex];

                return (
                  <div
                    key={field.id}
                    className="animate-in fade-in slide-in-from-top-2 duration-300"
                  >
                    <div className="flex gap-2.5 group/row items-start">
                      <div className="flex-1 relative">
                        <Controller
                          name={
                            `details.${field.originalIndex}.chapterId` as const
                          }
                          control={control}
                          render={({ field: selectField }) => {
                            const processedOptions = sortedChapterOptions.map(
                              (ch) => {
                                const isAlreadySelected = detailsWatch.some(
                                  (detail, idx) =>
                                    detail.chapterId === ch.value &&
                                    idx !== field.originalIndex,
                                );
                                return {
                                  ...ch,
                                  disabled: isAlreadySelected,
                                  label: isAlreadySelected
                                    ? `${ch.label} (Đã chọn)`
                                    : ch.label,
                                };
                              },
                            );

                            return (
                              <DataSelect
                                placeholder="Chọn chương..."
                                options={processedOptions}
                                value={selectField.value}
                                onChange={selectField.onChange}
                                size="sm"
                                theme={slateTheme}
                                error={detailErrors?.chapterId?.message}
                              />
                            );
                          }}
                        />
                      </div>

                      <div className="w-28 relative flex flex-col">
                        <div className="relative">
                          <input
                            type="number"
                            {...register(
                              `details.${field.originalIndex}.percentage` as const,
                              { valueAsNumber: true },
                            )}
                            className={cn(
                              commonInputClass(
                                !!detailErrors?.percentage,
                                false,
                              ),
                              "text-right pr-8 font-black text-emerald-600",
                            )}
                          />
                          <span className="absolute right-3 top-[20px] -translate-y-1/2 text-[10px] font-bold text-slate-400">
                            %
                          </span>
                        </div>
                        <FormError
                          message={detailErrors?.percentage?.message}
                        />
                      </div>

                      <button
                        type="button"
                        onClick={() => remove(field.originalIndex)}
                        className="w-10 h-10 shrink-0 flex items-center justify-center rounded-xl bg-rose-50 text-rose-500 hover:bg-rose-100 transition-all opacity-0 group-hover/row:opacity-100 mt-0"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>

            <div
              className={cn(
                "p-3.5 rounded-2xl transition-all flex justify-between items-center border-none mt-4",
                !isInvalidPercentage ? "bg-emerald-50/60" : "bg-amber-50/60",
              )}
            >
              <div className="flex items-center gap-2.5">
                <div
                  className={cn(
                    "p-1.5 rounded-lg",
                    !isInvalidPercentage
                      ? "bg-emerald-100 text-emerald-600"
                      : "bg-amber-100 text-amber-600",
                  )}
                >
                  <Info size={14} strokeWidth={2.5} />
                </div>
                <span className="text-[11px] font-black uppercase tracking-wider text-slate-500">
                  Trạng thái tỉ trọng:
                </span>
              </div>
              <div className="flex items-center gap-2">
                <span
                  className={cn(
                    "text-xl font-black",
                    !isInvalidPercentage
                      ? "text-emerald-600"
                      : "text-amber-600",
                  )}
                >
                  {totalPercentage}%
                </span>
                <span className="text-[10px] font-bold text-slate-400">
                  / 100%
                </span>
              </div>
            </div>

            {errors.details?.root?.message && (
              <FormError message={errors.details.root.message} />
            )}
          </div>

          <div className="h-20" aria-hidden="true" />
        </fieldset>
      </div>

      {/* ========================================== */}
      {/* SECTION 3: FOOTER ACTIONS (Sticky Bottom)  */}
      {/* ========================================== */}
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
              "Kích hoạt ma trận mới"
            )}
          </Button>
        </div>
      </footer>
    </form>
  );
}
