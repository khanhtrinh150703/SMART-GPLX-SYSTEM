import { DeleteType } from "@/domain/constants/delete.constant";

/**
 * @description Giao diện kết quả trả về cho các thao tác xóa.
 * (Interface for deletion operation results.)
 */
export interface IDeleteResponseDTO {
  /** @description ID của bản ghi đã bị xóa. (ID of the deleted record.) */
  readonly id: string;

  /** @description Loại xóa đã thực hiện (HARD/SOFT). (Type of deletion performed.) */
  readonly type: DeleteType;

  /** @description Thông báo xác nhận trạng thái. (Status confirmation message.) */
  readonly message?: string;
  
  /** @description Số lượng thực thể hoặc phần tử áp dụng theo điều kiện ràng buộc. */
  readonly count?: number;
}

/**
 * @description DTO vận chuyển kết quả thao tác xóa.
 * Đảm bảo dữ liệu phản hồi cho Client luôn nhất quán và sạch sẽ.
 */
export class DeleteResponseDTO implements IDeleteResponseDTO {
  public readonly id: string;
  public readonly type: DeleteType;
  public readonly message?: string;

  constructor(data: IDeleteResponseDTO) {
    this.id = data.id;
    this.type = data.type;
    this.message = this._generateMessage(data.type, data.count);
  }

  private _generateMessage(type: DeleteType, count?: number): string {
    const messages = {
      [DeleteType.SOFT]: count
        ? `Bản ghi đã được ẩn do có ${count} dữ liệu liên quan.`
        : `Bản ghi đã được chuyển vào thùng rác.`,
      [DeleteType.HARD]: `Bản ghi đã được xóa vĩnh viễn khỏi hệ thống.`
    };

    return messages[type];
  }
}