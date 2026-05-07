// src/features/gplx-test/components/exam-filter.tsx
import { Search, Filter } from "lucide-react";
import { IExamFilter } from "../types/exam-ui.types";

interface ExamFilterProps {
  filters: IExamFilter;
  onFilterChange: (newFilters: IExamFilter) => void;
}

export const ExamFilter = ({ filters, onFilterChange }: ExamFilterProps) => {
  return (
    <div className="flex flex-col md:flex-row gap-4 mb-8 bg-white p-4 rounded-3xl shadow-soft">
      {/* Search Input */}
      <div className="relative flex-1">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
        <input
          type="text"
          placeholder="Tìm kiếm bộ đề thi..."
          className="w-full pl-12 pr-4 py-3 bg-slate-50 border-none rounded-2xl text-sm focus:ring-2 focus:ring-emerald-500 outline-none transition-all"
          value={filters.search}
          onChange={(e) => onFilterChange({ ...filters, search: e.target.value })}
        />
      </div>

      {/* Category Select */}
      <div className="flex items-center gap-2 px-4 bg-slate-50 rounded-2xl border-none">
        <Filter className="text-slate-400 w-4 h-4" />
        <select
          className="bg-transparent py-3 text-sm font-bold text-slate-700 outline-none border-none cursor-pointer"
          value={filters.category}
          onChange={(e) => onFilterChange({ ...filters, category: e.target.value })}
        >
          <option value="all">Tất cả hạng bằng</option>
          <option value="A1">Hạng A1</option>
          <option value="A2">Hạng A2</option>
          <option value="B1">Hạng B1</option>
          <option value="B2">Hạng B2</option>
        </select>
      </div>
    </div>
  );
};