// user.props.ts
import { Status } from "@/shared/config/status.config";
import { Role } from "../role/role.entity";

export interface IUserProps {
  id: string;
  username: string;
  email: string;
  fullName: string;
  phoneNumber: string;
  passwordHash: string;
  status: Status;
  urlPicture: string;
  roles: Role[];
  createdAt: Date;
  updatedAt: Date;
  deletedAt?: Date;
}

/**
 * @description Type phục vụ việc tạo mới User.
 * Các trường timestamps và ID sẽ được Entity tự quản lý.
 */
export type CreateUserProps = Omit<IUserProps,
  | 'id'
  | 'status'
  | 'roles'
  | 'createdAt'
  | 'updatedAt'
  | 'deletedAt'
> & {
  status?: string;
  roles?: Role[];
};