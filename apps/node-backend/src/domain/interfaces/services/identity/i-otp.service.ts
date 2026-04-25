/**
 * @interface IOtpService
 * @description Giao diện điều phối nghiệp vụ liên quan đến mã OTP (Sinh mã, gửi, xác thực)
 */
export interface IOtpService {
  /**
   * @description Xử lý luồng yêu cầu cấp mã OTP mới và gửi tới người dùng
   * @param userEmail Email nhận mã
   */
  requestOtp(userEmail: string): Promise<void>;

  /**
   * @description Kiểm tra tính hợp lệ của mã OTP người dùng nhập
   * @param userEmail Email người dùng
   * @param inputOtp Mã OTP cần kiểm tra
   * @returns Trả về true nếu hợp lệ, ngược lại ném lỗi AppError
   */
  verifyOtp(userEmail: string, inputOtp: string): Promise<boolean>;

  /**
   * @description Chủ động xóa mã OTP (thường dùng sau khi đã xác thực thành công)
   * @param userEmail Email cần dọn dẹp OTP
   */
  deleteOtp(userEmail: string): Promise<void>;
}