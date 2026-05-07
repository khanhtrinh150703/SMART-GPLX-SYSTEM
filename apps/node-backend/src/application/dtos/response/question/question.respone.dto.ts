import { QuestionStatus } from "@/domain/entities/question/question.status";

/**
 * @description Giao diện dữ liệu chi tiết của một đáp án trả về cho Client.
 * (Interface for the detailed data of an answer option returned to the Client.)
 */
export interface IAnswerResponseDTO {
  /** @description Mã định danh duy nhất của đáp án (UUID). (Unique identifier of the answer.) */
  readonly id: string;

  /** @description Nội dung văn bản của đáp án. (Text content of the answer.) */
  readonly content: string;

  /** @description Đánh dấu đây có phải là đáp án đúng hay không. (Flag indicating if this is the correct answer.) */
  readonly isCorrect: boolean;

  /** @description Đường dẫn hình ảnh minh họa cho đáp án (nếu có). (Illustration image URL for the answer, if any.) */
  readonly imageUrl: string | null;
}

/**
 * @description DTO vận chuyển dữ liệu đáp án.
 * Đóng vai trò mang dữ liệu sạch từ tầng Application ra ngoài API.
 */
export class AnswerResponseDTO implements IAnswerResponseDTO {
  public readonly id: string;
  public readonly content: string;
  public readonly isCorrect: boolean;
  public readonly imageUrl: string | null;

  constructor(data: IAnswerResponseDTO) {
    this.id = data.id;
    this.content = data.content;
    this.isCorrect = data.isCorrect;
    this.imageUrl = data.imageUrl;
  }
}

/**
 * @description Giao diện dữ liệu câu hỏi đầy đủ trả về cho Client.
 * (Interface for full question data returned to the Client, ensuring a clean and safe structure.)
 */
export interface IQuestionResponseDTO {
  /** @description Mã định danh duy nhất của câu hỏi (UUID). (Unique identifier of the question.) */
  readonly id: string;

  /** @description Số thứ tự câu hỏi trong bộ đề. (The sequence number of the question in the set.) */
  readonly indexNumber: number;

  /** @description ID của chương học chứa câu hỏi này. (ID of the chapter containing this question.) */
  readonly chapterId: string;

  /** @description Nội dung câu hỏi dùng để hiển thị. (The question content for display.) */
  readonly content: string;

  /** @description Đường dẫn hình ảnh minh họa tình huống (nếu có). (Situation illustration image URL, if any.) */
  readonly imageUrl: string | null;

  /** @description Đánh dấu đây có phải là "Câu điểm liệt" hay không. (Flag indicating if this is a "Critical Question".) */
  readonly isCritical: boolean;

  /** @description Cấu trúc phân loại mức độ khó. (Structure classifying the difficulty level.) */
  readonly difficulty: {
    readonly level: number;
    readonly label: string;
  };

  /** @description Trạng thái hiện tại của câu hỏi. (Current status of the question.) */
  readonly status: QuestionStatus;

  /** @description Danh sách các lựa chọn đáp án đi kèm. (List of accompanying answer options.) */
  readonly answers: IAnswerResponseDTO[];

  /** @description Danh sách ID các hạng bằng lái áp dụng (VD: B1, B2). (List of applicable license category IDs.) */
  readonly licenseCategoryIds: string[];
}

/**
 * @description DTO vận chuyển dữ liệu câu hỏi hoàn chỉnh.
 * Đảm bảo cấu trúc dữ liệu sạch, an toàn và nhất quán cho phía Client trong dự án Smart-GPLX-System.
 */
export class QuestionResponseDTO implements IQuestionResponseDTO {
  public readonly id: string;
  public readonly indexNumber: number;
  public readonly chapterId: string;
  public readonly content: string;
  public readonly imageUrl: string | null;
  public readonly isCritical: boolean;
  public readonly difficulty: {
    readonly level: number;
    readonly label: string;
  };
  public readonly status: QuestionStatus;
  public readonly answers: IAnswerResponseDTO[];
  public readonly licenseCategoryIds: string[];

  constructor(data: IQuestionResponseDTO) {
    this.id = data.id;
    this.indexNumber = data.indexNumber;
    this.chapterId = data.chapterId;
    this.content = data.content;
    this.imageUrl = data.imageUrl;
    this.isCritical = data.isCritical;
    this.difficulty = {
      level: data.difficulty.level,
      label: data.difficulty.label
    };
    this.status = data.status;
    this.licenseCategoryIds = data.licenseCategoryIds;

    // Khởi tạo danh sách Answer DTO từ dữ liệu đầu vào
    this.answers = Array.isArray(data.answers)
      ? data.answers.map(ans => new AnswerResponseDTO(ans))
      : [];
  }
}