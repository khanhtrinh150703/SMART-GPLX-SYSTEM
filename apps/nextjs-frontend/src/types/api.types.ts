/**
 * Mục đích (Purpose): Định nghĩa thông tin phân trang (Pagination metadata) đầy đủ.
 */
export interface PaginationMeta {
  readonly total: number;
  readonly page: number;
  readonly limit: number;
  readonly totalPages: number;
  readonly hasNextPage: boolean;
  readonly hasPreviousPage: boolean;
}

/**
 * Mục đích (Purpose): Cấu trúc dữ liệu phân trang trả về từ API.
 * @template T: Kiểu dữ liệu của mảng các phần tử (Items type).
 */
export interface PaginatedResult<T> {
  readonly data: T[]; // Mảng dữ liệu thực tế
  readonly meta: PaginationMeta; // Thông tin phân trang
}