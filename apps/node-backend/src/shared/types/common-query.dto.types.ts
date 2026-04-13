// types/query.dto.ts

export class BaseQueryDTO {
  public page: number = 1;
  public limit: number = 10;
  public sortBy: string = 'createdAt';
  public sortOrder: 'asc' | 'desc' = 'desc';

  /** * @description Chế độ xem lọc theo logic xóa mềm (Dịch: View mode for soft-delete logic)
   * active: Chỉ bản ghi hiện hành (deletedAt == null)
   * deleted: Chỉ bản ghi đã xóa (deletedAt != null)
   * all: Lấy tất cả
   */
  public status?: string;

  public search?: string;

  // Helper cho Prisma (Giữ nguyên hoặc cải tiến nhẹ)
  get pagination() {
    const p = Math.max(1, Number(this.page));
    const l = Math.max(1, Number(this.limit));
    return {
      skip: (p - 1) * l,
      take: l,
    };
  }
}