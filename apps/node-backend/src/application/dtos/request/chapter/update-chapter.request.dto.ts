/**
 * @description DTO dùng để cập nhật thông tin chương lý thuyết.
 */
export interface UpdateChapterRequestDTO {
  /** @property {string} id - ID của chương cần cập nhật (Bắt buộc). */
  id: string;
  /** @property {string} name - Tên chương mới. */
  name?: string;
  /** @property {string} description - Mô tả mới. */
  description?: string;
  /** @property {number} orderIndex - Thứ tự sắp xếp mới. */
  orderIndex?: number;

  code:string;
}