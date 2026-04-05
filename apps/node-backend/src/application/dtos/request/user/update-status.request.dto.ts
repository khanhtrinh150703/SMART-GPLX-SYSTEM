import { UserStatus } from "@/domain/entities/user/user.status";

/**
 * @description DTO dành cho quản trị viên (Admin) để thay đổi trạng thái hoạt động của người dùng.
 */
export class ChangeStatusRequestDTO {
  /** @property {UserStatus} status - Trạng thái mới cần áp dụng (VD: ACTIVE, BANNED, PENDING). */
  readonly status!: UserStatus;

  /**
   * @description Ánh xạ dữ liệu trạng thái từ request body.
   */
  constructor(data: Partial<ChangeStatusRequestDTO>) {
    Object.assign(this, data);
  }
}