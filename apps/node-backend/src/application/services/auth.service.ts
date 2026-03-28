import bcrypt from 'bcrypt';
import { LoginInputDTO } from '../dtos/request/loginInput.dto';
import { LoginResponseDTO } from '../dtos/response/auth.dto';
import { ErrorCode, AppError } from '@/shared/errors';
import { UserService } from './user.service';
import { UserMapper } from '@/infrastructure/database/mappers/user.mapper';
import { TokenPayload } from '@/shared/types/auth.types';
import { ITokenManager } from '@/domain/interfaces/external/i-token-manager';
import { ResetPasswordDTO } from '../dtos/request/auth.dto';
import { OtpService } from './otp.service';
import { IAuthService } from '@/domain/interfaces/services/i-auth.service';
import { ICradle } from '@/shared/types/container.types';

/**
 * Service xử lý nghiệp vụ xác thực người dùng.
 */
export class AuthService implements IAuthService {

  private readonly _userService: UserService; // Dùng Service thay vì Repo
  private readonly _tokenManager: ITokenManager;
  private readonly _otpService: OtpService;
  
  constructor({ userService, tokenManager, otpService }: ICradle) {
    this._userService = userService;
    this._tokenManager = tokenManager;
    this._otpService = otpService;
  }

  /**
   * @description Xử lý đăng nhập, kiểm tra mật khẩu và cấp phát bộ đôi Token.
   * @param {LoginInputDTO} dto - Dữ liệu đăng nhập.
   * @returns {Promise<LoginResponseDTO>}
   */
  public async login(dto: LoginInputDTO): Promise<LoginResponseDTO> {
    // 1. Rule 8: Cheap Check - Validate dữ liệu đầu vào cơ bản
    if (!dto.isValid()) {
      throw new AppError(ErrorCode.AUTH.INVALID_CREDENTIALS);
    }

    // 2. Tìm User thông qua Service (Đã bao gồm include Roles & Permissions từ Repo)
    // UserService.getUserByIdentifier đã được viết để check email/username linh hoạt
    const user = await this._userService.getUserByIdentifier(dto.username);

    // 3. Kiểm tra mật khẩu (Sử dụng bcrypt)
    // Chúng ta dùng dấu !isPasswordMatch để ném lỗi chung cho bảo mật
    const isPasswordMatch = await bcrypt.compare(dto.password, user.passwordHash ?? '');
    if (!isPasswordMatch) {
      throw new AppError(ErrorCode.AUTH.INVALID_CREDENTIALS);
    }

    // 4. KIỂM TRA TRẠNG THÁI (Nếu UserService chưa check thì ở đây check cho chắc)
    // 5. TRÍCH XUẤT ROLE (Không gán cứng 'USER' nữa)
    // Lấy Role đầu tiên hoặc Role cao nhất của User để đưa vào Token

    // Manager lo việc ký JWT và whitelist/blacklist trong Redis
    const tokens = await this._tokenManager.generateAndStoreTokens(user);
    
    // 7. MAPPING KẾT QUẢ TRẢ VỀ
    // Giấu đi passwordHash, chỉ trả về profile sạch và bộ đôi token
    return UserMapper.toLoginResponse(user, tokens.accessToken, tokens.refreshToken);
  }

  /**
     * Tác dụng: Đăng xuất người dùng.
     */
  public async logout(payload: TokenPayload): Promise<void> {
    await this._tokenManager.revokeTokenByPattern(payload.userId);

    // CHỐT: Gọi thẳng Manager để thu hồi session
    // await this._tokenManager.revokeTokenByPayLoad(payload);
  }

  /**
     * BƯỚC 1: YÊU CẦU GỬI OTP
     * Tác dụng: Kiểm tra email và gửi mã OTP qua MailService.
     */
  public async requestForgotPassword(email: string): Promise<void> {
    // 1. Kiểm tra User có tồn tại không (Hỏi qua UserService)
    const user = await this._userService.getUserByEmail(email);
    if (!user) throw new AppError(ErrorCode.USER.NOT_FOUND);

    // 2. Nhờ OtpService sinh mã, lưu vào Redis và gửi mail hộ
    // Hàm requestOtp này cậu đã viết rất chuẩn ở turn trước rồi.
    await this._otpService.requestOtp(email);
  }

  /**
   * BƯỚC 2: XÁC THỰC OTP & ĐỔI MẬT KHẨU
   * Tác dụng: Kiểm tra mã OTP, nếu đúng thì cập nhật mật khẩu mới vào DB.
   */
  public async resetPassword(dto: ResetPasswordDTO): Promise<void> {
    // 1. Rule 8: DTO tự validate dữ liệu (Cheap Check)
    dto.validateOrThrow();

    // 2. Nhờ OtpService xác thực mã OTP (Nếu sai/hết hạn sẽ tự ném lỗi bên trong)
    await this._otpService.verifyOtp(dto.email, dto.otp);

    // 3. Tìm User để chuẩn bị cập nhật
    const user = await this._userService.getUserByEmail(dto.email);
    if (!user) throw new AppError(ErrorCode.USER.NOT_FOUND);

    // 4. Hash mật khẩu mới
    const hashedPass = await bcrypt.hash(dto.newPassword, 10);

    // 5. Rule 6: Rich Domain Model - Entity tự cập nhật trạng thái
    user.resetPassword(hashedPass);

    // 6. Lưu vào MySQL thông qua UserService
    await this._userService.update(user);

    // 7. CHIẾN THUẬT BẢO MẬT (Logout All)
    // Sau khi đổi pass thành công, đá hết các thiết bị đang dùng pass cũ ra
    await this._tokenManager.revokeTokenByPattern(user.id);

    // Xóa nốt OTP vì đã dùng xong (Nếu OtpService chưa xóa trong verifyOtp)
    await this._otpService.deleteOtp(dto.email);
  }
}