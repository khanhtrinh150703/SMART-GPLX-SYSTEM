import {
  ExamUserFullContentResponseDTO,
  ExamUserQuestionResponseDTO,
  IExamUserAnswerResponseDTO,
  IExamUserFullContentResponseDTO,
  IExamUserQuestionResponseDTO,
} from "@/application/dtos/response/exam/exam-full-content.response.dto";
import {
  ExamUserResultResponseDTO,
  IExamUserResultResponseDTO,
} from "@/application/dtos/response/exam/exam-result.respone.dto";
import {
  IExamSummaryResponseDTO,
  ExamSummaryResponseDTO,
} from "@/application/dtos/response/exam/exam-summary.response.dto";
import {
  ExamResponseDTO,
  IExamQuestionResponseDTO,
  IExamResponseDTO,
} from "@/application/dtos/response/exam/exam.response.dto";
import { ExamEntity } from "@/domain/entities/exam/exam.entity";
import {
  IExamProps,
  IExamQuestionProps,
} from "@/domain/entities/exam/exam.props";
import { PrismaExamWithRelations } from "@/infrastructure/persistence/exam-mgmt";
import { formatImageUrl } from "@/shared/utils/url.util";
import { Prisma, Status } from "@prisma/client";

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
      question: q.question
        ? {
            content: q.question.content,
            imageUrl: q.question.imageUrl ?? undefined, // Đảm bảo trả về undefined nếu db là null

            // 3. Chuyển đổi an toàn danh sách Answers
            answers: (q.question.answers || []).map((ans) => ({
              content: ans.content,
              imageUrl: ans.imageUrl ?? undefined,
            })),
          }
        : undefined,
      chapterName: q.question?.chapter?.name ?? undefined,
    }));

    // 2. Gom thành Props sạch
    const props: IExamProps = {
      id: raw.id,
      name: raw.name,
      userId: raw.userId,
      examMatrixId: raw.examMatrixId ?? "",
      licenseCategoryId: raw.licenseCategoryId,
      totalQuestions: raw.totalQuestions,
      passingScore: raw.passingScore,
      durationMinutes: raw.durationMinutes,
      minCriticalQuestions: raw.minCriticalQuestions,
      isChapter: raw.isChapter,
      isEdited: raw.isEdited,
      status: raw.status as Status,
      score: raw.score,
      isPassed: raw.isPassed,
      deletedAt: raw.deletedAt,
      startedAt: raw.startedAt,
      endedAt: raw.endedAt ?? null,
      questions,
      fullName: raw.user?.fullName ?? "",
      licenseCategoryName: raw.licenseCategory?.name,
    };

    // 3. Khởi tạo qua Factory Method
    return ExamEntity.reconstitute(props);
  }

  /**
   * @description Chuyển đổi sang định dạng Create (Dùng cho prisma.exam.create)
   */
  public static toCreatePersistence(exam: ExamEntity): Prisma.ExamCreateInput {
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
      endedAt: props.endedAt,
      createdAt: props.createdAt,
      updatedAt: props.updatedAt,
      isChapter: props.isChapter,

      // Quan hệ bắt buộc: Connect
      user: { connect: { id: props.userId } },
      licenseCategory: { connect: { id: props.licenseCategoryId } },

      // Quan hệ không bắt buộc: Chỉ connect nếu có ID
      ...(props.examMatrixId && {
        examMatrix: { connect: { id: props.examMatrixId } },
      }),

      // Snapshot Questions: Create lồng (Nested Create)
      questions: {
        create: (props.questions || []).map((q) => ({
          questionId: q.questionId,
          correctAnswer: q.correctAnswer,
          isCritical: q.isCritical,
          indexNumber: q.indexNumber,
        })),
      },
    };
  }

  /**
   * @description Chuyển đổi thực thể sang định dạng cập nhật của Prisma.
   * Tập trung vào việc làm mới Snapshot câu hỏi và duy trì các mối quan hệ.
   * @param {ExamEntity} exam - Thực thể bài thi.
   * @returns {Prisma.ExamUpdateInput} Dữ liệu đầu vào cho lệnh update.
   */
  public static toUpdatePersistence(exam: ExamEntity): Prisma.ExamUpdateInput {
    const { props } = exam;

    return {
      // 1. Cập nhật thông tin cơ bản và kết quả
      name: props.name,
      totalQuestions: props.totalQuestions,
      passingScore: props.passingScore,
      durationMinutes: props.durationMinutes,
      minCriticalQuestions: props.minCriticalQuestions,
      status: props.status,
      score: props.score,
      isPassed: props.isPassed,
      startedAt: props.startedAt,
      endedAt: props.endedAt,
      createdAt: props.createdAt,
      updatedAt: props.updatedAt,
      isEdited: props.isEdited ?? false,

      // 2. Xử lý các quan hệ (Connect/Disconnect)
      // Thường userId sẽ không thay đổi, nhưng giữ connect để đảm bảo tính nhất quán
      user: { connect: { id: props.userId } },

      // 3. Logic làm mới danh sách câu hỏi (Snapshot Strategy)
      questions: {
        // Xóa toàn bộ Snapshot cũ của bài thi này
        deleteMany: {},

        // Tái tạo toàn bộ Snapshot mới từ Entity
        createMany: {
          data: props.questions.map((q) => ({
            questionId: q.questionId,
            indexNumber: q.indexNumber,
            isCritical: q.isCritical,
            correctAnswer: q.correctAnswer,
          })),
        },
      },
    };
  }

  /**
   * @description Chuyển đổi một Exam Entity sang định dạng dữ liệu phản hồi (Response DTO).
   * @param {ExamEntity} entity - Đối tượng Exam Domain cần chuyển đổi.
   * @returns {IExamResponseDTO} DTO chứa dữ liệu đã được định dạng để trả về cho Client.
   */
  public static toResponse(entity: ExamEntity): IExamResponseDTO {
    const { props } = entity;
    return new ExamResponseDTO({
      id: props.id ?? "",
      name: props.name,
      userId: props.userId,
      licenseCategoryId: props.licenseCategoryId,
      totalQuestions: props.totalQuestions,
      durationMinutes: props.durationMinutes,
      minCriticalQuestions: props.minCriticalQuestions,
      passingScore: props.passingScore,
      startedAt: props.startedAt,
      createdAt: props.createdAt ?? new Date(),
      fullName: props.fullName,
      isEdited: props.isEdited ?? false,
      isChapter: props.isChapter ?? false,
      examMatrixId: props.examMatrixId ?? "",
      licenseCategoryName: props.licenseCategoryName,
      // endedAt: props.endedAt ?? null,
      status: props.status,
      questions: props.questions.map(
        (q): IExamQuestionResponseDTO => ({
          questionId: q.questionId,
          indexNumber: q.indexNumber,
          chapterId: q.chapterId,
          chapterName: q.chapterName,
          isCritical: q.isCritical,
          // isCorrect: q.isCorrect ?? null,
          // correctAnswer: q.correctAnswer,
        }),
      ),
    });
  }

  public static toFullContentResponseDTO(
    entity: ExamEntity,
  ): IExamUserFullContentResponseDTO {
    return new ExamUserFullContentResponseDTO({
      examId: entity.id ?? "",
      title: entity.props.name,
      limitMinutes: entity.props.durationMinutes,
      totalQuestions: entity.props.totalQuestions,
      licenseCategoryName: entity.props.licenseCategoryName,
      questions: (entity.props.questions || []).map(
        (eq): ExamUserQuestionResponseDTO => {
          // Lấy trực tiếp thông tin từ snapshot (không còn dùng .props ở đây)
          const questionSnapshot = eq.question;

          return new ExamUserQuestionResponseDTO({
            questionId: eq.questionId,
            indexNumber: eq.indexNumber,

            // Truy cập trực tiếp vào các thuộc tính của interface IQuestionSnapshotProps
            content:
              questionSnapshot?.content ??
              "Nội dung câu hỏi đang được cập nhật",
            imageUrl: formatImageUrl(questionSnapshot?.imageUrl),
            isCritical: eq.isCritical,

            // Metadata đã được phẳng hóa (flatten) trong IExamQuestionProps
            chapterName: eq.chapterName,

            // Ánh xạ mảng đáp án từ IAnswerSnapshotProps sang DTO
            answers: (questionSnapshot?.answers || []).map(
              (ans, idx): IExamUserAnswerResponseDTO => ({
                position: idx + 1,
                content: ans.content,
                imageUrl: formatImageUrl(ans.imageUrl),
              }),
            ),
          });
        },
      ),
    });
  }

  /**
   * @description Chuyển đổi từ Domain Entity sang Response DTO kết quả chi tiết.
   * Sử dụng dữ liệu đã được chấm điểm sau khi gọi hàm complete().
   */
  public static toResultResponseDTO(
    entity: ExamEntity,
  ): IExamUserResultResponseDTO {
    const { props } = entity;

    return new ExamUserResultResponseDTO({
      // 1. Thông tin định danh đề thi
      examId: entity.id ?? "",
      title: props.name,
      licenseCategoryName: props.licenseCategoryName,

      // 2. Kết quả chấm điểm (Core Results)
      score: props.score,
      totalQuestions: props.totalQuestions,
      correctAnswers: props.score,
      wrongAnswers: props.wrongCount ?? 0,
      skippedAnswers: props.skippedCount ?? 0,
      passed: props.isPassed,
      hasFailedCritical: props.hasFailedCritical ?? false,
      passingScore: props.passingScore,

      // 3. Phân tích thời gian (Time Analytics)
      timeSpent: props.resultMetadata?.timeSpent ?? 0,
      timeRemaining: props.resultMetadata?.timeRemaining ?? 0,
      timeExam: props.durationMinutes * 60,
      isAutoSubmit: props.resultMetadata?.isAutoSubmit ?? false,
      clientFinishedAt:
        props.resultMetadata?.clientFinishedAt?.toISOString() ??
        new Date().toISOString(),

      // 4. Nội dung bài làm để xem lại (Review)
      questions: (props.questions || []).map(
        (eq): IExamUserQuestionResponseDTO => {
          // Snapshot này chứa nội dung câu hỏi từ database SQL
          const snapshot = eq.question;

          return {
            questionId: eq.questionId,
            indexNumber: eq.indexNumber,
            content: snapshot?.content ?? "Nội dung câu hỏi không khả dụng",
            imageUrl: formatImageUrl(snapshot?.imageUrl),
            isCritical: eq.isCritical,
            chapterName: eq.chapterName,

            // Đáp án User chọn và đáp án đúng để FE render màu Xanh/Đỏ
            userSelectedAnswer: eq.userAnswer,
            correctAnswer: eq.correctAnswer,

            // Danh sách các lựa chọn (options)
            answers: (snapshot?.answers || []).map((ans, idx) => ({
              position: idx + 1, // Chuyển từ index 0 sang vị trí 1, 2, 3...
              content: ans.content,
              imageUrl: formatImageUrl(ans.imageUrl),
            })),
          };
        },
      ),
    });
  }

  /**
   * @description Chuyển đổi Exam Entity sang DTO tóm tắt.
   * @param entity - Thực thể Exam cần chuyển đổi.
   * @returns DTO chứa các thông tin cơ bản của bộ đề.
   */
  public static toSummaryResponseDTO(
    entity: ExamEntity,
  ): IExamSummaryResponseDTO {
    return new ExamSummaryResponseDTO({
      id: entity.id ?? "",
      title: entity.props.name,
      category: entity.props.licenseCategoryName || "N/A",
      totalQuestions: entity.props.totalQuestions,
      passScore: entity.props.passingScore,
      limitMinutes: entity.props.durationMinutes,
    });
  }

  /**
   * @description Chuyển đổi danh sách Exam Entity sang định dạng phản hồi (Response).
   * @param {ExamEntity[]} entities - Danh sách các đối tượng Exam Domain.
   * @returns {IExamResponseDTO[]} Mảng dữ liệu phản hồi cho Client.
   */
  public static toResponseList(entities: ExamEntity[]): IExamResponseDTO[] {
    return entities.map((entity) => this.toResponse(entity));
  }
}
