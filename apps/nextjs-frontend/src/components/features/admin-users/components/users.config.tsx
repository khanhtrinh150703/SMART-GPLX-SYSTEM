import { StatusOption } from "@/components/ui/StatusTabs/StatusTabs";

type UserStatus = "active" | "locked" | "deleted" | "all";
/** * Danh sách Tab trạng thái */
export const USER_STATUS_OPTIONS: StatusOption<UserStatus | "all">[] = [
  { 
    id: "all", 
    label: "Tất cả", 
    color: "bg-slate-500 shadow-lg shadow-slate-200/60" 
  },
  { 
    id: "active", 
    label: "Đang hoạt động", 
    color: "bg-emerald-500 shadow-lg shadow-emerald-200/50" 
  },
  { 
    id: "deleted", 
    label: "Bị Khóa", 
    color: "bg-rose-500 shadow-lg shadow-rose-200/50" 
  },
];

export const FILTER_FIELDS = [
  { label: "Tên", value: "name" },
  { label: "Email", value: "Email" },
  { label: "Vai trò", value: "roles" },
  { label: "Trạng thái", value: "status" },
];
