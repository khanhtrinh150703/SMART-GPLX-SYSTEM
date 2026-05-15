  /**
   * @description Giao diện cơ sở cho các tham số truy vấn có phân trang và sắp xếp.
   */
  export interface IBaseQueryDTO {
    page: number;
    limit: number;
    sortBy: string;
    sortOrder: 'asc' | 'desc';
    status?: string;
    search?: string;
  }

  /**
   * @description Lớp cơ sở để bóc tách và xử lý tham số truy vấn (Pagination & Sorting).
   */
  export abstract class BaseQueryDTO implements IBaseQueryDTO {
    public page: number = 1;
    public limit: number = 10;
    public sortBy: string = 'createdAt';
    public sortOrder: 'asc' | 'desc' = 'desc';

    /** * @description Chế độ xem theo logic xóa mềm.
     * active: Chỉ bản ghi hiện hành (deletedAt == null)
     * deleted: Chỉ bản ghi đã xóa (deletedAt != null)
     * all: Lấy tất cả
     */
    public status?: string;
    public search?: string;

    /**
     * @description Chuyển đổi tham số Page/Limit sang Skip/Take cho Prisma.
     * @returns {Object} { skip: number, take: number }
     */
    public get pagination(): { readonly skip: number; readonly take: number } {
      const p = Math.max(1, Number(this.page));
      const l = Math.max(1, Number(this.limit));
      
      return {
        skip: (p - 1) * l,
        take: l,
      };
    }

    /**
     * @description Trả về cấu trúc sắp xếp chuẩn cho Prisma.
     */
    public get orderBy(): Record<string, 'asc' | 'desc'> {
      return {
        [this.sortBy]: this.sortOrder,
      };
    }
  }