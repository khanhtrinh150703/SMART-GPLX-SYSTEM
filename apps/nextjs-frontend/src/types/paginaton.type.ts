/**
 * @interface PaginatedResult
 * @description Cấu trúc chuẩn cho mọi phản hồi có phân trang
 */
export interface PaginatedResult<T> {
  data: T[];
  meta: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
    hasNextPage: boolean;
    hasPreviousPage: boolean;
  };
}

/**
 * Interface cho tham số truy vấn.
 * (Interface for query parameters)
 */

export interface QueryParams {
  page?: number;
  limit?: number;
  search?: string;
  status?: string;
  sortBy?: string;
  sortOrder?: "asc" | "desc"; // Kiểu Literal chuẩn
  [key: string]: string | number | boolean | undefined;
}

export interface ISelectionPoolParams {
  licenseCategoryId: string; // BẮT BUỘC: Không có cái này là "ăn" lỗi ngay từ lúc gõ code
  search?: string;           // Tùy chọn: Tìm kiếm trong kho
  chapterId?: string;        // Tùy chọn: Lọc theo chương
}