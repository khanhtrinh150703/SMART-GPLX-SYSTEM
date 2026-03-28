import { User } from '@/domain/entities/user/user.entity';
import { TokenPayload } from '@/shared/types/auth.types';

/**
 * Interface quản lý vòng đời của Token (Tạo, Lưu, Xác thực).
 */
export interface ITokenManager {
  /**
   * Tác dụng: Tạo cặp Access & Refresh Token và lưu Access Token vào kho lưu trữ.
   * @param {User} user - Thông tin người dùng cần mã hóa.
   * @returns {Promise<{ accessToken: string; refreshToken: string }>}
   */
  generateAndStoreTokens(user: User): Promise<{ accessToken: string; refreshToken: string }>;

  /**
   * Tác dụng: Thu hồi Token (thực hiện xóa trong kho lưu trữ).
   * @param {string} userId - ID người dùng cần đăng xuất.
   */
  revokeTokenByPattern(pattern: string): Promise<void>;

  /**
   * Tác dụng: Thu hồi Token (thực hiện xóa trong kho lưu trữ).
   * @param {string} userId - ID người dùng cần đăng xuất.
   */
  revokeTokenByPayLoad(payload: TokenPayload): Promise<void>;
}