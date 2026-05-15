import { IActiveSessionAnswer } from "@/domain/entities/active-session/active-session.props";

/**
 * @description Bản ghi lưu trữ trong MongoDB cho ActiveSession.
 * Nói không với 'any', mọi trường đều phải rõ ràng.
 */
export interface IActiveSessionPersistence {
  _id: string;
  userId: string;
  examId: string;
  currentQuestionIndex: number;
  currentAnswers: IActiveSessionAnswer[];
  expiresAt: Date;
  createdAt: Date;
  updatedAt: Date;
  deletedAt: Date | null;
}