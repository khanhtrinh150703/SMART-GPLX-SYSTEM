import { Permission } from "../permission/permission.entity";

/**
 * Interface định nghĩa các thuộc tính của Role.
 */
export interface IRoleProps {
  id: string;
  name: string;
  description: string;
  permissions: Permission[];
}

/**
 * @description Type phục vụ việc tạo mới Role.
 * Chấp nhận mảng Permission thực thể hoặc để trống.
 */
export type CreateRoleProps = Omit<IRoleProps, 'id'> & {
  description?: string;
  permissions?: Permission[];
};