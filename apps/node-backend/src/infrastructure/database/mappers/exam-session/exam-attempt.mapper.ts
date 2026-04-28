import { ExamAttemptEntity } from "@/domain/entities/exam-attempt/exam-attempt.entity";
import { ExamEntity } from "@/domain/entities/exam/exam.entity";
import { Question } from "@/domain/entities/question/question.entity";
import { IExamAttemptPersistence } from "@/infrastructure/persistence/exam-session/exam-attempt.record";
import { AppError, ErrorCode } from "@/shared/errors";
import {
    CreateExamAttemptProps,
    IAnswerSnapshot,
    IExamAttemptProps,
    IQuestionSnapshot
} from "@/domain/entities/exam-attempt/exam-attempt.props";
import { IExamQuestionProps } from "@/domain/entities/exam/exam.props";
import { IExamAttemptResponseDTO } from "@/application/dtos/response/exam-attempt/exam-attempt.respone.dto";

/**
 * @class ExamAttemptMapper
 * @description Điều phối việc đóng gói dữ liệu từ MySQL (Template) sang NoSQL (Snapshot).
 */
export class ExamAttemptMapper {

    /**
       * @description Ánh xạ từ Domain Entity sang Persistence Model (MongoDB).
       */
    public static toPersistence(entity: ExamAttemptEntity): IExamAttemptPersistence {
        const props = entity.props;

        // Ràng buộc: ID phải tồn tại vì Entity đã được khởi tạo qua Factory Method
        if (!props.id) {
            throw new AppError(ErrorCode.EXAM_ATTEMPT.ID_REQUIRED)
        }

        return {
            _id: props.id, // Chuyển id của Entity thành _id cho MongoDB
            userId: props.userId,
            examId: props.examId,
            score: props.score,
            correctCount: props.correctCount,
            isPassed: props.isPassed,
            durationSeconds: props.durationSeconds,
            submittedAt: props.submittedAt,

            // Snapshot là dữ liệu quan trọng nhất, lưu dưới dạng Object đã đóng băng
            snapshot: props.snapshot,

            // Các trường hệ thống từ Base Props
            // Ép kiểu Date nếu BaseProps định nghĩa là optional
            createdAt: props.createdAt as Date,
            updatedAt: props.updatedAt as Date,
            deletedAt: props.deletedAt || null, // Đảm bảo lưu null thay vì undefined
        };
    }

    /**
    * @description Chuyển đổi từ Persistence Model (MongoDB) ngược về Domain Entity.
    * Đây là quá trình 'Reconstitution' trong DDD.
    */
    public static toDomain(raw: IExamAttemptPersistence): ExamAttemptEntity {
        // Mapping ngược từ _id (DB) sang id (Entity Props)
        const props: IExamAttemptProps = {
            id: raw._id,
            userId: raw.userId,
            examId: raw.examId,
            score: raw.score,
            correctCount: raw.correctCount,
            isPassed: raw.isPassed,
            durationSeconds: raw.durationSeconds,
            submittedAt: raw.submittedAt,

            // Snapshot được giữ nguyên vì interface IExamSnapshot đã đồng bộ
            snapshot: raw.snapshot,

            // Các trường hệ thống từ IBaseProps
            createdAt: raw.createdAt,
            updatedAt: raw.updatedAt,
            deletedAt: raw.deletedAt,
        };

        // Sử dụng phương thức reconstitute để tạo lại Entity mà không chạy lại logic factory 'create'
        return ExamAttemptEntity.reconstitute(props);
    }

    /**
    * @description Chuyển đổi kết quả từ thực thể Exam và danh sách câu hỏi sang Props cho NoSQL.
    * @param exam Thực thể Exam chứa danh sách ExamQuestion (Luật chơi/Metadata).
    * @param fullQuestions Danh sách thực thể Question chứa nội dung chi tiết (Thịt).
    * @param userAnswers Map đáp án thí sinh chọn { questionId: selectedIndex }.
    */
    public static toCreateProps(
        exam: ExamEntity,
        fullQuestions: Question[],
        userAnswers: Map<string, number | null>
    ): CreateExamAttemptProps {

        // 1. Map danh sách câu hỏi sang Snapshot bằng hàm riêng đã tách
        const questionSnapshots: IQuestionSnapshot[] = exam.props.questions.map((eq) => {
            const qEntity = fullQuestions.find(q => q.id === eq.questionId);

            if (!qEntity) {
                throw new Error(`Dữ liệu nội dung cho câu hỏi ${eq.questionId} không tìm thấy.`);
            }

            const selectedIndex = userAnswers.get(eq.questionId) ?? null;

            return this._toQuestionSnapshot(eq, qEntity, selectedIndex);
        });

        // 2. Trả về bộ Props hoàn chỉnh
        return {
            userId: exam.props.userId,
            examId: exam.id!,
            score: exam.props.score,
            correctCount: exam.props.score, // Cần check lại logic: điểm số vs số câu đúng
            isPassed: exam.props.isPassed,
            durationSeconds: this._calculateDuration(exam.props.startedAt, exam.props.endedAt!),
            submittedAt: exam.props.endedAt!,
            snapshot: {
                title: exam.props.name,
                licenseCategory: exam.props.licenseCategoryId,
                totalQuestions: exam.props.totalQuestions,
                passingScore: exam.props.passingScore,
                questions: questionSnapshots
            }
        };
    }

    /**
    * @private
    * @description Chuyển đổi dữ liệu câu hỏi và câu trả lời thành bản Snapshot.
    */
    private static _toQuestionSnapshot(
        examQuestion: IExamQuestionProps,
        questionEntity: Question,
        userSelectedIndex: number | null
    ): IQuestionSnapshot {
        const isCorrect = userSelectedIndex === examQuestion.correctAnswer;

        const options: IAnswerSnapshot[] = questionEntity.props.answers.map((ans, idx) => ({
            answerIndex: idx + 1,
            content: ans.props.content,
            imageUrl: ans.props.imageUrl
        }));

        return {
            questionId: examQuestion.questionId,
            indexNumber: examQuestion.indexNumber,
            content: questionEntity.props.content,
            imageUrl: questionEntity.props.imageUrl,
            isCritical: examQuestion.isCritical,
            chapterId: questionEntity.props.chapterId,
            chapterName: questionEntity.props.chapterName || "Chưa phân loại",
            options: options,
            selectedAnswerIndex: userSelectedIndex,
            correctAnswerIndex: examQuestion.correctAnswer,
            isCorrect: isCorrect
        };
    }

    /**
     * @description Tính toán thời gian làm bài (giây)
     */
    private static _calculateDuration(start: Date, end: Date): number {
        return Math.floor((end.getTime() - start.getTime()) / 1000);
    }


    /**
   * @description Chuyển đổi từ Domain Entity sang Response DTO.
   * Chỗ này là "Source of Truth" cho dữ liệu trả về FE.
   */
    public static toResponseDTO(entity: ExamAttemptEntity): IExamAttemptResponseDTO {
        const { props } = entity;

        return {
            id: entity.id!,
            examId: props.examId,
            examTitle: props.snapshot.title,
            score: props.score,
            isPassed: props.isPassed,
            correctCount: props.correctCount,
            totalQuestions: props.snapshot.totalQuestions,
            durationSeconds: props.durationSeconds,
            submittedAt: props.submittedAt
        };
    }

    /**
     * @description Chuyển đổi danh sách thực thể sang danh sách DTO.
     */
    public static toResponseDTOList(entities: ExamAttemptEntity[]): IExamAttemptResponseDTO[] {
        return entities.map(entity => this.toResponseDTO(entity));
    }
}