"use client";

import React from "react";
import {
  FieldValues,
  UseFormReturn,
  useFieldArray,
  Path,
  PathValue,
  FieldArrayPath,
} from "react-hook-form";
import {
  FileText,
  ShieldAlert,
  UploadCloud,
  Plus,
  CheckCircle2,
  Trash2,
  X,
  Image as ImageIcon,
  Hash,
  Layers,
  Activity,
} from "lucide-react";
import Image from "next/image";

import { cn } from "@/lib/utils/utils";
import { FormField } from "@/components/common/Form/FormField";
import { Select } from "@/components/ui/Select/Select";
import { questionFormVariants as v } from "./variants/question-modal.variants";
import { DIFFICULTY_OPTIONS } from "./question.config";

/**
 * @description Interface for Question Form Fields using Generic T.
 * (Giao diện cho các trường dữ liệu của Form câu hỏi sử dụng Generic T.)
 */
export interface QuestionFormFieldsProps<T extends FieldValues> {
  form: UseFormReturn<T>;
  isLoading?: boolean;
  previews: {
    main: string | null;
    answers: Record<number, string>;
  };
  handlers: {
    onMainImageChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    onAnswerImageChange: (
      index: number,
      e: React.ChangeEvent<HTMLInputElement>,
    ) => void;
    removeMainImage: () => void;
    removeAnswerImage: (index: number) => void;
  };
  options: {
    chapters: { value: string; label: string }[];
    licenses: { value: string; label: string }[];
  };
}

/**
 * @description Core fields component for the Question Management form.
 * (Component các trường dữ liệu cốt lõi cho form Quản lý câu hỏi.)
 */
export function QuestionFormFields<T extends FieldValues>({
  form,
  isLoading = false,
  previews,
  handlers,
  options,
}: QuestionFormFieldsProps<T>) {
  const {
    register,
    control,
    watch,
    setValue,
    formState: { errors },
  } = form;
  
  // 1. Dynamic Field Array for Answers (Xử lý mảng động cho các đáp án)
  const { fields, append, remove } = useFieldArray({
    control,
    name: "answers" as FieldArrayPath<T>,
  });

  // 2. Reactive Data Watchers (Theo dõi dữ liệu phản hồi theo thời gian thực)
  const answersWatcher = (watch("answers" as Path<T>) || []) as Array<{
    isCorrect: boolean;
  }>;
  const licensesWatcher = (watch("licenseCategoryIds" as Path<T>) ||
    []) as string[];
  const isCritical = watch("isCritical" as Path<T>) as boolean;

  /**
   * @description Handles toggling license categories selection.
   * (Xử lý việc chọn/bỏ chọn các hạng bằng lái.)
   */
  const handleToggleLicense = (id: string) => {
    /**
     * Execution Flow (Luồng xử lý):
     * Clone current list -> Check existence -> Add or Remove -> Update Form State.
     * (Sao chép danh sách hiện tại -> Kiểm tra tồn tại -> Thêm hoặc Xóa -> Cập nhật trạng thái Form.)
     */
    const current = [...licensesWatcher];
    const index = current.indexOf(id);

    if (index > -1) {
      current.splice(index, 1);
    } else {
      current.push(id);
    }

    setValue(
      "licenseCategoryIds" as Path<T>,
      current as PathValue<T, Path<T>>,
      { shouldValidate: true },
    );
  };

  return (
    <div className={v.form}>
      {/* --- LEFT COLUMN: CONTENT & CONFIGURATION (CỘT TRÁI: NỘI DUNG & CẤU HÌNH) --- */}
      <div className={v.leftCol}>
        {/* Main Content Area */}
        <FormField
          label="Nội dung câu hỏi chính (Main Content)"
          icon={FileText}
          isTextArea
          placeholder="Nhập nội dung câu hỏi chi tiết tại đây..."
          {...register("content" as Path<T>)}
          error={errors.content?.message as string}
          disabled={isLoading}
          className="h-40"
        />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Chapter Selection */}
          <Select
            label="Chủ đề chương (Chapter Topic)"
            icon={Layers}
            {...register("chapterId" as Path<T>)}
            options={options.chapters}
            error={errors.chapterId?.message as string}
            disabled={isLoading}
          />

          {/* Index Number */}
          <FormField
            label="Số thứ tự (Index Number)"
            icon={Hash}
            type="number"
            placeholder="VD: 1"
            {...register("indexNumber" as Path<T>, { valueAsNumber: true })}
            error={errors.indexNumber?.message as string}
            disabled={isLoading}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Difficulty Selection */}
          <div className={v.inputGroup}>
            <label className={v.label}>
              <Activity size={14} /> Độ khó (Difficulty)
            </label>
            <select
              {...register("difficultyLevel" as Path<T>, {
                valueAsNumber: true,
              })}
              className={cn(v.inputField, "h-14 px-4")}
              disabled={isLoading}
            >
              {DIFFICULTY_OPTIONS.map((d) => (
                <option key={d.value} value={d.value}>
                  {d.label}
                </option>
              ))}
            </select>
          </div>

          {/* Status Selection */}
          <div className={v.inputGroup}>
            <label className={v.label}>Trạng thái (Status)</label>
            <select
              {...register("status" as Path<T>)}
              className={cn(v.inputField, "h-14 px-4")}
              disabled={isLoading}
            >
              <option value="ACTIVE">Hoạt động (Active)</option>
              <option value="DRAFT">Bản nháp (Draft)</option>
            </select>
          </div>
        </div>

        {/* License Categories Selection */}
        <div className={v.inputGroup}>
          <label className={v.label}>
            Áp dụng cho hạng bằng (License Categories)
          </label>
          <div className="flex flex-wrap gap-2 p-4 bg-slate-50/50 rounded-[1.5rem] border border-slate-100">
            {options.licenses.map((l) => (
              <div
                key={l.value}
                onClick={() => !isLoading && handleToggleLicense(l.value)}
                className={cn(
                  "px-5 py-2.5 rounded-2xl text-[11px] font-black cursor-pointer transition-all border-2 select-none",
                  licensesWatcher.includes(l.value)
                    ? "bg-emerald-600 border-emerald-600 text-white shadow-md shadow-emerald-200"
                    : "bg-white border-slate-100 text-slate-400 hover:border-emerald-300",
                  isLoading && "opacity-50 cursor-not-allowed",
                )}
              >
                {l.label}
              </div>
            ))}
          </div>
          {errors.licenseCategoryIds && (
            <p className="text-xs text-rose-500 font-bold mt-1 ml-1">
              {String(errors.licenseCategoryIds.message)}
            </p>
          )}
        </div>

        {/* Critical Question Toggle */}
        <label
          className={cn(
            "flex items-center gap-4 p-6 rounded-[2rem] border-2 cursor-pointer transition-all",
            isCritical
              ? "bg-rose-50 border-rose-200 shadow-inner"
              : "bg-slate-50 border-transparent hover:bg-slate-100",
            isLoading && "opacity-50 pointer-events-none",
          )}
        >
          <input
            type="checkbox"
            {...register("isCritical" as Path<T>)}
            className="w-6 h-6 accent-rose-500 shrink-0"
          />
          <div className="flex-1">
            <p
              className={cn(
                "font-black text-sm uppercase",
                isCritical ? "text-rose-600" : "text-slate-700",
              )}
            >
              Đây là câu hỏi điểm liệt (Critical Question)
            </p>
          </div>
          <ShieldAlert
            className={isCritical ? "text-rose-500" : "text-slate-300"}
          />
        </label>
      </div>

      {/* --- RIGHT COLUMN: MEDIA & ANSWERS (CỘT PHẢI: HÌNH ẢNH & ĐÁP ÁN) --- */}
      <div className={v.rightCol}>
        {/* Main Image Upload Area */}
        <div className="relative group h-64">
          <div
            className={cn(
              "w-full h-full border-2 border-dashed rounded-[2.5rem] flex flex-col items-center justify-center transition-all overflow-hidden relative",
              previews.main
                ? "border-emerald-500 bg-emerald-50/20"
                : "border-slate-200 hover:border-emerald-400 bg-slate-50 hover:bg-slate-100",
            )}
          >
            {previews.main ? (
              <div className="relative w-full h-full group overflow-hidden rounded-[2.5rem]">
                <Image
                  src={previews.main}
                  alt="Question preview"
                  fill
                  className="object-contain p-4 transition-transform duration-500 group-hover:scale-105"
                  unoptimized
                />
                <button
                  type="button"
                  onClick={handlers.removeMainImage}
                  className="absolute top-4 right-4 z-10 p-2.5 bg-rose-500/90 text-white rounded-full shadow-lg hover:bg-rose-600 transition-all"
                >
                  <X size={18} strokeWidth={3} />
                </button>
              </div>
            ) : (
              <label className="cursor-pointer flex flex-col items-center justify-center gap-4 w-full h-full">
                <div className="p-5 rounded-3xl bg-emerald-50 text-emerald-500 group-hover:scale-110 transition-all">
                  <UploadCloud size={42} strokeWidth={1.5} />
                </div>
                <div className="text-center">
                  <span className="block text-sm font-black text-slate-600 uppercase tracking-widest">
                    Tải ảnh minh họa
                  </span>
                  <span className="text-[10px] text-slate-400 font-bold">
                    PNG, JPG hoặc WEBP (Tối đa 5MB)
                  </span>
                </div>
                <input
                  type="file"
                  className="hidden"
                  accept="image/*"
                  onChange={handlers.onMainImageChange}
                  disabled={isLoading}
                />
              </label>
            )}
          </div>
        </div>

        {/* Answer Management Section */}
        <div className="space-y-4">
          <div className="flex justify-between items-center px-2">
            <h3 className={v.label}>Danh sách đáp án (Answers List)</h3>
            <button
              type="button"
              disabled={fields.length >= 6 || isLoading}
              onClick={() =>
                append({
                  content: "",
                  isCorrect: false,
                  imageFile: null,
                } as PathValue<T, FieldArrayPath<T>>)
              }
              className="text-[10px] font-black text-emerald-600 bg-emerald-50 px-4 py-2 rounded-xl hover:bg-emerald-100 disabled:opacity-50"
            >
              <Plus size={12} className="inline mr-1" /> THÊM ĐÁP ÁN
            </button>
          </div>

          <div className={v.answerScroll}>
            {fields.map((field, index) => {
              const isCorrect = answersWatcher[index]?.isCorrect;
              return (
                <div
                  key={field.id}
                  className={v.answerCard({
                    status: isCorrect ? "correct" : "normal",
                  })}
                >
                  <div className="flex items-center gap-3">
                    {/* Correct Answer Toggle */}
                    <button
                      type="button"
                      onClick={() => {
                        const updated = answersWatcher.map((a, i) => ({
                          ...a,
                          isCorrect: i === index,
                        }));
                        setValue(
                          "answers" as Path<T>,
                          updated as PathValue<T, Path<T>>,
                          { shouldValidate: true },
                        );
                      }}
                      className={v.checkButton({ isActive: isCorrect })}
                      disabled={isLoading}
                    >
                      {isCorrect ? <CheckCircle2 size={18} /> : index + 1}
                    </button>

                    {/* Answer Content Input */}
                    <input
                      {...register(`answers.${index}.content` as Path<T>)}
                      placeholder={`Nhập đáp án ${index + 1}...`}
                      className="flex-1 bg-transparent border-none outline-none font-bold text-sm text-slate-700"
                      disabled={isLoading}
                    />

                    {/* Remove Answer Button */}
                    {fields.length > 2 && (
                      <button
                        type="button"
                        onClick={() => remove(index)}
                        className="text-slate-300 hover:text-rose-500"
                        disabled={isLoading}
                      >
                        <Trash2 size={16} />
                      </button>
                    )}
                  </div>

                  {/* Answer Image Preview & Upload */}
                  <div className="flex items-center gap-3 pl-14 mt-2">
                    <label className="cursor-pointer flex items-center gap-2 text-[10px] font-black text-slate-400 uppercase hover:text-emerald-500">
                      <ImageIcon size={14} />{" "}
                      {previews.answers[index] ? "Thay đổi ảnh" : "Thêm ảnh"}
                      <input
                        type="file"
                        className="hidden"
                        accept="image/*"
                        onChange={(e) => handlers.onAnswerImageChange(index, e)}
                        disabled={isLoading}
                      />
                    </label>

                    {previews.answers[index] && (
                      <div className="relative w-12 h-12 rounded-xl overflow-hidden border-2 border-emerald-100 group/ans-img">
                        <Image
                          src={previews.answers[index]}
                          alt="Answer preview"
                          fill
                          className="object-cover"
                          unoptimized
                        />
                        <button
                          type="button"
                          onClick={() => handlers.removeAnswerImage(index)}
                          className="absolute inset-0 bg-rose-500/80 text-white flex items-center justify-center opacity-0 group-hover/ans-img:opacity-100 transition-opacity"
                        >
                          <X size={14} strokeWidth={3} />
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
          {errors.answers && (
            <p className="text-xs text-rose-500 font-bold mt-1 text-center">
              {String(errors.answers.message)}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
