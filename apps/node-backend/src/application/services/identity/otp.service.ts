import crypto from 'crypto';
import { IEmailService } from '@/domain/interfaces/services/external/i-email.service';
import { IOtpRepository } from '@/domain/interfaces/repositories/identity/i-otp.repository';
import { AppError, ErrorCode } from '@/shared/errors';
import { IOtpService } from '@/domain/interfaces/services/identity/i-otp.service';
import { OTP_CONFIG } from '@/shared/config/otp.config';
import { AUTH_CONFIG } from '@/shared/config/auth.config';

/**
 * @interface IOtpServiceCradle
 * @description Tập hợp các phụ thuộc (Dependencies) cần thiết để vận hành OtpService.
 */
export interface IOtpServiceCradle {
  /** @description Repository quản lý lưu trữ, kiểm tra trạng thái và vòng đời của mã OTP. */
  otpRepository: IOtpRepository;

  /** @description Dịch vụ gửi thông báo mã xác thực đến người dùng qua Email. */
  emailService: IEmailService;
}

/**
 * @class OtpService
 * @description Quản lý vòng đời mã xác thực (OTP) bao gồm: sinh mã, kiểm tra và điều phối gửi thông báo.
 */
export class OtpService implements IOtpService {
  /** @private @readonly @description Kho lưu trữ dữ liệu OTP tạm thời. */
  private readonly _otpRepo: IOtpRepository;

  /** @private @readonly @description Dịch vụ gửi Email hệ thống. */
  private readonly _emailService: IEmailService;

  /**
   * @constructor
   * @description Khởi tạo OtpService với các công cụ được tiêm (inject) từ DI Container.
   * @param {IOtpServiceCradle} cradle - Chứa các Repository và Service bổ trợ cần thiết.
   */
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
   * @description Yêu cầu cấp mã OTP mới, thực hiện kiểm tra giới hạn gửi lại (Rate Limit) và gửi qua Email.
   * @param {string} userEmail - Địa chỉ email của người dùng cần nhận mã xác thực. (User email to receive OTP).
   * @returns {Promise<void>}
   * @throws {AppError} SYSTEM.TOO_MANY_REQUESTS - Nếu yêu cầu gửi lại quá nhanh hoặc đang trong thời gian khóa 60 giây.
   */
  public async requestOtp(userEmail: string): Promise<void> {
    // 1. Kiểm tra xem người dùng có đang bị khóa tính năng gửi lại không
    const isLocked = await this._otpRepo.isResendLocked(userEmail);
    if (isLocked) {
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