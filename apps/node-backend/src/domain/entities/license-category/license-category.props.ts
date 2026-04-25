export interface ILicenseCategoryProps {
  id: string;
  name: string;
  description: string;
  minAge: number;
  createdAt: Date;
  updatedAt: Date;
  deletedAt?: Date;
}

/**
 * @description Type phục vụ việc tạo mới Hạng bằng lái.
 * 'name' là bắt buộc (ví dụ: "Hạng A1"), 'minAge' có thể mặc định là 18.
 */
export type CreateLicenseCategoryProps = Omit<ILicenseCategoryProps, 
  | 'id' 
  | 'createdAt' 
  | 'updatedAt' 
  | 'deletedAt'
> & {
  description?: string;
  minAge?: number;
};