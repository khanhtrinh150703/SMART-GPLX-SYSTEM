"use client";

import {
  Layers,
  Timer,
  Target,
  ClipboardList,
  ShieldCheck,
} from "lucide-react";
import { TableColumn } from "@/components/common/Generic-Table/GenericTable";
import { TableColumnFactory } from "@/components/common/Generic-Table/table-column.factory";
import { cn } from "@/lib/utils/utils";
import { IExamMatrixResponse } from "../types/exam-management";
import { format } from "date-fns";

/**
 * getExamMatrixColumns: Định nghĩa các cột cho bảng quản lý Ma trận.
 * (Defining columns for the Exam Matrix management table).
 */
export const getExamMatrixColumns = (
  onEdit: (item: IExamMatrixResponse) => void,
  onDelete: (item: IExamMatrixResponse) => void,
  onRestore: (item: IExamMatrixResponse) => void,
  page: number,
  limit: number,
): TableColumn<IExamMatrixResponse>[] => [
  // 1. Cột Số thứ tự (Ordinal Number)
  TableColumnFactory.stt<IExamMatrixResponse>(page, limit),

  // 2. Cột Thông tin chính (Primary Information)
  {
    header: "Cấu hình Ma trận",
    sortable: true,
    sortKey: "name",
    accessor: (item: IExamMatrixResponse) => (
      <div className="flex items-start gap-3 py-1 group">
        <div className="mt-0.5 p-1.5 rounded-lg bg-emerald-50 text-emerald-600 shrink-0 transition-colors group-hover:bg-emerald-100">
          <Layers size={14} strokeWidth={2.5} />
        </div>

        <div className="flex flex-col min-w-0 leading-none">
          <div className="flex items-center gap-2">
            <span
              className={cn(
                "text-sm font-bold truncate transition-colors",
                item.isDefault
                  ? "text-emerald-700"
                  : "text-slate-900 group-hover:text-emerald-600",
              )}
            >
              {item.name}
            </span>
            {item.isDefault && (
              <div
                className="w-1.5 h-1.5 rounded-full bg-emerald-500 shadow-[0_0_6px_rgba(16,185,129,0.4)] shrink-0"
                title="Mặc định"
              />
            )}
          </div>

          <div className="flex items-center gap-1.5 mt-1.5">
            <span className="text-[10px] font-black uppercase tracking-wider text-slate-400">
              Ngày tạo:
            </span>
            <span className="text-[11px] font-medium text-slate-500 uppercase tracking-tight">
              {item.createdAt
                ? format(new Date(item.createdAt), "dd/MM/yyyy")
                : "N/A"}
            </span>
          </div>
        </div>
      </div>
    ),
  },

  // 3. CỘT MỚI: Hạng bằng (License Category Column)
  {
    header: "Hạng bằng",
    sortable: true,
    sortKey: "licenseCategoryName",
    accessor: (item: IExamMatrixResponse) => (
      <div className="flex justify-center">
        <div className="px-4 py-1.5 rounded-2xl bg-white shadow-soft border-none transition-all hover:shadow-md active:scale-95">
          <div className="flex items-center gap-1.5">
            <div className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
            <span className="text-[10px] font-black text-slate-800 uppercase tracking-widest">
              {item.licenseCategoryName}
            </span>
          </div>
        </div>
      </div>
    ),
    className: "w-40",
  },

  // 4. Cột Quy chuẩn đề (Core Metrics)
  {
    header: "Quy chuẩn đề",
    accessor: (item) => (
      <div className="grid grid-cols-2 gap-y-2 gap-x-4">
        <div className="flex items-center gap-1.5" title="Tổng số câu hỏi">
          <ClipboardList size={12} className="text-slate-400" />
          <span className="text-xs font-bold text-slate-700">
            {item.totalQuestions} câu
          </span>
        </div>

        <div className="flex items-center gap-1.5" title="Thời gian làm bài">
          <Timer size={12} className="text-slate-400" />
          <span className="text-xs font-bold text-slate-700">
            {item.durationMinutes}p
          </span>
        </div>

        <div className="flex items-center gap-1.5" title="Yêu cầu điểm đạt">
          <Target size={12} className="text-amber-500" />
          <span className="text-xs font-black text-amber-600">
            {item.passingScore}đ
          </span>
        </div>

        <div
          className="flex items-center gap-1.5"
          title="Số lượng câu điểm liệt"
        >
          <ShieldCheck size={12} className="text-rose-500" />
          <span className="text-xs font-bold text-rose-600">
            {item.minCriticalQuestions} câu liệt
          </span>
        </div>
      </div>
    ),
    className: "w-60",
  },

  // 5. Cột Phân bổ chương (Chapter Distribution Summary)
  {
    header: "Cấu trúc",
    sortable: true,
    sortKey: "details",
    accessor: (item) => {
      const detailCount = item.details?.length || 0;
      return (
        <div className="flex flex-col gap-1">
          <span className="text-xs font-bold text-slate-700">
            {detailCount} Nhóm nội dung
          </span>
          <div className="flex gap-0.5 w-24 h-1.5 rounded-full bg-slate-100 overflow-hidden">
            {item.details?.map((detail, idx) => (
              <div
                key={idx}
                style={{ width: `${detail.percentage}%` }}
                className={cn(
                  "h-full transition-all",
                  idx % 2 === 0 ? "bg-emerald-500" : "bg-emerald-300",
                )}
              />
            ))}
          </div>
        </div>
      );
    },
    className: "w-40",
  },

  // 6. Cột Trạng thái
  TableColumnFactory.status<IExamMatrixResponse>(),

  // 7. Cột Thao tác
  TableColumnFactory.actions<IExamMatrixResponse>(onEdit, onDelete, onRestore),
];
