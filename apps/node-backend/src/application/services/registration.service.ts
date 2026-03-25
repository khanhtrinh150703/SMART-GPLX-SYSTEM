import bcrypt from 'bcrypt';
import crypto from 'crypto';
import { RegisterDTO } from '../dtos/request/auth.dto';
import { ErrorCode, AppError } from '@/shared/errors';
import { TIME_CONSTANTS } from '@/domain/constants/time.constants'
import { User } from '@/domain/entities/user/user.entity';
import { OtpService } from './otp.service';
import { UserService } from './user.service';
import { IPendingUserRepository } from '@/domain/interfaces/repositories/i-pending-user.repository';

/**
 * Service quản lý quy trình đăng ký người dùng mới và điều phối xác thực OTP.
 */
export class RegistrationService {

  constructor(
    private readonly userService: UserService,
    private readonly otpService: OtpService,
    private readonly pendingRepo: IPendingUserRepository // Inject thêm Repo này
  ) { }

  /**
   * Tác dụng: Khởi tạo quy trình đăng ký, lưu dữ liệu tạm và ra lệnh gửi mã OTP.
   * @param {RegisterDTO} dto - Dữ liệu đăng ký từ client.
   * @returns {Promise<void>}
   */
  public async initiate(dto: RegisterDTO): Promise<void> {
    this.validate(dto);
    const normalizedEmail = dto.email.trim().toLowerCase();
    const normalizedUsername = dto.username.trim().toLowerCase();

    // 1. Kiểm tra tồn tại trong DB chính qua UserService
    await this.userService.checkExisting(normalizedUsername, normalizedEmail);

    // 2. Lưu dữ liệu đăng ký vào Redis (Pending Data)
    await this.pendingRepo.savePendingData(
      normalizedEmail,
      JSON.stringify(dto),
      TIME_CONSTANTS.PENDING_TTL
    );

    // 3. Ra lệnh cho OtpService sinh và gửi mã (OtpService giờ chỉ nhận mỗi email)
    await this.otpService.requestOtp(normalizedEmail);
  }

  /**
   * Tác dụng: Hoàn tất đăng ký, kiểm tra OTP, tạo User chính thức và dọn dẹp dữ liệu tạm.
   * @param {string} email - Email người dùng.
   * @param {string} otp - Mã xác thực OTP.
   * @returns {Promise<User>} - Trả về Entity User sau khi tạo thành công.
   */
  public async complete(email: string, otp: string): Promise<User> {
    const normalizedEmail = email.trim().toLowerCase();

    // 1. Lấy dữ liệu tạm từ PendingRepo để kiểm tra xem họ có thực sự đang đăng ký không
    const rawData = await this.pendingRepo.getPendingData(normalizedEmail);
    if (!rawData) {
      throw new AppError(ErrorCode.AUTH.REGISTRATION_EXPIRED);
    }
    const userData: RegisterDTO = JSON.parse(rawData);

    // 2. Xác thực mã OTP thông qua OtpService
    // Nếu sai, hàm verifyOtp sẽ tự động throw AppError
    await this.otpService.verifyOtp(normalizedEmail, otp);

    // 3. Hash mật khẩu
    const hashedPassword = await bcrypt.hash(userData.password, 10);

    // 4. Gọi UserService để tạo User chính thức vào MySQL
    const newUser = await this.userService.createUser({
      id: crypto.randomUUID(),
      username: userData.username.trim().toLowerCase(),
      email: normalizedEmail,
      fullName: userData.fullName ?? '',
      passwordHash: hashedPassword,
    });

    // 5. Dọn dẹp dữ liệu tạm trong Redis
    await this.pendingRepo.deletePendingData(normalizedEmail);

    return newUser;
  }

  /**
   * Tác dụng: Xử lý yêu cầu gửi lại mã OTP cho người dùng đang đăng ký dở dang.
   * @param {string} email - Email người dùng.
   * @returns {Promise<void>}
   */
  public async resend(email: string): Promise<void> {
    const normalizedEmail = email.trim().toLowerCase();

    // 1. Kiểm tra xem luồng đăng ký tạm của người này còn tồn tại không
    const isPending = await this.pendingRepo.getPendingData(normalizedEmail);
    if (!isPending) {
      throw new AppError(ErrorCode.AUTH.REGISTRATION_EXPIRED);
    }

    // 2. Yêu cầu OtpService gửi lại mã (Logic chống spam 60s đã được bọc bên trong requestOtp)
    await this.otpService.requestOtp(normalizedEmail);
  }

  /**
   * Tác dụng: Validate dữ liệu đầu vào cơ bản (Tốt nhất nên để ngoài Middleware, 
   * nhưng nếu bạn muốn double-check ở tầng Service thì viết tại đây).
   * @param {RegisterDTO} dto - Dữ liệu cần kiểm tra.
   */
  private validate(dto: RegisterDTO): void {
    if (!dto.isEmail()) throw new AppError(ErrorCode.VALIDATION.INVALID_EMAIL);
    if (!dto.isPassword()) throw new AppError(ErrorCode.VALIDATION.INVALID_PASSWORD);
  }
}