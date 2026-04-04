import { QuestionResponseDto } from "@/application/dtos/response/question/question.respone.dto";
import { labels } from "@/domain/constants/difficulty.constant";
import { Question } from "@/domain/entities/question/question.entity";
import { IQuestionRecord } from "@/infrastructure/persistence/question.record";

export class QuestionMapper {

  /**
     * @description Chuyển từ Database Record (Prisma) sang Domain Entity.
     * Đây là nơi ánh xạ mọi trường dữ liệu, bao gồm cả trạng thái "đã xóa".
     * @param {IQuestionRecord} raw - Dữ liệu thô từ database.
     * @returns {Question}
     */
  public static toDomain(raw: IQuestionRecord): Question {
    return Question.reconstitute({
      id: raw.id,
      chapterId: raw.chapterId,
      content: raw.content,
      imageUrl: raw.imageUrl,
      difficultyLevel: raw.difficultyLevel,
      isCritical: raw.isCritical,

      // 1. Ánh xạ trạng thái xóa của Câu hỏi vào Entity
      deletedAt: raw.deletedAt ?? null,

      // 2. Map danh sách đáp án (bao gồm cả trường deletedAt của từng đáp án)
      answers: (raw.answers ?? []).map((a) => ({
        id: a.id,
        content: a.content,
        imageUrl: a.imageUrl,
        isCorrect: a.isCorrect,
        deletedAt: a.deletedAt ?? null, // Quan trọng: Để Entity biết đáp án nào còn sống
      })),

      // 3. Map danh sách ID hạng bằng lái từ bảng trung gian
      licenseCategoryIds: (raw.licenseLinks ?? []).map((l) => l.licenseCategoryId),
    });
  }

  /**
   * @description Chuyển từ Entity sang Persistence Record
   * @param {Question} entity - Thực thể câu hỏi
   * @returns {Partial<IQuestionRecord>}
   */
  public static toPersistence(entity: Question): Partial<IQuestionRecord> {
    const { props } = entity;
    return {
      chapterId: props.chapterId,
      content: props.content,
      imageUrl: props.imageUrl,
      isCritical: props.isCritical,
    };
  }

  /**
     * @description Chuyển đổi từ Domain Entity sang Response DTO để trả về cho Client.
     * Đảm bảo dữ liệu trả về đã được lọc sạch và đúng kiểu dữ liệu.
     * @param {Question} entity - Thực thể câu hỏi từ tầng Domain
     * @returns {QuestionResponseDto}
     */
  public static toResponse(entity: Question): QuestionResponseDto {
    const { props } = entity;
    return {
      id: props.id ?? "",
      chapterId: props.chapterId,
      content: props.content,
      imageUrl: props.imageUrl ?? "",
      isCritical: props.isCritical,
      difficulty: {
        level: props.difficultyLevel,
        label: labels[props.difficultyLevel] || 'Không xác định'
      },
      // Đảm bảo map danh sách đáp án đúng chuẩn AnswerResponseDto
      answers: props.answers.map((ans) => ({
        id: ans.id || "",
        content: ans.content,
        isCorrect: ans.isCorrect,
        imageUrl: ans.imageUrl ?? null,
      })),
      // Giữ nguyên mảng ID các hạng bằng lái
      licenseCategoryIds: props.licenseCategoryIds,
    };
  }

  /**
   * @description Chuyển đổi danh sách Entity sang danh sách Response DTO.
   * @param {Question[]} entities - Mảng các thực thể câu hỏi
   * @returns {QuestionResponseDto[]}
   */
  public static toResponseList(entities: Question[]): QuestionResponseDto[] {
    return entities.map((entity) => this.toResponse(entity));
  }
}