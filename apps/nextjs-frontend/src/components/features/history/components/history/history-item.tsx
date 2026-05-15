// src/features/history/components/history-item.tsx

import { cn, formatDurationSeconds } from "@/lib/utils/utils";
import { IExamHistorySummary } from "../../types/history.types";
import { format } from "date-fns";
import { vi } from "date-fns/locale";

interface HistoryItemProps {
  data: IExamHistorySummary;
  onSelect: (id: string) => void;
}

export const HistoryItem = ({ data, onSelect }: HistoryItemProps) => {
  const {
    snapshotId,
    examName,
    score,
    totalQuestions,
    isPassed,
    createdAt,
    durationSeconds,
    licenseCategoryName, // Hạng bằng
  } = data;

  const handleItemClick = () => {
    const targetId = snapshotId;
    if (targetId && typeof onSelect === "function") {
      onSelect(targetId);
    }
  };

  const dateObj = createdAt ? new Date(createdAt) : null;
  const isValidDate = dateObj instanceof Date && !isNaN(dateObj.getTime());

  return (
    <div
      onClick={handleItemClick}
      className={cn(
        // Trả lại form dáng gọn gàng, không nhồi nhét padding to
        "group relative flex flex-col justify-between p-6 rounded-[1.5rem] bg-white border border-slate-100 shadow-sm transition-all duration-300 cursor-pointer hover:-translate-y-1 hover:shadow-md active:scale-[0.98]",
        isPassed ? "hover:border-emerald-300" : "hover:border-rose-300",
      )}
    >
      {/* NỬA TRÊN: Tên Đề & Thời gian + HẠNG BẰNG */}
      <div className="flex justify-between items-start gap-4 mb-6">
        <div className="flex-1">
          <h4
            className={cn(
              "font-bold text-slate-900 text-lg leading-tight line-clamp-2 transition-colors",
              isPassed
                ? "group-hover:text-emerald-700"
                : "group-hover:text-rose-700",
            )}
          >
            {examName}
          </h4>
          <p className="text-xs text-slate-400 font-medium mt-1">
            {isValidDate
              ? format(dateObj, "dd MMM, yyyy • HH:mm", { locale: vi })
              : "Thời gian không rõ"}
          </p>
        </div>

        {/* Tag Hạng Bằng: Thiết kế chìm, dịu mắt, không lóa */}
        {licenseCategoryName && (
          <div className="shrink-0 flex items-center justify-center px-3 py-1 bg-slate-100/80 rounded-lg border border-slate-200/50">
            <span className="text-[11px] font-black uppercase tracking-widest text-slate-500">
              {licenseCategoryName}
            </span>
          </div>
        )}
      </div>

      {/* NỬA DƯỚI: Thống kê & Trạng thái */}
      <div className="flex items-end justify-between pt-4 border-t border-slate-50">
        <div className="flex gap-6">
          {/* Điểm số */}
          <div className="flex flex-col">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">
              Điểm số
            </span>
            <div className="flex items-baseline gap-1">
              <span className="text-2xl font-black text-slate-800 transition-colors duration-300 group-hover:text-slate-950">
                {score}
              </span>
              <span className="text-sm font-bold text-slate-400">
                /{totalQuestions}
              </span>
            </div>
          </div>

          {/* Thời gian */}
          <div className="flex flex-col">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">
              Thời gian
            </span>
            <span className="text-xl font-bold text-slate-700 transition-colors duration-300 group-hover:text-slate-900">
              {formatDurationSeconds(durationSeconds)}
            </span>
          </div>
        </div>

        {/* Huy hiệu Trạng thái: Trả lại hiệu ứng tĩnh, không glow lóa mắt */}
        <div
          className={cn(
            "px-4 py-1.5 rounded-xl text-[11px] font-black uppercase tracking-widest transition-all duration-300",
            isPassed
              ? "bg-emerald-50 text-emerald-600 group-hover:bg-emerald-500 group-hover:text-white group-hover:shadow-sm"
              : "bg-rose-50 text-rose-600 group-hover:bg-rose-500 group-hover:text-white group-hover:shadow-sm",
          )}
        >
          {isPassed ? "Đạt" : "Trượt"}
        </div>
      </div>
    </div>
  );
};
