import { QueryParams } from "@/types/paginaton.type";

/**
 * ChapterQueryParams: Định nghĩa cấu trúc tham số truy vấn cho Chương.
 */
export interface ChapterQueryParams extends QueryParams {
  // Tham số lọc động (Dynamic Filter Params)
  name?: string; // Tên chương
  description?: string; // Mô tả
  orderIndex?: number; // Thứ tự hiển thị
}
