import { UserResponseDTO } from "@/types/user-respone";
import { TableColumn } from "@/components/common/Generic-Table/GenericTable";
import { TableColumnFactory } from "@/components/common/Generic-Table/table-column.factory";

/**
 * @description Định nghĩa các cột cho bảng Người dùng sử dụng Factory dùng chung.
 */
export const getUserColumns = (
  onEdit: (u: UserResponseDTO) => void,
  onDelete: (u: UserResponseDTO) => void,
  onUnlock: (u: UserResponseDTO) => void,
  onRestore: (u: UserResponseDTO) => void,
  page: number,
  limit: number,
): TableColumn<UserResponseDTO>[] => [
  // 1. Cột STT
  TableColumnFactory.stt<UserResponseDTO>(page, limit),

  // 2. Cột Thông tin học viên (Avatar + Tên + ID)
  {
    header: "Học viên",
    sortable: true,
    sortKey: "fullName",
    accessor: (user) => (
      <div className="flex items-center gap-4 overflow-hidden">
        <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-emerald-100 to-slate-100 flex items-center justify-center text-emerald-700 font-black shadow-sm shrink-0 uppercase">
          {user.fullName.charAt(0)}
        </div>
        <div className="flex flex-col min-w-0">
          <span className="font-bold text-slate-800 leading-tight truncate">
            {user.fullName}
          </span>
          <span className="text-[10px] text-slate-400 font-medium">
            ID: {user.id.toString().slice(0, 8)}...
          </span>
        </div>
      </div>
    ),
  },

  // 3. Cột Email (Hiển thị text đơn giản để tránh rối mắt)
  {
    header: "Email",
    sortable: true,
    sortKey: "email",
    accessor: (user) => (
      <span className="text-sm text-slate-600 font-medium truncate block lowercase">
        {user.email}
      </span>
    ),
  },

  // 4. Cột Vai trò (Roles)
  {
    header: "Vai trò",
    sortable: true,
    sortKey: "roles",
    accessor: (user) => (
      <div className="flex flex-wrap gap-1 justify-center">
        {user.roles.map((role) => (
          <span
            key={role.id}
            className="px-2 py-0.5 rounded-md bg-slate-50 text-slate-500 text-[9px] font-bold uppercase border border-slate-200"
          >
            {role.name}
          </span>
        ))}
      </div>
    ),
    className: "text-center w-36",
  },

  // 5. Cột Trạng thái
  TableColumnFactory.status<UserResponseDTO>(),

  // 6. Cột Thao tác
  TableColumnFactory.actions<UserResponseDTO>(
    onEdit,
    onDelete,
    onRestore,
    onUnlock,
  ),
];