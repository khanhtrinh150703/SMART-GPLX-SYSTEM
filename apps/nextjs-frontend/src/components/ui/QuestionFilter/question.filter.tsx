"use client";

import React from "react";
import { Check, Hash, Star, RotateCcw, Filter } from "lucide-react";
// Đừng quên import Controller từ react-hook-form nha má
import { Control, Controller, FieldErrors } from "react-hook-form"; 
import { cn } from "@/lib/utils/utils";
import Button from "@/components/ui/Button/Button";
import { QuestionFilterForm, QuestionFilterProps } from "./type";
import { FilterGroup } from "../FilterGroup/FilterGroup";
import { DataSelect } from "../Data-Select/data-select";

// Bổ sung type cho các props của react-hook-form
interface ExtendedFilterProps extends QuestionFilterProps {
  control?: Control<QuestionFilterForm>;
  errors?: FieldErrors<QuestionFilterForm>;
  isLoading?: boolean;
}

export const QuestionFilter: React.FC<ExtendedFilterProps> = ({
  isOpen,
  chapterOptions,
  licenseOptions,
  difficultyOptions,
  filterForm,
  onFilterChange,
  onApply,
  onClear,
  onClose,
  control,     // Lấy từ ngoài vào
  errors,      // Lấy từ ngoài vào
  isLoading,   // Lấy từ ngoài vào
}) => {
  if (!isOpen) return null;

  // Lưu ý: Nếu má đã chuyển sang dùng react-hook-form toàn bộ,
  // handleTick này có thể cần sửa lại dùng setValue của RHF thay vì onFilterChange.
  // Tạm thời tôi giữ nguyên logic cũ cho các ô không dùng Controller.
  const handleTick = (field: keyof QuestionFilterForm, value: string) => {
    const newValue = filterForm[field] === value ? "" : value;
    onFilterChange({ [field]: newValue });
  };

  return (
    <div 
      className={cn(
        "bg-white p-5 rounded-[1.5rem] shadow-2xl ring-1 ring-slate-200/60 animate-in fade-in zoom-in-95 duration-200",
        "w-full max-w-[480px] mx-auto absolute top-20 right-0 z-50"
      )}
    >
      {/* 1. HEADER */}
      <div className="flex items-center justify-between mb-6 border-b border-slate-50 pb-4">
        <div className="flex items-center gap-2">
          <Filter size={14} className="text-emerald-600" />
          <h3 className="text-xs font-black text-slate-800 uppercase tracking-widest">Bộ lọc nâng cao</h3>
        </div>
        <button onClick={onClose} className="text-slate-400 hover:text-slate-600 transition-colors">
          <Hash size={14} className="rotate-45" />
        </button>
      </div>
      
      {/* 2. BODY */}
      <div className="space-y-5">
        <div className="grid grid-cols-2 gap-4">
          <Controller
            name="chapterId"
            control={control}
            render={({ field }) => (
              <DataSelect
                label="Chủ đề chương"
                placeholder="Chọn chương..."
                options={chapterOptions} // Đã map chuẩn biến
                value={field.value}
                onChange={field.onChange}
                error={errors?.chapterId?.message}
                disabled={isLoading}
                size="sm"
              />
            )}
          />

          <Controller
            name="licenseCategoryIds"
            control={control}
            render={({ field }) => (
              <div className="md:col-span-1">
                <DataSelect
                  label="Hạng bằng lái"
                  placeholder="Chọn hạng bằng..."
                  options={licenseOptions} // Đã map chuẩn biến
                  size="sm"
                  value={field.value}
                  onChange={field.onChange}
                  disabled={isLoading}
                  error={errors?.licenseCategoryIds?.message}
                />
              </div>
            )}
          />
        </div>

        {/* Difficulty */}
        <FilterGroup label="Độ khó" icon={Star}>
          <div className="flex gap-2">
            {difficultyOptions.map((diff) => {
              const isActive = filterForm.difficultyLevel === diff.value;
              return (
                <button
                  type="button"
                  key={diff.value}
                  onClick={() => handleTick("difficultyLevel", diff.value)}
                  className={cn(
                    "flex-1 py-2 rounded-lg text-[10px] font-black uppercase border transition-all",
                    isActive
                      ? "bg-emerald-600 border-emerald-600 text-white"
                      : "bg-white border-slate-200 text-slate-400 hover:border-emerald-200"
                  )}
                >
                  {diff.label}
                </button>
              );
            })}
          </div>
        </FilterGroup>

        {/* Toggles */}
        <div className="flex gap-4 pt-2">
          <label className="flex items-center gap-2 cursor-pointer group">
            <div 
              onClick={() => handleTick("isCritical", "true")}
              className={cn(
                "w-5 h-5 rounded-md border flex items-center justify-center transition-all",
                filterForm.isCritical === "true" ? "bg-rose-500 border-rose-500 text-white" : "bg-slate-100 border-slate-200"
              )}
            >
              {filterForm.isCritical === "true" && <Check size={12} strokeWidth={4} />}
            </div>
            <span className="text-[11px] font-bold text-slate-600 group-hover:text-rose-500 transition-colors">Câu điểm liệt</span>
          </label>

          <label className="flex items-center gap-2 cursor-pointer group">
            <div 
              onClick={() => handleTick("indexNumber", "true")}
              className={cn(
                "w-5 h-5 rounded-md border flex items-center justify-center transition-all",
                filterForm.indexNumber === "true" ? "bg-indigo-500 border-indigo-500 text-white" : "bg-slate-100 border-slate-200"
              )}
            >
              {filterForm.indexNumber === "true" && <Check size={12} strokeWidth={4} />}
            </div>
            <span className="text-[11px] font-bold text-slate-600 group-hover:text-indigo-500 transition-colors">Lọc mã số</span>
          </label>
        </div>
      </div>

      {/* 3. FOOTER */}
      <div className="flex items-center justify-between mt-8 pt-4 border-t border-slate-50">
        <button
          type="button"
          onClick={onClear}
          className="flex items-center gap-1.5 text-[10px] font-bold text-slate-400 hover:text-rose-500 transition-colors"
        >
          <RotateCcw size={12} /> Xóa làm lại
        </button>
        <div className="flex gap-2">
          <button type="button" onClick={onClose} className="px-4 py-2 text-[11px] font-bold text-slate-400">Đóng</button>
          <Button
            type="button" // Tránh trigger submit nhầm nếu form bọc bên ngoài
            variant="primary"
            onClick={onApply}
            className="px-6 h-9 rounded-xl text-[11px] font-black"
            text="Áp dụng lọc"
          />
        </div>
      </div>
    </div>
  );
};