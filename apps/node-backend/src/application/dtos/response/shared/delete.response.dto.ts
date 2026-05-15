import { DeleteType } from "@/domain/constants/delete.constant";

/**
 * @description Giao diện kết quả trả về cho các thao tác xóa.
 * (Interface for deletion operation results.)
 */
export interface IDeleteResponseDTO {
  /** @description ID của bản ghi đã bị xử lý.  */
  readonly id: string;

  /** @description Loại xóa đã thực hiện */
  readonly type: DeleteType;

  /** @description Trạng thái xóa vĩnh viễn. */
  readonly isPermanent?: boolean;

  /** @description Thông báo xác nhận trạng thái. */
  readonly message?: string;

  /** @description Số lượng thực thể liên quan bị ảnh hưởng. */
  readonly count?: number;
}

/**
 * @description DTO vận chuyển kết quả thao tác xóa.
 * Đảm bảo dữ liệu phản hồi cho Client luôn nhất quán và minh bạch.
 */
export class DeleteResponseDTO implements IDeleteResponseDTO {
  /** @description ID bản ghi. */
  public readonly id: string;

  /** @description Hình thức xóa. */
  public readonly type: DeleteType;

  /** @description Xác định đây là xóa vĩnh viễn hay xóa mềm. */
  public readonly isPermanent: boolean;

  /** @description Thông báo chi tiết kết quả. */
  public readonly message: string;

  constructor(data: IDeleteResponseDTO) {
    this.id = data.id;
    this.type = data.type;

    this.isPermanent = data.type === DeleteType.HARD;

    this.message = this._generateMessage(data.type, data.count);
  }

  /**
   * @description Tự động khởi tạo thông báo dựa trên loại xóa và dữ liệu liên quan.
   */
  private _generateMessage(type: DeleteType, count?: number): string {
    const messages = {
      [DeleteType.SOFT]:
        count && count > 0
          ? `Bản ghi đã được ẩn do có ${count} dữ liệu liên quan.`
          : `Bản ghi đã được chuyển vào thùng rác.`,
      [DeleteType.HARD]: `Bản ghi đã được xóa vĩnh viễn khỏi hệ thống.`,
    };

    return messages[type];
  }
}
