/**
 * @description Giao diện rút gọn phục vụ hiển thị trong Selection Pool và lập ma trận đề thi.
 * (Shortened interface for display in the Selection Pool and exam matrix creation.)
 * Tối ưu dung lượng bằng cách chỉ chứa dữ liệu nhận diện và các flag phục vụ logic nghiệp vụ.
 */
export interface IExamQuestionSummaryResponseDTO {
  /** @description ID định danh duy nhất (UUID). (Unique identifier ID.) */
  readonly id: string;

  /** @description Nội dung câu hỏi đã được cắt tinh gọn (Truncated). (Truncated question content.) */
  readonly content: string;

  /** @description Tên chương/chủ đề phục vụ việc nhóm dữ liệu. (Chapter name for data grouping.) */
  readonly chapterName: string;

  /** @description Thứ tự sắp xếp của chương theo giáo trình GPLX. (Chapter display order according to the driving curriculum.) */
  readonly chapterOrder: number;

  /** @description Đánh dấu câu hỏi điểm liệt để tính toán ràng buộc đề thi. (Mark critical questions to calculate exam constraints.) */
  readonly isCritical: boolean;

  /** @description Số thứ tự câu hỏi theo bộ đề chính thức. (Question index number according to the official set.) */
  readonly indexNumber: number;

  /** @description Nhãn hiển thị độ khó (VD: Dễ, Trung bình, Khó). (Label for difficulty level.) */
  readonly difficultyLabel: string;

  /** @description Danh sách ID các hạng bằng lái mà câu hỏi này thuộc về. (List of license category IDs.) */
  readonly licenseIds: string[];

  /** @description Danh sách tên các hạng bằng lái mà câu hỏi này thuộc về. (List of license category names.) */
  readonly licenseCategoryNames: string[];
}

/**
 * @description DTO vận chuyển dữ liệu câu hỏi rút gọn.
 * Đóng vai trò mang dữ liệu tinh gọn để phục vụ các logic chọn lọc câu hỏi trong dự án Smart-GPLX-System.
 * (DTO for carrying shortened question data, serving selection logic in the Smart-GPLX-System.)
 */
export class ExamQuestionSummaryResponseDTO implements IExamQuestionSummaryResponseDTO {
  public readonly id: string;
  public readonly content: string;
  public readonly chapterName: string;
  public readonly chapterOrder: number;
  public readonly isCritical: boolean;
  public readonly indexNumber: number;
  public readonly difficultyLabel: string;
  public readonly licenseIds: string[];
  public readonly licenseCategoryNames: string[];

  constructor(data: IExamQuestionSummaryResponseDTO) {
    this.id = data.id;
    this.content = data.content;
    this.chapterName = data.chapterName;
    this.chapterOrder = data.chapterOrder;
    this.isCritical = data.isCritical;
    this.indexNumber = data.indexNumber;
    this.difficultyLabel = data.difficultyLabel;
    this.licenseIds = Array.isArray(data.licenseIds) ? data.licenseIds : [];
    this.licenseCategoryNames = Array.isArray(data.licenseCategoryNames) ? data.licenseCategoryNames : [];
  }
}