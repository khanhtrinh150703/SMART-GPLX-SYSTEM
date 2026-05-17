import { BaseQueryDTO } from "@/shared/types/common-query.dto.types";

export class UserQueryDTO extends BaseQueryDTO {
  // Thêm các field lọc đặc thù vào đây
  public fullName?: string;
  public roles?: string;
  public email?: string;
  public name?: string;
  
  constructor(data: Partial<UserQueryDTO>) {
    super(data);
    
    // Gán dữ liệu thô vào class
    Object.assign(this, data);

    // Đừng quên ép kiểu cho các thuộc tính kế thừa từ BaseQueryDTO nếu cần
    if (this.limit) this.limit = Number(this.limit);
    if (this.page) this.page = Number(this.page);
  }
}