/**
 * Giao diện quản lý nghiệp vụ lưu trữ OTP.
 */
export interface IOtpRepository {
  saveOtp(email: string, otpCode: string, ttlSeconds: number): Promise<void>;
  getOtp(email: string): Promise<string | null>;
  deleteOtp(email: string): Promise<void>;

  /**
     * Thiết lập khóa chặn gửi lại OTP.
     * @param {string} email - Email cần khóa.
     * @param {number} ttlSeconds - Thời gian khóa (giây).
     */
  setResendLock(email: string, ttlSeconds: number): Promise<void>;

  /**
   * Kiểm tra xem Email có đang bị khóa gửi lại hay không.
   * @param {string} email - Email cần kiểm tra.
   * @returns {Promise<boolean>} - True nếu đang bị khóa.
   */
  isResendLocked(email: string): Promise<boolean>;
}