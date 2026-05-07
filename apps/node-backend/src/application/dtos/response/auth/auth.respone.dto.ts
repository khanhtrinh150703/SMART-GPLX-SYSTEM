import { RoleResponseDTO } from "../role/role.respone.dto";

/**
 * @description Giao diện phản hồi sau khi đăng nhập thành công.
 * Kết hợp thông tin hồ sơ người dùng và bộ đôi Token bảo mật.
 */
export interface ILoginResponseDTO {
  readonly user: {
    readonly id: string;
    readonly email: string;
    readonly username: string;
    readonly fullName: string;
    readonly urlPicture: string;
    readonly status: string;
    readonly createdAt: Date;
    readonly updatedAt: Date;
    readonly roles: RoleResponseDTO[];
  };
  readonly accessToken: string;
  readonly refreshToken: string;
}

/**
 * @description DTO vận chuyển dữ liệu đăng nhập.
 * Chỉ đóng vai trò mang dữ liệu sạch (Data Carrier) ra ngoài API.
 */
export class LoginResponseDTO implements ILoginResponseDTO {
  public readonly user: {
    readonly id: string;
    readonly email: string;
    readonly username: string;
    readonly fullName: string;
    readonly urlPicture: string;
    readonly status: string;
    readonly createdAt: Date;
    readonly updatedAt: Date;
    readonly roles: RoleResponseDTO[];
  };
  public readonly accessToken: string;
  public readonly refreshToken: string;

  constructor(data: ILoginResponseDTO) {
    this.user = data.user;
    this.accessToken = data.accessToken;
    this.refreshToken = data.refreshToken;
  }
}