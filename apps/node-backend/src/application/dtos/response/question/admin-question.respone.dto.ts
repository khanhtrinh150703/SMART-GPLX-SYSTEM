import { IQuestionResponseDTO, QuestionResponseDTO } from "./question.respone.dto";

/**
 * @description Giao diện DTO mở rộng dành riêng cho Admin, bổ sung các nhãn hiển thị.
 * (Extended DTO interface specifically for Admin, adding display labels.)
 */
export interface IQuestionAdminResponseDTO extends IQuestionResponseDTO {
  /** @description Tên hiển thị của chương học. (The display name of the chapter.) */
  readonly chapterName: string;

  /** @description Danh sách tên các hạng bằng lái (VD: ["B1", "B2"]). (List of license category names.) */
  readonly licenseCategoryNames: string[];

  /** @description Ngày xóa (nếu có) để Admin biết trạng thái ẩn/hiện. (Deletion date, if any, to track visibility status.) */
  readonly deletedAt: string | null;

  /** @description Ngày tạo để Admin thực hiện sắp xếp và quản lý. (Creation date for Admin sorting and management.) */
  readonly createdAt: string;
}

/**
 * @description DTO vận chuyển dữ liệu câu hỏi dành cho giao diện quản trị (Admin).
 * Kế thừa từ QuestionResponseDTO để tái sử dụng cấu trúc cơ bản và bổ sung các thông tin quản trị đặc thù.
 */
export class QuestionAdminResponseDTO extends QuestionResponseDTO implements IQuestionAdminResponseDTO {
  public readonly chapterName: string;
  public readonly licenseCategoryNames: string[];
  public readonly deletedAt: string | null;
  public readonly createdAt: string;

  constructor(data: IQuestionAdminResponseDTO) {
    // Khởi tạo các thuộc tính cơ bản từ QuestionResponseDTO
    super(data);

    // Khởi tạo các thuộc tính mở rộng cho Admin
    this.chapterName = data.chapterName;
    this.licenseCategoryNames = Array.isArray(data.licenseCategoryNames)
      ? data.licenseCategoryNames
      : [];
    this.deletedAt = data.deletedAt;
    this.createdAt = data.createdAt;
  }
}