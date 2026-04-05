import { Edit2, Trash2, FileText, RotateCcw } from "lucide-react";
import { cn } from "@/lib/utils/utils";
import { TableColumn } from "@/components/common/Generic-Table/GenericTable";
import { Chapter } from "./chapter.config";

/**
 * Hàm tạo cấu hình cột cho Chapter.
 * Dịch: Factory function to generate chapter table columns.
 */
export const getChapterColumns = (
  onEdit: (item: Chapter) => void,
  onDelete: (item: Chapter) => void,
  onRestore: (item: Chapter) => void,
): TableColumn<Chapter>[] => [
  {
    header: "Thứ tự",
    accessor: (item) => (
      <span className="flex items-center justify-center w-8 h-8 rounded-lg bg-emerald-50 text-emerald-600 font-black text-[10px]">
        {item.order}
      </span>
    ),
    className: "w-20 text-center",
  },
  {
    header: "Nội dung chương học",
    accessor: (item) => (
      <div className="flex flex-col gap-0.5">
        <span className="font-bold text-slate-800 leading-tight">
          {item.title}
        </span>
        <span className="text-[11px] text-slate-400 line-clamp-1">
          {item.description}
        </span>
      </div>
    ),
  },
  {
    header: "Số bài học",
    accessor: (item) => (
      <div className="flex items-center gap-2 text-slate-500">
        <FileText size={13} className="text-slate-300" />
        <span className="font-bold text-xs">{item.lessonCount} bài</span>
      </div>
    ),
    className: "w-32",
  },
  {
    header: "Trạng thái",
    accessor: (item) => {
      // Dịch: Cấu hình màu sắc và nhãn dựa trên status
      const statusStyles = {
        active: "bg-emerald-50 text-emerald-600",
        draft: "bg-slate-100 text-slate-400",
        deleted: "bg-rose-50 text-rose-500",
      };

      const statusLabels = {
        active: "Hoạt động",
        draft: "Bản nháp",
        deleted: "Đã xóa",
      };

      return (
        <span
          className={cn(
            "px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-wider inline-block",
            statusStyles[item.status] || statusStyles.draft
          )}
        >
          {statusLabels[item.status] || "N/A"}
        </span>
      );
    },
    className: "w-32 text-center",
  },
  {
    header: "Thao tác",
    accessor: (item) => ( // Đã sửa: Đổi từ 'user' thành 'item' cho đồng bộ
      <div className="flex items-center justify-end gap-1 opacity-0 group-hover:opacity-100 transition-all duration-300 translate-x-2 group-hover:translate-x-0 pr-2">
        
        {/* Nút Khôi phục: Chỉ hiện khi đã xóa */}
        {item.status === "deleted" && (
          <button
            onClick={() => onRestore(item)}
            className="p-2 hover:bg-emerald-50 text-emerald-600 rounded-xl transition-all"
            title="Khôi phục"
          >
            <RotateCcw size={16} />
          </button>
        )}

        {/* Nút Sửa & Xóa: Chỉ hiện khi chưa bị xóa (hoặc tùy logic của bạn) */}
        {item.status !== "deleted" && (
          <>
            <button
              onClick={() => onEdit(item)}
              className="p-2 hover:bg-white hover:shadow-soft text-slate-400 hover:text-emerald-600 rounded-xl transition-all"
              title="Chỉnh sửa"
            >
              <Edit2 size={16} />
            </button>
            <button
              onClick={() => onDelete(item)}
              className="p-2 hover:bg-rose-50 text-slate-400 hover:text-rose-500 rounded-xl transition-all"
              title="Xóa"
            >
              <Trash2 size={16} />
            </button>
          </>
        )}
      </div>
    ),
    className: "text-right",
  },
];