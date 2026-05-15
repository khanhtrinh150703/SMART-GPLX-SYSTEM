import { STATUS, Status } from "@/shared/config/status.config";
import { AppError, ErrorCode } from "@/shared/errors";

/**
 * @description Giao diện dữ liệu đầu vào cho yêu cầu thay đổi trạng thái người dùng.
 */
export interface IChangeStatusInputDTO {
  readonly status: Status;
}

/**
 * @description DTO xử lý việc thay đổi trạng thái hoạt động của tài khoản (Admin-only).
 * Đảm bảo trạng thái mới thuộc danh sách cho phép (ACTIVE, BANNED, PENDING).
 */
export class ChangeStatusRequestDTO implements IChangeStatusInputDTO {
  public readonly status: Status;

  constructor(data: IChangeStatusInputDTO) {
    // 1. Chặn đứng dữ liệu lỗi/undefined ngay từ constructor
    this.validate(data);

    // 2. Gán giá trị sau khi xác thực
    this.status = data.status;
  }

  /**
   * @description Hàm gác cổng xác thực Enum và tính hiện diện của dữ liệu.
   * @private
   */
  private validate(data: IChangeStatusInputDTO): void {
    // Guard Clause: Chống sập hệ thống
    if (!data) {
      throw new AppError(ErrorCode.SYSTEM.INVALID_INPUT);
    }

    const { USER } = ErrorCode;

    // 1. Kiểm tra tính hiện diện của trường status
    if (!data.status) {
      throw new AppError(USER.STATUS_REQUIRED);
    }

    // 2. Kiểm tra xem status có thuộc Enum UserStatus hợp lệ hay không
    const validStatuses: Status[] = [
      STATUS.ACTIVE,
      STATUS.DELETED,
      STATUS.DRAFT,
    ];

    if (!validStatuses.includes(data.status)) {
      throw new AppError(USER.STATUS_INVALID);
    }
  }
}
