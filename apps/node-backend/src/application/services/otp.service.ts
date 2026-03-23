import crypto from 'crypto';
import { IOtpRepository } from '../../domain/interfaces/IOtpRepository';
import { IEmailService } from '../../domain/interfaces/IEmailService';
import { AppError, ErrorCode } from '@/shared/errors';
import { RegisterDTO } from '../dtos/request/auth.dto';

// Dịch vụ xử lý nghiệp vụ OTP (OTP Business Logic Service)
export class OtpService {
  constructor(
    private readonly otpRepo: IOtpRepository,
    private readonly emailService: IEmailService
  ) { }

  // Tạo mật khẩu dùng một lần ngẫu nhiên (Generate random One-Time Password)
  private generateOTP(): string {
    return crypto.randomInt(100000, 999999).toString();
  }

  // Luồng 1: Yêu cầu cấp mã (Request OTP Flow)
  async requestOtp(userEmail: string, userData: RegisterDTO): Promise<void> {

    await this.otpRepo.deleteOtp(userEmail);
    
    await this.otpRepo.savePendingData(userEmail, JSON.stringify(userData), 600);
    // 1. Sinh mã (Generate code)
    const otpCode = this.generateOTP();

    // 2. Lưu vào Redis thông qua Repository với thời gian sống 300 giây (Save to Redis via Repository with 300s TTL)
    await this.otpRepo.saveOtp(userEmail, otpCode, 300);

    // 3. Gửi email (Send email)
    await this.emailService.sendOtpEmail(userEmail, otpCode);
  }

  // Luồng 2: Xác thực mã (Verify OTP Flow)
  async verifyOtp(userEmail: string, inputOtp: string): Promise<boolean> {
    // 1. Lấy mã từ Redis ra (Retrieve code from Redis)
    const storedOtp = await this.otpRepo.getOtp(userEmail);
    // 2. Kiểm tra tồn tại / Hết hạn (Check existence / Expired)
    if (!storedOtp) {
      throw new AppError(ErrorCode.AUTH.OTP_EXPIRED); // Lỗi: OTP đã hết hạn (Error: OTP Expired)
    }

    // 3. So sánh mã không khớp (Mismatch comparison)
    if (storedOtp !== inputOtp) {
      throw new AppError(ErrorCode.AUTH.OTP_INVALID); // Lỗi: OTP không hợp lệ (Error: Invalid OTP)
    }

    // 4. Nếu đúng, xóa mã luôn để tránh Tấn công phát lại (If correct, delete immediately to prevent Replay Attack)
    await this.otpRepo.deleteOtp(userEmail);

    return true; // Trả về thành công (Return success)
  }

  async getValidatedData(email: string): Promise<RegisterDTO> {
    const rawData = await this.otpRepo.getPendingData(email);
    if (!rawData) {
      throw new AppError(ErrorCode.AUTH.REGISTRATION_EXPIRED);
    }
    return JSON.parse(rawData);
  }

  async deletePendingData(email: string): Promise<void> {
    // 1. Kiểm tra đầu vào cơ bản
    if (!email) {
      throw new AppError(ErrorCode.AUTH.INVALID_CREDENTIALS);
    }

    // 2. Thực hiện xóa từ Repository
    await this.otpRepo.deletePendingData(email);

    // 3. Nếu không có dòng nào bị xóa (Affected Rows = 0)

  }

  private readonly LOCK_TIME = 60; // Quy tắc 60 giây nằm ở đây

  async isResendLocked(email: string): Promise<boolean> {
    const key = `resend_lock:${email}`;
    return await this.otpRepo.exists(key);
  }

  async setResendLock(email: string): Promise<void> {
    const key = `resend_lock:${email}`;
    await this.otpRepo.setWithExpiry(key, 'true', this.LOCK_TIME);
  }
}