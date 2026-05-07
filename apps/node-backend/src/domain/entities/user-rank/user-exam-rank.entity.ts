import { BaseEntity } from "@/domain/seedwork/entity.base";
import { IUserExamRankProps, CreateUserExamRankProps } from "./user-exam-rank.props";

/**
 * @description Thực thể Kỷ lục thi (Rich Domain Model).
 */
export class UserExamRankEntity extends BaseEntity<IUserExamRankProps> {
    private constructor(props: IUserExamRankProps) {
        super(props);
    }

    /**
     * @description Khởi tạo thực thể mới (Factory Method).
     */
    public static create(props: CreateUserExamRankProps): UserExamRankEntity {
        const now = new Date();
        return new UserExamRankEntity({
            ...props,
            id: crypto.randomUUID(),
            createdAt: now,
            updatedAt: now,
            deletedAt: null,
        });
    }

    /**
     * @description Tái tạo thực thể từ Database (Reconstitution).
     */
    public static reconstitute(props: IUserExamRankProps): UserExamRankEntity {
        return new UserExamRankEntity(props);
    }

    /**
     * @description Cập nhật thành tích mới nếu tốt hơn kỷ lục cũ.
     * Logic: Điểm cao hơn HOẶC (Điểm bằng nhau nhưng thời gian ngắn hơn).
     */
    public updatePerformance(newScore: number, newDuration: number, attemptId: string): void {
        const isBetterScore = newScore > this.props.bestScore;
        const isSameScoreButFaster =
            newScore === this.props.bestScore && newDuration < this.props.fastestSeconds;

        if (isBetterScore || isSameScoreButFaster) {
            this._props = {
                ...this._props,
                bestScore: newScore,
                fastestSeconds: newDuration,
                lastAttemptId: attemptId,
                updatedAt: new Date()
            };
        }
    }
}