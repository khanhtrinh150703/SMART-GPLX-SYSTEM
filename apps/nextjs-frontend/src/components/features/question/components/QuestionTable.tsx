"use client";

import React, { useMemo } from "react";
import { GenericTable } from "@/components/common/Generic-Table/GenericTable";
import { cn } from "@/lib/utils/utils";
import { Question } from "../types/question.types";
import { getQuestionColumns } from "./question-colums";

/**
 * QuestionTableProps: Định nghĩa các thuộc tính cho bảng câu hỏi
 * (Props definition for the question management table)
 */
interface QuestionTableProps {
  questions: Question[];      // Danh sách câu hỏi (List of questions)
  isLoading: boolean;         // Trạng thái đang tải (Loading state)
  page: number;               // Trang hiện tại để tính STT (Current page for Ordinal Number)
  limit: number;              // Số lượng bản ghi mỗi trang (Records per page)
  onEdit: (question: Question) => void;    // Hàm xử lý chỉnh sửa (Edit handler)
  onDelete: (question: Question) => void;  // Hàm xử lý xóa (Delete handler)
  onRestore: (question: Question) => void; // Hàm xử lý khôi phục (Restore handler)
  
  // Cấu hình sắp xếp (Sorting configuration)
  sortConfig?: { 
    key: keyof Question; 
    direction: "asc" | "desc" | null 
  };
  onSort?: (key: keyof Question) => void;
}

export const QuestionTable = ({
  questions,
  isLoading,
  page,
  limit,
  onEdit,
  onDelete,
  onRestore,
  sortConfig,
  onSort,
}: QuestionTableProps) => {

  /**
   * columns: Khởi tạo danh sách cột cho bảng
   * Sử dụng useMemo để tránh việc render lại không cần thiết khi dữ liệu không đổi
   * (Memoized columns to prevent unnecessary re-renders)
   */
  const columns = useMemo(
    () => getQuestionColumns(onEdit, onDelete, onRestore, page, limit),
    [onEdit, onDelete, onRestore, page, limit]
  );

  return (
    <div className={cn(
      "w-full rounded-[2.5rem] overflow-hidden border border-white/50 shadow-soft bg-white/40 backdrop-blur-md",
      "animate-in fade-in slide-in-from-bottom-4 duration-700"
    )}>
      <GenericTable<Question>
        columns={columns}
        data={questions}
        isLoading={isLoading}
        className="bg-transparent"
        sortConfig={sortConfig}
        onSort={onSort}
        onRowClick={onEdit} // Nhấn vào hàng để xem chi tiết/sửa
      />
    </div>
  );
};