import { Role } from "@/domain/entities/role/role.entity";
import { SelectionResponseDto } from "@/shared/responses/selection-response.dto";

/**
 * @interface IRoleService
 * @description Giao diện điều phối nghiệp vụ liên quan đến Vai trò (Role).
 * Chịu trách nhiệm truy vấn, xử lý và định dạng dữ liệu Role cho các tầng phía trên.
 */
export interface IRoleService {
  
  /**
   * @description Truy vấn thông tin chi tiết của một Vai trò thông qua tên định danh.
   * @param {string} name - Tên định danh của Role (Ví dụ: 'USER', 'ADMIN').
   * @returns {Promise<Role>} Thực thể Role tương ứng.
   * @throws {NotFoundError} Nếu không tìm thấy Role với tên đã cung cấp.
   */
  getRoleByName(name: string): Promise<Role>;

  /**
   * @description Truy vấn thông tin chi tiết của một Vai trò thông qua mã định danh (ID).
   * @param {string} id - UUID của Role cần tìm.
   * @returns {Promise<Role>} Thực thể Role tương ứng.
   * @throws {NotFoundError} Nếu không tìm thấy Role với ID đã cung cấp.
   */
  getRoleById(id: string): Promise<Role>;

  /**
   * @description Lấy danh sách toàn bộ các Vai trò hiện có trong hệ thống.
   * @returns {Promise<Role[]>} Mảng chứa các thực thể Role.
   */
  getAllRoles(): Promise<Role[]>;

  /**
   * @description Lấy danh sách các Vai trò dưới dạng rút gọn (Label/Value).
   * Thường được sử dụng để đổ dữ liệu vào các thành phần Dropdown hoặc Select trên giao diện.
   * @returns {Promise<SelectionResponseDto[]>} Danh sách Role định dạng selection (Value: ID, Label: Name).
   */
  getRoleSelections(): Promise<SelectionResponseDto[]>;
}