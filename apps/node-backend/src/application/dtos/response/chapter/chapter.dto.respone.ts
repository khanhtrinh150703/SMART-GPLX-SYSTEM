/**
 * @description DTO phản hồi thông tin chương lý thuyết cho Client.
 * (DTO responding with theoretical chapter information for the Client)
 */
export interface ChapterResponseDTO {
  /** @property {string} id - Mã định danh duy nhất của chương (UUID). */
  readonly id: string;

  /** @property {string} name - Tiêu đề của chương học (VD: Khái niệm và quy tắc). */
  readonly name: string;

  /** @property {string | null} description - Mô tả tóm tắt nội dung chương (có thể để trống). */
  readonly description: string | null;

  /** @property {number} orderIndex - Thứ tự hiển thị của chương trong danh sách đào tạo. */
  readonly orderIndex: number;

  /** @property {Date} createdAt - Thời điểm tạo chương học hệ thống. */
  readonly createdAt: Date;

  /** @property {string} status - Trạng thái hiện tại (VD: 'active', 'draft', 'deleted'). */
  readonly status: string;
}