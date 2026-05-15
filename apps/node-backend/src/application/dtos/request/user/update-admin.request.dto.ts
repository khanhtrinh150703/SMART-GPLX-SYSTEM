import { AppError, ErrorCode } from "@/shared/errors";

/**
 * @description Giao diện dữ liệu đầu vào cho yêu cầu cập nhật Admin.
 */
export interface IUpdateAdminInputDTO {
  readonly fullName?: string;
  readonly roles?: string[];
}

/**
 * @description DTO xử lý yêu cầu cập nhật thông tin tài khoản Admin.
 */
export class UpdateAdminRequestDTO implements IUpdateAdminInputDTO {
  public readonly fullName?: string;
  public readonly roles?: string[];

  constructor(data: IUpdateAdminInputDTO) {
    if (!data) {
      throw new AppError(ErrorCode.SYSTEM.INVALID_INPUT);
    }

    // Mapping và chuẩn hóa dữ liệu sang instance
    this.fullName =
      data.fullName !== undefined ? String(data.fullName).trim() : undefined;

    this.roles = Array.isArray(data.roles)
      ? data.roles.map((role) => String(role).trim()).filter(Boolean)
      : data.roles !== undefined
        ? []
        : undefined;

    this.validate();
  }

  /**
   * @description Hàm gác cổng kiểm tra tính hợp lệ đa tầng của instance.
   */
  private validate(): void {
    const { USER } = ErrorCode;

    // 1. Kiểm tra xem có ít nhất một trường dữ liệu được cung cấp để cập nhật hay không
    if (this.fullName === undefined && this.roles === undefined) {
      throw new AppError(USER.MISSING_UPDATE_FIELDS);
    }

    // 2. Kiểm tra tính hợp lệ của họ tên (nếu có)
    if (this.fullName !== undefined) {
      if (this.fullName.length === 0) {
        throw new AppError(USER.NAME_REQUIRED);
      }
      if (this.fullName.length < 2) {
        throw new AppError(USER.NAME_TOO_SHORT);
      }
      if (this.fullName.length > 100) {
        throw new AppError(USER.NAME_TOO_LONG);
      }
    }

    // 3. Kiểm tra tính hợp lệ của danh sách vai trò (nếu có)
    if (this.roles !== undefined) {
      if (this.roles.length === 0) {
        throw new AppError(USER.ROLES_REQUIRED);
      }
    }
  }
}
