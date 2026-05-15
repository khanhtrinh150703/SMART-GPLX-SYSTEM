import { ErrorCode, AppError } from '@/shared/errors';
import { User } from '@/domain/entities/user/user.entity';
import { IPendingUserRepository } from '@/domain/interfaces/repositories/identity/i-pending-user.repository';
import { IRegistrationService } from '@/domain/interfaces/services/identity/commands/i-registration.service';
import { IUserService } from '@/domain/interfaces/services/identity/commands/i-user.service';
import { IOtpService } from '@/domain/interfaces/services/identity/commands/i-otp.service';
import { AUTH_CONFIG } from '@/shared/config/auth.config';
import { RegisterRequestDTO } from '@/application/dtos/request/auth/register.request.dto';
import { UserMapper } from '@/infrastructure/database/mappers/identity';
import { IUserResponseDTO } from '@/application/dtos/response/user/user.respone.dto';

/**
 * @interface IRegistrationServiceCradle
 * @description Định nghĩa tập hợp các phụ thuộc (Dependencies) chuyên biệt cho quy trình đăng ký.
 */
export interface IRegistrationServiceCradle {
  /** @description Dịch vụ xử lý nghiệp vụ chính liên quan đến thực thể Người dùng. */
  userService: IUserService;

  /** @description Dịch vụ quản lý vòng đời và xác thực mã OTP. */
  otpService: IOtpService;

  /** @description Kho lưu trữ tạm thời cho dữ liệu đăng ký chưa xác thực (thường dùng Redis). */
  pendingUserRepository: IPendingUserRepository;
}

/**
 * @class RegistrationService
 * @description Điều phối quy trình đăng ký tài khoản mới và xác thực OTP đầu vào.
 * @principle Loose Coupling - Sử dụng các Interface để giảm sự phụ thuộc trực tiếp giữa các thành phần.
 */
export class RegistrationService implements IRegistrationService {
  /** 
   * @private 
   * @readonly 
   * @description Instance điều phối logic người dùng. 
   */
  private readonly _userService: IUserService;

  /** 
   * @private 
   * @readonly 
   * @description Instance điều phối logic mã xác thực. 
   */
  private readonly _otpService: IOtpService;

  /** 
   * @private 
   * @readonly 
   * @description Instance quản lý bộ nhớ tạm cho luồng đăng ký. 
   */
  private readonly _pendingRepo: IPendingUserRepository;

  /**
   * @constructor
   * @description Khởi tạo Service với "túi đồ nghề" được tiêm từ DI Container (Awilix).
   * @param {IRegistrationServiceCradle} cradle - Chứa các Service và Repository cần thiết.
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
   * @returns {Promise<IUserResponseDTO>} - Trả về Entity IUserResponseDTO sau khi tạo thành công.
   * @throws {AppError} AUTH.REGISTRATION_EXPIRED - Nếu phiên đăng ký tạm không tồn tại hoặc đã quá hạn.
   */
  public async complete(email: string, otp: string): Promise<IUserResponseDTO> {
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
   * @description Gửi lại mã OTP cho quy trình.
   * Kiểm tra sự tồn tại của phiên đăng ký tạm thời và thực thi logic gửi mã kèm chống spam.
   * @param {string} email - Địa chỉ email người dùng cần nhận lại mã.
   * @returns {Promise<void>}
   * @throws {AppError} AUTH.REGISTRATION_EXPIRED - Nếu phiên đăng ký tạm không tồn tại hoặc đã quá hạn.
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
}