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
  [key: string]: string | number | undefined; // Cho phép key động, KHÔNG dùng null
}