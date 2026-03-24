/**
 * Giao diện quản lý nghiệp vụ lưu trữ OTP.
 */
export interface IOtpRepository {
  saveOtp(email: string, otpCode: string, ttlSeconds: number): Promise<void>;
  getOtp(email: string): Promise<string | null>;
  deleteOtp(email: string): Promise<void>;

  // // Bổ sung 2 hàm quản lý chống spam OTP
  // setResendLock(email: string, ttlSeconds: number): Promise<void>;
  // checkResendLock(email: string): Promise<boolean>;
}