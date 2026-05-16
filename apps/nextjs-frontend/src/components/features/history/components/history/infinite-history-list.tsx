// src/features/history/components/infinite-history-list.tsx
"use client";

import { useEffect, useRef, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { HistoryItem } from "./history-item";
import { useHistoryInfinite } from "../../hooks/use-history-infinite";
import { HistoryQueryParams } from "../../types/history.types";
import { Loader2, Inbox, AlertCircle } from "lucide-react";

interface InfiniteHistoryListProps {
  filters: Omit<HistoryQueryParams, "page" | "limit">;
  onSelect: (id: string) => void;
}

export const InfiniteHistoryList = ({
  filters,
  onSelect,
}: InfiniteHistoryListProps) => {
  // 1. DATA FETCHING LAYER (Tầng truy vấn dữ liệu)
  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading,
    isError,
  } = useHistoryInfinite(filters);

  const loadMoreRef = useRef<HTMLDivElement>(null);

  // 2. DATA PROCESSING LAYER (Tầng xử lý dữ liệu)
  /**
   * flatItems: Làm phẳng dữ liệu từ các trang và lọc trùng ID (snapshotId).
   * (Flatten data from pages and filter duplicate snapshotIds).
   */
  const flatItems = useMemo(() => {
    if (!data) return [];

    // Gộp tất cả các trang thành một mảng duy nhất (Flattening pages)
    const allItems = data.pages.flat();

    // Lọc trùng bằng Map để đảm bảo tính duy nhất (Deduplication)
    return Array.from(
      new Map(allItems.map((item) => [item.snapshotId, item])).values()
    );
  }, [data]);

  // 3. INFINITE SCROLL OBSERVER (Bộ theo dõi cuộn vô hạn)
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasNextPage && !isFetchingNextPage) {
          fetchNextPage();
        }
      },
      { threshold: 0.1, rootMargin: "200px" } // Load trước khi cuộn tới cuối 200px
    );

    if (loadMoreRef.current) observer.observe(loadMoreRef.current);
    return () => observer.disconnect();
  }, [hasNextPage, isFetchingNextPage, fetchNextPage]);

  // 4. UI RENDER LOGIC (Logic hiển thị giao diện)

  // Trạng thái đang tải lần đầu (Initial Loading)
  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">
        {[...Array(6)].map((_, i) => (
          <div
            key={`skeleton-${i}`}
            className="h-[200px] bg-slate-100/50 animate-pulse rounded-[2rem] border border-slate-100 shadow-sm"
          />
        ))}
      </div>
    );
  }

  // Trạng thái lỗi (Error State)
  if (isError) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="p-12 text-center bg-rose-50 rounded-[2.5rem] border border-rose-100 mt-6 shadow-sm flex flex-col items-center gap-4"
      >
        <AlertCircle className="text-rose-500 w-12 h-12" />
        <div className="space-y-1">
          <p className="font-black text-rose-900 uppercase italic">Lỗi kết nối</p>
          <p className="text-sm text-rose-600">Máy chủ không phản hồi, vui lòng thử lại sau.</p>
        </div>
      </motion.div>
    );
  }

  // Trạng thái danh sách trống (Empty State)
  if (flatItems.length === 0) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col items-center justify-center p-20 bg-white border border-slate-200 border-dashed rounded-[3rem] text-slate-400 mt-6 shadow-soft"
      >
        <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mb-6">
          <Inbox className="w-10 h-10 text-slate-300" />
        </div>
        <h3 className="text-2xl font-black text-slate-800 mb-2 italic uppercase">
          Trống trơn
        </h3>
        <p className="text-sm font-medium text-slate-500 text-center max-w-[320px]">
          Bạn chưa thực hiện bài kiểm tra nào trong danh mục này.
        </p>
      </motion.div>
    );
  }

  return (
    <div className="flex flex-col w-full min-h-screen">
      {/* Grid hiển thị danh sách - Emerald Design System */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">
        <AnimatePresence mode="popLayout">
          {flatItems.map((item, index) => (
            <motion.div
              key={item.snapshotId} // Sử dụng snapshotId duy nhất làm Key
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05, duration: 0.4 }}
              layout
            >
              <HistoryItem data={item} onSelect={onSelect} />
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {/* Tầng hiển thị Loading khi cuộn (Footer Loader) */}
      <div
        ref={loadMoreRef}
        className="h-48 w-full flex flex-col items-center justify-center pt-10"
      >
        {isFetchingNextPage ? (
          <div className="flex items-center gap-3 text-emerald-600 bg-white border border-emerald-100 px-8 py-4 rounded-3xl font-black text-xs shadow-soft uppercase tracking-widest animate-bounce">
            <Loader2 className="w-4 h-4 animate-spin stroke-[3px]" />
            Đang đồng bộ dữ liệu...
          </div>
        ) : !hasNextPage && flatItems.length > 0 ? (
          <div className="flex flex-col items-center gap-3 opacity-40">
            <div className="h-[2px] w-16 bg-gradient-to-r from-transparent via-slate-300 to-transparent" />
            <span className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em]">
              Kịch trần danh sách
            </span>
          </div>
        ) : null}
      </div>
    </div>
  );
};