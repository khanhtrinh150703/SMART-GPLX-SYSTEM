// user.props.ts
import { UserStatus } from "./user.status";
import { Role } from "../role/role.entity";

export interface IUserProps {
  id: string;
  username: string;
  email: string;
  fullName: string;
  phoneNumber: string;
  passwordHash: string;
  status: UserStatus;
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