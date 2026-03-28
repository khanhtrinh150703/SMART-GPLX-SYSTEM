import { Role } from "@/domain/entities/role/role.entity";

/**
 * @interface IRoleService
 * @description Giao diện điều phối nghiệp vụ liên quan đến Vai trò (Role)
 */
export interface IRoleService {
  /**
   * @description Lấy thông tin Role theo tên định danh
   * @param name Tên role (vd: 'user', 'admin')
   */
  getRoleByName(name: string): Promise<Role>;

  /**
   * @description Lấy thông tin Role theo ID
   * @param id UUID của role
   */
  getRoleById(id: string): Promise<Role>;

  /**
   * @description Lấy toàn bộ danh sách vai trò
   */
  getAllRoles(): Promise<Role[]>;
}