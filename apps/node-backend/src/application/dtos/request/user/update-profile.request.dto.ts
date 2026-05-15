import { AppError, ErrorCode } from "@/shared/errors";
import { IUploadedFile } from "@/shared/types/file.type";

/**
 * @description Giao diện dữ liệu đầu vào cho yêu cầu cập nhật hồ sơ cá nhân.
 */
export interface IUpdateProfileInputDTO {
  readonly fullName?: string;
  readonly pictureFile?: IUploadedFile;
}

/**
 * @description DTO xử lý cập nhật hồ sơ cá nhân, đảm bảo dữ liệu được chuẩn hóa trước khi lưu trữ.
 */
export class UpdateProfileRequestDTO implements IUpdateProfileInputDTO {
  public readonly fullName?: string;
  public readonly pictureFile?: IUploadedFile;

  constructor(data: IUpdateProfileInputDTO) {
    if (!data) {
      throw new AppError(ErrorCode.SYSTEM.INVALID_INPUT);
    }

    // Mapping và ép kiểu dữ liệu tường minh sang instance
    this.fullName =
      data.fullName !== undefined ? String(data.fullName).trim() : undefined;
    this.pictureFile = data.pictureFile;

    this.validate();
  }

  /**
   * @description Hàm gác cổng kiểm tra tính hợp lệ của hồ sơ dựa trên dữ liệu instance.
   */
  private validate(): void {
    const { USER } = ErrorCode;

    // 1. Kiểm tra xem có ít nhất một trường thông tin được gửi lên hay không
    if (this.fullName === undefined && this.pictureFile === undefined) {
      throw new AppError(USER.MISSING_UPDATE_FIELDS);
    }

    // 2. Kiểm tra tính hợp lệ của họ tên (nếu có cung cấp)
    if (this.fullName !== undefined) {
      if (this.fullName.length === 0) {
        throw new AppError(USER.NAME_REQUIRED);
      }

      if (this.fullName.length > 50) {
        throw new AppError(USER.NAME_TOO_LONG);
      }
    }
  }
}
