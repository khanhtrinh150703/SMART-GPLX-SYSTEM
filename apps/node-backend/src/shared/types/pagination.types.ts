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