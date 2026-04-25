import { ErrorCode, AppError } from '@/shared/errors';
import { User } from '@/domain/entities/user/user.entity';
import { IPendingUserRepository } from '@/domain/interfaces/repositories/identity/i-pending-user.repository';
import { IRegistrationService } from '@/domain/interfaces/services/identity/i-registration.service';
import { IUserService } from '@/domain/interfaces/services/identity/i-user.service';
import { IOtpService } from '@/domain/interfaces/services/identity/i-otp.service';
import { AUTH_CONFIG } from '@/shared/config/auth.config';
import { RegisterRequestDTO } from '@/application/dtos/request/auth/register.request.dto';
import { UserMapper } from '@/infrastructure/database/mappers/identity';
import { UserResponseDTO } from '@/application/dtos/response/user/user.respone.dto';

/**
 * @interface IRegistrationServiceCradle
 * @description "Bộ lọc" dependencies cho RegistrationService.
 * Đảm bảo service này chỉ tiếp cận đúng các công cụ cần thiết cho việc đăng ký.
 */
export interface IRegistrationServiceCradle {
  userService: IUserService;
  otpService: IOtpService;
  pendingUserRepository: IPendingUserRepository;
}

/**
 * @class RegistrationService
 * @description Điều phối quy trình đăng ký tài khoản mới và xác thực OTP đầu vào.
 */
export class RegistrationService implements IRegistrationService {
  // Sử dụng Interface thay vì Class trực tiếp để tăng tính linh hoạt (Loose Coupling)
  private readonly _userService: IUserService;
  private readonly _otpService: IOtpService;
  private readonly _pendingRepo: IPendingUserRepository;

  /**
   * @description Khởi tạo Service với túi đồ nghề chuyên biệt.
   * @param {IRegistrationServiceCradle} cradle - Dependencies được tiêm tự động từ Awilix.
   */
  constructor({ userService, otpService, pendingUserRepository }: IRegistrationServiceCradle) {
    this._userService = userService;
    this._otpService = otpService;
    this._pendingRepo = pendingUserRepository;
  }

  /**
   * @description Tác dụng: Khởi tạo quy trình đăng ký, lưu dữ liệu tạm và ra lệnh gửi mã OTP.
   * @param {RegisterRequestDTO} dto - Dữ liệu đăng ký từ client.
   * @returns {Promise<void>}
   */
  public async initiate(dto: RegisterRequestDTO): Promise<void> {
    this.validate(dto);
    const normalizedEmail = dto.email.trim().toLowerCase();
    const normalizedUsername = dto.username.trim().toLowerCase();

    // 1. Kiểm tra tồn tại trong DB chính qua UserService
    await this._userService.checkExisting(normalizedUsername, normalizedEmail);

    // 2. Lưu dữ liệu đăng ký vào Redis (Pending Data)
    await this._pendingRepo.save(
      normalizedEmail,
      JSON.stringify(dto),
      AUTH_CONFIG.security.pendingTtlSeconds
    );

    // 3. Ra lệnh cho OtpService sinh và gửi mã (OtpService giờ chỉ nhận mỗi email)
    await this._otpService.requestOtp(normalizedEmail);
  }

  /**
   * @description Tác dụng: Hoàn tất đăng ký, kiểm tra OTP, tạo User chính thức và dọn dẹp dữ liệu tạm.
   * @param {string} email - Email người dùng.
   * @param {string} otp - Mã xác thực OTP.
   * @returns {Promise<UserResponseDTO>} - Trả về Entity UserResponseDTO sau khi tạo thành công.
   */
  public async complete(email: string, otp: string): Promise<UserResponseDTO> {
    const normalizedEmail = email.trim().toLowerCase();
    // 1. Lấy dữ liệu tạm từ PendingRepo để kiểm tra xem họ có thực sự đang đăng ký không
    const rawData = await this._pendingRepo.get(normalizedEmail);
    if (!rawData) {
      throw new AppError(ErrorCode.AUTH.REGISTRATION_EXPIRED);
    }
    const userData: RegisterRequestDTO = JSON.parse(rawData);
    // 2. Xác thực mã OTP thông qua OtpService
    // Nếu sai, hàm verifyOtp sẽ tự động throw AppError

    await this._otpService.verifyOtp(normalizedEmail, otp);

    // 3. Hash mật khẩu

    // 4. Gọi UserService để tạo User chính thức vào MySQL
    const newUser = await User.create({
      username: userData.username.trim().toLowerCase(),
      email: normalizedEmail,
      fullName: userData.fullName ?? '',
      passwordPlain: userData.password,
    });

    await this._userService.createUser(newUser);
    // 5. Dọn dẹp dữ liệu tạm trong Redis
    await this._pendingRepo.delete(normalizedEmail);
    await this._otpService.deleteOtp(normalizedEmail);

    const result = UserMapper.toResponse(newUser);

    return result;
  }

  /**
   * @description Tác dụng: Xử lý yêu cầu gửi lại mã OTP cho người dùng đang đăng ký dở dang.
   * @param {string} email - Email người dùng.
   * @returns {Promise<void>}
   */
  public async resend(email: string): Promise<void> {
    const normalizedEmail = email.trim().toLowerCase();

    // 1. Kiểm tra xem luồng đăng ký tạm của người này còn tồn tại không
    const isPending = await this._pendingRepo.get(normalizedEmail);
    if (!isPending) {
      throw new AppError(ErrorCode.AUTH.REGISTRATION_EXPIRED);
    }

    // 2. Yêu cầu OtpService gửi lại mã (Logic chống spam 60s đã được bọc bên trong requestOtp)
    await this._otpService.requestOtp(normalizedEmail);
  }

  /**
   * @description Tác dụng: Validate dữ liệu đầu vào cơ bản (Tốt nhất nên để ngoài Middleware, 
   * @param {RegisterDTO} dto - Dữ liệu cần kiểm tra.
   */
  private validate(dto: RegisterRequestDTO): void {
    if (!dto.isEmail()) throw new AppError(ErrorCode.VALIDATION.EMAIL_INVALID);
    if (!dto.isPassword()) throw new AppError(ErrorCode.VALIDATION.PASSWORD_INVALID);
  }
}