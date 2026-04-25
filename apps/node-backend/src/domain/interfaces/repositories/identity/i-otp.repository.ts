/**
 * Giao diện quản lý vòng đời của mã OTP và cơ chế chống Spam (Resend Lock).
 * Thằng này đảm bảo OTP được lưu trữ an toàn và người dùng không thể yêu cầu gửi mail liên tục.
 */
export interface IOtpRepository {
  /**
   * Tác dụng: Lưu mã OTP vào kho với thời gian hết hạn ngắn.
   * @param {string} email - Email nhận mã (dùng làm định danh).
   * @param {string} otpCode - Mã số xác thực (vd: "123456").
   * @param {number} ttlSeconds - Thời gian sống của mã (thường là 180s - 300s).
   */
  saveOtp(email: string, otpCode: string, ttlSeconds: number): Promise<void>;

  /**
   * Tác dụng: Lấy mã OTP hiện tại để đối chiếu.
   */
  getOtp(email: string): Promise<string | null>;

  /**
   * Tác dụng: Xóa mã OTP ngay sau khi xác thực thành công (tránh dùng lại).
   */
  deleteOtp(email: string): Promise<void>;

  /**
   * Tác dụng: Thiết lập một "khóa chặn" tạm thời để ngăn người dùng nhấn gửi lại quá nhanh.
   * @param {string} email - Email cần bị khóa.
   * @param {number} ttlSeconds - Thời gian giãn cách giữa 2 lần gửi (vd: 60s).
   */
  setResendLock(email: string, ttlSeconds: number): Promise<void>;

  /**
   * Tác dụng: Kiểm tra xem Email này có đang trong thời gian chờ (cooldown) hay không.
   * @returns {Promise<boolean>} - Trả về true nếu đang bị khóa (không được phép gửi tiếp).
   */
  isResendLocked(email: string): Promise<boolean>;
}