import { UserResponseDTO } from "@/types/user-respone";
import { TableColumn } from "@/components/common/Generic-Table/GenericTable";
import { TableColumnFactory } from "@/components/common/Generic-Table/table-column.factory";
import { cn } from "@/lib/utils/utils";

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
    accessor: (user) => {
      const getRoleStyles = (roleName: string) => {
        switch (roleName.toUpperCase()) {
          case "ADMIN":
            return "bg-rose-50 text-rose-600 border-rose-100";
          case "INSTRUCTOR":
            return "bg-emerald-50 text-emerald-600 border-emerald-100";
          default:
            return "bg-blue-50 text-blue-600 border-blue-100";
        }
      };

      return (
        <div className="flex items-center justify-center gap-1.5 flex-nowrap">
          {/* 💡 Chỉ hiện tối đa 1 Role chính nếu không đủ chỗ, hoặc 2 cái cực nhỏ */}
          {user.roles.slice(0, 2).map((role) => (
            <span
              key={role.id}
              className={cn(
                "px-2 py-0.5 rounded-full text-[9px] font-black uppercase border whitespace-nowrap",
                getRoleStyles(role.name),
              )}
            >
              {role.name}
            </span>
          ))}

          {/* Nếu có hơn 2 role, hiện dấu cộng tinh tế */}
          {user.roles.length > 2 && (
            <span className="text-[9px] font-bold text-slate-400 bg-slate-50 px-1.5 py-0.5 rounded-full border border-slate-100">
              +{user.roles.length - 2}
            </span>
          )}
        </div>
      );
    },
    // 💡 Quan trọng: Tăng nhẹ width của cột để chứa đủ 2 nhãn nằm ngang
    className: "text-center w-48 min-w-[180px]",
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
