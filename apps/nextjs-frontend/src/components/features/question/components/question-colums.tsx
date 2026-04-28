import { ShieldAlert, Image as ImageIcon, BookOpen } from "lucide-react";
import { Question } from "../types/question.types";
import { TableColumn } from "@/components/common/Generic-Table/GenericTable";
import { TableColumnFactory } from "@/components/common/Generic-Table/table-column.factory";
import { cn } from "@/lib/utils/utils";
import { DIFFICULTY_MAP } from "./question.config";

export const getQuestionColumns = (
  onEdit: (item: Question) => void,
  onDelete: (item: Question) => void,
  onRestore: (item: Question) => void,
  page: number,
  limit: number,
): TableColumn<Question>[] => [
  // 1. Cột Số thứ tự
  TableColumnFactory.stt<Question>(page, limit),

  // 2. Cột Nội dung câu hỏi (Đã bỏ phần Chương)
  {
    header: "Nội dung câu hỏi",
    sortable: true,
    sortKey: "content",
    accessor: (item) => (
      <div className="flex items-start gap-2 max-w-[350px]">
        {item.isCritical && (
          <div className="mt-0.5 shrink-0" title="Câu hỏi điểm liệt">
            <ShieldAlert size={16} className="text-rose-500 fill-rose-50" />
          </div>
        )}
        <span
          className={cn(
            "font-bold text-sm leading-snug line-clamp-2 transition-colors",
            item.isCritical ? "text-rose-700" : "text-slate-800",
          )}
        >
          {item.content}
        </span>
      </div>
    ),
  },

  // 3. Cột Chương (Tách riêng)
  {
    header: "Chương học",
    sortable: true,
    sortKey: "chapterName",
    accessor: (item) => (
      <div className="flex items-center gap-2 text-slate-600 font-medium max-w-[200px]">
        <div className="p-1.5 rounded-lg bg-emerald-50 shrink-0">
          <BookOpen size={14} className="text-emerald-600" />
        </div>
        <span className="text-[11px] leading-tight line-clamp-2">
          {item.chapterName || "Chưa phân chương"}
        </span>
      </div>
    ),
    className: "w-48",
  },

  // 4. Cột Đáp án
  {
    header: "Đáp án",
    sortable: true,
    sortKey: "answers",
    accessor: (item) => (
      <div className="flex flex-col gap-1">
        {item.imageUrl ? (
          <span className="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-100 w-fit">
            <ImageIcon size={10} /> CÓ ẢNH
          </span>
        ) : (
          <span className="text-[10px] text-slate-400 italic">Không ảnh</span>
        )}
        <span className="text-[10px] text-slate-500 font-medium">
          {item.answers.length} đáp án
        </span>
      </div>
    ),
    className: "w-28",
  },

  // 5. Cột Độ khó
  {
    header: "Độ khó",
    sortable: true,
    sortKey: "difficulty",
    accessor: (item) => {
      const config =
        DIFFICULTY_MAP[item.difficulty.label] || DIFFICULTY_MAP.MEDIUM;
      return (
        <span
          className={cn(
            "px-2.5 py-1 rounded-lg text-[10px] font-black uppercase tracking-wider shadow-sm border block w-fit",
            config.color,
            "border-current/10",
          )}
        >
          {config.label}
        </span>
      );
    },
    className: "w-28",
  },

  // 6. Cột Hạng bằng
  {
    header: "Hạng bằng",
    sortable: true,
    sortKey: "licenseCategoryNames",
    accessor: (item) => (
      <div className="flex flex-wrap gap-1 max-w-[120px]">
        {item.licenseCategoryNames?.length ? (
          item.licenseCategoryNames.map((name) => (
            <div
              key={name}
              className="px-1.5 py-0.5 rounded bg-slate-800 flex items-center justify-center"
            >
              <span className="text-[9px] font-bold text-white uppercase leading-none">
                {name}
              </span>
            </div>
          ))
        ) : (
          <span className="text-[10px] text-slate-400 italic">Chưa gán</span>
        )}
      </div>
    ),
    className: "w-32",
  },

  {
    header: "Mã số",
    sortable: true,
    sortKey: "indexNumber",
    accessor: (item) => (
      <span className="font-bold text-slate-700">#{item.indexNumber}</span>
    ),
    className: "w-20",
  },
  // 7. Cột Trạng thái
  TableColumnFactory.status<Question>(),

  // 8. Cột Thao tác
  TableColumnFactory.actions<Question>(onEdit, onDelete, onRestore),
];
