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
 * Đảm bảo dữ liệu đầu vào hợp lệ và ngăn chặn việc gửi yêu cầu rỗng.
 */
export class UpdateAdminRequestDTO implements IUpdateAdminInputDTO {
  public readonly fullName?: string;
  public readonly roles?: string[];

  constructor(data: IUpdateAdminInputDTO) {
    // 1. Chặn đứng dữ liệu lỗi ngay tại constructor
    this.validate(data);

    // 2. Gán giá trị và chuẩn hóa dữ liệu
    if (data.fullName !== undefined) {
      this.fullName = data.fullName.trim();
    }

    if (data.roles !== undefined) {
      this.roles = Array.isArray(data.roles) ? data.roles : [];
    }
  }

  /**
   * @description Hàm gác cổng thực hiện kiểm tra tính hợp lệ đa tầng.
   * @private
   */
  private validate(data: IUpdateAdminInputDTO): void {
    if (!data) throw new AppError(ErrorCode.SYSTEM.INVALID_INPUT);

    const { USER } = ErrorCode;

    const hasFullName = data.fullName !== undefined;
    const hasRoles = data.roles !== undefined;

    // 1. Check xem có trường nào được gửi lên không
    if (!hasFullName && !hasRoles) {
      throw new AppError(USER.MISSING_UPDATE_FIELDS);
    }

    // 2. Validate Name
    if (hasFullName) {
      const name = data.fullName?.trim() || '';
      if (name.length === 0) throw new AppError(USER.NAME_REQUIRED);
      if (name.length < 2) throw new AppError(USER.NAME_TOO_SHORT);
      if (name.length > 100) throw new AppError(USER.NAME_TOO_LONG);
    }

    // 3. Validate Roles
    if (hasRoles) {
      if (!Array.isArray(data.roles)) throw new AppError(USER.INVALID_ROLES_FORMAT);
      if (data.roles.length === 0) throw new AppError(USER.ROLES_REQUIRED);
    }
  }
}