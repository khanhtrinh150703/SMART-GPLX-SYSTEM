import bcrypt from 'bcrypt';
import { LoginResponseDTO } from '../dtos/response/auth/auth.respone.dto';
import { ErrorCode, AppError } from '@/shared/errors';
import { UserMapper } from '@/infrastructure/database/mappers/user.mapper';
import { TokenPayload, Tokens } from '@/shared/types/auth.types';
import { ITokenManager } from '@/domain/interfaces/external/i-token-manager';
import { IAuthService } from '@/domain/interfaces/services/i-auth.service';
import { ResetPasswordRequestDTO } from '../dtos/request/auth/reset-password.request.dto';
import { LoginRequestDTO } from '../dtos/request/auth/login.request.dto';
import { IUserService } from '@/domain/interfaces/services/i-user.service';
import { IOtpService } from '@/domain/interfaces/services/i-otp.service';
import { RefreshTokenRequestDTO } from '../dtos/request/auth/refresh.token.request.dto';
import { jwtUtil } from '@/shared/utils/jwt.util';
import { REDIS_CONSTANTS } from '@/domain/constants/redis.constant';

/**
 * @interface IAuthServiceCradle
 * @description "Túi đồ nghề" bảo mật dành riêng cho AuthService.
 * Tập hợp các service cần thiết để thực hiện Đăng nhập, Đăng xuất và OTP.
 */
export interface IAuthServiceCradle {
  userService: IUserService;
  tokenManager: ITokenManager;
  otpService: IOtpService;
}

/**
 * @class AuthService
 * @description Dịch vụ điều phối logic nghiệp vụ liên quan đến Xác thực và Bảo mật.
 */
export class AuthService implements IAuthService {
  private readonly _userService: IUserService;
  private readonly _tokenManager: ITokenManager;
  private readonly _otpService: IOtpService;

  /**
   * @description Khởi tạo AuthService với các phụ thuộc chuyên biệt.
   * @param {IAuthServiceCradle} cradle - Chỉ chứa User, Token và OTP Services.
   */
  constructor({ userService, tokenManager, otpService }: IAuthServiceCradle) {
    this._userService = userService;
    this._tokenManager = tokenManager;
    this._otpService = otpService;
  }

  /**
   * Xử lý đăng nhập, kiểm tra thông tin định danh và cấp phát bộ đôi Token.
   * @param {LoginRequestDTO} dto - Dữ liệu đăng nhập (username/password).
   * @returns {Promise<LoginResponseDTO>} Thông tin profile sạch và cặp JWT.
   */
  public async login(dto: LoginRequestDTO): Promise<LoginResponseDTO> {
    // 1. Rule 8: Cheap Check - Validate dữ liệu đầu vào cơ bản
    if (!dto.isValid()) {
      throw new AppError(ErrorCode.AUTH.INVALID_CREDENTIALS);
    }

    // 2. Tìm User qua Service (Bao gồm Roles & Permissions)
    const user = await this._userService.getUserByIdentifier(dto.username);

    // 3. Kiểm tra mật khẩu bằng thuật toán Bcrypt
    const isPasswordMatch = await bcrypt.compare(dto.password, user.passwordHash ?? '');
    if (!isPasswordMatch) {
      throw new AppError(ErrorCode.AUTH.INVALID_CREDENTIALS);
    }

    // 4. Sinh Token và lưu JTI vào Redis để quản lý Session
    const tokens = await this._tokenManager.generateAndStoreTokens(user);

    // 5. Mapping kết quả trả về thông qua UserMapper
    return UserMapper.toLoginResponse(user, tokens.accessToken, tokens.refreshToken);
  }

  /**
   * @description Logic làm mới cặp Token (Access & Refresh)
   * @param {RefreshTokenRequestDTO} dto - Chứa chuỗi refreshToken từ Client
   */
  public async refresh(dto: RefreshTokenRequestDTO): Promise<Tokens> {
    // 1. Verify chữ ký JWT của Refresh Token
    // Nếu token giả hoặc hết hạn, jwtUtil sẽ ném AppError(401)
    const payload = jwtUtil.verifyRefreshToken(dto.refreshToken) as TokenPayload;

    // 2. Kiểm tra "Sổ cái" Redis: Refresh Token này đã bị hủy chưa?
    const deviceId = payload.deviceId || 'default';
    const refreshKey = `${REDIS_CONSTANTS.REFRESH_TOKEN_PREFIX}${payload.userId}:${deviceId}:${payload.jti}`;

    // Giả định tokenRepository được bọc trong tokenManager hoặc truy cập trực tiếp
    // Ở đây ta check xem session này còn valid trong Redis không
    const isValidSession = await this._tokenManager.exists(refreshKey);

    if (!isValidSession) {
      // Nếu không tìm thấy Key -> Token đã bị dùng rồi hoặc đã Logout
      throw new AppError(ErrorCode.AUTH.UNAUTHORIZED);
    }

    // 3. Kiểm tra thực thể User trong Database
    const user = await this._userService.getUserById(payload.userId);
    if (!user) {
      throw new AppError(ErrorCode.USER.NOT_FOUND);
    }

    if (user.status !== 'active') {
      throw new AppError(ErrorCode.AUTH.ACCOUNT_LOCKED);
    }

    // 4. TOKEN ROTATION (Xoay vòng Token)
    // - Bước A: Thu hồi (Xóa) cặp Token cũ trong Redis để không ai dùng lại được nữa
    await this._tokenManager.revokeTokenByPayLoad(payload);

    // - Bước B: Tạo và Lưu cặp Token mới tinh (Access & Refresh mới, JTI mới)
    const newTokens = await this._tokenManager.generateAndStoreTokens(user);

    return newTokens;
  }

  /**
   * Đăng xuất người dùng và thu hồi (revoke) toàn bộ session hiện có.
   * @param {TokenPayload} payload - Thông tin trích xuất từ JWT hợp lệ.
   * @returns {Promise<void>}
   */
  public async logout(payload: TokenPayload): Promise<void> {
    // Thu hồi mọi token liên quan đến userId này trong Redis
    await this._tokenManager.revokeTokenByPattern(payload.userId);
  }

  /**
   * Yêu cầu gửi mã OTP để bắt đầu quy trình khôi phục mật khẩu.
   * @param {string} email - Email của người dùng cần reset mật khẩu.
   * @returns {Promise<void>}
   */
  public async requestForgotPassword(email: string): Promise<void> {
    // 1. Kiểm tra sự tồn tại của người dùng
    const user = await this._userService.getUserByEmail(email);
    if (!user) throw new AppError(ErrorCode.USER.NOT_FOUND);

    
    // const clientIp = requestIp.getClientIp(req);
    // 2. Sinh mã OTP, lưu Redis và gửi Mail qua OtpService
    await this._otpService.requestOtp(email);
  }

  /**
   * Xác thực mã OTP và tiến hành thiết lập mật khẩu mới.
   * @param {ResetPasswordRequestDTO} dto - Dữ liệu gồm email, mã otp và mật khẩu mới.
   * @returns {Promise<void>}
   */
  public async resetPassword(dto: ResetPasswordRequestDTO): Promise<void> {
    // 1. DTO tự kiểm tra định dạng dữ liệu
    dto.validateOrThrow();

    // 2. Xác thực tính hợp lệ của OTP (Verify & Delete)
    await this._otpService.verifyOtp(dto.email, dto.otp);

    // 3. Tìm người dùng để cập nhật
    const user = await this._userService.getUserByEmail(dto.email);
    if (!user) throw new AppError(ErrorCode.USER.NOT_FOUND);

    // 4. Băm mật khẩu mới và cập nhật trạng thái Entity (Rich Domain)
    const hashedPass = await bcrypt.hash(dto.newPassword, 10);
    user.resetPassword(hashedPass);

    // 5. Lưu thay đổi vào Database qua Service
    await this._userService.update(user);

    // 6. Security Strategy: Đăng xuất khỏi mọi thiết bị sau khi đổi pass
    await this._tokenManager.revokeTokenByPattern(user.id);

    // 7. Dọn dẹp OTP đã sử dụng
    await this._otpService.deleteOtp(dto.email);
  }
}