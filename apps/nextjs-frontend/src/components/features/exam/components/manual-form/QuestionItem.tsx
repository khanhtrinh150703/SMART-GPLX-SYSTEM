"use client";

import React, { memo } from "react";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { CheckCircle2, GripVertical, Trash2 } from "lucide-react";
import { motion } from "framer-motion";

import { cn } from "@/lib/utils/utils";
import {
  checkboxVariants,
  orchestratorStyles,
} from "./question-orchestrator.variants";
import { questionItemVariants } from "./animations";
import { IExamQuestionSummary } from "@/components/features/question/types/question-summary.types";

interface QuestionItemProps {
  question: IExamQuestionSummary;
  isSelected?: boolean;
  onToggle: (question: IExamQuestionSummary, isShift: boolean) => void;
  variant: "pool" | "selected";
}

export const QuestionItem = memo(
  ({ question, isSelected, onToggle, variant }: QuestionItemProps) => {
    const {
      attributes,
      listeners,
      setNodeRef,
      transform,
      transition,
      isDragging,
    } = useSortable({
      id: `${variant}-${question.id}`,
      data: { type: variant, question },
    });

    const style: React.CSSProperties = {
      transform: CSS.Translate.toString(transform),
      transition,
      opacity: isDragging ? 0.3 : 1,
      willChange: "transform",
    };

    if (variant === "pool") {
      return (
        <tr
          ref={setNodeRef}
          style={style}
          {...attributes}
          {...listeners}
          onClick={(e) => onToggle(question, e.shiftKey)}
          className={cn(
            "group cursor-pointer hover:bg-slate-50 border-b transition-colors select-none",
            isSelected && "bg-emerald-50/40",
          )}
        >
          {/* 1. Checkbox */}
          <td className="p-3 text-center w-10">
            <div className={checkboxVariants({ selected: !!isSelected })}>
              {isSelected && <CheckCircle2 size={12} />}
            </div>
          </td>

          {/* 2. Số thứ tự (indexNumber) */}
          <td className="p-3 text-center w-14 font-mono text-[11px] text-slate-400">
            #{question.indexNumber}
          </td>

          {/* 3. Nội dung câu hỏi (content) */}
          <td className="p-3 text-xs text-slate-700 font-medium leading-relaxed max-w-[300px]">
            <p className="line-clamp-2">{question.content}</p>
          </td>

          {/* 4. Hạng bằng (licenseCategoryNames) */}
          <td className="p-3 w-24">
            <div className="flex flex-wrap gap-1">
              {/* Thêm dấu ?. vào đây */}
              {question.licenseCategoryNames?.map((cat) => (
                <span
                  key={cat}
                  className="px-1.5 py-0.5 bg-slate-100 text-slate-600 rounded text-[9px] font-bold border border-slate-200"
                >
                  {cat}
                </span>
              ))}
            </div>
          </td>

          {/* 5. Độ khó (difficultyLabel) */}
          <td className="p-3 w-20 text-center">
            <span
              className={cn(
                "text-[10px] font-medium px-2 py-0.5 rounded-full",
                question.difficultyLabel === "Dễ" && "bg-blue-50 text-blue-600",
                question.difficultyLabel === "Trung bình" &&
                  "bg-orange-50 text-orange-600",
                question.difficultyLabel === "Khó" &&
                  "bg-purple-50 text-purple-600",
              )}
            >
              {question.difficultyLabel}
            </span>
          </td>

          {/* 6. Trạng thái (isCritical) */}
          <td className="p-3 text-center w-20">
            {question.isCritical ? (
              <span className="px-2 py-0.5 bg-rose-500 text-white rounded text-[9px] font-black uppercase tracking-tighter">
                Điểm liệt
              </span>
            ) : (
              <span className="text-[9px] text-slate-300 font-bold uppercase">
                Cơ bản
              </span>
            )}
          </td>
        </tr>
      );
    }

    return (
      <motion.div
        ref={setNodeRef}
        style={style}
        layout // Giữ hiệu ứng sắp xếp danh sách mượt mà
        variants={questionItemVariants}
        initial="initial"
        animate="animate"
        exit="exit"
        className={cn(
          orchestratorStyles.itemCard,
          isDragging && "border-emerald-500 shadow-lg",
        )}
      >
        <div
          {...attributes}
          {...listeners}
          className="p-1 cursor-grab active:cursor-grabbing"
        >
          <GripVertical size={18} className="text-slate-300" />
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-xs font-bold text-slate-800 truncate">
            {question.content}
          </p>
        </div>
        <button
          type="button"
          onClick={() => onToggle(question, false)}
          className="p-2 hover:bg-rose-50 text-slate-300 hover:text-rose-500 rounded-xl"
        >
          <Trash2 size={16} />
        </button>
      </motion.div>
    );
  },
);

QuestionItem.displayName = "QuestionItem";
