/**
 * @description Giao diện cơ sở cho các tham số truy vấn có phân trang và sắp xếp.
 */
export interface IBaseQueryDTO {
  page: number;
  limit: number;
  sortBy: string;
  sortOrder: "asc" | "desc";
  status?: string;
  search?: string;
}

/**
 * @description Lớp cơ sở để bóc tách và xử lý tham số truy vấn (Pagination & Sorting).
 */
export abstract class BaseQueryDTO implements IBaseQueryDTO {
  public page: number = 1;
  public limit: number = 10;
  public sortBy: string = "createdAt";
  public sortOrder: "asc" | "desc" = "desc";
  public status?: string;
  public search?: string;

  constructor(data?: Partial<IBaseQueryDTO>) {
    if (!data) return;

    // 1. Ép kiểu số an toàn và chặn giá trị nhỏ hơn 1 (Sanitize page & limit)
    if (data.page !== undefined && data.page !== null) {
      this.page = Math.max(1, Number(data.page));
    }
    if (data.limit !== undefined && data.limit !== null) {
      this.limit = Math.max(1, Number(data.limit));
    }

    // 2. Chuẩn hóa chuỗi sắp xếp (Sanitize sort properties)
    if (typeof data.sortBy === "string" && data.sortBy.trim() !== "") {
      this.sortBy = data.sortBy.trim();
    }
    if (data.sortOrder === "asc" || data.sortOrder === "desc") {
      this.sortOrder = data.sortOrder;
    }

    // 3. Chuẩn hóa bộ lọc tìm kiếm nâng cao (Sanitize search & status parameters)
    if (typeof data.status === "string") {
      this.status = data.status.trim();
    }
    if (typeof data.search === "string") {
      this.search = data.search.trim() !== "" ? data.search.trim() : undefined;
    }
  }

  public get pagination(): { readonly skip: number; readonly take: number } {
    return {
      skip: (this.page - 1) * this.limit,
      take: this.limit,
    };
  }

  public get orderBy(): Record<string, "asc" | "desc"> {
    return {
      [this.sortBy]: this.sortOrder,
    };
  }
}
