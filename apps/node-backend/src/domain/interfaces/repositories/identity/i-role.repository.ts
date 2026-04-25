import { Role } from "@/domain/entities/role/role.entity";

/**
 * @interface IRoleRepository
 * @description Giao diện quản lý lưu trữ cho thực thể Role
 */
export interface IRoleRepository {
  /**
   * @description Tìm kiếm Role theo tên định danh
   * @param name Tên role (vd: 'user', 'admin')
   * @returns Role entity hoặc null
   */
  findByName(name: string): Promise<Role | null>;

  /**
   * @description Tìm kiếm Role theo ID
   * @param id UUID của role
   */
  findById(id: string): Promise<Role | null>;

  /**
   * @description Lấy danh sách tất cả các Role trong hệ thống
   */
  findAll(): Promise<Role[]>;

  /**
   * @description Lưu hoặc cập nhật một Role
   * @param role Thực thể Role
   */
  createRole(role: Role): Promise<void>;
}