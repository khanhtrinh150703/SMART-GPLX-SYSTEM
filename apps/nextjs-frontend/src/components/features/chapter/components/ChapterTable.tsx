"use client";

import React, { useMemo } from "react";
import { GenericTable } from "@/components/common/Generic-Table/GenericTable";
import { getChapterColumns } from "@/components/features/chapter/components/chapter-columns";
import { Chapter } from "@/components/features/chapter/components/chapter.config";

interface ChapterTableProps {
  chapters: Chapter[];
  isLoading: boolean;
  onEdit: (chapter: Chapter) => void;
  onDelete: (chapter: Chapter) => void;
  onRestore: (chapter: Chapter) => void; // Thêm hành động khôi phục
}

export const ChapterTable = ({ chapters, isLoading, onEdit, onDelete, onRestore }: ChapterTableProps) => {
  // Memoize columns để tối ưu hiệu suất
  const columns = useMemo(
    () => getChapterColumns(onEdit, onDelete, onRestore),
    [onEdit, onDelete, onRestore]
  );

  return (
    <GenericTable<Chapter>
      columns={columns}
      data={chapters}
      isLoading={isLoading}
      className="bg-transparent"
    />
  );
};