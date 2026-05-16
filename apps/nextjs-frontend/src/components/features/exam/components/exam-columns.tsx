"use client";

import React from "react";
import {
  FileText,
  Target,
  ClipboardList,
  ShieldCheck,
  Timer,
} from "lucide-react";
import { TableColumn } from "@/components/common/Generic-Table/GenericTable";
import { TableColumnFactory } from "@/components/common/Generic-Table/table-column.factory";
import { format } from "date-fns";
import { IExamResponse } from "../types/exam.types";

export const getExamColumns = (
  onView: (item: IExamResponse) => void,
  onDelete: (item: IExamResponse) => void,
  onRestore: (item: IExamResponse) => void,
  page: number,
  limit: number,
): TableColumn<IExamResponse>[] => [
  TableColumnFactory.stt<IExamResponse>(page, limit),

  // 1. THÔNG TIN ĐỀ THI: Thu gọn metadata vào 1 dòng duy nhất
  {
    header: "Thông tin Đề thi",
    sortable: true,
    sortKey: "name",
    accessor: (item) => (
      <div className="flex flex-col gap-0.5 py-0.5">
        {" "}
        {/* Giảm gap và padding dọc */}
        <div className="flex items-center gap-2">
          {/* Thu nhỏ Icon Box xuống w-7 h-7 */}
          <div className="w-7 h-7 rounded-lg bg-emerald-50 flex items-center justify-center shrink-0">
            <FileText size={12} className="text-emerald-600" />{" "}
            {/* Giảm size icon xuống 12 */}
          </div>
          <span className="font-bold text-slate-800 text-sm tracking-tight line-clamp-1">
            {item.name}
          </span>
        </div>
        {/* Điều chỉnh ml-9 để thẳng hàng với text bên trên */}
        <div className="flex items-center gap-1.5 ml-9 text-[10px] font-medium text-slate-400 italic">
          <span className="truncate max-w-[80px]">
            {item.fullName || "Admin"}
          </span>
          <span className="w-1 h-1 rounded-full bg-slate-200 shrink-0" />
          <span className="shrink-0">
            {item.startedAt
              ? format(new Date(item.startedAt), "dd/MM/yyyy")
              : "N/A"}
          </span>
        </div>
      </div>
    ),
  },
  // 2. HẠNG GPLX: Dùng Border thay vì đổ màu nền đen kịt
  {
    header: "HẠNG BẰNG",
    sortable: true,
    sortKey: "licenseCategoryName",
    accessor: (item) => (
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
    className: "w-28",
  },

  // 3. CẤU TRÚC & CHỈ TIÊU: Gom về 1 cụm thống nhất, dùng Badge Danger tinh tế
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

  TableColumnFactory.status<IExamResponse>(),
  TableColumnFactory.actions<IExamResponse>(onView, onDelete, onRestore),
];
