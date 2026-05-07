"use client";

import { motion } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { navVariants } from "./exam-navigation.variants";
import { cn } from "@/lib/utils/utils";

interface ExamNavigationProps {
  total: number; // Tổng số câu hỏi (Total questions)
  currentIndex: number; // Vị trí hiện tại (Current index from parent)
  isReviewMode: boolean; // Chế độ xem lại (Review mode)
  onPrev: () => void; // Callback quay lại (Back callback)
  onNext: () => void; // Callback tiếp theo (Next callback)
}

/**
 * ExamNavigation: Thanh điều hướng dưới cùng tích hợp tiến độ.
 * Đảm bảo hiển thị tốt trên cả thiết bị di động bằng cách ẩn bớt text khi màn hình quá nhỏ.
 */
export const ExamNavigation = ({
  total,
  currentIndex,
  isReviewMode,
  onPrev,
  onNext,
}: ExamNavigationProps) => {
  // Tính toán % tiến độ (Progress bar calculation)
  const progress = ((currentIndex + 1) / total) * 100;
  const mode = isReviewMode ? "review" : "testing";

  return (
    <footer className={cn(navVariants({ mode }))}>
      {/* Nút QUAY LẠI (Back Button) */}
      <button
        onClick={onPrev}
        disabled={currentIndex === 0}
        className="flex items-center gap-1 lg:gap-2 px-3 lg:px-5 py-2.5 rounded-xl text-sm font-bold text-slate-400 hover:bg-emerald-50 hover:text-emerald-600 disabled:opacity-30 disabled:hover:bg-transparent transition-all active:scale-95"
      >
        <ChevronLeft size={18} />
        <span className="hidden xs:inline">Quay lại</span>
      </button>

      {/* Thanh Tiến Độ (Progress Bar) */}
      <div className="flex-1 max-w-md mx-4 lg:mx-8 h-1.5 bg-slate-100 rounded-full overflow-hidden relative">
        <motion.div
          className={cn(
            "h-full rounded-full relative",
            isReviewMode ? "bg-amber-400" : "bg-emerald-500",
          )}
          initial={false} // Không chạy animation lại từ 0 khi render lần đầu
          animate={{ width: `${progress}%` }}
          transition={{ ease: "easeInOut", duration: 0.3 }}
        >
          {/* Hiệu ứng bóng sáng trên thanh tiến độ (Glow effect) */}
          <div className="absolute top-0 right-0 bottom-0 w-10 bg-gradient-to-r from-transparent to-white/30" />
        </motion.div>
      </div>

      {/* Nút TIẾP THEO (Next Button) */}
      <button
        onClick={onNext}
        disabled={currentIndex === total - 1}
        // className={cn(nextButtonVariants({ isReview: isReviewMode }))}
        className="flex items-center gap-1 lg:gap-2 px-3 lg:px-5 py-2.5 rounded-xl text-sm font-bold text-slate-400 hover:bg-emerald-50 hover:text-emerald-600 disabled:opacity-30 disabled:hover:bg-transparent transition-all active:scale-95"
      >
        <span className="hidden xs:inline">Tiếp theo</span>
        <ChevronRight size={18} />
      </button>
    </footer>
  );
};
