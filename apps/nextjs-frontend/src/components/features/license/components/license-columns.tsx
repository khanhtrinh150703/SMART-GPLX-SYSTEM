import { Edit2, Trash2, RotateCcw, User, Clock, ClipboardCheck } from "lucide-react";
import { cn } from "@/lib/utils/utils";
import { TableColumn } from "@/components/common/Generic-Table/GenericTable";
import { License } from "./license.config";

/**
 * getLicenseColumns - Cấu hình cột cho bảng quản lý hạng bằng lái
 * @param onEdit - Hàm xử lý chỉnh sửa
 * @param onDelete - Hàm xử lý xóa
 * @param onRestore - Hàm xử lý khôi phục
 */
export const getLicenseColumns = (
  onEdit: (item: License) => void,
  onDelete: (item: License) => void,
  onRestore: (item: License) => void,
): TableColumn<License>[] => [
  {
    header: "Mã hạng",
    accessor: (item) => (
      <span className="flex items-center justify-center w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 font-black text-xs shadow-sm border border-emerald-100/50">
        {item.code}
      </span>
    ),
    className: "w-24 text-center",
  },
  {
    header: "Thông tin hạng bằng",
    accessor: (item) => (
      <div className="flex flex-col gap-0.5">
        <span className="font-bold text-slate-800 leading-tight">
          {item.name}
        </span>
        <span className="text-[11px] text-slate-400 line-clamp-1 max-w-[300px]">
          {item.description}
        </span>
      </div>
    ),
  },
  {
    header: "Cấu hình đề thi",
    accessor: (item) => (
      <div className="flex flex-col gap-1">
        <div className="flex items-center gap-1.5 text-slate-600">
          <ClipboardCheck size={12} className="text-emerald-500" />
          <span className="text-xs font-bold">{item.totalQuestions} câu</span>
        </div>
        <div className="flex items-center gap-1.5 text-slate-400 text-[10px]">
          <span className="bg-slate-100 px-1.5 py-0.5 rounded-md font-medium">
            Đạt: {item.passingScore}+
          </span>
        </div>
      </div>
    ),
    className: "w-32",
  },
  {
    header: "Yêu cầu & TG",
    accessor: (item) => (
      <div className="flex flex-col gap-1">
        <div className="flex items-center gap-1.5 text-slate-500">
          <User size={12} className="text-slate-300" />
          <span className="text-xs font-semibold">{item.minAge} tuổi</span>
        </div>
        <div className="flex items-center gap-1.5 text-slate-500">
          <Clock size={12} className="text-slate-300" />
          <span className="text-[10px]">{item.testDuration} phút</span>
        </div>
      </div>
    ),
    className: "w-32",
  },
  {
    header: "Trạng thái",
    accessor: (item) => {
      const statusStyles = {
        active: "bg-emerald-50 text-emerald-600 border-emerald-100",
        draft: "bg-slate-50 text-slate-400 border-slate-100",
        deleted: "bg-rose-50 text-rose-500 border-rose-100",
      };

      const statusLabels = {
        active: "Đang cấp",
        draft: "Tạm ngưng",
        deleted: "Thùng rác",
      };

      return (
        <span
          className={cn(
            "px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-wider border inline-block",
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
    accessor: (item) => (
      <div className="flex items-center justify-end gap-1 opacity-0 group-hover:opacity-100 transition-all duration-300 translate-x-2 group-hover:translate-x-0 pr-2">
        {item.status === "deleted" ? (
          <button
            onClick={() => onRestore(item)}
            className="p-2 hover:bg-emerald-50 text-emerald-600 rounded-xl transition-all"
            title="Khôi phục"
          >
            <RotateCcw size={16} />
          </button>
        ) : (
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