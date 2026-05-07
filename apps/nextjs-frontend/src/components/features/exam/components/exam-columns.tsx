"use client";

import React from "react";
import {
  FileText,
  Timer,
  Target,
  User,
  ShieldAlert,
  Clock,
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
      <div className="flex flex-col gap-1 py-1">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-emerald-50 flex items-center justify-center shrink-0">
            <FileText size={14} className="text-emerald-600" />
          </div>
          <span className="font-bold text-slate-800 text-sm tracking-tight line-clamp-1">
            {item.name}
          </span>
        </div>
        <div className="flex items-center gap-2 ml-10 text-[10px] font-medium text-slate-400 italic">
          <span>{item.userName || "Admin"}</span>
          <span className="w-1 h-1 rounded-full bg-slate-200" />
          <span>
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
    header: "HẠNG",
    accessor: (item) => (
      <div className="flex justify-center">
        <div className="px-4 py-1.5 rounded-2xl bg-white shadow-soft border-none transition-all hover:shadow-md active:scale-95">
          <div className="flex items-center gap-1.5">
            {/* Một điểm nhấn nhỏ để nhận diện hạng bằng nhanh hơn */}
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
    header: "Thông số",
    accessor: (item) => (
      <div className="flex flex-col gap-2">
        {/* Hàng thông số kỹ thuật (Horizontal Metrics) */}
        <div className="flex items-center gap-3 text-slate-500">
          <div className="flex items-center gap-1" title="Tổng câu">
            <span className="text-[10px] font-bold">#</span>
            <span className="text-xs font-black text-slate-700">
              {item.totalQuestions}
            </span>
          </div>
          <div className="flex items-center gap-1" title="Thời gian">
            <Clock size={12} strokeWidth={2.5} />
            <span className="text-xs font-black text-slate-700">
              {item.durationMinutes}
            </span>
          </div>
          <div className="flex items-center gap-1" title="Điểm đạt">
            <Target size={12} strokeWidth={2.5} className="text-emerald-500" />
            <span className="text-xs font-black text-emerald-600">
              {item.passingScore}đ
            </span>
          </div>
        </div>

        {/* CÂU ĐIỂM LIỆT: Dùng dạng "Compact Danger Badge" */}
        <div className="flex items-center">
          <div className="flex items-center gap-1.5 px-2 py-1 rounded-md bg-rose-50 border border-rose-100 group">
            <ShieldAlert
              size={10}
              strokeWidth={3}
              className="text-rose-500 animate-pulse"
            />
            <span className="text-[9px] font-black text-rose-600 uppercase tracking-tight">
              {item.minCriticalQuestions} CÂU LIỆT • STRICT
            </span>
          </div>
        </div>
      </div>
    ),
    className: "w-52",
  },

  TableColumnFactory.status<IExamResponse>(),
  TableColumnFactory.actions<IExamResponse>(onView, onDelete, onRestore),
];
