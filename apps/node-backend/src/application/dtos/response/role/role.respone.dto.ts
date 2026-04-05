/**
 * @description Đối tượng truyền tải dữ liệu Vai trò (Role) ở mức độ thu gọn.
 * Chỉ cung cấp các thông tin cần thiết để hiển thị tên và phân quyền cơ bản trên giao diện.
 */
export interface RoleResponseDTO {
  /** @property {string} id - Mã định danh duy nhất của vai trò (UUID). */
  id: string;

  /** @property {string} name - Tên định danh kỹ thuật dùng cho logic check quyền (VD: 'ADMIN', 'STUDENT'). */
  name: string;

  /** @property {string} displayName - Tên hiển thị thân thiện với người dùng (VD: 'Quản trị viên'). */
  displayName?: string;
}