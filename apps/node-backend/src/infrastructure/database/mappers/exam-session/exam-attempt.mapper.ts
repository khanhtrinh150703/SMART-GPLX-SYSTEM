import { ExamAttemptEntity } from "@/domain/entities/exam-attempt/exam-attempt.entity";
import { ExamEntity } from "@/domain/entities/exam/exam.entity";
import { Question } from "@/domain/entities/question/question.entity";
import { IExamAttemptPersistence } from "@/infrastructure/persistence/exam-session/exam-attempt.record";
import {
  CreateExamAttemptProps,
  IAnswerSnapshot,
  IExamAttemptProps,
  IQuestionSnapshot,
} from "@/domain/entities/exam-attempt/exam-attempt.props";
import { IExamQuestionProps } from "@/domain/entities/exam/exam.props";
import {
  ExamAttemptResponseDTO,
  IExamAttemptResponseDTO,
  IQuestionSnapshotResponseDTO,
} from "@/application/dtos/response/exam-attempt/exam-attempt.respone.dto";
import { AppError } from "@/shared/errors/error-app";
import { ErrorCode } from "@/shared/errors/error-codes";
import { formatImageUrl } from "@/shared/utils/url.util";

/**
 * @description Blueprint input for the mapping orchestration.
 * (Dữ liệu đầu vào cho quá trình điều phối mapper).
 */
export interface ICreateAttemptInput {
  exam: ExamEntity;
  fullQuestions: Question[];
  userAnswers: Map<string, number | null>;
  isAutoSubmit?: boolean;
}

/**
 * @class ExamAttemptMapper
 * @description Điều phối việc đóng gói dữ liệu từ MySQL (Template) sang NoSQL (Snapshot).
 */
export class ExamAttemptMapper {
  /**
   * @description Dùng chung cho cả Create và Update để tránh lặp code (Private)
   */
  private static toCommonPersistence(
    entity: ExamAttemptEntity,
  ): IExamAttemptPersistence {
    const { props } = entity;

    return {
      _id: entity.id ?? "",
      userId: props.userId,
      userName: props.userName,
      examId: props.examId,
      licenseCategoryId: props.licenseCategoryId,
      licenseCategoryName: props.licenseCategoryName,

      // Kết quả chấm điểm
      score: props.score,
      correctCount: props.correctCount,
      wrongCount: props.wrongCount ?? 0,
      skippedCount: props.skippedCount ?? 0,
      totalQuestions: props.totalQuestions,

      // Trạng thái đạt/loại
      isPassed: props.isPassed,
      hasFailedCritical: props.hasFailedCritical ?? false,
      passingScore: props.passingScore,
      
      // Metadata & Snapshot
      durationSeconds: props.durationSeconds,
      isAutoSubmit: props.isAutoSubmit,
      submittedAt: props.submittedAt,
      totalTimeExam: props.totalTimeExam,
      snapshot: props.snapshot,
      
      // Timestamps
      createdAt: props.createdAt as Date,
      updatedAt: props.updatedAt as Date,
      deletedAt: props.deletedAt ?? null,
    };
  }

  /**
   * @description Dùng khi INSERT (Yêu cầu full fields)
   */
  public static toCreatePersistence(
    entity: ExamAttemptEntity,
  ): IExamAttemptPersistence {
    return this.toCommonPersistence(entity);
  }

  /**
   * @description Dùng khi UPDATE (Omit hoặc Pick các trường cho phép sửa)
   * Ở đây ta dùng Partial để bảo vệ các trường bất biến.
   */
  public static toUpdatePersistence(
    entity: ExamAttemptEntity,
  ): Partial<IExamAttemptPersistence> {
    const record = this.toCommonPersistence(entity);

    const {
      _id,
      userId: _userId,
      createdAt: _createdAt,
      ...updateData
    } = record;

    return updateData;
  }

  /**
   * @description Chuyển đổi từ dữ liệu Persistence (MongoDB Record) ngược về Domain Entity.
   * @param raw - Bản ghi thô từ Database (IExamAttemptPersistence).
   * @returns {ExamAttemptEntity} - Thực thể Domain đã được tái tạo trạng thái.
   */
  public static toDomain(raw: IExamAttemptPersistence): ExamAttemptEntity {
    // Mapping ngược từ _id (DB) sang id (Entity Props)
    const props: IExamAttemptProps = {
      id: raw._id,
      userId: raw.userId,
      userName: raw.userName,
      examId: raw.examId,
      licenseCategoryId: raw.licenseCategoryId,
      licenseCategoryName: raw.licenseCategoryName,

      // Kết quả chi tiết
      score: raw.score,
      correctCount: raw.correctCount,
      wrongCount: raw.wrongCount ?? 0,
      skippedCount: raw.skippedCount ?? 0,
      totalQuestions: raw.totalQuestions,

      isPassed: raw.isPassed,
      hasFailedCritical: raw.hasFailedCritical ?? false,
      passingScore: raw.passingScore,

      // Metadata thời gian
      durationSeconds: raw.durationSeconds,
      isAutoSubmit: raw.isAutoSubmit,
      submittedAt: raw.submittedAt,
      totalTimeExam: raw.totalTimeExam,

      // Snapshot được giữ nguyên vì interface IExamSnapshot đã đồng bộ
      snapshot: raw.snapshot,

      // Các trường hệ thống từ IBaseProps
      createdAt: raw.createdAt,
      updatedAt: raw.updatedAt,
      deletedAt: raw.deletedAt,
    };

    return ExamAttemptEntity.reconstitute(props);
  }

  /**
   * @description Chuyển đổi dữ liệu từ phiên thi sang Props để khởi tạo Entity.
   * @param exam Thực thể phiên thi hiện tại.
   * @param fullQuestions Danh sách thực thể câu hỏi đầy đủ nội dung.
   * @param userAnswers Bản đồ câu trả lời của người dùng.
   * @param isAutoSubmit Cờ xác định nộp bài tự động hay thủ công.
   */
  public static toCreateProps(
    input: ICreateAttemptInput,
  ): CreateExamAttemptProps {
    const { exam, fullQuestions, userAnswers, isAutoSubmit = false } = input;
    const questionSnapshots: IQuestionSnapshot[] = exam.props.questions.map(
      (eq) => {
        const qEntity = fullQuestions.find((q) => q.id === eq.questionId);

        if (!qEntity) {
          throw new AppError(
            ErrorCode.QUESTION.NOT_FOUND,
            `Dữ liệu nội dung cho câu hỏi ${eq.questionId} không tìm thấy.`,
          );
        }

        const selectedIndex = userAnswers.get(eq.questionId) ?? null;
        return this._toQuestionSnapshot(eq, qEntity, selectedIndex);
      },
    );

    return {
      userId: exam.props.userId,
      userName: exam.props.fullName ?? "Người dùng",
      examId: exam.id ?? "",
      licenseCategoryId: exam.props.licenseCategoryId,
      licenseCategoryName: exam.props.licenseCategoryName ?? "",

      // Kết quả chi tiết
      score: exam.props.score,
      correctCount: exam.props.score,
      wrongCount: exam.props.wrongCount ?? 0,
      skippedCount: exam.props.skippedCount ?? 0,
      totalQuestions: exam.props.totalQuestions,

      // Trạng thái đạt/loại
      isPassed: exam.props.isPassed,
      hasFailedCritical: exam.props.hasFailedCritical ?? false,
      passingScore: exam.props.passingScore,

      // Metadata thời gian
      durationSeconds: exam.props.resultMetadata?.timeSpent ?? 0,
      isAutoSubmit: isAutoSubmit,
      submittedAt: exam.props.endedAt!,
      totalTimeExam: exam.props.durationMinutes,
      // Toàn bộ nội dung tại thời điểm nộp
      snapshot: {
        title: exam.props.name,
        licenseCategory: exam.props.licenseCategoryId,
        totalQuestions: exam.props.totalQuestions,
        passingScore: exam.props.passingScore,
        questions: questionSnapshots,
      },
    };
  }

  /**
   * @private
   * @description Chuyển đổi dữ liệu câu hỏi và câu trả lời thành bản Snapshot.
   */
  private static _toQuestionSnapshot(
    examQuestion: IExamQuestionProps, 
    questionEntity: Question, 
    userSelectedIndex: number | null,
  ): IQuestionSnapshot {
    const isCorrect = userSelectedIndex === examQuestion.correctAnswer;

    const options: IAnswerSnapshot[] = questionEntity.props.answers.map(
      (ans, idx) => ({
        answerIndex: idx + 1,
        content: ans.props.content,
        imageUrl: ans.props.imageUrl,
      }),
    );

    const finalChapterName =
      examQuestion.chapterName ||
      questionEntity.props.chapterName ||
      "Chưa phân loại";

    return {
      questionId: examQuestion.questionId,
      indexNumber: questionEntity.props.indexNumber,
      content: questionEntity.props.content,
      timeSpent: examQuestion.timeSpent ?? 0,
      imageUrl: questionEntity.props.imageUrl,
      isCritical: examQuestion.isCritical,
      chapterId: questionEntity.props.chapterId,
      chapterName: finalChapterName,
      options: options,
      selectedAnswerIndex: userSelectedIndex,
      correctAnswerIndex: examQuestion.correctAnswer,
      isCorrect: isCorrect,
    };
  }

  public static toEntity(input: ICreateAttemptInput): ExamAttemptEntity {
    const props = this.toCreateProps(input);

    // Trả về Entity (Tự sinh ID và Validate bên trong)
    return ExamAttemptEntity.create(props);
  }

  /**
   * @description Mapper chuyển đổi từ ExamAttemptEntity (NoSQL) sang DTO phản hồi chuẩn.
   * Đảm bảo khớp 100% với IExamAttemptResponseDTO và fix lỗi property missing.
   */
  public static toResponseDTO(
    entity: ExamAttemptEntity,
  ): IExamAttemptResponseDTO {
    const { props } = entity;
    const { snapshot } = props;

    // Sử dụng class constructor để tận dụng logic _formatDuration tự động
    return new ExamAttemptResponseDTO({
      // 1. Thông tin định danh & Người dùng
      id: entity.id!,
      userId: props.userId,
      userName: props.userName,
      examId: props.examId,
      title: snapshot.title, // Tên hiển thị chung
      licenseCategoryName: props.licenseCategoryName,

      // 2. Kết quả chấm điểm (Core Results - Đã đồng bộ tên chuẩn)
      score: props.score,
      totalQuestions: props.totalQuestions,
      correctAnswers: props.correctCount, // correctCount -> correctAnswers
      wrongAnswers: props.wrongCount ?? 0,
      skippedAnswers: props.skippedCount ?? 0,
      passed: props.isPassed, // isPassed -> passed
      hasFailedCritical: props.hasFailedCritical ?? false,
      passingScore: props.passingScore,

      // 3. Phân tích thời gian (Time Analytics - Đã đồng bộ tên chuẩn)
      timeSpent: props.durationSeconds, // durationSeconds -> timeSpent
      timeExam: props.totalTimeExam * 60,
      isAutoSubmit: props.isAutoSubmit,
      clientFinishedAt: props.submittedAt.toISOString(),

      // 4. Nội dung Review (Mapped từ Snapshot NoSQL sang DTO Response)
      questions: (snapshot.questions || []).map(
        (q): IQuestionSnapshotResponseDTO => ({
          questionId: q.questionId,
          indexNumber: q.indexNumber,
          content: q.content ?? "Nội dung câu hỏi không khả dụng",
          imageUrl: formatImageUrl(q.imageUrl) ?? "",
          isCritical: q.isCritical,
          chapterId: q.chapterId,
          chapterName: q.chapterName,
          timeSpent: q.timeSpent ?? 0,
          userSelectedAnswer: q.selectedAnswerIndex,
          correctAnswer: q.correctAnswerIndex,
          isCorrect: q.isCorrect,
          explanation: q.explanation,

          // Chuyển đổi từ 'options' (Snapshot) sang 'answers' (Response DTO)
          answers: (q.options || []).map((opt) => ({
            position: opt.answerIndex, // Giữ nguyên vị trí đáp án 1, 2, 3...
            content: opt.content,
            imageUrl: formatImageUrl(opt.imageUrl),
          })),
        }),
      ),
    });
  }

  /**
   * @description Chuyển đổi danh sách thực thể sang danh sách DTO.
   */
  public static toResponseDTOList(
    entities: ExamAttemptEntity[],
  ): IExamAttemptResponseDTO[] {
    return entities.map((entity) => this.toResponseDTO(entity));
  }
}
