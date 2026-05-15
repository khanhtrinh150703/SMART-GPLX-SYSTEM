import { QueryParams } from "@/types/paginaton.type";

export interface UserQueryParams extends QueryParams {
  // Tham số lọc động (Dynamic Filter Params)
  fullName?: string; // Tên chương
  email?: string; // Mô tả
  roles?: string; // Thứ tự hiển thị
}
