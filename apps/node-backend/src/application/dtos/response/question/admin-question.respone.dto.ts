import { QuestionResponseDTO } from "./question.respone.dto";

/**
 * @interface QuestionAdminResponseDTO
 * @description DTO mở rộng dành riêng cho Admin, bổ sung các nhãn hiển thị.
 * (Extended DTO specifically for Admin, adding display labels)
 */
export interface QuestionAdminResponseDTO extends QuestionResponseDTO {
  /** @property {string} chapterName - Tên hiển thị của chương học. */
  chapterName: string;

  /** @property {string[]} licenseCategoryNames - Danh sách tên các hạng bằng lái (VD: ["B1", "B2"]). */
  licenseCategoryNames: string[];

  /** @property {string | null} deletedAt - Ngày xóa (nếu có) để Admin biết trạng thái ẩn/hiện. */
  deletedAt: string | null;

  /** @property {string} createdAt - Ngày tạo để Admin sắp xếp bản ghi. */
  createdAt: string;
}