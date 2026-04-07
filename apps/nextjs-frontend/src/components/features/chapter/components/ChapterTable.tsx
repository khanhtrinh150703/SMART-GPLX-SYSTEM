"use client";

import React, { useMemo } from "react";
import { GenericTable } from "@/components/common/Generic-Table/GenericTable";
import { getChapterColumns } from "@/components/features/chapter/components/chapter-columns";
import { Chapter } from "@/types/chapter.types";

/**
 * ChapterTableProps - Cập nhật Interface để TypeScript không "la"
 */
interface ChapterTableProps {
  chapters: Chapter[];
  isLoading: boolean;
  page: number;   // <-- 1. PHẢI CÓ TRONG INTERFACE
  limit: number;  // <-- 2. PHẢI CÓ TRONG INTERFACE
  onEdit: (chapter: Chapter) => void;
  onDelete: (chapter: Chapter) => void;
  onRestore: (chapter: Chapter) => void;
  sortConfig?: { key: keyof Chapter; direction: "asc" | "desc" | null };
  onSort?: (key: keyof Chapter) => void;
}

export const ChapterTable = ({
  chapters,
  isLoading,
  page,      // Nhận từ props
  limit,     // Nhận từ props
  onEdit,
  onDelete,
  onRestore,
  sortConfig,
  onSort,
}: ChapterTableProps) => {
  
  /**
   * Memoize columns: Truyền page và limit vào để tính STT
   */
  const columns = useMemo(
    // 3. TRUYỀN ĐỦ 5 THAM SỐ VÀO ĐÂY
    () => getChapterColumns(onEdit, onDelete, onRestore, page, limit),
    // 4. THÊM page, limit VÀO DEPENDENCIES để STT nhảy khi đổi trang
    [onEdit, onDelete, onRestore, page, limit], 
  );

  return (
    <GenericTable<Chapter>
      columns={columns}
      data={chapters}
      isLoading={isLoading}
      className="bg-transparent"
      sortConfig={sortConfig}
      onSort={onSort}
      onRowClick={onEdit}
    />
  );
};