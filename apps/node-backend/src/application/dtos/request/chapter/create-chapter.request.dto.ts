/**
 * @description DTO dùng để tạo mới một chương lý thuyết.
 */
export interface CreateChapterRequestDTO {
  /** @property {string} name - Tên chương (VD: Khái niệm và quy tắc giao thông). */
  name: string;
  /** @property {string} description - Mô tả nội dung chương. */
  description?: string;
  /** @property {number} orderIndex - Thứ tự sắp xếp của chương trong danh sách. */
  orderIndex: number;
}

