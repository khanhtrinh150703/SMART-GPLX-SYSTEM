import { UserStatus } from "@/domain/entities/user/user.status";

/**
 * @description DTO chứa thông tin thu gọn của Vai trò (Role) để trả về phía Client.
 */
export interface RoleDTO {
  /** @property {string} id - Mã định danh duy nhất của vai trò (UUID). */
  id: string;

  /** @property {string} name - Tên định danh vai trò trong hệ thống (VD: 'ADMIN', 'STUDENT'). */
  name: string;

  /** @property {string} displayName - Tên hiển thị ngôn ngữ tự nhiên (VD: 'Quản trị viên'). */
  displayName?: string;
}

/**
 * @description DTO phản hồi thông tin chi tiết người dùng, đảm bảo an toàn bằng cách loại bỏ các trường nhạy cảm.
 */
export interface UserResponseDTO {
  /** @property {string} id - Mã định danh duy nhất của người dùng (UUID). */
  readonly id: string;

  /** @property {string} username - Tên đăng nhập của tài khoản. */
  readonly username: string;

  /** @property {string} email - Địa chỉ Email chính thức. */
  readonly email: string;

  /** @property {string} fullName - Họ và tên đầy đủ của người dùng. */
  readonly fullName: string;

  /** @property {string} urlPicture - Đường dẫn liên kết đến ảnh đại diện (nếu có). */
  readonly urlPicture: string;

  /** @property {string} phoneNumber - Số điện thoại liên lạc. */
  readonly phoneNumber: string;

  /** @property {UserStatus} status - Trạng thái hoạt động hiện tại của tài khoản (VD: active, locked). */
  readonly status: UserStatus;

  /** @property {Date} createdAt - Thời điểm khởi tạo tài khoản. */
  readonly createdAt: Date;

  /** @property {Date} updatedAt - Thời điểm cập nhật thông tin gần nhất. */
  readonly updatedAt: Date;

  /** @property {RoleDTO[]} roles - Danh sách các vai trò đã được gán cho người dùng. */
  readonly roles: RoleDTO[];
}