import { Edit2, Trash2, RotateCcw, Unlock } from "lucide-react";
import { cn } from "@/lib/utils/utils";
import { TableColumn } from "./GenericTable";

/**
 * Định nghĩa các kiểu Trạng thái chung để đảm bảo đồng nhất UI
 */
export type StatusType =
  | "active"
  | "inactive"
  | "deleted"
  | "draft"
  | "pending"
  | "locked";

export const STATUS_VARIANTS: Record<
  StatusType,
  { label: string; className: string }
> = {
  active: {
    label: "Hoạt động",
    className: "bg-emerald-50 text-emerald-600 border-emerald-100",
  },
  inactive: {
    label: "Tạm dừng",
    className: "bg-slate-50 text-slate-400 border-slate-100",
  },
  draft: {
    label: "Bản nháp",
    className: "bg-amber-50 text-amber-600 border-amber-100",
  },
  deleted: {
    label: "Đã xóa",
    className: "bg-rose-50 text-rose-500 border-rose-100",
  },
  pending: {
    label: "Chờ duyệt",
    className: "bg-blue-50 text-blue-600 border-blue-100",
  },
  locked: {
    label: "Đã khóa",
    // Màu Tím/Violet để trông khác biệt hẳn với các màu còn lại
    className: "bg-purple-50 text-purple-600 border-purple-100",
  },
};

export const TableColumnFactory = {
  // 1. Cột STT (Tái sử dụng cho mọi bảng)
  stt: <T,>(page: number, limit: number): TableColumn<T> => ({
    header: "STT",
    accessor: (_, index) => {
      const serialNumber = (Number(page) - 1) * Number(limit) + index + 1;
      return (
        <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-emerald-50 text-emerald-600 font-black text-[11px] border border-emerald-100 shadow-sm">
          {serialNumber.toString().padStart(2, "0")}
        </div>
      );
    },
    className: "w-20 text-center",
  }),

  // 2. Cột Trạng thái (T - Kiểu dữ liệu bất kỳ nhưng phải có trường 'status')
  status: <T extends { status: string }>(): TableColumn<T> => ({
    header: "Trạng thái",
    sortable: true,
    sortKey: "status" as keyof T,
    accessor: (item) => {
      const normalizedStatus = item.status.toLowerCase() as StatusType;
      const config = STATUS_VARIANTS[normalizedStatus] || STATUS_VARIANTS.draft;
      return (
        <span
          className={cn(
            "px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider border inline-block whitespace-nowrap",
            config.className,
          )}
        >
          {config.label}
        </span>
      );
    },
    className: "w-32 text-center",
  }),

  // 3. Cột Thao tác (Nhận các callback function)
  actions: <T extends { status: string }>(
    onEdit: (item: T) => void,
    onDelete: (item: T) => void,
    onRestore: (item: T) => void,
    onUnlock?: (item: T) => void, // Tham số mới: Tùy chọn (English: Optional Parameter)
  ): TableColumn<T> => ({
    header: "Thao tác",
    accessor: (item) => {
      // BƯỚC BẢO VỆ: Ép kiểu về chuỗi và chuyển thành chữ thường để so sánh an toàn
      // (English: Safety step: Cast to string and convert to lowercase for safe comparison)
      const normalizedStatus = String(item.status).toLowerCase();

      return (
        <div className="flex items-center justify-end gap-1 opacity-0 group-hover:opacity-100 transition-all duration-300 translate-x-2 group-hover:translate-x-0 pr-4">
          {/* TRƯỜNG HỢP 1: ĐÃ XÓA -> Chỉ hiện nút Khôi phục */}
          {normalizedStatus === "deleted" ? (
            <button
              onClick={(e) => {
                e.stopPropagation();
                onRestore(item);
              }}
              className="p-2 hover:bg-emerald-50 text-emerald-600 rounded-xl transition-all"
              title="Khôi phục"
            >
              <RotateCcw size={16} />
            </button>
          ) : (
            /* TRƯỜNG HỢP 2: ĐANG HOẠT ĐỘNG HOẶC BỊ KHÓA */
            <>
              {/* Nếu trạng thái là Locked và có truyền hàm onUnlock thì mới hiện nút Mở khóa */}
              {normalizedStatus === "locked" && onUnlock && (
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onUnlock(item);
                  }}
                  className="p-2 hover:bg-amber-50 text-amber-600 rounded-xl transition-all"
                  title="Mở khóa"
                >
                  <Unlock size={16} />
                </button>
              )}

              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onEdit(item);
                }}
                className="p-2 hover:bg-white hover:shadow-md text-slate-400 hover:text-emerald-600 rounded-xl transition-all"
                title="Chỉnh sửa"
              >
                <Edit2 size={16} />
              </button>

              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onDelete(item);
                }}
                className="p-2 hover:bg-rose-50 text-slate-400 hover:text-rose-500 rounded-xl transition-all"
                title="Xóa / Khóa"
              >
                <Trash2 size={16} />
              </button>
            </>
          )}
        </div>
      );
    },
    className: "text-right",
  }),
};
