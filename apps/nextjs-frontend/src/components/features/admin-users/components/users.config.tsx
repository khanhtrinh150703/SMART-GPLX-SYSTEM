import { StatusOption } from "@/components/ui/StatusTabs/StatusTabs";

type UserStatus = "active" | "locked" | "deleted" | "all";
/** * Danh sách Tab trạng thái */
export const USER_STATUS_OPTIONS: StatusOption<UserStatus>[] = [
  { id: "all", label: "Tất cả" },
  { id: "active", label: "Hoạt động", color: "text-emerald-600" },
  { id: "locked", label: "Tạm ẩn", color: "text-amber-600" },
  { id: "deleted", label: "Bị Khóa", color: "text-rose-600" },
] as const;

export const FILTER_FIELDS = [
  { label: "Tên", value: "name" },
  { label: "Email", value: "Email" },
  { label: "Vai trò", value: "roles" },
  { label: "Trạng thái", value: "status" },
];
