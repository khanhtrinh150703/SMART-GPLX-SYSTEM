"use client";

import { cn, formatDurationSeconds } from "@/lib/utils/utils";
import { IUserStatistics } from "../../types/stats.types";

export const StatsOverview = ({
  stats,
  isLoading,
}: {
  stats?: IUserStatistics | null;
  isLoading: boolean;
}) => {
  if (isLoading || !stats) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5 h-full">
        {[...Array(4)].map((_, i) => (
          <div
            key={i}
            className={cn(
              "bg-slate-100 animate-pulse rounded-[1.5rem]",
              i === 0 ? "col-span-1 md:col-span-2 h-32" : "h-28",
            )}
          />
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-5 h-full">
      {/* 1. THẺ TỈ LỆ ĐẠT (Pass Rate) - Điểm nhấn Emerald */}
      <div className="md:col-span-2 p-6 rounded-[1.5rem] border border-emerald-100 border-l-[6px] border-l-emerald-500 bg-gradient-to-r from-emerald-50/60 to-white shadow-sm flex flex-col justify-between group transition-shadow hover:shadow-md">
        <div className="flex justify-between items-start">
          <div>
            <p className="text-[11px] font-black text-emerald-800/60 uppercase tracking-[0.15em] mb-1">
              Tỉ lệ đạt
            </p>
            <div className="flex items-baseline gap-3">
              <span className="text-6xl font-black text-slate-900 tracking-tight">
                {stats.passRate}%
              </span>
              <span className="text-sm font-bold text-emerald-700 bg-white/60 px-3 py-1 rounded-full border border-emerald-100">
                {stats.passedExams} / {stats.totalExams} bài đạt
              </span>
            </div>
          </div>

          <div className="text-right">
            <p className="text-[10px] font-bold text-slate-400 uppercase mb-1 tracking-wider">
              Tổng câu hỏi tiếp cận
            </p>
            <p className="text-2xl font-black text-emerald-600">
              {stats.totalQuestionsAnswered.toLocaleString()}
            </p>
          </div>
        </div>

        {/* Thanh Progress Bar tạo điểm nhấn */}
        <div className="mt-5 w-full h-2 bg-white/60 rounded-full overflow-hidden border border-emerald-100/50">
          <div
            className="h-full bg-emerald-500 rounded-full"
            style={{ width: `${stats.passRate}%` }}
          />
        </div>
      </div>

      {/* 2. THẺ ĐIỂM SỐ & ĐIỂM LIỆT (Scores & Critical) - Điểm nhấn Sky/Rose */}
      <div
        className={cn(
          "p-6 rounded-[1.5rem] border border-l-[6px] shadow-sm flex flex-col justify-between transition-all hover:shadow-md",
          stats.failedByCritical > 0
            ? "border-rose-200 border-l-rose-500 bg-gradient-to-r from-rose-50/60 to-white"
            : "border-sky-100 border-l-sky-500 bg-gradient-to-r from-sky-50/60 to-white",
        )}
      >
        <p className="text-[11px] font-black uppercase tracking-[0.15em] mb-3 text-slate-500">
          Điểm số
        </p>

        <div className="flex justify-between items-end mb-4">
          <div>
            <p className="text-[10px] font-bold text-slate-400 uppercase">
              Trung bình (Thang 10)
            </p>
            <p className="text-4xl font-black text-slate-900">
              {stats.averageScore.toFixed(1)}
              <span className="text-lg text-slate-400 font-medium ml-1">
                /10
              </span>
            </p>
          </div>

          <div className="text-right">
            <p className="text-[10px] font-bold text-slate-400 uppercase">
              Trượt điểm liệt
            </p>
            <p
              className={cn(
                "text-2xl font-black",
                stats.failedByCritical > 0 ? "text-rose-600" : "text-slate-700",
              )}
            >
              {stats.failedByCritical}{" "}
              <span className="text-sm font-medium text-slate-500">lần</span>
            </p>
          </div>
        </div>

        {/* Thanh tiến trình (Progress Bar) */}
        <div className="space-y-1.5">
          <div className="flex justify-between items-center text-[10px] font-bold uppercase text-slate-400">
            <span>Tiến độ mục tiêu</span>
            <span>{(stats.averageScore * 10).toFixed(0)}%</span>
          </div>
          <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
            <div
              className={cn(
                "h-full transition-all duration-1000 ease-out rounded-full",
                stats.averageScore >= 8 ? "bg-emerald-500" : "bg-sky-500",
              )}
              style={{ width: `${(stats.averageScore / 10) * 100}%` }}
            />
          </div>
        </div>
      </div>

      {/* 3. THẺ NHỊP ĐỘ (Pace) - Điểm nhấn Violet */}
      <div className="p-6 rounded-[1.5rem] border border-violet-100 border-l-[6px] border-l-violet-500 bg-gradient-to-r from-violet-50/60 to-white shadow-sm flex flex-col justify-between transition-shadow hover:shadow-md">
        <p className="text-[11px] font-black text-violet-800/60 uppercase tracking-[0.15em] mb-3">
          Nhịp độ làm bài
        </p>
        <div className="flex justify-between items-end">
          <div>
            <p className="text-[10px] font-bold text-slate-400 uppercase">
              Trung bình
            </p>
            <p className="text-2xl font-black text-slate-900">
              {formatDurationSeconds(stats.averageDuration)}
            </p>
          </div>
          <div className="text-right">
            <p className="text-[10px] font-bold text-slate-400 uppercase">
              Nhanh nhất
            </p>
            <p className="text-2xl font-black text-violet-600">
              {formatDurationSeconds(stats.fastestDuration)}
            </p>
          </div>
        </div>
      </div>

      {/* 4. THẺ KỶ LỤC CHUỖI (Streak) - Điểm nhấn Amber (Nằm ngang dài mỏng ở dưới cùng) */}
      <div className="md:col-span-2 p-5 rounded-[1.5rem] border border-amber-100 border-l-[6px] border-l-amber-500 bg-gradient-to-r from-amber-50/60 to-white shadow-sm flex flex-col sm:flex-row items-center justify-between gap-4 transition-all hover:shadow-md">
        {/* Phần 1: Chuỗi hiện tại (Bên trái) */}
        <div className="flex items-center gap-4 w-full sm:w-auto">
          <div
            className={cn(
              "w-12 h-12 bg-white rounded-full shadow-sm flex items-center justify-center text-2xl border transition-all",
              stats.currentStreak > 0
                ? "border-orange-200 animate-pulse"
                : "border-slate-200 grayscale opacity-50",
            )}
          >
            🔥
          </div>
          <div>
            <p className="text-[11px] font-black text-amber-800/60 uppercase tracking-[0.15em]">
              Chuỗi hiện tại
            </p>
            <div className="flex items-baseline gap-2">
              <span className="text-3xl font-black text-slate-900">
                {stats.currentStreak}
              </span>
              <span className="text-xs font-bold text-slate-500 uppercase">
                Ngày
              </span>
            </div>
          </div>
        </div>

        {/* Đường phân cách (chỉ hiện trên màn hình to) */}
        <div className="hidden sm:block h-10 w-px bg-amber-200/50"></div>

        {/* Phần 2: Kỷ lục chuỗi (Bên phải) */}
        <div className="flex items-center gap-4 w-full sm:w-auto">
          <div>
            <p className="text-[11px] font-black text-amber-800/60 uppercase tracking-[0.15em] sm:text-right">
              Kỷ lục chuỗi
            </p>
            <div className="flex items-baseline gap-2 sm:justify-end">
              <span className="text-3xl font-black text-slate-900">
                {stats.maxStreak}
              </span>
              <span className="text-xs font-bold text-slate-500 uppercase">
                Ngày
              </span>
            </div>
          </div>
          <div className="w-12 h-12 bg-white rounded-full shadow-sm flex items-center justify-center text-2xl border border-amber-100">
            👑
          </div>
        </div>

        {/* Nếu có tên bài thi nhanh nhất thì hiện ở đây cho đỡ trống */}
        {stats.fastestExamName && (
          <div className="hidden sm:block text-right">
            <p className="text-[10px] font-bold text-slate-400 uppercase">
              Bản ghi nhanh nhất
            </p>
            <p className="text-sm font-bold text-slate-700 max-w-[200px] truncate">
              {stats.fastestExamName}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};
