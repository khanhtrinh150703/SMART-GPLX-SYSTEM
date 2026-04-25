export interface IAnswerProps {
  id: string;
  content: string;
  isCorrect: boolean;
  imageUrl: string;
  createdAt: Date;
  updatedAt: Date;
  deletedAt?: Date;
}

/**
 * @description Dữ liệu cần thiết để tạo một đáp án mới.
 */
export type CreateAnswerProps = Pick<IAnswerProps, 'content' | 'isCorrect'> & {
  imageUrl?: string;
};