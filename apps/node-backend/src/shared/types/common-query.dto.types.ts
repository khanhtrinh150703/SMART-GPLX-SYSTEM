// types/query.dto.ts
export class BaseQueryDTO {
  public page: number = 1;
  public limit: number = 10;
  public sortBy: string = 'createdAt';
  public sortOrder: 'asc' | 'desc' = 'desc';
  public status: 'active' | 'deleted' | 'all' = 'active';
  public search?: string;

  // Helper để lấy Skip/Take cho Prisma
  get pagination() {
    return {
      skip: (Math.max(1, this.page) - 1) * this.limit,
      take: this.limit,
    };
  }
}