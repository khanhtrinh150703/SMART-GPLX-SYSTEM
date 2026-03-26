import bcrypt from 'bcrypt';
import { LoginInputDTO } from '../dtos/request/loginInput.dto';
import { LoginResponseDTO } from '../dtos/response/auth.dto';
import { ErrorCode, AppError } from '@/shared/errors';
import { UserService } from './user.service';
import { UserMapper } from '@/infrastructure/database/mappers/user.mapper';
import { TokenPayload } from '@/shared/types/auth.types';
import { ITokenManager } from '@/domain/interfaces/services/i-token-manager';
import { ResetPasswordDTO } from '../dtos/request/auth.dto';
import { OtpService } from './otp.service';

/**
 * Service xử lý nghiệp vụ xác thực người dùng.
 */
export class AuthService {
  constructor(
    private readonly userService: UserService, // Dùng Service thay vì Repo
    private readonly tokenManager: ITokenManager,
    private readonly otpService: OtpService,
  ) { }

  /**
     * Tác dụng: Xử lý đăng nhập, kiểm tra mật khẩu và cấp phát bộ đôi Token.
     * @param {LoginInputDTO} dto - Dữ liệu đăng nhập.
     * @returns {Promise<LoginResponseDTO>}
     */
  public async login(dto: LoginInputDTO): Promise<LoginResponseDTO> {
    // 1. Kiểm tra DTO (Đảm bảo không rỗng)
    if (!dto.isValid()) {
      throw new AppError(ErrorCode.AUTH.INVALID_CREDENTIALS);
    }

    // 2. Tìm User trong DB thông qua UserService
    // Giả sử getUserByUsername trả về Entity User
    const user = await this.userService.getUserByIdentifier(dto.username);

    // 3. So sánh mật khẩu (Bcrypt)
    const isPasswordMatch = await bcrypt.compare(dto.password, user.passwordHash ?? '');
    if (!isPasswordMatch) {
      throw new AppError(ErrorCode.AUTH.INVALID_CREDENTIALS);
    }

    // 4. CHỐT: Manager sẽ làm hết việc Ký JWT + Lưu vào Redis
    const payload = new TokenPayload({
      userId: user.id,
      role: 'USER', // Cậu có thể lấy role từ user entity
      // deviceId: dto.deviceId // Nếu DTO có deviceId
    });

    // Manager trả về cặp token, AuthService không cần gọi jwtUtil thủ công nữa
    const tokens = await this.tokenManager.generateAndStoreTokens(payload);

    // 5. Trả về thông qua Mapper
    return UserMapper.toLoginResponse(user, tokens.accessToken, tokens.refreshToken);
  }

  /**
     * Tác dụng: Đăng xuất người dùng.
     */
  public async logout(payload: TokenPayload): Promise<void> {
    // CHỐT: Gọi thẳng Manager để thu hồi session
    await this.tokenManager.revokeToken(payload.userId);
  }

  /**
     * BƯỚC 1: YÊU CẦU GỬI OTP
     * Tác dụng: Kiểm tra email và gửi mã OTP qua MailService.
     */
  public async requestForgotPassword(email: string): Promise<void> {
    // 1. Kiểm tra User có tồn tại không (Hỏi qua UserService)
    const user = await this.userService.getUserByEmail(email);
    if (!user) throw new AppError(ErrorCode.USER.NOT_FOUND);

    // 2. Nhờ OtpService sinh mã, lưu vào Redis và gửi mail hộ
    // Hàm requestOtp này cậu đã viết rất chuẩn ở turn trước rồi.
    await this.otpService.requestOtp(email);
  }

  /**
   * BƯỚC 2: XÁC THỰC OTP & ĐỔI MẬT KHẨU
   * Tác dụng: Kiểm tra mã OTP, nếu đúng thì cập nhật mật khẩu mới vào DB.
   */
  public async resetPassword(dto: ResetPasswordDTO): Promise<void> {
    // 1. Rule 8: DTO tự validate dữ liệu (Cheap Check)
    dto.validateOrThrow();

    // 2. Nhờ OtpService xác thực mã OTP (Nếu sai/hết hạn sẽ tự ném lỗi bên trong)
    await this.otpService.verifyOtp(dto.email, dto.otp);

    // 3. Tìm User để chuẩn bị cập nhật
    const user = await this.userService.getUserByEmail(dto.email);
    if (!user) throw new AppError(ErrorCode.USER.NOT_FOUND);

    // 4. Hash mật khẩu mới
    const hashedPass = await bcrypt.hash(dto.newPassword, 10);

    // 5. Rule 6: Rich Domain Model - Entity tự cập nhật trạng thái
    user.resetPassword(hashedPass);

    // 6. Lưu vào MySQL thông qua UserService
    await this.userService.update(user);

    // 7. CHIẾN THUẬT BẢO MẬT (Logout All)
    // Sau khi đổi pass thành công, đá hết các thiết bị đang dùng pass cũ ra
    await this.tokenManager.revokeToken(user.id);

    // Xóa nốt OTP vì đã dùng xong (Nếu OtpService chưa xóa trong verifyOtp)
    await this.otpService.deleteOtp(dto.email);
  }
}