import { User } from "lucide-react";
import { LicenseCategory } from "@/types/license-category.types";
import { TableColumn } from "@/components/common/Generic-Table/GenericTable";
import { TableColumnFactory } from "@/components/common/Generic-Table/table-column.factory";

/**
 * @description Định nghĩa các cột cho bảng Hạng bằng lái sử dụng Factory dùng chung.
 */
export const getLicenseColumns = (
  onEdit: (item: LicenseCategory) => void,
  onDelete: (item: LicenseCategory) => void,
  onRestore: (item: LicenseCategory) => void,
  page: number,
  limit: number
): TableColumn<LicenseCategory>[] => [
  
  // 1. Cột STT (Tái sử dụng Factory) - Tự động xử lý 01, 02...
  TableColumnFactory.stt<LicenseCategory>(page, limit),

  // 2. Cột đặc thù: Thông tin Hạng bằng (Tên & Mô tả)
  {
    header: "Hạng bằng lái",
    sortable: true,
    sortKey: "name",
    accessor: (item) => (
      <div className="flex flex-col gap-1">
        <span className="font-black text-slate-800 text-sm leading-tight">
          {item.name}
        </span>
        <span className="text-[11px] text-slate-400 line-clamp-1 max-w-[300px]">
          {item.description}
        </span>
      </div>
    ),
  },

  // 3. Cột đặc thù: Độ tuổi tối thiểu
  {
    header: "Yêu cầu",
    sortable: true,
    sortKey: "minAge",
    accessor: (item) => (
      <div className="flex items-center gap-2 text-slate-600">
        <div className="w-6 h-6 rounded-md bg-slate-50 flex items-center justify-center border border-slate-100">
            <User size={12} className="text-emerald-500" />
        </div>
        <span className="font-bold text-xs">{item.minAge} tuổi trở lên</span>
      </div>
    ),
    className: "w-40",
  },

  // 4. Cột Trạng thái (Tái sử dụng Factory)
  // Factory sẽ tự xử lý: font-bold, text-[10px], và các màu sắc chuẩn
  TableColumnFactory.status<LicenseCategory>(),

  // 5. Cột Thao tác (Tái sử dụng Factory)
  // Tự động xử lý: hiện/ẩn nút Khôi phục, Sửa, Xóa và stopPropagation
  TableColumnFactory.actions<LicenseCategory>(onEdit, onDelete, onRestore),
];