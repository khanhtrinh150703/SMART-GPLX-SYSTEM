"use client";

import React, { useMemo } from "react";
import { GenericTable } from "@/components/common/Generic-Table/GenericTable";
import { cn } from "@/lib/utils/utils";
import { IExamMatrixResponse } from "../types/exam-management"; // Sử dụng đúng Interface Ma trận
import { getExamMatrixColumns } from "./exam-matrix-columns";

/**
 * ExamMatrixTableProps: Định nghĩa các thuộc tính cho bảng quản lý Ma trận đề thi.
 * (Props definition for the exam matrix management table).
 */
interface ExamMatrixTableProps {
  matrices: IExamMatrixResponse[]; // Danh sách ma trận (List of matrices)
  isLoading: boolean;              // Trạng thái đang tải (Loading state)
  page: number;                    // Trang hiện tại (Current page)
  limit: number;                   // Số lượng bản ghi/trang (Records per page)
  onEdit: (matrix: IExamMatrixResponse) => void;    // Hàm sửa (Edit handler)
  onDelete: (matrix: IExamMatrixResponse) => void;  // Hàm xóa (Delete handler)
  onRestore: (matrix: IExamMatrixResponse) => void; // Hàm khôi phục (Restore handler)
  
  // Cấu hình sắp xếp (Sorting configuration)
  sortConfig?: { 
    key: keyof IExamMatrixResponse; 
    direction: "asc" | "desc" | null 
  };
  onSort?: (key: keyof IExamMatrixResponse) => void;
}

export const ExamMatrixTable = ({
  matrices,
  isLoading,
  page,
  limit,
  onEdit,
  onDelete,
  onRestore,
  sortConfig,
  onSort,
}: ExamMatrixTableProps) => {

  /**
   * columns: Khởi tạo danh sách cột cho bảng Ma trận.
   * Sử dụng useMemo để tối ưu hiệu năng render.
   * (Memoized columns for performance optimization).
   */
  const columns = useMemo(
    () => getExamMatrixColumns(onEdit, onDelete, onRestore, page, limit),
    [onEdit, onDelete, onRestore, page, limit]
  );

  return (
    
    <div className={cn(
      // Emerald Design: Bo góc 3xl, hiệu ứng Glassmorphism (Kính mờ) và đổ bóng mịn.
      "w-full rounded-[3rem] overflow-hidden border border-white/60 shadow-soft bg-white/50 backdrop-blur-xl",
      "animate-in fade-in slide-in-from-bottom-6 duration-1000 ease-out",
      "ring-1 ring-black/[0.03]"
    )}>
      <GenericTable<IExamMatrixResponse>
        columns={columns}
        data={matrices}
        isLoading={isLoading}
        className="bg-transparent"
        sortConfig={sortConfig}
        onSort={onSort}
        // Cho phép nhấn vào hàng để mở chế độ chỉnh sửa (Edit mode).
        onRowClick={onEdit} 
        // Style cho từng dòng để tạo cảm giác chuyên nghiệp.
        // rowClassName="hover:bg-emerald-50/50 transition-colors cursor-pointer group"
      />

      {/* Trạng thái trống (Empty State) */}
      {!isLoading && matrices.length === 0 && (
        <div className="py-24 flex flex-col items-center justify-center text-slate-400">
          <p className="text-xs font-black uppercase tracking-[0.3em] opacity-40">
            Không tìm thấy cấu hình ma trận nào
          </p>
        </div>
      )}
    </div>
  );
};