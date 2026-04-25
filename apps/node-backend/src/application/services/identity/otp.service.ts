import crypto from 'crypto';
import { IEmailService } from '@/domain/interfaces/external/i-email.service';
import { IOtpRepository } from '@/domain/interfaces/repositories/identity/i-otp.repository';
import { AppError, ErrorCode } from '@/shared/errors';
import { IOtpService } from '@/domain/interfaces/services/identity/i-otp.service';
import { OTP_CONFIG } from '@/shared/config/otp.config';
import { AUTH_CONFIG } from '@/shared/config/auth.config';

export interface IOtpServiceCradle {
  otpRepository: IOtpRepository;
  emailService: IEmailService;
}

export class OtpService implements IOtpService {
  private readonly _otpRepo: IOtpRepository;
  private readonly _emailService: IEmailService;

  // Thay ICradle bằng IOtpServiceCradle
  constructor({ otpRepository, emailService }: IOtpServiceCradle) {
    this._otpRepo = otpRepository;
    this._emailService = emailService;
  }

  /**
   * @description Tác dụng: Tạo mã OTP ngẫu nhiên gồm 6 chữ số.
   * @returns {string} - Chuỗi mã OTP.
   */
  private generateOTP(): string {
    const { min, max } = OTP_CONFIG;
    return crypto.randomInt(min, max).toString();
  }

  /**
   * @description Tác dụng: Xử lý luồng yêu cầu cấp mã OTP mới và gửi qua email.
   * @param {string} userEmail - Email người dùng cần nhận OTP.
   * @returns {Promise<void>}
   */
  public async requestOtp(userEmail: string): Promise<void> {

    // import requestIp from 'request-ip';

    // // Trong Controller
    // const clientIp = requestIp.getClientIp(req);
    // Chặn theo IP trước để bot không dùng nhiều email phá hoại
    // await globalApiLimiter.consume(ip); 

    // // Chặn theo Email để không làm phiền người dùng
    // await otpLimiter.daily.consume(email);
    // await otpLimiter.resend.consume(email);
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
    await this._otpRepo.saveOtp(userEmail, otpCode, AUTH_CONFIG.otp.ttlSeconds);

    // 4. Bật cờ khóa gửi lại (Resend Lock) trong 60 giây
    await this._otpRepo.setResendLock(userEmail, AUTH_CONFIG.security.lockTimeSeconds);

    // 5. Gửi email
    await this._emailService.sendOtpEmail(userEmail, otpCode);
  }

  /**
   * @description Tác dụng: Kiểm tra tính hợp lệ của mã OTP người dùng nhập vào.
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
   * @description Tác dụng: Xóa mã OTP của người dùng khỏi kho lưu trữ.
   * @param {string} userEmail - Email của người dùng cần xóa OTP.
   * @returns {Promise<void>}
   */
  public deleteOtp = async (userEmail: string): Promise<void> => {
    // Service điều phối lệnh trực tiếp xuống Repository thực thi
    await this._otpRepo.deleteOtp(userEmail);
  };
}