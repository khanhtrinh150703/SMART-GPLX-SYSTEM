import { IBaseProps } from "@/domain/seedwork/entity.base";

/**
 * @description Thuộc tính cốt lõi của bảng kỷ lục người dùng.
 */
export interface IUserExamRankProps extends IBaseProps {
    readonly userId: string;
    readonly examId: string;
    readonly licenseCategoryId: string;
    readonly bestScore: number;
    readonly fastestSeconds: number;
    readonly lastAttemptId: string | null;
}

export type CreateUserExamRankProps = Omit<IUserExamRankProps, 'id' | 'createdAt' | 'updatedAt' | 'deletedAt'>;