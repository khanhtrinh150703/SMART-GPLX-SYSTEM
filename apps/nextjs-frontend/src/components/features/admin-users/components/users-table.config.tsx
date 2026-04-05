import { Edit2, Trash2, Unlock, RotateCcw } from "lucide-react";
import { TableColumn } from "@/components/common/Generic-Table/GenericTable";
import { UserResponseDTO } from "@/types/user-respone";
import { StatusOption } from "@/components/ui/StatusTabs/StatusTabs";

type UserStatus = "active" | "locked" | "deleted" | "all";
/** * Danh sách Tab trạng thái */
export const USER_STATUS_OPTIONS: StatusOption<UserStatus>[] = [
  { id: "all", label: "Tất cả" },
  { id: "active", label: "Hoạt động", color: "text-emerald-600" },
  { id: "locked", label: "Tạm ẩn", color: "text-amber-600" },
  { id: "deleted", label: "Bị Khóa", color: "text-rose-600" },
] as const;

/** * Hàm tạo Column cho User Table */
export const getUserColumns = (
  onEdit: (u: UserResponseDTO) => void,
  onDelete: (u: UserResponseDTO) => void,
  onUnlock: (u: UserResponseDTO) => void,
  onRestore: (u: UserResponseDTO) => void,
): TableColumn<UserResponseDTO>[] => [
  {
    header: "Học viên",
    accessor: (user) => (
      <div className="flex items-center gap-4">
        <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-emerald-100 to-slate-100 flex items-center justify-center text-emerald-700 font-black shadow-sm">
          {user.fullName.charAt(0).toUpperCase()}
        </div>
        <div className="flex flex-col">
          <span className="font-bold text-slate-800 leading-tight">
            {user.fullName}
          </span>
          <span className="text-[11px] text-slate-400 font-medium">
            ID: {user.id.toString().substring(0, 8)}...
          </span>
        </div>
      </div>
    ),
  },
  {
    header: "Trạng thái",
    accessor: (user) => (
      <span
        className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider ${
          user.status === "active"
            ? "bg-emerald-50 text-emerald-600"
            : "bg-slate-100 text-slate-400"
        }`}
      >
        {user.status === "active" ? "Hoạt động" : user.status}
      </span>
    ),
    className: "text-center",
  },
  {
    header: "Vai trò",
    accessor: (user) => (
      <div className="flex flex-wrap gap-1 justify-center">
        {user.roles.map((role) => (
          <span
            key={role.id}
            className="px-2 py-0.5 rounded-md bg-slate-100 text-slate-600 text-[10px] font-bold uppercase border border-slate-200"
          >
            {role.name}
          </span>
        ))}
      </div>
    ),
    className: "text-center w-40",
  },
  {
    header: "Thao tác",
    accessor: (user) => (
      <div className="flex items-center justify-end gap-1 opacity-0 group-hover:opacity-100 transition-all duration-300 translate-x-2 group-hover:translate-x-0 pr-2">
        {user.status === "deleted" && (
          <button
            onClick={() => onRestore(user)}
            className="p-2 hover:bg-emerald-50 text-emerald-600 rounded-xl transition-all"
          >
            <RotateCcw size={16} />
          </button>
        )}
        {user.status === "locked" && (
          <button
            onClick={() => onUnlock(user)}
            className="p-2 hover:bg-amber-50 text-amber-600 rounded-xl transition-all"
          >
            <Unlock size={16} />
          </button>
        )}
        <button
          onClick={() => onEdit(user)}
          className="p-2 hover:bg-white hover:shadow-soft text-slate-400 hover:text-emerald-600 rounded-xl transition-all"
        >
          <Edit2 size={16} />
        </button>
        <button
          onClick={() => onDelete(user)}
          className="p-2 hover:bg-rose-50 text-slate-400 hover:text-rose-500 rounded-xl transition-all"
        >
          <Trash2 size={16} />
        </button>
      </div>
    ),
    className: "text-right",
  },
];
