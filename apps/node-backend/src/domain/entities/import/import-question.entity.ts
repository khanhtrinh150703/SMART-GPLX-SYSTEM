import { BaseEntity } from "@/domain/seedwork/entity.base";
import { IImportQuestionProps, IImportAnswer, CreateImportQuestionProps } from "./import-question.props";
import { RowValidationError } from "@/shared/errors/row-validation.error";

/**
 * @description Thực thể đại diện cho một câu hỏi trong luồng Import.
 * Chịu trách nhiệm thực hiện Business Invariants và Self-Validation.
 */
export class QuestionImportEntity extends BaseEntity<IImportQuestionProps> {

  /**
   * @description Constructor đơn giản, chỉ nhận dữ liệu đã được chuẩn hóa.
   */
  private constructor(props: IImportQuestionProps) {
    super(props);
    this.validate();
  }

  /**
   * @description Factory: Khởi tạo thực thể câu hỏi mới cho quá trình Import.
   * Thực hiện gọt giũa (Trim, UpperCase) và gán các trường hệ thống.
   */
  public static create(props: CreateImportQuestionProps): QuestionImportEntity {
    const now = new Date();

    // Thực hiện Normalization ngay tại đây
    const finalizedProps: IImportQuestionProps = {
      ...props,
      id: crypto.randomUUID(),

      // Gọt giũa dữ liệu thô
      content: props.content.trim(),
      chapterId: props.chapterId.trim().toUpperCase(),
      licenseCategoryIds: props.licenseCategoryIds.map(id => id.trim().toUpperCase()),
      aiExplainDraft: props.aiExplainDraft?.trim(),

      // Chuẩn hóa danh sách câu trả lời
      answers: props.answers.map(ans => ({
        ...ans,
        text: ans.text.trim()
      })),

      // Gán các trường hệ thống
      createdAt: now,
      updatedAt: now,
      deletedAt: null,
    };

    return new QuestionImportEntity(finalizedProps);
  }


  /**
   * @description Factory: Tái tạo thực thể từ dữ liệu đã tồn tại (Persistence/Cache).
   */
  public static reconstitute(props: IImportQuestionProps): QuestionImportEntity {
    return new QuestionImportEntity(props);
  }

  /**
   * @description Kiểm tra logic nghiệp vụ nội tại (Business Invariants).
   * @throws {RowValidationError} Nếu dữ liệu vi phạm quy tắc nghiệp vụ.
   */
  private validate(): void {
    const errors: string[] = [];

    // 1. Kiểm tra tính hiện diện và độ dài
    if (!this._props.content || this._props.content.length < 10) {
      errors.push("Nội dung câu hỏi quá ngắn (tối thiểu 10 ký tự)");
    }

    if (!this._props.chapterId) {
      errors.push("Mã chương (Chapter ID) không được để trống");
    }

    if (this._props.licenseCategoryIds.length === 0) {
      errors.push("Câu hỏi phải thuộc ít nhất một hạng bằng lái (License Category)");
    }

    // 2. Kiểm tra logic đáp án (Answers Logic)
    const answersCount = this._props.answers.length;
    if (answersCount < 2) {
      errors.push(`Câu hỏi chỉ có ${answersCount} đáp án. Yêu cầu tối thiểu 2 đáp án.`);
    }

    // Kiểm tra tính hợp lệ của Correct Index (User nhập từ Excel thường là 1-based)
    if (this._props.correctAnswerIndex < 1 || this._props.correctAnswerIndex > answersCount) {
      errors.push(
        `Chỉ số đáp án đúng (${this._props.correctAnswerIndex}) không nằm trong phạm vi số lượng đáp án (1-${answersCount})`
      );
    }

    // Kiểm tra xem có đúng 1 đáp án được đánh dấu isCorrect không
    const correctAnswers = this._props.answers.filter(a => a.isCorrect);
    if (correctAnswers.length !== 1) {
      errors.push("Một câu hỏi phải có duy nhất một đáp án đúng");
    }

    // 3. Ném lỗi tập hợp (Batch Error) để tầng Application xử lý ghi log
    if (errors.length > 0) {
      throw new RowValidationError("Lỗi logic nghiệp vụ thực thể câu hỏi", errors);
    }
  }

  // ========================================================================
  // GETTERS (Chỉ trả về dữ liệu cần thiết, bảo vệ tính đóng gói)
  // ========================================================================

  public get indexNumber(): number { return this._props.indexNumber; }
  public get isCritical(): boolean { return this._props.isCritical; }
  public get answers(): IImportAnswer[] { return [...this._props.answers]; } // Trả về bản sao để tránh đột biến mảng gốc
}