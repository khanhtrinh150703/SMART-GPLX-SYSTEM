import { UserStatus } from "@/domain/entities/user/user.status";
import { RoleResponseDTO } from "../role/role.respone.dto";

/**
 * @description Đối tượng phản hồi thông tin chi tiết người dùng (User Profile).
 * Đã được lọc bỏ toàn bộ các trường dữ liệu nhạy cảm (Password, OTP, Salt) để đảm bảo an toàn thông tin.
 */
export interface UserResponseDTO {
  /** @property {string} id - Mã định danh duy nhất của người dùng (UUID). */
  readonly id: string;

  /** @property {string} username - Tên tài khoản dùng để đăng nhập. */
  readonly username: string;

  /** @property {string} email - Địa chỉ hòm thư điện tử chính thức đã qua xác thực. */
  readonly email: string;

  /** @property {string} fullName - Họ và tên đầy đủ của chủ tài khoản. */
  readonly fullName: string;

  /** @property {string} urlPicture - Đường dẫn URL tuyệt đối dẫn đến ảnh đại diện của người dùng. */
  readonly urlPicture: string;

  /** @property {string} phoneNumber - Số điện thoại liên lạc định dạng quốc tế hoặc nội địa. */
  readonly phoneNumber: string;

  /** @property {UserStatus} status - Trạng thái hiện tại của tài khoản (VD: 'active', 'locked', 'pending'). */
  readonly status: UserStatus;

  /** @property {Date} createdAt - Thời điểm tài khoản được khởi tạo (ISO 8601). */
  readonly createdAt: Date;

  /** @property {Date} updatedAt - Thời điểm gần nhất thông tin tài khoản có sự thay đổi (ISO 8601). */
  readonly updatedAt: Date;

  /** @property {RoleResponseDTO[]} roles - Danh sách các vai trò quyền hạn mà người dùng này đang nắm giữ. */
  readonly roles: RoleResponseDTO[];
}