import { IBaseProps } from "@/domain/seedwork/entity.base";

/**
 * @description Chi tiết từng câu trả lời trong phiên làm bài nháp
 */
export interface IActiveSessionAnswer {
    readonly questionId: string;
    readonly selectedAnswerId: number | null;
    readonly updatedAt: Date;
}

/**
 * @description Props chính cho ActiveSessionEntity (NoSQL)
 */
export interface IActiveSessionProps extends IBaseProps {
    readonly userId: string;
    readonly examId: string;
    currentAnswers: IActiveSessionAnswer[];
    expiresAt: Date; 
}

export type CreateActiveSessionProps = Omit<IActiveSessionProps, "id" | "createdAt" | "updatedAt" | "deletedAt">;