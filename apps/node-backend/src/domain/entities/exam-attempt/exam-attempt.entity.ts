import { BaseEntity } from '@/domain/seedwork/entity.base';
import { CreateExamAttemptProps, IExamAttemptProps, IQuestionSnapshot } from './exam-attempt.props';
import { AppError, ErrorCode } from '@/shared/errors';

export class ExamAttemptEntity extends BaseEntity<IExamAttemptProps> {

    private constructor(props: IExamAttemptProps) {
        super(props);
        // Luôn validate ngay khi khởi tạo để đảm bảo tính toàn vẹn
        this.validate();
    }

    /**
     * @description Factory Method: Khởi tạo kết quả thi mới từ kết quả nộp bài.
     * Đây là lúc AI hoặc Service đẩy dữ liệu đã tính toán xong vào.
     */
    public static create(props: CreateExamAttemptProps): ExamAttemptEntity {
        const now = new Date();
        const finalizedProps: IExamAttemptProps = {
            ...props,
            id: crypto.randomUUID(),
            createdAt: now,
            updatedAt: now,
            deletedAt: null,
        };

        return new ExamAttemptEntity(finalizedProps);
    }

    /**
     * @description Resurrection: Tái tạo thực thể từ NoSQL (MongoDB/DocumentDB).
     * Dùng khi cần hiển thị Dashboard hoặc cho AI phân tích lại lịch sử.
     */
    public static reconstitute(props: IExamAttemptProps): ExamAttemptEntity {
        return new ExamAttemptEntity(props);
    }

    /**
     * @description Invariants (Quy tắc bất biến): Kiểm tra logic nghiệp vụ GPLX.
     * Thực hiện cơ chế "Nghĩ xong mới làm" tại tầng lõi Domain.
     */
    public validate(): void {
        const { score, isPassed, snapshot } = this.props;

        // 1. Kiểm tra giới hạn điểm (0 - 100 hoặc tổng số câu)
        if (score < 0 || score > snapshot.totalQuestions) {
            throw new AppError(ErrorCode.EXAM_ATTEMPT.SCORE_INVALID)
        }

        // 2. Logic "Câu điểm liệt": Kiểm tra xem có câu liệt nào bị làm sai không
        const hasFailedCritical = snapshot.questions.some(
            (q: IQuestionSnapshot) => q.isCritical && !q.isCorrect
        );

        // 3. Kiểm tra tính nhất quán giữa điểm số và trạng thái Đạt/Trượt
        const isActuallyPassed = score >= snapshot.passingScore && !hasFailedCritical;

        if (isPassed !== isActuallyPassed) {
            throw new AppError(ErrorCode.EXAM_ATTEMPT.RESULT_CONSISTENCY_ERROR)
        }
    }

    /**
     * @description Tính toán tỷ lệ hoàn thành theo từng chương.
     * Phục vụ việc cập nhật User Matrix (Async).
     */
    public getPerformanceByChapter(): Map<string, { correct: number; total: number }> {
        const stats = new Map<string, { correct: number; total: number }>();

        this.props.snapshot.questions.forEach((q) => {
            const current = stats.get(q.chapterId) || { correct: 0, total: 0 };
            stats.set(q.chapterId, {
                correct: current.correct + (q.isCorrect ? 1 : 0),
                total: current.total + 1,
            });
        });

        return stats;
    }

    // Getters để truy cập dữ liệu (Read-only)
    public get result() {
        return {
            score: this.props.score,
            isPassed: this.props.isPassed,
            correctCount: this.props.correctCount,
            duration: this.props.durationSeconds
        };
    }

    public get snapshot() {
        return this.props.snapshot;
    }
}