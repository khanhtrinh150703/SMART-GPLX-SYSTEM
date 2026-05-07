"use client";

import { Maximize, Minimize } from "lucide-react";
import { headerVariants, indicatorVariants } from "./exam-header.variants";
import { cn } from "@/lib/utils/utils";

interface ExamHeaderProps {
  title: string;
  licenseCategoryName?: string; // Hạng giấy phép lái xe (e.g., A1, B2)
  currentIndex: number;         // Chỉ số câu hỏi hiện tại (Current question index)
  total: number;                // Tổng số câu hỏi (Total questions)
  isReviewMode: boolean;        // Chế độ xem lại (Review mode)
  isFullscreen: boolean;        // Trạng thái toàn màn hình (Fullscreen state)
  onToggleFullscreen: () => void; // Hàm chuyển đổi toàn màn hình (Toggle function)
}

/**
 * ExamHeader: Thành phần đầu trang hiển thị thông tin bài thi
 * Tuân thủ: Type-Safety (Không any), Responsive, và Clean Architecture.
 */
export const ExamHeader = ({
  title,
  licenseCategoryName,
  currentIndex,
  total,
  isReviewMode,
  isFullscreen,
  onToggleFullscreen,
}: ExamHeaderProps) => {
  // Xác định mode hiện tại để áp dụng variant (Testing or Review)
  const mode = isReviewMode ? "review" : "testing";

  return (
    <header className={cn(headerVariants({ mode }))}>
      {/* Left: Info Section (Thông tin tiêu đề) */}
      <div className="flex items-center gap-2 lg:gap-3 min-w-0">
        <div className="relative flex items-center justify-center w-3 h-3 shrink-0">
          {!isReviewMode && (
            <span className="absolute inline-flex w-full h-full rounded-full bg-emerald-400 opacity-75 animate-ping" />
          )}
          <span
            className={cn(
              "relative inline-flex w-2 h-2 rounded-full",
              isReviewMode ? "bg-amber-500" : "bg-emerald-500"
            )}
          />
        </div>
        
        <span className="text-[11px] lg:text-sm font-bold text-slate-500 tracking-wide uppercase truncate">
          {isReviewMode 
            ? `Xem lại: ${title}` 
            : (
              <>
                <span className="hidden sm:inline">Hạng </span>
                {licenseCategoryName} • {title}
              </>
            )
          }
        </span>
      </div>

      {/* Right: Actions Section (Số câu hỏi & Thao tác) */}
      <div className="flex items-center gap-2 lg:gap-3 shrink-0">
        {/* Số câu hỏi (Question Indicator) */}
        <span className={cn(indicatorVariants({ mode }))}>
          <span className="hidden xs:inline">Câu </span>
          {currentIndex + 1} / {total}
        </span>
        
        {/* Fullscreen Button */}
        <button
          onClick={onToggleFullscreen}
          className="w-8 h-8 lg:w-9 lg:h-9 flex items-center justify-center rounded-full text-slate-400 hover:bg-slate-100 transition-colors group"
          title={isFullscreen ? "Thu nhỏ" : "Toàn màn hình"}
        >
          {isFullscreen 
            ? <Minimize size={16} className="group-hover:text-emerald-500" /> 
            : <Maximize size={16} className="group-hover:text-emerald-500" />
          }
        </button>
      </div>
    </header>
  );
};