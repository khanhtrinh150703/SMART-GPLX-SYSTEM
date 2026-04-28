"use client";

import React, { useMemo } from "react";
import { useForm, useFieldArray, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Plus,
  Trash2,
  Settings,
  PieChart,
  Info,
  ChevronDown,
} from "lucide-react";
import { cn } from "@/lib/utils/utils";
import {
  examMatrixSchema,
  ExamMatrixFormValues,
} from "../schema/exam-matrix.schema";
import Button from "@/components/ui/Button/Button";
import { SelectionData } from "@/types/common.type";

interface Props {
  initialData?: ExamMatrixFormValues;
  onSubmit: (data: ExamMatrixFormValues) => void;
  isLoading?: boolean;
  chapters: SelectionData[]; // Giả định trong SelectionData đã có orderIndex
  licenses: SelectionData[];
}

export function ExamMatrixForm({
  initialData,
  onSubmit,
  isLoading,
  chapters,
  licenses,
}: Props) {
  const {
    register,
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<ExamMatrixFormValues>({
    resolver: zodResolver(examMatrixSchema),
    defaultValues: initialData || {
      name: "",
      licenseCategoryId: "",
      totalQuestions: 35,
      passingScore: 32,
      durationMinutes: 22,
      minCriticalQuestions: 1,
      isDefault: false,
      details: [{ chapterId: "", percentage: 0 }],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: "details",
  });

  const detailsWatch = useWatch({ control, name: "details", defaultValue: [] });
  const isEditMode = !!initialData;

  // --- LOGIC SẮP XẾP ---

  // 1. Sắp xếp danh sách chương trong dropdown theo orderIndex
  const sortedChapterOptions = useMemo(() => {
    return [...chapters].sort(
      (a, b) => (Number(a.orderIndex) || 0) - (Number(b.orderIndex) || 0),
    );
  }, [chapters]);

  // 2. Sắp xếp các hàng hiển thị trên giao diện theo orderIndex của chương đã chọn
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

  // --- KẾT THÚC LOGIC SẮP XẾP ---

  const totalPercentage = useMemo(() => {
    if (!Array.isArray(detailsWatch)) return 0;
    return detailsWatch.reduce(
      (acc, curr) => acc + (Number(curr?.percentage) || 0),
      0,
    );
  }, [detailsWatch]);

  const isInvalidPercentage = totalPercentage !== 100;

  const commonInputClass = (hasError: boolean, isDisabled: boolean) =>
    cn(
      "w-full h-10 px-4 rounded-xl text-sm font-medium transition-all outline-none border-none",
      "bg-slate-100/50 text-slate-700 placeholder:text-slate-400",
      "hover:bg-slate-100 focus:bg-white focus:ring-2",
      hasError
        ? "focus:ring-rose-500/20 text-rose-600"
        : "focus:ring-emerald-500/20",
      isDisabled && "opacity-60 cursor-not-allowed bg-slate-100 text-slate-400",
    );

  const labelClass =
    "text-[10px] font-black uppercase tracking-[0.15em] text-slate-400 ml-1 block mb-1.5";

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="relative space-y-8 pb-24"
    >
      <fieldset disabled={isLoading} className="space-y-8">
        {/* SECTION 1: CẤU HÌNH CHUNG */}
       {/* SECTION 1: THÔNG SỐ CƠ BẢN */}
        <div className="space-y-5">
          <div className="flex items-center justify-between border-b border-slate-50 pb-3">
            <div className="flex items-center gap-2 text-emerald-600/80">
              <Settings size={16} strokeWidth={2.5} />
              <span className="font-black uppercase tracking-[0.2em] text-[11px]">
                Thông số cơ bản
              </span>
            </div>

            {/* TRƯỜNG IS DEFAULT - Dạng Toggle Switch */}
            <label className="flex items-center gap-3 cursor-pointer group">
              <span className="text-[10px] font-black uppercase tracking-widest text-slate-400 group-hover:text-emerald-500 transition-colors">
                Thiết lập mặc định
              </span>
              <div className="relative">
                <input
                  type="checkbox"
                  {...register("isDefault")}
                  className="sr-only peer"
                />
                <div className="w-10 h-5 bg-slate-200 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-emerald-500"></div>
              </div>
            </label>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-x-4 gap-y-5">
            <div className="md:col-span-2">
              <label className={labelClass}>Tên định danh ma trận</label>
              <input
                {...register("name")}
                placeholder="VD: Đề thi B2 - Quý 1/2026"
                className={commonInputClass(!!errors.name, false)}
              />
            </div>

            <div className="md:col-span-2">
              <label className={labelClass}>Hạng bằng áp dụng</label>
              <div className="relative">
                <select
                  {...register("licenseCategoryId")}
                  disabled={isEditMode}
                  className={cn(
                    commonInputClass(!!errors.licenseCategoryId, isEditMode),
                    "appearance-none pr-10",
                  )}
                >
                  <option value="">Chọn hạng bằng...</option>
                  {licenses.map((lic) => (
                    <option key={lic.value} value={lic.value}>
                      {lic.label}
                    </option>
                  ))}
                </select>
                {!isEditMode && (
                  <ChevronDown
                    size={14}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none"
                  />
                )}
              </div>
            </div>

            {[
              { label: "Tổng số câu", name: "totalQuestions" },
              { label: "Thời gian (Phút)", name: "durationMinutes" },
              { label: "Điểm liệt tối thiểu", name: "minCriticalQuestions" },
              { label: "Điểm đạt", name: "passingScore" },
            ].map((item) => (
              <div key={item.name}>
                <label className={labelClass}>{item.label}</label>
                <input
                  type="number"
                  {...register(item.name as keyof ExamMatrixFormValues, {
                    valueAsNumber: true,
                  })}
                  className={commonInputClass(false, false)}
                />
              </div>
            ))}
          </div>
        </div>

        {/* SECTION 2: PHÂN BỔ CHƯƠNG */}
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
              className="h-7 px-3 rounded-lg border-none bg-emerald-50 text-emerald-600 hover:bg-emerald-100 text-[10px] font-black uppercase tracking-wider"
            >
              <Plus size={12} className="mr-1" strokeWidth={3} /> Thêm hàng
            </Button>
          </div>

          <div className="space-y-2.5">
            {sortedFields.map((field) => (
              <div
                key={field.id}
                className="flex gap-2.5 group/row animate-in fade-in slide-in-from-top-2 duration-300"
              >
                <div className="flex-1 relative">
                  <select
                    {...register(
                      `details.${field.originalIndex}.chapterId` as const,
                    )}
                    className={cn(
                      commonInputClass(false, false),
                      "appearance-none pr-10",
                    )}
                  >
                    <option value="">Chọn chương...</option>
                    {sortedChapterOptions.map((ch) => (
                      <option key={ch.value} value={ch.value}>
                        {ch.label}
                      </option>
                    ))}
                  </select>
                  <ChevronDown
                    size={14}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none"
                  />
                </div>

                <div className="w-28 relative">
                  <input
                    type="number"
                    {...register(
                      `details.${field.originalIndex}.percentage` as const,
                      { valueAsNumber: true },
                    )}
                    className={cn(
                      commonInputClass(false, false),
                      "text-right pr-8 font-black text-emerald-600",
                    )}
                  />
                  <span className="absolute right-3 top-1/2 -translate-y-1/2 text-[10px] font-bold text-slate-300">
                    %
                  </span>
                </div>

                <button
                  type="button"
                  onClick={() => remove(field.originalIndex)}
                  className="w-10 h-10 flex items-center justify-center rounded-xl bg-rose-50 text-rose-500 hover:bg-rose-100 transition-all opacity-0 group-hover/row:opacity-100"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            ))}
          </div>

          {/* Tracker bar */}
          <div
            className={cn(
              "p-3.5 rounded-2xl transition-all flex justify-between items-center border-none",
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
                  !isInvalidPercentage ? "text-emerald-600" : "text-amber-600",
                )}
              >
                {totalPercentage}%
              </span>
              <span className="text-[10px] font-bold text-slate-400">
                / 100%
              </span>
            </div>
          </div>
        </div>
      </fieldset>

      <div className="sticky bottom-0 left-0 right-0 p-4 bg-white/90 backdrop-blur-xl border-t border-slate-50 z-20 -mx-2">
        <Button
          type="submit"
          className="w-full h-12 rounded-2xl shadow-xl shadow-emerald-500/10 text-xs font-black tracking-[0.2em] uppercase"
          isLoading={isLoading}
          disabled={isInvalidPercentage || isLoading}
        >
          {initialData ? "Cập nhật thay đổi" : "Kích hoạt ma trận mới"}
        </Button>
      </div>
    </form>
  );
}
