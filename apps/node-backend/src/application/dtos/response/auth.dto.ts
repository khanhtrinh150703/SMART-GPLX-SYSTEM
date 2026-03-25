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
    role: string;
  };
  accessToken: string;
  refreshToken: string;
}