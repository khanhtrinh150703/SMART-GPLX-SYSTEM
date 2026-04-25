import { RoleResponseDTO } from "../role/role.respone.dto";

/**
 * @description DTO phản hồi sau khi đăng nhập thành công, bao gồm thông tin hồ sơ và bộ đôi mã thông báo bảo mật (Tokens).
 */
export interface ILoginResponseDTO {
  /** @description Thông tin chi tiết hồ sơ người dùng đã được xác thực. */
  user: {
    /** @property {string} id - Mã định danh duy nhất của người dùng (UUID). */
    id: string;

    /** @property {string} email - Địa chỉ Email tài khoản. */
    email: string;

    /** @property {string} username - Tên đăng nhập hệ thống. */
    username: string;

    /** @property {string} fullName - Họ và tên đầy đủ của người dùng. */
    fullName: string;

    /** @property {string} urlPicture - Đường dẫn liên kết đến ảnh đại diện. */
    urlPicture: string;

    /** @property {string} status - Trạng thái hiện tại của tài khoản (active, locked...). */
    status: string;

    /** @property {Date} createdAt - Thời điểm khởi tạo tài khoản. */
    createdAt: Date;

    /** @property {Date} updatedAt - Thời điểm cập nhật thông tin gần nhất. */
    updatedAt: Date;

    /** @property {RoleResponseDTO[]} roles - Danh sách vai trò và quyền hạn được gán cho người dùng. */
    roles: RoleResponseDTO[];
  };

  /** @description Mã thông báo truy cập ngắn hạn dùng để gọi các API bảo mật (JWT Access Token). */
  accessToken: string;

  /** @description Mã thông báo dài hạn dùng để cấp mới Access Token khi hết hạn (Refresh Token). */
  refreshToken: string;
}