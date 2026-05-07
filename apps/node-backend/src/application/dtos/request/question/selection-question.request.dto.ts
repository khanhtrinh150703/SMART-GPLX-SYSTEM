/**
 * @class GetSelectionPoolDto
 * @description DTO định nghĩa bộ lọc để lấy danh sách câu hỏi từ kho dữ liệu (Selection Pool).
 */
export class GetSelectionPoolDto {
  /** @description ID định danh của hạng bằng lái (Bắt buộc). */
  public readonly licenseId: string;

  /** @description Lọc câu hỏi theo chương hoặc chủ đề cụ thể. */
  public readonly chapterId?: string;

  /** @description Từ khóa tìm kiếm theo nội dung văn bản của câu hỏi. */
  public readonly search?: string;

  /** @description Lọc riêng nhóm câu hỏi điểm liệt. */
  public readonly isCritical?: boolean;

  /** @description Lọc theo loại câu hỏi (Hình ảnh, Sa hình, Lý thuyết). */
  public readonly questionTypeId?: string;

  /** @description Danh sách các ID câu hỏi cần loại trừ để tránh chọn trùng. */
  public readonly excludeIds?: string[];

  /** @description Trạng thái hoạt động của câu hỏi (Mặc định là true). */
  public readonly isActive?: boolean;

  /**
   * @description Khởi tạo DTO với cơ chế gán giá trị an toàn và thiết lập mặc định.
   * @param {Partial<GetSelectionPoolDto>} data - Dữ liệu đầu vào không bắt buộc để khởi tạo đối tượng.
   */
  constructor(data?: Partial<GetSelectionPoolDto>) {
    this.licenseId = data?.licenseId ?? '';
    this.chapterId = data?.chapterId;
    this.search = data?.search;
    this.isCritical = data?.isCritical;
    this.questionTypeId = data?.questionTypeId;
    this.excludeIds = data?.excludeIds ?? [];
    this.isActive = data?.isActive ?? true;
  }
}