"use client";

import React from "react";
import { Check } from "lucide-react";
import { cn } from "@/lib/utils/utils";
import Button from "@/components/ui/Button/Button";
import { filterVariants, gridVariants } from "./filter.variants";
import { QuestionFilterForm, QuestionFilterProps } from "./type";

export const QuestionFilter: React.FC<QuestionFilterProps> = ({
  isOpen,
  layout = "grid",
  chapterOptions,
  licenseOptions,
  difficultyOptions,
  filterForm,
  onFilterChange,
  onApply,
  onClear,
  onClose,
}) => {
  if (!isOpen) return null;

  // Hàm xử lý chọn/bỏ chọn (Toggle logic)
  const handleTick = (field: keyof QuestionFilterForm, value: string) => {
    const newValue = filterForm[field] === value ? "" : value;
    onFilterChange({ [field]: newValue });
  };

  return (
    <div className={cn(filterVariants({ layout }))}>
      <div className={cn(gridVariants({ layout }))}>
        
        {/* Lọc theo Chương */}
        <FilterGroup label="Chủ đề (Chương)">
          <select
            className="w-full h-11 px-4 rounded-xl border border-slate-200 bg-slate-50 text-sm outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 transition-all"
            value={filterForm.chapterId}
            onChange={(e) => onFilterChange({ chapterId: e.target.value })}
          >
            <option value="">Tất cả chương</option>
            {chapterOptions.map((opt) => (
              <option key={opt.value} value={opt.value}>{opt.label}</option>
            ))}
          </select>
        </FilterGroup>

        {/* Lọc theo Hạng bằng */}
        <FilterGroup label="Hạng bằng lái">
          <select
            className="w-full h-11 px-4 rounded-xl border border-slate-200 bg-slate-50 text-sm outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 transition-all"
            value={filterForm.licenseCategoryIds}
            onChange={(e) => onFilterChange({ licenseCategoryIds: e.target.value })}
          >
            <option value="">Tất cả hạng bằng</option>
            {licenseOptions.map((opt) => (
              <option key={opt.value} value={opt.value}>{opt.label}</option>
            ))}
          </select>
        </FilterGroup>

        {/* Lọc theo Độ khó */}
        <FilterGroup label="Độ khó">
          <div className="flex flex-wrap gap-2">
            {difficultyOptions.map((diff) => (
              <button
                type="button"
                key={diff.value}
                onClick={() => handleTick("difficultyLevel", diff.value)}
                className={cn(
                  "px-3 py-2 rounded-xl text-xs font-semibold border transition-all select-none active:scale-95",
                  filterForm.difficultyLevel === diff.value
                    ? "bg-emerald-50 border-emerald-500 text-emerald-700 shadow-sm"
                    : "bg-white border-slate-200 text-slate-600 hover:bg-slate-50"
                )}
              >
                {diff.label}
              </button>
            ))}
          </div>
        </FilterGroup>

        {/* Lọc Câu điểm liệt */}
        <FilterGroup label="Loại câu hỏi">
          <button
            type="button"
            onClick={() => handleTick("isCritical", "true")}
            className={cn(
              "flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold border transition-all active:scale-95 w-fit",
              filterForm.isCritical === "true"
                ? "bg-rose-50 border-rose-500 text-rose-700 shadow-sm"
                : "bg-white border-slate-200 text-slate-600 hover:bg-slate-50"
            )}
          >
            <div className={cn(
              "w-4 h-4 rounded-[4px] border flex items-center justify-center transition-colors",
              filterForm.isCritical === "true" ? "bg-rose-500 border-rose-500 text-white" : "border-slate-300"
            )}>
              {filterForm.isCritical === "true" && <Check size={12} strokeWidth={4} />}
            </div>
            Câu điểm liệt
          </button>
        </FilterGroup>
      </div>

      {/* Footer chứa nút bấm */}
      <div className="flex items-center justify-end gap-3 pt-4 mt-4 border-t border-slate-100">
        <Button
          variant="ghost"
          onClick={() => { onClear(); onClose(); }}
          className="text-slate-500 hover:text-rose-500 font-medium"
        >
          Xóa làm lại
        </Button>
        <Button 
          variant="primary" 
          onClick={onApply} 
          className="px-8 shadow-emerald-200"
        >
          Áp dụng bộ lọc
        </Button>
      </div>
    </div>
  );
};

// Component nhỏ hỗ trợ cấu trúc
const FilterGroup: React.FC<{ label: string; children: React.ReactNode }> = ({ label, children }) => (
  <div className="flex flex-col gap-3">
    <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">
      {label}
    </label>
    {children}
  </div>
);