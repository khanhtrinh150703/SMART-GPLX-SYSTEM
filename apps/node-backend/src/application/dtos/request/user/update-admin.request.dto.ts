/**
 * @description Input interface cho việc khởi tạo DTO từ Controller.
 */
export interface IUpdateAdminInput {
  fullName?: string;
  roles?: string[]; // Danh sách ID hoặc Name của Role gửi từ Frontend
}

/**
 * @description DTO xử lý yêu cầu cập nhật thông tin tài khoản Admin.
 * Được sử dụng trong kịch bản Quản trị viên cập nhật thông tin người dùng khác hoặc chính mình.
 */
export class UpdateAdminRequestDTO {
  /** @property {string} fullName - Họ tên đầy đủ mới (Tùy chọn). */
  readonly fullName?: string;

  /** @property {string[]} roles - Danh sách các vai trò mới được gán cho người dùng (Tùy chọn). */
  readonly roles?: string[];

  /**
   * @description Khởi tạo DTO với dữ liệu thô từ Request.
   * @param {IUpdateAdminInput} data - Dữ liệu đầu vào.
   */
  constructor(data: IUpdateAdminInput) {
    this.fullName = data.fullName?.trim();
    this.roles = data.roles;
  }

  /**
   * @description Kiểm tra tính hợp lệ của dữ liệu cập nhật.
   * Đảm bảo ít nhất một trường được cung cấp và dữ liệu đúng định dạng.
   * @returns {boolean}
   */
  public isValid(): boolean {
    // 1. Phải có ít nhất một trong hai trường để cập nhật
    if (!this.fullName && (!this.roles || this.roles.length === 0)) {
      return false;
    }

    // 2. Nếu có gửi fullName, không được để chuỗi rỗng sau khi trim
    if (this.fullName !== undefined && this.fullName.length === 0) {
      return false;
    }

    // 3. Nếu có gửi roles, phải là một mảng
    if (this.roles !== undefined && !Array.isArray(this.roles)) {
      return false;
    }

    return true;
  }
}