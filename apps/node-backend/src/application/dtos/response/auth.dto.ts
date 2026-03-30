import { RoleDTO } from "./user.dto";

/**
 * DTO định nghĩa dữ liệu trả về sau khi Đăng nhập thành công.
 */
export interface LoginResponseDTO {
  user: {
    id: string;
    email: string;
    username: string;
    fullName: string;
    urlPicture: string;
    status: string;
    createdAt: Date;
    updatedAt: Date;
    // Thêm dòng này để khớp với Mapper
    roles: RoleDTO[];
  };
  accessToken: string;
  refreshToken: string;
}