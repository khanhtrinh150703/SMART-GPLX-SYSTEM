import { PaginatedResult } from "../types/pagination.types";

export class PaginationUtil {
  /**
   * @description Tạo ra phản hồi phân trang chuẩn hóa
   */
  public static createPaginatedResponse<T>(
    data: T[], 
    total: number, 
    page: number, 
    limit: number
  ): PaginatedResult<T> {
    const totalPages = Math.ceil(total / limit);

    return {
      data,
      meta: {
        total,
        page,
        limit,
        totalPages,
        hasNextPage: page < totalPages,
        hasPreviousPage: page > 1,
      },
    };
  }

  /**
   * @description Tính toán skip cho Repository
   */
  public static getSkip(page: number, limit: number): number {
    return (page - 1) * limit;
  }
}