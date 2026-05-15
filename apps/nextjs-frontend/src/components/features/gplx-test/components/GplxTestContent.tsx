"use client";

import { useState, useCallback, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
// Thêm icon Shuffle (Trộn)
import { SearchIcon, AlertCircle, ArrowLeft, Shuffle } from "lucide-react";

// Components
import { ExamSkeleton } from "./ExamSkeleton";
import { ExamCard } from "./ExamCard";
import { GplxTestContainer } from "./GplxTestContainer";
import { ExamGrid } from "./ExamGrid";
import SplashScreen from "@/components/common/Loaders/SplashScreen";

// Hooks & Utilities
import { cn } from "@/lib/utils/utils";
import { useInfiniteExamsVisual } from "../hook/use-infinite-exam-visual";
import { useExamRealtime } from "../hook/use-exam-realtime";
import { useExamDetail } from "../hook/use-exam-detail";
import { useDebounce } from "../hook/use-debounce";

// Constants
import { CATEGORIES, CATEGORY_MAP } from "../constants/category";
import Button from "@/components/ui/Button/Button";
import { useExamSessionManager } from "../hook/use-exam-session-manager";

export default function GplxTestPage() {
  const [activeExamId, setActiveExamId] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("Tất cả");

  // --- NEW STATE: TRẠNG THÁI TRỘN ĐỀ (Shuffle State) ---
  const [isShuffleActive, setIsShuffleActive] = useState<boolean>(false);

  const debouncedSearch = useDebounce(searchTerm, 500);

  useExamRealtime();
  const queryParams = useMemo(
    () => ({
      limit: 10,
      search: debouncedSearch,
      licenseCode: CATEGORY_MAP[selectedCategory],
    }),
    [debouncedSearch, selectedCategory],
  );
  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading: isLoadingList,
    isError: isErrorList,
  } = useInfiniteExamsVisual(queryParams);

  const {
    exam,
    isLoading: isLoadingDetail,
    isError: isErrorDetail,
  } = useExamDetail(activeExamId ?? undefined);

  const uniqueExams = useMemo(() => {
    if (!data) return [];
    const flatData = data.pages.flatMap((page) => page.data);
    return Array.from(
      new Map(flatData.map((item) => [item.id, item])).values(),
    );
  }, [data]);

  const observerTarget = useCallback(
    (node: HTMLDivElement | null) => {
      if (isLoadingList || isFetchingNextPage || !hasNextPage || !node) return;

      const observer = new IntersectionObserver(
        (entries) => {
          if (entries[0].isIntersecting) {
            fetchNextPage();
          }
        },
        { threshold: 0.1, rootMargin: "200px" },
      );

      observer.observe(node);
      return () => observer.disconnect();
    },
    [hasNextPage, fetchNextPage, isLoadingList, isFetchingNextPage],
  );

  const { handleJoinExamRoom, handleExitExamRoom } =
    useExamSessionManager(setActiveExamId);

  // --- WRAPPER HANDLER: XỬ LÝ VÀO PHÒNG CÓ TRỘN ĐỀ ---
  const onJoinExam = (examId: string) => {
    handleJoinExamRoom(examId);
  };

  if (isErrorList) return <SplashScreen variant="take-exam" />;

  return (
    <div
      className={cn(
        "bg-slate-50 w-full relative transition-colors duration-500",
        activeExamId ? "h-screen overflow-hidden" : "min-h-screen",
      )}
    >
      <AnimatePresence mode="wait">
        {!activeExamId ? (
          <motion.div
            key="list-view"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.4 }}
            className="p-4 md:p-8 max-w-7xl mx-auto"
          >
            <header className="mb-10 w-full space-y-6">
              <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
                <h1 className="text-3xl md:text-4xl font-black italic uppercase leading-tight tracking-tight bg-gradient-to-r from-emerald-600 to-emerald-400 bg-clip-text text-transparent py-1 px-1 -ml-1">
                  SÁT HẠCH LÝ THUYẾT
                </h1>

                <div className="flex flex-col sm:flex-row items-center gap-4 w-full lg:w-auto">
                  {/* BUTTON: THAY ĐỔI VỊ TRÍ CÂU HỎI & ĐÁP ÁN (Shuffle Toggle Button) */}
                  <button
                    onClick={() => setIsShuffleActive(!isShuffleActive)}
                    className={cn(
                      "flex items-center gap-3 px-6 py-2.5 rounded-full text-xs font-black uppercase tracking-widest transition-all border-2",
                      isShuffleActive
                        ? "bg-emerald-600 border-emerald-600 text-white shadow-lg shadow-emerald-500/20" // Emerald theme
                        : "bg-white border-slate-100 text-slate-400 hover:border-emerald-200 hover:text-emerald-600",
                    )}
                  >
                    <Shuffle
                      size={16}
                      strokeWidth={isShuffleActive ? 3 : 2}
                      className={cn(isShuffleActive && "animate-spin-slow")}
                    />
                    <span>
                      {isShuffleActive
                        ? "Đã tráo thứ tự"
                        : "Tráo thứ tự câu hỏi & đáp án"}
                    </span>
                  </button>

                  <div className="relative w-full sm:w-80 group">
                    <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-emerald-500 transition-colors">
                      <SearchIcon size={18} />
                    </div>
                    <input
                      type="text"
                      placeholder="Tìm kiếm đề thi..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="w-full pl-12 pr-4 py-2.5 bg-white border border-slate-200 rounded-full text-sm outline-none focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-400 shadow-sm transition-all"
                    />
                  </div>
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-2">
                {CATEGORIES.map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setSelectedCategory(cat)}
                    className={cn(
                      "px-5 py-2 rounded-full text-sm font-medium transition-all border shadow-sm",
                      selectedCategory === cat
                        ? "bg-emerald-500 border-emerald-500 text-white translate-y-[-1px]"
                        : "bg-white border-slate-200 text-slate-600 hover:border-emerald-300",
                    )}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </header>

            <ExamGrid>
              {/* 1. Trạng thái tải dữ liệu lần đầu (Initial Loading State) */}
              {isLoadingList && uniqueExams.length === 0 ? (
                Array.from({ length: 8 }).map((_, i) => (
                  <ExamSkeleton key={`initial-skeleton-${i}`} />
                ))
              ) : uniqueExams.length > 0 ? (
                /* 2. Trạng thái hiển thị danh sách (Success State) */
                <>
                  {uniqueExams.map((examItem, index) => (
                    <ExamCard
                      key={examItem.id}
                      exam={examItem}
                      index={index}
                      onSelect={onJoinExam}
                      size="sm"
                    />
                  ))}

                  {/* Tải thêm trang tiếp theo (Infinite Scroll Loading) */}
                  {isFetchingNextPage &&
                    Array.from({ length: 4 }).map((_, i) => (
                      <ExamSkeleton key={`next-page-skeleton-${i}`} />
                    ))}
                </>
              ) : (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="col-span-full flex flex-col items-center justify-center py-20 px-4 text-center border-2 border-dashed border-slate-200 rounded-3xl bg-slate-50/50"
                >
                  <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mb-4 text-slate-400">
                    <SearchIcon size={32} />
                  </div>
                  <h3 className="text-lg font-bold text-slate-900">
                    Không tìm thấy đề thi
                  </h3>
                  <p className="text-slate-500 text-sm max-w-xs mt-1">
                    Thử thay đổi từ khóa tìm kiếm hoặc chọn hạng bằng lái khác
                  </p>
                </motion.div>
              )}
            </ExamGrid>

            <div
              ref={observerTarget}
              className="w-full flex justify-center py-16"
            >
              {isFetchingNextPage ? (
                <div className="flex flex-col items-center gap-2">
                  <div className="flex gap-1 animate-pulse">
                    <div className="w-2 h-2 bg-emerald-500 rounded-full" />
                  </div>
                  <span className="text-[10px] text-emerald-600 font-black uppercase">
                    Đang đồng bộ...
                  </span>
                </div>
              ) : (
                !hasNextPage &&
                uniqueExams.length > 0 && (
                  <p className="text-slate-400 text-xs font-bold uppercase italic">
                    Đã hiển thị tất cả đề thi
                  </p>
                )
              )}
            </div>
          </motion.div>
        ) : (
          <motion.div
            key="exam-container"
            className="fixed inset-0 z-50 bg-white"
            initial={{ opacity: 0, x: 100 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -100 }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
          >
            {isLoadingDetail ? (
              <SplashScreen variant="take-exam" />
            ) : isErrorDetail || !exam ? (
              <div className="flex flex-col items-center justify-center h-full gap-4">
                <AlertCircle size={48} className="text-rose-500" />
                <h2 className="text-xl font-bold">Lỗi tải đề thi</h2>
                <Button variant="outline" onClick={handleExitExamRoom}>
                  <ArrowLeft className="mr-2 h-4 w-4" /> Quay lại danh sách
                </Button>
              </div>
            ) : (
              // Truyền flag shuffle xuống container làm bài (Pass shuffle flag to test container)
              <GplxTestContainer
                exam={exam}
                onExit={handleExitExamRoom}
                shouldShuffle={isShuffleActive}
              />
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
