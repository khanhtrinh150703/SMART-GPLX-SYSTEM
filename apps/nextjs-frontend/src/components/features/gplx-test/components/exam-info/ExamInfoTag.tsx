"use client";

import React from "react";
import { BookOpen, FileBadge } from "lucide-react";
import { cn } from "@/lib/utils/utils";
import { examTagVariants, type ExamTagVariantsProps } from "./ExamInfoTag.variants";

interface ExamInfoTagProps extends ExamTagVariantsProps {
  title: string; // Tên đề thi (Exam Title)
  category?: string; // Hạng bằng (License Category)
  className?: string; // Class bổ sung (Additional classes)
}

/**
 * @description Component hiển thị tiêu đề và hạng bằng của đề thi.
 * Đã được tối ưu chiều cao để cân bằng với Layout Dashboard.
 */
export const ExamInfoTag: React.FC<ExamInfoTagProps> = ({
  title,
  category,
  size = "lg", 
  className,
}) => {
  return (
    <div className={cn("flex flex-wrap items-center justify-center gap-4", className)}>
      
      {/* Tag: Tên đề thi (Exam Title) */}
      <div className={cn(examTagVariants({ theme: "slate", size }), "hover:scale-[1.02]")}>
        <BookOpen className={cn(size === "lg" ? "w-5 h-5" : "w-4 h-4", "text-emerald-600")} />
        <span className="font-semibold tracking-tight">
          {title}
        </span>
      </div>

      {/* Tag: Hạng bằng lái (License Category) */}
      {category && (
        <div className={cn(examTagVariants({ theme: "emerald", size }), "hover:scale-[1.02]")}>
          <FileBadge className={cn(size === "lg" ? "w-5 h-5" : "w-4 h-4")} />
          <span className="font-bold uppercase tracking-wider">Hạng {category}</span>
        </div>
      )}
    </div>
  );
};