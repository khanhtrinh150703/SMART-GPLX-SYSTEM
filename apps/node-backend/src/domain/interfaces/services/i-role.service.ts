import { Role } from "@/domain/entities/role/role.entity";
import { SelectionResponseDto } from "@/shared/responses/selection-response.dto";

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

  /**
   * @description Lấy danh sách các hạng bằng lái định dạng selection (value/label) có hỗ trợ tìm kiếm (theo mã hạng hoặc tên).
   * @returns {Promise<SelectionResponseDto[]>} - Danh sách các hạng bằng lái rút gọn cho dropdown.
   */
  getRoleSelections(): Promise<SelectionResponseDto[]>;
}