"use client";

import {
  FileText,
  Timer,
  Target,
  User,
  ShieldCheck,
  CalendarDays,
  Award,
} from "lucide-react";
import { TableColumn } from "@/components/common/Generic-Table/GenericTable";
import { TableColumnFactory } from "@/components/common/Generic-Table/table-column.factory";
import { cn } from "@/lib/utils/utils";
import { IExamResponse } from "../types/exam-generation";
import { format } from "date-fns";

/**
 * getExamColumns: Định nghĩa các cột cho bảng quản lý danh sách Đề thi.
 * (Defining columns for the Exam management table).
 */
export const getExamColumns = (
  onView: (item: IExamResponse) => void,
  onDelete: (item: IExamResponse) => void,
  onRestore: (item: IExamResponse) => void,
  page: number,
  limit: number,
): TableColumn<IExamResponse>[] => [
  // 1. Cột Số thứ tự (Ordinal Number)
  TableColumnFactory.stt<IExamResponse>(page, limit),

  // 2. Cột Thông tin Đề thi & Người tạo (Exam & Author Information)
  {
    header: "Thông tin Đề thi",
    sortable: true,
    sortKey: "name",
    accessor: (item) => (
      <div className="flex flex-col gap-1.5 max-w-[280px]">
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded-xl bg-emerald-50 shrink-0">
            <FileText size={14} className="text-emerald-600" />
          </div>
          <span className="font-bold text-slate-900 text-sm leading-tight line-clamp-1">
            {item.name}
          </span>
        </div>
        <div className="flex flex-col gap-1 ml-8">
          <div className="flex items-center gap-1.5 text-slate-400">
            <User size={10} />
            <span className="text-[10px] font-bold">{item.userName || "N/A"}</span>
          </div>
          <div className="flex items-center gap-1.5 text-slate-400">
            <CalendarDays size={10} />
            <span className="text-[10px] font-bold uppercase tracking-wider">
              {item.startedAt ? format(new Date(item.startedAt), "dd/MM/yyyy HH:mm") : "N/A"}
            </span>
          </div>
        </div>
      </div>
    ),
  },

  // 3. Phân loại Hạng bằng (License Category)
  {
    header: "Hạng GPLX",
    accessor: (item) => (
      <div className="flex items-center gap-2">
        <div className="px-3 py-1 rounded-full bg-slate-100 border border-slate-200">
          <span className="text-[11px] font-black text-slate-600 uppercase tracking-tighter">
            {item.licenseCategoryName}
          </span>
        </div>
      </div>
    ),
    className: "w-32",
  },

  // 4. Thông số kỹ thuật (Technical Metrics)
  {
    header: "Thông số",
    accessor: (item) => (
      <div className="grid grid-cols-2 gap-y-2 gap-x-4">
        <div className="flex items-center gap-1.5" title="Tổng số câu">
          <FileText size={12} className="text-slate-400" />
          <span className="text-xs font-bold text-slate-700">{item.totalQuestions} câu</span>
        </div>
        <div className="flex items-center gap-1.5" title="Thời gian quy định">
          <Timer size={12} className="text-slate-400" />
          <span className="text-xs font-bold text-slate-700">{item.durationMinutes}p</span>
        </div>
        <div className="flex items-center gap-1.5" title="Yêu cầu đạt">
          <Target size={12} className="text-amber-500" />
          <span className="text-xs font-black text-amber-600">
            {/* Logic dựa trên luật 2024: Ví dụ B2 (35 câu) đạt 32, TESTT (45 câu) đạt 40 */}
            {item.totalQuestions >= 45 ? "40" : "32"}đ
          </span>
        </div>
        <div className="flex items-center gap-1.5 text-rose-500" title="Câu hỏi điểm liệt">
          <ShieldCheck size={12} />
          <span className="text-xs font-bold uppercase text-[9px]">Điểm liệt</span>
        </div>
      </div>
    ),
    className: "w-48",
  },

  // 5. Cột Trạng thái (Sử dụng Badge đồng bộ với IN_PROGRESS)
  TableColumnFactory.status<IExamResponse>(),

  // 6. Cột Thao tác
  TableColumnFactory.actions<IExamResponse>(onView, onDelete, onRestore),
];