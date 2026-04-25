/**
 * Interface định nghĩa các thuộc tính của Chapter.
 */
export interface IChapterProps {
  id: string;
  name: string;
  description: string | null;
  orderIndex: number;
  code: string;
  createdAt: Date;
  updatedAt: Date;
  deletedAt?: Date;
}

/**
 * @description Type dùng để tạo mới Chapter. 
 * 'code' là bắt buộc vì đây là mã định danh nghiệp vụ (Business Code).
 */
export type CreateChapterProps = Omit<IChapterProps, 
  | 'id' 
  | 'createdAt' 
  | 'updatedAt' 
  | 'deletedAt'
> & {
  description?: string | null;
  orderIndex?: number;
};