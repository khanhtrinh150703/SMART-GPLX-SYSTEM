import { STATUS, Status } from "@/shared/config/status.config";
import { AppError, ErrorCode } from "@/shared/errors";

/**
 * @description Giao diện dữ liệu đầu vào cho yêu cầu thay đổi trạng thái người dùng.
 */
export interface IChangeStatusInputDTO {
  readonly status: Status;
}

/**
 * @description DTO xử lý việc thay đổi trạng thái hoạt động của tài khoản.
 */
export class ChangeStatusRequestDTO implements IChangeStatusInputDTO {
  public readonly status: Status;

  constructor(data: IChangeStatusInputDTO) {
    if (!data) {
      throw new AppError(ErrorCode.SYSTEM.INVALID_INPUT);
    }

    // Mapping và ép kiểu dữ liệu tường minh sang instance
    this.status = data.status;

    this.validate();
  }

  /**
   * @description Hàm gác cổng xác thực giá trị trạng thái dựa trên dữ liệu instance.
   */
  private validate(): void {
    const { USER } = ErrorCode;

    // 1. Kiểm tra tính hiện diện của trường status
    if (!this.status) {
      throw new AppError(USER.STATUS_REQUIRED);
    }

    // 2. Kiểm tra xem status có thuộc danh sách trạng thái cho phép hay không
    const validStatuses: Status[] = [
      STATUS.ACTIVE,
      STATUS.DELETED,
      STATUS.DRAFT,
    ];

    if (!validStatuses.includes(this.status)) {
      throw new AppError(USER.STATUS_INVALID);
    }
  }
}
