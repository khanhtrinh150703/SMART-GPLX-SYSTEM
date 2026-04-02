/**
 * @description DTO dùng để tạo mới một chương lý thuyết.
 */
export interface CreateChapterDTO {
  /** @property {string} name - Tên chương (VD: Khái niệm và quy tắc giao thông). */
  name: string;
  /** @property {string} description - Mô tả nội dung chương. */
  description?: string;
  /** @property {number} orderIndex - Thứ tự sắp xếp của chương trong danh sách. */
  orderIndex: number;
}

/**
 * @description DTO dùng để cập nhật thông tin chương lý thuyết.
 */
export interface UpdateChapterDTO {
  /** @property {string} id - ID của chương cần cập nhật (Bắt buộc). */
  id: string;
  /** @property {string} name - Tên chương mới. */
  name?: string;
  /** @property {string} description - Mô tả mới. */
  description?: string;
  /** @property {number} orderIndex - Thứ tự sắp xếp mới. */
  orderIndex?: number;
}