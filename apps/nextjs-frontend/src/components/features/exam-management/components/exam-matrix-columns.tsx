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
    accessor: (item) => (
      <div className="flex flex-col gap-1 max-w-[300px]">
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded-xl bg-emerald-50 shrink-0">
            <Layers size={14} className="text-emerald-600" />
          </div>
          <span className="font-bold text-slate-900 text-sm leading-tight line-clamp-1">
            {item.name}
          </span>
        </div>
        <span className="text-[10px] text-slate-400 font-medium ml-8 uppercase tracking-wider">
          ID: {item.id.slice(0, 8)}...
        </span>
      </div>
    ),
  },

  // 3. Cột Quy chuẩn đề (Core Metrics) - Đã cập nhật số câu điểm liệt
  {
    header: "Quy chuẩn đề",
    accessor: (item) => (
      <div className="grid grid-cols-2 gap-y-2 gap-x-4">
        {/* Tổng số câu (Total Questions) */}
        <div className="flex items-center gap-1.5" title="Tổng số câu hỏi">
          <ClipboardList size={12} className="text-slate-400" />
          <span className="text-xs font-bold text-slate-700">
            {item.totalQuestions} câu
          </span>
        </div>

        {/* Thời gian (Duration) */}
        <div className="flex items-center gap-1.5" title="Thời gian làm bài">
          <Timer size={12} className="text-slate-400" />
          <span className="text-xs font-bold text-slate-700">
            {item.durationMinutes}p
          </span>
        </div>

        {/* Điểm đạt (Passing Score) */}
        <div className="flex items-center gap-1.5" title="Yêu cầu điểm đạt">
          <Target size={12} className="text-amber-500" />
          <span className="text-xs font-black text-amber-600">
            {item.passingScore}đ
          </span>
        </div>

        {/* CẬP NHẬT: Câu điểm liệt (Critical requirement) */}
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
    className: "w-60", // Tăng nhẹ độ rộng để hiển thị đủ chữ
  },

  // 4. Cột Phân bổ chương (Chapter Distribution Summary)
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

  // 5. Cột Trạng thái
  TableColumnFactory.status<IExamMatrixResponse>(),

  // 6. Cột Thao tác
  TableColumnFactory.actions<IExamMatrixResponse>(onEdit, onDelete, onRestore),
];
