// src/features/history/components/history-container.tsx
"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { RotateCcw, Search } from "lucide-react"; // Icon reset

import { useUserStats } from "../hooks/use-user-stats";
import { useHistory } from "../hooks/use-history";

import { StatsOverview } from "./dashboard/stats-overview";
import { AccuracyChart } from "./dashboard/accuracy-chart";
import { DateRangePicker } from "./filters/date-range-picker";
import { StatusFilter } from "./filters/status-filter";
import { InfiniteHistoryList } from "./history/infinite-history-list";
import { ExamReviewRoom } from "@/components/features/gplx-test/components/exam-review/ExamReviewRoom";
import { HistoryQueryParams } from "../types/history.types";
import { FilterSelect } from "@/components/ui/Select/FilterSelect";
import { useHistoryUrlParams } from "../hooks/use-history-summary-url-params";
import { historyToolbarVariants as variants } from "./history/history-toobar.variants";
import { HISTORY_FILTERS } from "./filters/status.config";

export function HistoryContainer() {
  // 1. Hook quản lý URL (URL Params Hook)
  const {
    searchParams,
    activeField,
    activeValue,
    updateMultipleUrlParams,
    handleSearchByField,
    clearFilters,
    getApiParams,
    FILTER_FIELDS,
  } = useHistoryUrlParams();

  // 2. Trạng thái Local cho Search Bar (Local state for Search Bar)
  // Giữ lại y hệt logic của bạn để UI không bị lag khi gõ
  const [searchValue, setSearchValue] = useState(activeValue);
  const [localActiveField, setLocalActiveField] = useState(activeField);

  // Đồng bộ URL về Local State nếu có thay đổi từ bên ngoài (Sync URL to Local)
  useEffect(() => {
    const handler = setTimeout(() => {
      // Đã fix lỗi field luôn là 'name' bằng cách truyền localActiveField
      if (searchValue !== activeValue || localActiveField !== activeField) {
        handleSearchByField(localActiveField, searchValue);
      }
    }, 400);
    return () => clearTimeout(handler);
  }, [
    searchValue,
    localActiveField,
    activeValue,
    activeField,
    handleSearchByField,
  ]);

  // 3. Các trạng thái khác (Other states)
  const currentStatus = searchParams.get("status") || "all";
  const apiParams = getApiParams();

  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [view, setView] = useState<"list" | "review">("list");

  // 4. Fetch Data Hooks
  const { data: stats, isLoading: isStatsLoading } = useUserStats();
  const { detailData, isDetailLoading } = useHistory(
    { page: 1, limit: 10 },
    selectedId || undefined,
  );

  // 5. Handlers
  const handleDateChange = (range: { from?: Date; to?: Date }) => {
    updateMultipleUrlParams({
      startDate: range.from?.toISOString(),
      endDate: range.to?.toISOString(),
    });
  };

  const handleStatusChange = (status: string) => {
    updateMultipleUrlParams({ status });
  };

  const handleOpenReview = (id: string) => {
    setSelectedId(id);
    setView("review");
  };

  const handleSafeExit = () => {
    setView("list");
    setSelectedId(null);
  };

  return (
    <div className="flex flex-col gap-8 p-8 max-w-7xl mx-auto relative">
      {/* KHU VỰC 1: Dashboard Thống kê (Statistics Dashboard) */}
      <section className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="col-span-2">
          <StatsOverview stats={stats} isLoading={isStatsLoading} />
        </div>
        <div className="col-span-1 bg-white/80 rounded-3xl p-6 shadow-soft border border-slate-100 flex flex-col items-center justify-center">
          <AccuracyChart
            correct={stats?.totalCorrectAnswers || 0}
            wrong={stats?.totalWrongAnswers || 0}
            unanswered={stats?.totalUnanswered || 0}
            accuracyRate={stats?.accuracyRate || 0}
          />
        </div>
      </section>

      {/* KHU VỰC 2 & 3: Bộ lọc và Danh sách (Filters & List Section) */}
      <section className="flex flex-col gap-8 w-full">
        <div className={variants.root()}>
          {/* TABS CONTAINER */}
          <div className={variants.tabsContainer()}>
            <div className="flex items-center gap-2">
              <StatusFilter
                options={HISTORY_FILTERS}
                currentStatus={currentStatus}
                onChange={handleStatusChange}
              />
            </div>

            <div className="w-px h-5 bg-slate-200 mx-4" />

            <div className="flex items-center">
              <DateRangePicker onChange={handleDateChange} />
            </div>
          </div>

          {/* MAIN TOOLBAR */}
          <div className={variants.mainToolbar()}>
            {/* 1. Nút Reset */}
            <button
              onClick={clearFilters}
              className={variants.resetButton()}
              title="Đặt lại bộ lọc"
            >
              <RotateCcw
                size={22}
                className="group-hover:-rotate-180 transition-transform duration-500"
              />
            </button>

            {/* 2. Cụm Tìm kiếm thông minh */}
            <div className={variants.searchGroup()}>
              <FilterSelect
                options={FILTER_FIELDS}
                value={localActiveField}
                onChange={setLocalActiveField}
                variant="ghost"
                className="h-full w-40 md:w-48 border-0 bg-transparent text-[12px] font-black uppercase tracking-widest text-slate-500"
              />

              <div className="w-px h-7 bg-slate-200/60" />

              <div className="flex-1 flex items-center px-4 gap-3">
                <Search size={20} className="text-slate-400" />
                <input
                  type="text"
                  value={searchValue}
                  onChange={(e) => setSearchValue(e.target.value)}
                  placeholder="Tìm kiếm theo tên đề thi..."
                  className="flex-1 bg-transparent outline-none text-base text-slate-700 placeholder:text-slate-400 font-medium"
                />
              </div>
            </div>
          </div>
        </div>

        {/* PHẦN DANH SÁCH DƯỚI NÀY */}
        <div className="px-2">
          <div className="mb-4 flex items-center gap-3">
            <div className="h-[2px] w-8 bg-emerald-500 rounded-full" />
            <span className="text-slate-400 text-[11px] font-black uppercase tracking-[0.3em]">
              Lịch sử bài thi
            </span>
          </div>

          <InfiniteHistoryList
            filters={apiParams as Omit<HistoryQueryParams, "page" | "limit">}
            onSelect={handleOpenReview}
          />
        </div>
      </section>

      {/* KHU VỰC 4: Modal Review (Review Modal Area) */}
      <AnimatePresence>
        {view === "review" && (
          <motion.div
            key="review-view"
            className="fixed inset-0 z-[60] bg-slate-900/40 backdrop-blur-md flex flex-col items-center justify-center p-4 md:p-8"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            {/* Giữ nguyên phần UI Modal của bạn, không đổi */}
            <motion.div
              className="w-full max-w-6xl h-full max-h-[90vh] flex flex-col items-center justify-center relative"
              initial={{ y: 20, scale: 0.98 }}
              animate={{ y: 0, scale: 1 }}
              exit={{ y: 20, scale: 0.98 }}
              transition={{ duration: 0.4, ease: "easeOut" }}
            >
              {isDetailLoading ? (
                <div className="flex flex-col items-center gap-4 bg-white p-12 rounded-3xl shadow-2xl">
                  <div className="w-12 h-12 border-4 border-emerald-600 border-t-transparent rounded-full animate-spin" />
                  <p className="text-emerald-700 font-bold">
                    Đang tải... (Loading...)
                  </p>
                </div>
              ) : detailData ? (
                <div className="w-full h-full bg-white rounded-3xl shadow-2xl overflow-hidden">
                  <ExamReviewRoom result={detailData} onExit={handleSafeExit} />
                </div>
              ) : (
                <div className="bg-white p-12 rounded-3xl flex flex-col items-center">
                  <p className="text-rose-500 font-bold mb-4">
                    Lỗi tải dữ liệu. (Data loading error.)
                  </p>
                  <button
                    onClick={handleSafeExit}
                    className="px-6 py-2 bg-slate-100 rounded-xl"
                  >
                    Quay lại (Go back)
                  </button>
                </div>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
