import crypto from 'crypto';
import { IEmailService } from '@/domain/interfaces/services/i-email.service';
import { IOtpRepository } from '@/domain/interfaces/repositories/i-otp.repository';
import { AppError, ErrorCode } from '@/shared/errors';
import { TIME_CONSTANTS } from '@/domain/constants/time.constants'

/**
 * Dịch vụ xử lý nghiệp vụ tạo, gửi và xác thực mã OTP.
 */
export class OtpService {

  constructor(
    private readonly otpRepo: IOtpRepository,
    private readonly emailService: IEmailService
  ) { }

  /**
   * Tác dụng: Tạo mã OTP ngẫu nhiên gồm 6 chữ số.
   * @returns {string} - Chuỗi mã OTP.
   */
  private generateOTP(): string {
    return crypto.randomInt(100000, 999999).toString();
  }

  /**
   * Tác dụng: Xử lý luồng yêu cầu cấp mã OTP mới và gửi qua email.
   * @param {string} userEmail - Email người dùng cần nhận OTP.
   * @returns {Promise<void>}
   */
  public async requestOtp(userEmail: string): Promise<void> {
    // 1. Kiểm tra xem người dùng có đang bị khóa tính năng gửi lại không
    const isLocked = await this.otpRepo.isResendLocked(userEmail);
    if (isLocked) {
      // Lưu ý: Cần thêm mã lỗi TOO_MANY_REQUESTS vào ErrorCode của bạn
      throw new AppError(ErrorCode.SYSTEM.TOO_MANY_REQUESTS);
    }

    // 2. Xóa OTP cũ (nếu có) để đảm bảo chỉ có 1 OTP có hiệu lực
    await this.otpRepo.deleteOtp(userEmail);

    // 3. Sinh mã và lưu vào kho chứa
    const otpCode = this.generateOTP();
    await this.otpRepo.saveOtp(userEmail, otpCode, TIME_CONSTANTS.OTP_TTL);

    // 4. Bật cờ khóa gửi lại (Resend Lock) trong 60 giây
    await this.otpRepo.setResendLock(userEmail, TIME_CONSTANTS.LOCK_TIME);

    // 5. Gửi email
    await this.emailService.sendOtpEmail(userEmail, otpCode);
  }

  /**
   * Tác dụng: Kiểm tra tính hợp lệ của mã OTP người dùng nhập vào.
   * @param {string} userEmail - Email người dùng.
   * @param {string} inputOtp - Mã OTP do người dùng nhập.
   * @returns {Promise<boolean>} - Trả về true nếu hợp lệ. Sẽ ném lỗi nếu sai.
   */
  public async verifyOtp(userEmail: string, inputOtp: string): Promise<boolean> {
    const storedOtp = await this.otpRepo.getOtp(userEmail);

    if (!storedOtp) {
      throw new AppError(ErrorCode.AUTH.OTP_EXPIRED);
    }

    if (storedOtp !== inputOtp) {
      throw new AppError(ErrorCode.AUTH.OTP_INVALID);
    }

    // Xóa ngay lập tức để chống Tấn công phát lại (Replay Attack)
    await this.otpRepo.deleteOtp(userEmail);

    return true;
  }

  /**
   * Tác dụng: Xóa mã OTP của người dùng khỏi kho lưu trữ.
   * Hàm này cho phép các Service khác chủ động dọn dẹp mã sau khi hoàn tất nghiệp vụ.
   * @param {string} userEmail - Email của người dùng cần xóa OTP.
   * @returns {Promise<void>}
   */
  public deleteOtp = async (userEmail: string): Promise<void> => {
    // Service điều phối lệnh trực tiếp xuống Repository thực thi
    await this.otpRepo.deleteOtp(userEmail);
  };
}