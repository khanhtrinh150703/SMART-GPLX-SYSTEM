/**
 * Interface định nghĩa các thuộc tính của Chapter.
 */
export interface IChapterProps {
  id: string;
  name: string;
  description: string | null;
  orderIndex: number;
  code: string;
  createdAt?: Date;
  updatedAt?: Date;
  deletedAt?: Date | null;
}