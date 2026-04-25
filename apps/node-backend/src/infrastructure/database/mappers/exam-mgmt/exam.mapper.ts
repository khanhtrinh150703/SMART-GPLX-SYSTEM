import { IExamQuestionResponse, IExamResponse } from '@/application/dtos/response/exam/exam-response.dto';
import { ExamEntity } from '@/domain/entities/exam/exam.entity';
import { IExamProps, IExamQuestionProps } from '@/domain/entities/exam/exam.props';
import { PrismaExamWithRelations } from '@/infrastructure/persistence/exam-mgmt/question.record';
import { ExamStatus, Prisma } from '@prisma/client';

/**
 * @description Mapper chuẩn hóa chuyển đổi dữ liệu của Exam.
 */
export class ExamMapper {

  /**
   * @description Chuyển đổi dữ liệu từ Prisma Record sang Domain Entity.
   * @param {PrismaQuestionWithRelations} raw - Dữ liệu thô từ Database (Prisma).
   * @returns {ExamEntity}
   */
  public static toDomain(raw: PrismaExamWithRelations): ExamEntity {
    // 1. Map Questions (Dữ liệu snapshot)
    const questions: IExamQuestionProps[] = (raw.questions || []).map((q) => ({
      questionId: q.questionId,
      indexNumber: q.indexNumber,
      isCritical: q.isCritical,
      correctAnswer: q.correctAnswer,
    }));

    // 2. Gom thành Props sạch
    const props: IExamProps = {
      id: raw.id,
      name: raw.name,
      userId: raw.userId,
      examMatrixId: raw.examMatrixId,
      licenseCategoryId: raw.licenseCategoryId,
      totalQuestions: raw.totalQuestions,
      passingScore: raw.passingScore,
      durationMinutes: raw.durationMinutes,
      minCriticalQuestions: raw.minCriticalQuestions,
      status: raw.status as ExamStatus,
      score: raw.score,
      isPassed: raw.isPassed,
      startedAt: raw.startedAt,
      endedAt: raw.endedAt ?? null,
      questions,
    };

    // 3. Khởi tạo qua Factory Method
    return ExamEntity.reconstitute(props);
  }

  /**
  * @description Chuyển đổi Exam Entity sang định dạng dữ liệu lưu trữ của Prisma.
  * @param {ExamEntity} exam - Thực thể bài thi từ tầng Domain.
  * @returns {Prisma.ExamCreateInput} Dữ liệu đầu vào cho tầng Database.
  */
  public static toPersistence(exam: ExamEntity): Prisma.ExamCreateInput {
    const { props } = exam;

    return {
      id: props.id,
      name: props.name,
      totalQuestions: props.totalQuestions,
      passingScore: props.passingScore,
      durationMinutes: props.durationMinutes,
      minCriticalQuestions: props.minCriticalQuestions,
      status: props.status,
      score: props.score,
      isPassed: props.isPassed,
      startedAt: props.startedAt,
      // Mapping quan hệ 1-n: Exam -> ExamQuestions
      user: { connect: { id: props.userId } },
      examMatrix: { connect: { id: props.examMatrixId } },
      licenseCategory: { connect: { id: props.licenseCategoryId } },
      questions: {
        create: props.questions.map((q) => ({
          questionId: q.questionId,
          correctAnswer: q.correctAnswer,
          isCritical: q.isCritical,
          indexNumber: q.indexNumber,
        })),
      },
    };
  }

  /**
   * @description Chuyển đổi một Exam Entity sang định dạng dữ liệu phản hồi (Response DTO).
   * @param {ExamEntity} entity - Đối tượng Exam Domain cần chuyển đổi.
   * @returns {IExamResponse} DTO chứa dữ liệu đã được định dạng để trả về cho Client.
   */
  public static toResponse(entity: ExamEntity): IExamResponse {
    const { props } = entity;

    return {
      id: props.id ?? '',
      name: props.name,
      userId: props.userId,
      licenseCategoryId: props.licenseCategoryId,
      totalQuestions: props.totalQuestions,
      durationMinutes: props.durationMinutes,
      startedAt: props.startedAt,
      // endedAt: props.endedAt ?? null,
      status: props.status,
      questions: props.questions.map((q): IExamQuestionResponse => ({
        questionId: q.questionId,
        indexNumber: q.indexNumber,
        chapterId: q.chapterId,
        chapterName: q.chapterName,
        isCritical: q.isCritical,
        // isCorrect: q.isCorrect ?? null,
        // correctAnswer: q.correctAnswer,
      })),
    };
  }

  /**
   * @description Chuyển đổi danh sách Exam Entity sang định dạng phản hồi (Response).
   * @param {ExamEntity[]} entities - Danh sách các đối tượng Exam Domain.
   * @returns {IExamResponse[]} Mảng dữ liệu phản hồi cho Client.
   */
  public static toResponseList(entities: ExamEntity[]): IExamResponse[] {
    return entities.map((entity) => this.toResponse(entity));
  }
}