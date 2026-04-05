export interface ILicenseCategoryProps {
  id?: string;
  name: string;
  description: string;
  minAge: number;
  createdAt?: Date;
  updatedAt?: Date;
  deletedAt: Date | null;
}