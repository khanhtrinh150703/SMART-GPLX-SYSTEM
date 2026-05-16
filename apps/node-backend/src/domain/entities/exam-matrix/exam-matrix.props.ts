export interface IExamMatrixDetailProps {
  id?: string;
  chapterId: string;
  percentage: number;
}

export interface IExamMatrixProps {
  id?: string;
  name: string;
  licenseCategoryId: string;
  licenseCategoryName?: string;
  totalQuestions: number;
  passingScore: number;
  durationMinutes: number;
  minCriticalQuestions: number;
  details: IExamMatrixDetailProps[];
  createdAt: Date;
  updatedAt: Date;
  isDefault: boolean;
  isChapter: boolean;
  deletedAt?: Date;
}
/**
 * @description Type dùng để tạo Ma trận đề mới.
 * Loại bỏ các trường tự sinh để Entity tự quyết định.
 */
export type CreateExamMatrixProps = Omit<IExamMatrixProps,
  | 'id'
  | 'createdAt'
  | 'updatedAt'
  | 'deletedAt'
> & {
  totalQuestions?: number;
  passingScore?: number;
  durationMinutes?: number;
};