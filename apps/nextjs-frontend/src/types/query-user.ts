export interface UserQueryDTO {
  page?: number;
  limit?: number;
  search?: string;
  role?: string;
  status: "active" | "locked" | "deleted" | "all";
}