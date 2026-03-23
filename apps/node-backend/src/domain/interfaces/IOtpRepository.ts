// Giao diện Kho lưu trữ OTP (OTP Repository Interface)
export interface IOtpRepository {
  // Lưu mã OTP (Save OTP) với thời gian sống (TTL - Time To Live) tính bằng giây
  saveOtp(email: string, otpCode: string, ttlSeconds: number): Promise<void>;

  // Lấy mã OTP (Get OTP)
  getOtp(email: string): Promise<string | null>;

  // Xóa mã OTP (Delete OTP)
  deleteOtp(email: string): Promise<void>;

  deletePendingData(email: string): Promise<void>;

  savePendingData(key: string, data: string, ttlSeconds: number): Promise<void>;
  getPendingData(key: string): Promise<string | null>;

  exists(key: string): Promise<boolean>;
  setWithExpiry(key: string, value: string, ttl: number): Promise<void>;
}