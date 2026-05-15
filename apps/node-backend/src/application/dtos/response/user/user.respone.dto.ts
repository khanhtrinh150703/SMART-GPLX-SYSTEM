import { Status } from "@/shared/config/status.config";
import { IRoleResponseDTO, RoleResponseDTO } from "../role/role.respone.dto";

/**
 * @description Giao diện phản hồi thông tin chi tiết người dùng (User Profile).
 * (Interface for User Profile detailed response.)
 * Đã được lọc bỏ toàn bộ các trường dữ liệu nhạy cảm để đảm bảo an toàn thông tin.
 */
export interface IUserResponseDTO {
  /** @description Mã định danh duy nhất của người dùng (UUID). (Unique identifier of the user.) */
  readonly id: string;

  /** @description Tên tài khoản dùng để đăng nhập. (Username for login.) */
  readonly username: string;

  /** @description Địa chỉ hòm thư điện tử chính thức đã qua xác thực. (Verified official email address.) */
  readonly email: string;

  /** @description Họ và tên đầy đủ của chủ tài khoản. (Full name of the account holder.) */
  readonly fullName: string;

  /** @description Đường dẫn URL tuyệt đối dẫn đến ảnh đại diện. (Absolute URL to the profile picture.) */
  readonly urlPicture: string;

  /** @description Số điện thoại liên lạc. (Contact phone number.) */
  readonly phoneNumber: string;

  /** @description Trạng thái hiện tại của tài khoản. (Current account status.) */
  readonly status: Status;

  /** @description Thời điểm tài khoản được khởi tạo (ISO 8601). (Account creation timestamp.) */
  readonly createdAt: Date;

  /** @description Thời điểm gần nhất thông tin tài khoản có sự thay đổi (ISO 8601). (Latest account update timestamp.) */
  readonly updatedAt: Date;

  /** @description Danh sách các vai trò quyền hạn nắm giữ. (List of roles and permissions held.) */
  readonly roles: IRoleResponseDTO[];

  /** @description Danh sách các mã quyền hạn cụ thể (VD: 'question:create'). (List of specific permission codes.) */
  readonly permissions: string[];
}

/**
 * @description DTO vận chuyển dữ liệu hồ sơ người dùng.
 * Đóng vai trò mang dữ liệu sạch từ tầng Application ra ngoài API, đảm bảo an toàn và nhất quán.
 */
export class UserResponseDTO implements IUserResponseDTO {
  public readonly id: string;
  public readonly username: string;
  public readonly email: string;
  public readonly fullName: string;
  public readonly urlPicture: string;
  public readonly phoneNumber: string;
  public readonly status: Status;
  public readonly createdAt: Date;
  public readonly updatedAt: Date;
  public readonly roles: IRoleResponseDTO[];
  public readonly permissions: string[];

  constructor(data: IUserResponseDTO) {
    this.id = data.id;
    this.username = data.username;
    this.email = data.email;
    this.fullName = data.fullName;
    this.urlPicture = data.urlPicture || '';
    this.phoneNumber = data.phoneNumber || '';
    this.status = data.status;
    this.createdAt = data.createdAt;
    this.updatedAt = data.updatedAt;
    this.permissions = Array.isArray(data.permissions) ? data.permissions : [];

    // Khởi tạo danh sách Role DTO từ dữ liệu đầu vào
    this.roles = Array.isArray(data.roles)
      ? data.roles.map(role => new RoleResponseDTO(role))
      : [];
  }
}