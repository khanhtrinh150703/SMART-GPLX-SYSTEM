import { UserStatus } from "@/domain/entities/user/user.status";

/**
 * Data Transfer Object dùng để trả về thông tin người dùng cho Client.
 * Đảm bảo tính bảo mật bằng cách loại bỏ các trường nhạy cảm (password, v.v.).
 */
export interface UserResponseDTO {
  /** * ID duy nhất của người dùng (UUID) 
   */
  readonly id: string;

  /** * Tên đăng nhập 
   */
  readonly username: string;

  /** * Địa chỉ Email 
   */
  readonly email: string;

  /** * Họ và tên đầy đủ 
   */
  readonly fullName: string;

  /** * Đường dẫn ảnh đại diện (Nếu có) 
   */
  readonly urlPicture: string;

  /** * Trạng thái tài khoản (active, suspend, v.v.) 
   */
  readonly status: UserStatus;

  readonly role: string;
}