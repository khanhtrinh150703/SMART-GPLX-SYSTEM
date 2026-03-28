import crypto from 'crypto';
import { IEmailService } from '@/domain/interfaces/external/i-email.service';
import { IOtpRepository } from '@/domain/interfaces/repositories/i-otp.repository';
import { AppError, ErrorCode } from '@/shared/errors';
import { TIME_CONSTANTS } from '@/domain/constants/time.constants'
import { IOtpService } from '@/domain/interfaces/services/i-otp.service';
import { ICradle } from '@/shared/types/container.types';

/**
 * Dịch vụ xử lý nghiệp vụ tạo, gửi và xác thực mã OTP.
 */
export class OtpService implements IOtpService {
  // 1. Khai báo các thuộc tính (properties) của class
  private readonly _otpRepo: IOtpRepository;
  private readonly _emailService: IEmailService;

  /**
   * @param {ICradle} cradle - Object chứa các dependencies từ DI Container
   */
  constructor({ otpRepository, emailService }: ICradle) {
    // 2. Gán các dependency từ object vào thuộc tính class
    // LƯU Ý: 'otpRepository' và 'emailService' phải khớp chính xác 
    // với Key cậu đã đăng ký (register) trong container.ts
    this._otpRepo = otpRepository;
    this._emailService = emailService;
  }

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
    const isLocked = await this._otpRepo.isResendLocked(userEmail);
    if (isLocked) {
      // Lưu ý: Cần thêm mã lỗi TOO_MANY_REQUESTS vào ErrorCode của bạn
      throw new AppError(ErrorCode.SYSTEM.TOO_MANY_REQUESTS);
    }

    // 2. Xóa OTP cũ (nếu có) để đảm bảo chỉ có 1 OTP có hiệu lực
    await this._otpRepo.deleteOtp(userEmail);

    // 3. Sinh mã và lưu vào kho chứa
    const otpCode = this.generateOTP();
    await this._otpRepo.saveOtp(userEmail, otpCode, TIME_CONSTANTS.OTP_TTL);

    // 4. Bật cờ khóa gửi lại (Resend Lock) trong 60 giây
    await this._otpRepo.setResendLock(userEmail, TIME_CONSTANTS.LOCK_TIME);

    // 5. Gửi email
    await this._emailService.sendOtpEmail(userEmail, otpCode);
  }

  /**
   * Tác dụng: Kiểm tra tính hợp lệ của mã OTP người dùng nhập vào.
   * @param {string} userEmail - Email người dùng.
   * @param {string} inputOtp - Mã OTP do người dùng nhập.
   * @returns {Promise<boolean>} - Trả về true nếu hợp lệ. Sẽ ném lỗi nếu sai.
   */
  public async verifyOtp(userEmail: string, inputOtp: string): Promise<boolean> {
    const storedOtp = await this._otpRepo.getOtp(userEmail);

    if (!storedOtp) {
      throw new AppError(ErrorCode.AUTH.OTP_EXPIRED);
    }

    if (storedOtp !== inputOtp) {
      throw new AppError(ErrorCode.AUTH.OTP_INVALID);
    }

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
    await this._otpRepo.deleteOtp(userEmail);
  };
}