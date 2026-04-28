import { Edit2, Trash2, RotateCcw } from "lucide-react";
import { cn } from "@/lib/utils/utils";
import { TableColumn } from "./GenericTable";

// Định nghĩa các biến thể màu sắc (Variants)
export type StatusVariant = "success" | "warning" | "danger" | "neutral";

export interface StatusConfig {
  label: string;
  variant: StatusVariant;
}

// 1. Helper tạo cột STT
export const createSTTColumn = <T,>(page: number, limit: number): TableColumn<T> => ({
  header: "STT",
  accessor: (_, index) => {
    const serialNumber = (page - 1) * limit + index + 1;
    return (
      <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-emerald-50 text-emerald-600 font-black text-[11px] border border-emerald-100 shadow-sm">
        {serialNumber.toString().padStart(2, "0")}
      </div>
    );
  },
  className: "w-20 text-center",
});

// 2. Helper tạo cột Trạng thái (Generic)
export const createStatusColumn = <T extends { status: string }>(
  statusMap: Record<string, StatusConfig>
): TableColumn<T> => ({
  header: "Trạng thái",
  sortable: true,
  sortKey: "status" as keyof T,
  accessor: (item) => {
    const config = statusMap[item.status] || { label: "N/A", variant: "neutral" };
    
    const variantStyles: Record<StatusVariant, string> = {
      success: "bg-emerald-50 text-emerald-600 border-emerald-100",
      warning: "bg-amber-50 text-amber-600 border-amber-100",
      danger: "bg-rose-50 text-rose-500 border-rose-100",
      neutral: "bg-slate-50 text-slate-400 border-slate-100",
    };

    return (
      <span className={cn(
        "px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider border inline-block",
        variantStyles[config.variant]
      )}>
        {config.label}
      </span>
    );
  },
  className: "w-32 text-center",
});

// 3. Helper tạo cột Thao tác (Generic)
export const createActionsColumn = <T extends { status: string }>(
  onEdit: (item: T) => void,
  onDelete: (item: T) => void,
  onRestore: (item: T) => void
): TableColumn<T> => ({
  header: "Thao tác",
  accessor: (item) => (
    <div className="flex items-center justify-end gap-1 opacity-0 group-hover:opacity-100 transition-all duration-300 translate-x-2 group-hover:translate-x-0 pr-2">
      {item.status === "deleted" ? (
        <button
          onClick={(e) => { e.stopPropagation(); onRestore(item); }}
          className="p-2 hover:bg-emerald-50 text-emerald-600 rounded-xl transition-all"
        >
          <RotateCcw size={16} />
        </button>
      ) : (
        <>
          <button
            onClick={(e) => { e.stopPropagation(); onEdit(item); }}
            className="p-2 hover:bg-white hover:shadow-soft text-slate-400 hover:text-emerald-600 rounded-xl transition-all"
          >
            <Edit2 size={16} />
          </button>
          <button
            onClick={(e) => { e.stopPropagation(); onDelete(item); }}
            className="p-2 hover:bg-rose-50 text-slate-400 hover:text-rose-500 rounded-xl transition-all"
          >
            <Trash2 size={16} />
          </button>
        </>
      )}
    </div>
  ),
  className: "text-right",
});