import { User } from '@/domain/entities/user/user.entity';
import { TokenPayload } from '@/shared/types/auth.types';

/**
 * @description Giao diện quản lý vòng đời của mã thông báo bảo mật (Token Lifecycle Management).
 * Chịu trách nhiệm điều phối việc khởi tạo, lưu trữ bền vững (Persistence) và thu hồi (Revocation) các loại Tokens.
 */
export interface ITokenManager {

  /**
   * @description Khởi tạo bộ đôi Access & Refresh Token, đồng thời lưu trữ trạng thái Access Token vào kho lưu trữ (Cache).
   * @param {User} user - Thực thể người dùng chứa thông tin định danh và vai trò để mã hóa vào Payload.
   * @returns {Promise<{ accessToken: string; refreshToken: string }>} Đối tượng chứa cặp mã thông báo mới.
   */
  generateAndStoreTokens(user: User): Promise<{ accessToken: string; refreshToken: string }>;

  /**
   * @description Thu hồi hàng loạt mã thông báo dựa trên khuôn mẫu (Pattern) định sẵn trong kho lưu trữ.
   * Thường được sử dụng để vô hiệu hóa toàn bộ phiên làm việc của một người dùng trên nhiều thiết bị.
   * @param {string} pattern - Biểu thức hoặc chuỗi định danh khuôn mẫu cần truy vấn và xóa bỏ.
   * @returns {Promise<void>}
   */
  revokeTokenByPattern(pattern: string): Promise<void>;

  /**
   * @description Thu hồi một mã thông báo xác định dựa trên thông tin trích xuất từ Payload (như JTI hoặc UID).
   * Phục vụ cho quy trình đăng xuất đơn lẻ hoặc vô hiệu hóa một phiên làm việc cụ thể.
   * @param {TokenPayload} payload - Dữ liệu chứa thông tin định danh phiên làm việc cần hủy bỏ.
   * @returns {Promise<void>}
   */
  revokeTokenByPayLoad(payload: TokenPayload): Promise<void>;

  /**
   * @description Kiểm tra xem một mã định danh (Key) có còn tồn tại trong kho lưu trữ hay không.
   * Phục vụ cho việc xác thực Session (Phiên làm việc) còn hiệu lực hay đã bị thu hồi.
   * @param {string} key - Chuỗi định danh hoàn chỉnh (đã bao gồm prefix) cần kiểm tra.
   * @returns {Promise<boolean>} True nếu tồn tại (Valid), False nếu không (Revoked/Expired).
   */
  exists(key: string): Promise<boolean>;
}