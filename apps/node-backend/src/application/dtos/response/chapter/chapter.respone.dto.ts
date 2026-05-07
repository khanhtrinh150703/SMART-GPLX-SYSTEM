/**
 * @description Giao diện dữ liệu trả về cho thông tin chương lý thuyết.
 */
export interface IChapterResponseDTO {
  readonly id: string;
  readonly name: string;
  readonly description: string | null;
  readonly orderIndex: number;
  readonly createdAt: Date;
  readonly status: string;
  readonly code: string;
}

/**
 * @description DTO vận chuyển thông tin chương lý thuyết.
 * Đóng vai trò mang dữ liệu sạch (Data Carrier) để phản hồi cho phía Client.
 */
export class ChapterResponseDTO implements IChapterResponseDTO {
  public readonly id: string;
  public readonly name: string;
  public readonly description: string | null;
  public readonly orderIndex: number;
  public readonly createdAt: Date;
  public readonly status: string;
  public readonly code: string;

  constructor(data: IChapterResponseDTO) {
    this.id = data.id;
    this.name = data.name;
    this.description = data.description;
    this.orderIndex = data.orderIndex;
    this.createdAt = data.createdAt;
    this.status = data.status;
    this.code = data.code;
  }
}