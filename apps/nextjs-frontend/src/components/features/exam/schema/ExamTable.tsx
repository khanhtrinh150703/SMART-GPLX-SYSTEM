"use client";

import React, { useMemo } from "react";
import { GenericTable } from "@/components/common/Generic-Table/GenericTable";
import { cn } from "@/lib/utils/utils";
import { IExamResponse } from "../types/exam-generation"; // Sử dụng Interface Đề thi (Exam Interface)
import { getExamColumns } from "./exam-columns"; // Hook/Function lấy cột cho Đề thi

/**
 * ExamTableProps: Định nghĩa các thuộc tính cho bảng quản lý danh sách Đề thi.
 * (Props definition for the exam management table).
 */
interface ExamTableProps {
  exams: IExamResponse[];           // Danh sách bài thi (List of exams)
  isLoading: boolean;               // Trạng thái đang tải (Loading state)
  page: number;                     // Trang hiện tại (Current page)
  limit: number;                    // Số lượng bản ghi/trang (Records per page)
  onView: (exam: IExamResponse) => void;    // Xem chi tiết/kết quả (View detail handler)
  onDelete: (exam: IExamResponse) => void;  // Xóa bài thi (Delete handler)
  onRestore: (exam: IExamResponse) => void; // Khôi phục bài thi (Restore handler)
  
  // Cấu hình sắp xếp (Sorting configuration)
  sortConfig?: { 
    key: keyof IExamResponse; 
    direction: "asc" | "desc" | null 
  };
  onSort?: (key: keyof IExamResponse) => void;
}

export const ExamTable = ({
  exams,
  isLoading,
  page,
  limit,
  onView,
  onDelete,
  onRestore,
  sortConfig,
  onSort,
}: ExamTableProps) => {

  /**
   * columns: Khởi tạo danh sách cột cho bảng Đề thi.
   * Sử dụng useMemo để tối ưu hiệu năng render khi dependencies không đổi.
   * (Memoized columns for performance optimization).
   */
  const columns = useMemo(
    () => getExamColumns(onView, onDelete, onRestore, page, limit),
    [onView, onDelete, onRestore, page, limit]
  );

  return (
    <div className={cn(
      // Emerald Design: Bo góc 3xl (rounded-[3rem]), hiệu ứng Kính mờ (Glassmorphism) và đổ bóng mịn (shadow-soft).
      "w-full rounded-[3rem] overflow-hidden border border-white/60 shadow-soft bg-white/50 backdrop-blur-xl",
      "animate-in fade-in slide-in-from-bottom-6 duration-1000 ease-out",
      "ring-1 ring-black/[0.03]"
    )}>
      <GenericTable<IExamResponse>
        columns={columns}
        data={exams}
        isLoading={isLoading}
        className="bg-transparent"
        sortConfig={sortConfig}
        onSort={onSort}
        // Cho phép nhấn vào hàng để xem bài thi hoặc kết quả (Allow row click to view).
        onRowClick={onView} 
      />

      {/* Trạng thái trống (Empty State) - Hiển thị khi không có dữ liệu */}
      {!isLoading && exams.length === 0 && (
        <div className="py-24 flex flex-col items-center justify-center text-slate-400">
          <div className="mb-4 p-4 bg-slate-50 rounded-full opacity-50">
            {/* Có thể thêm Icon trống tại đây */}
          </div>
          <p className="text-xs font-black uppercase tracking-[0.3em] opacity-40">
            Chưa có đề thi nào được khởi tạo
          </p>
        </div>
      )}
    </div>
  );
};