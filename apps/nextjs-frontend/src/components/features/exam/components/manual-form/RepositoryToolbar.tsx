"use client";

import React, { useState, useTransition } from "react";
import {
  Search,
  Filter,
  AlertCircle,
  BookOpen,
  GraduationCap,
  X,
  Check,
} from "lucide-react";
import { cn } from "@/lib/utils/utils";

// 1. Cập nhật Interface: Gộp các thao tác filter thành 1 Action duy nhất để tối ưu re-render
interface ToolbarProps {
  searchTerm: string;
  onSearchChange: (v: string) => void;

  chapters: string[];
  selectedChapters: string[];

  licenseCategories: string[];
  selectedLicenses: string[];

  onlyCritical: boolean;

  // Action (Hành động) gom nhóm
  onApplyFilters: (filters: {
    chapters: string[];
    licenses: string[];
    critical: boolean;
  }) => void;
  onClearFilters: () => void;

  selectedCount?: number;
}

export const RepositoryToolbar = (p: ToolbarProps) => {
  const [isOpen, setIsOpen] = useState(false);

  // useTransition: Tối ưu UI không bị đơ khi thực hiện tác vụ nặng (React 18)
  const [isPending, startTransition] = useTransition();
  // LOCAL SEARCH STATE: Trạng thái cục bộ cho thanh tìm kiếm để gõ chữ không bị lag
  const [localSearch, setLocalSearch] = useState(p.searchTerm);

  // DRAFT STATE: Trạng thái nháp cho Modal, chỉ đẩy lên Cha khi bấm "Áp dụng"
  const [draftChapters, setDraftChapters] = useState<string[]>([]);
  const [draftLicenses, setDraftLicenses] = useState<string[]>([]);
  const [draftCritical, setDraftCritical] = useState<boolean>(false);

  // Sync (Đồng bộ) data từ Parent vào Draft State mỗi khi mở Modal
  const handleOpenModal = () => {
    setDraftChapters(p.selectedChapters);
    setDraftLicenses(p.selectedLicenses);
    setDraftCritical(p.onlyCritical);
    setIsOpen(true);
  };

  // Xử lý Search với Transition (Cập nhật input ngay lập tức, filter ngầm phía sau)
  const handleSearchInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setLocalSearch(value); // UI input mượt mà
    startTransition(() => {
      p.onSearchChange(value); // Xử lý data nặng chạy ngầm
    });
  };

  // Hàm xử lý Áp dụng bộ lọc
  const handleApply = () => {
    p.onApplyFilters({
      chapters: draftChapters,
      licenses: draftLicenses,
      critical: draftCritical,
    });
    setIsOpen(false);
  };

  const activeFiltersCount =
    (p.selectedChapters.length > 0 ? 1 : 0) +
    (p.selectedLicenses.length > 0 ? 1 : 0) +
    (p.onlyCritical ? 1 : 0);

  return (
    <div className="flex flex-col gap-4 mb-6">
      {/* THANH SEARCH CHÍNH */}
      <div className="flex gap-2">
        <div className="relative flex-1">
          <Search
            size={18}
            className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
          />
          <input
            value={localSearch}
            onChange={handleSearchInput}
            placeholder="Tìm theo nội dung hoặc mã câu hỏi..."
            className="w-full pl-12 pr-4 h-14 bg-white border border-slate-200 rounded-3xl shadow-sm focus:ring-2 focus:ring-emerald-500 transition-all outline-none"
          />
        </div>

        <button
          type="button"
          onClick={handleOpenModal}
          className={cn(
            "relative flex items-center gap-2 px-6 h-14 rounded-3xl font-bold transition-all border",
            activeFiltersCount > 0
              ? "bg-emerald-50 border-emerald-200 text-emerald-600"
              : "bg-white border-slate-200 text-slate-600 hover:bg-slate-50",
          )}
        >
          <Filter size={20} />
          <span>Bộ lọc</span>
          {activeFiltersCount > 0 && (
            <span className="absolute -top-1 -right-1 w-6 h-6 bg-emerald-500 text-white text-[10px] rounded-full flex items-center justify-center border-2 border-white shadow-soft">
              {activeFiltersCount}
            </span>
          )}
        </button>
      </div>

      {/* MODAL BỘ LỌC */}
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm">
          <div className="bg-white w-full max-w-2xl max-h-[85vh] rounded-[40px] shadow-2xl flex flex-col overflow-hidden animate-in fade-in zoom-in duration-200">
            {/* Header */}
            <div className="p-6 border-b flex items-center justify-between">
              <h3 className="text-xl font-black text-slate-800 flex items-center gap-2">
                <Filter className="text-emerald-500" /> Bộ lọc nâng cao
              </h3>
              <button
                type="button"
                onClick={() => setIsOpen(false)}
                className="p-2 hover:bg-slate-100 rounded-full transition-colors"
              >
                <X size={24} className="text-slate-400" />
              </button>
            </div>

            {/* Body */}
            <div className="flex-1 overflow-y-auto p-8 space-y-8 custom-scrollbar">
              {/* PHẦN 1: HẠNG BẰNG LÁI */}
              <section className="space-y-4">
                <label className="flex items-center gap-2 text-xs font-black text-slate-400 uppercase tracking-widest">
                  <GraduationCap size={16} /> Hạng bằng áp dụng
                </label>
                <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
                  {p.licenseCategories.map((lic) => {
                    const isActive = draftLicenses.includes(lic); // Dùng draft state
                    return (
                      <button
                        type="button"
                        key={lic}
                        onClick={() =>
                          setDraftLicenses((prev) =>
                            isActive
                              ? prev.filter((l) => l !== lic)
                              : [...prev, lic],
                          )
                        }
                        className={cn(
                          "flex items-center justify-center gap-2 h-12 rounded-2xl border-2 font-bold transition-all",
                          isActive
                            ? "bg-emerald-500 border-emerald-500 text-white shadow-lg shadow-emerald-100"
                            : "bg-white border-slate-100 text-slate-500 hover:border-emerald-200",
                        )}
                      >
                        {lic} {isActive && <Check size={14} />}
                      </button>
                    );
                  })}
                </div>
              </section>

              {/* PHẦN 2: CÂU ĐIỂM LIỆT */}
              <section className="space-y-4">
                <label className="flex items-center gap-2 text-xs font-black text-slate-400 uppercase tracking-widest">
                  <AlertCircle size={16} /> Loại câu hỏi đặc biệt
                </label>
                <button
                  type="button"
                  onClick={() => setDraftCritical(!draftCritical)} // Dùng draft state
                  className={cn(
                    "w-full flex items-center justify-between p-5 rounded-3xl border-2 transition-all",
                    draftCritical
                      ? "bg-rose-50 border-rose-200 text-rose-600"
                      : "bg-white border-slate-100 text-slate-500",
                  )}
                >
                  <div className="flex items-center gap-3">
                    <div
                      className={cn(
                        "w-10 h-10 rounded-full flex items-center justify-center",
                        draftCritical
                          ? "bg-rose-500 text-white"
                          : "bg-slate-100 text-slate-400",
                      )}
                    >
                      <AlertCircle size={20} />
                    </div>
                    <div className="text-left">
                      <p className="font-black text-sm">CÂU ĐIỂM LIỆT</p>
                      <p className="text-[10px] opacity-70">
                        Chỉ hiển thị các câu hỏi bắt buộc phải đúng
                      </p>
                    </div>
                  </div>
                  <div
                    className={cn(
                      "w-6 h-6 rounded-full border-2 flex items-center justify-center",
                      draftCritical
                        ? "bg-rose-500 border-rose-500"
                        : "border-slate-200",
                    )}
                  >
                    {draftCritical && (
                      <Check size={14} className="text-white" />
                    )}
                  </div>
                </button>
              </section>

              {/* PHẦN 3: CHƯƠNG HỌC */}
              <section className="space-y-4">
                <label className="flex items-center gap-2 text-xs font-black text-slate-400 uppercase tracking-widest">
                  <BookOpen size={16} /> Nội dung chương học
                </label>
                <div className="space-y-2">
                  {p.chapters.map((chap) => {
                    const isActive = draftChapters.includes(chap); // Dùng draft state
                    return (
                      <button
                        type="button"
                        key={chap}
                        onClick={() =>
                          setDraftChapters((prev) =>
                            isActive
                              ? prev.filter((c) => c !== chap)
                              : [...prev, chap],
                          )
                        }
                        className={cn(
                          "w-full flex items-start justify-between p-4 rounded-2xl border-2 text-sm font-bold transition-all gap-4",
                          isActive
                            ? "bg-slate-800 border-slate-800 text-white"
                            : "bg-white border-slate-100 text-slate-600 hover:border-slate-200",
                        )}
                      >
                        <span className="text-left flex-1 break-words">
                          {chap}
                        </span>
                        <div
                          className={cn(
                            "w-5 h-5 mt-0.5 rounded-md border flex-shrink-0 flex items-center justify-center",
                            isActive
                              ? "bg-emerald-500 border-emerald-500"
                              : "bg-slate-50 border-slate-200",
                          )}
                        >
                          {isActive && (
                            <Check size={12} className="text-white" />
                          )}
                        </div>
                      </button>
                    );
                  })}
                </div>
              </section>
            </div>

            {/* Footer Modal */}
            <div className="p-6 bg-slate-50 border-t flex gap-3">
              <button
                type="button"
                onClick={() => {
                  p.onClearFilters();
                  setIsOpen(false);
                }}
                className="flex-1 h-14 rounded-2xl font-black text-[10px] uppercase tracking-widest text-slate-400 hover:text-slate-600 transition-colors"
              >
                Xóa tất cả
              </button>
              <button
                type="button"
                onClick={handleApply} // Gọi batch update lên Parent
                className="flex-[2] h-14 bg-emerald-500 text-white rounded-2xl font-black text-[12px] uppercase tracking-widest shadow-lg shadow-emerald-200 hover:bg-emerald-600 transition-all active:scale-[0.98]"
              >
                Áp dụng bộ lọc
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
