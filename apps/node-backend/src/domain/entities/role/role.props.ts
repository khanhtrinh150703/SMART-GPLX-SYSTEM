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