import { ErrorCode, AppError } from '@/shared/errors';
import { UserMapper } from '@/infrastructure/database/mappers/identity/user.mapper';
import { ITokenManager } from '@/domain/interfaces/services/external/commands/i-token-manager.service';
import { IAuthService } from '@/domain/interfaces/services/identity/commands/i-auth.service';
import { IUserService } from '@/domain/interfaces/services/identity/commands/i-user.service';
import { IOtpService } from '@/domain/interfaces/services/identity/commands/i-otp.service';
import { jwtUtil } from '@/shared/utils/jwt.util';
import { REDIS_KEYS } from '@/shared/config/redis.config';
import { LoginRequestDTO } from '@/application/dtos/request/auth/login.request.dto';
import { RefreshTokenRequestDTO } from '@/application/dtos/request/auth/refresh.token.request.dto';
import { ResetPasswordRequestDTO } from '@/application/dtos/request/auth/reset-password.request.dto';
import { ILoginResponseDTO } from '@/application/dtos/response/auth/auth.respone.dto';
import { IUserQueryService } from '@/domain/interfaces/services/identity/queries';
import { ITokenPayload, ITokens } from '@/application/dtos/response/auth/token/token-payload.respone.dto';
import { STATUS } from '@/shared/config/status.config';

/**
 * @interface IAuthServiceCradle
 * @description Định nghĩa các phụ thuộc (Dependencies) cần thiết cho các tác vụ Xác thực và Bảo mật.
 */
export interface IAuthServiceCradle {
  /** @description Dịch vụ xử lý nghiệp vụ người dùng. */
  userService: IUserService;

  /** @description Dịch vụ quản lý, ký và xác thực mã Token (JWT). */
  tokenManager: ITokenManager;

  /** @description Dịch vụ điều phối mã xác thực một lần (OTP). */
  otpService: IOtpService;

  /** @description Dịch vụ truy vấn dữ liệu người dùng (Read-only). */
  userQueryService: IUserQueryService;
}

/**
 * @class AuthService
 * @description Application Service điều phối luồng Đăng nhập, Đăng xuất và quản lý phiên làm việc (Session Management).
 */
export class AuthService implements IAuthService {
  /** @private @readonly @description Dịch vụ nghiệp vụ User. */
  private readonly _userService: IUserService;

  /** @private @readonly @description Trình quản lý Token bảo mật. */
  private readonly _tokenManager: ITokenManager;

  /** @private @readonly @description Dịch vụ xử lý OTP. */
  private readonly _otpService: IOtpService;

  /** @private @readonly @description Dịch vụ truy vấn User. */
  private readonly _userQueryService: IUserQueryService;

  /**
   * @constructor
   * @description Khởi tạo AuthService với "túi đồ nghề" bảo mật được tiêm từ DI Container.
   * @param {IAuthServiceCradle} cradle - Chứa danh sách các Service phục vụ cho việc xác thực.
   */
  constructor({ userService, tokenManager, otpService, userQueryService }: IAuthServiceCradle) {
    this._userService = userService;
    this._tokenManager = tokenManager;
    this._otpService = otpService;
    this._userQueryService = userQueryService;
  }

  /**
   * @description Xác thực thông tin đăng nhập và cấp phát cặp Token (Access/Refresh). 
   * Thực thi chính sách duy nhất một phiên làm việc bằng cách thu hồi toàn bộ Token cũ của người dùng.
   * @param {LoginRequestDTO} dto - Chứa định danh (username/email) và mật khẩu người dùng. (Login credentials).
   * @returns {Promise<ILoginResponseDTO>} Thông tin profile cơ bản và bộ đôi JWT.
   * @throws {AppError} AUTH.INVALID_CREDENTIALS - Nếu sai tên đăng nhập hoặc mật khẩu (Dùng lỗi chung để tránh lộ thông tin).
   */
  public async login(dto: LoginRequestDTO): Promise<ILoginResponseDTO> {
    // 1. Cheap Check - Validate dữ liệu đầu vào cơ bản
    // (Dịch: Kiểm tra nhanh - Xác thực dữ liệu đầu vào cơ bản)

    // 2. Tìm User qua Service
    const user = await this._userQueryService.getUserByIdentifier(dto.username);

    // TRÁNH CRASH: Check user tồn tại trước khi gọi method của nó
    if (!user) {
      throw new AppError(ErrorCode.AUTH.INVALID_CREDENTIALS);
    }

    // 3. Kiểm tra mật khẩu (Encapsulated in Entity)
    const isPasswordMatch = await user.comparePassword(dto.password);
    if (!isPasswordMatch) {
      throw new AppError(ErrorCode.AUTH.INVALID_CREDENTIALS);
    }

    // 4. Quản lý Session & Token
    // Xóa các session cũ (Single Session Policy)
    await this._tokenManager.revokeTokenByPattern(user.id);

    // Sinh Token và lưu JTI vào Redis
    const tokens = await this._tokenManager.generateAndStoreTokens(user);

    // 5. Cập nhật trạng thái User (Ví dụ: lastLoginAt) - Optional nhưng nên có
    // await this._userService.updateLastLogin(user.id);

    // 6. Mapping kết quả qua Mapper
    return UserMapper.toLoginResponse(user, tokens);
  }

  /**
   * @description Làm mới bộ đôi Token bằng cơ chế xoay vòng (Token Rotation).
   * Thực hiện kiểm tra chữ ký, đối soát "sổ cái" Redis, thu hồi Token cũ và cấp phát cặp mã mới tinh.
   * @param {RefreshTokenRequestDTO} dto - Chứa chuỗi Refresh Token từ phía Client gửi lên. (Refresh token DTO).
   * @returns {Promise<ITokens>} Cặp mã Access Token và Refresh Token mới.
   * @throws {AppError} AUTH.UNAUTHORIZED - Nếu Token giả mạo, hết hạn hoặc đã bị thu hồi (vắng mặt trong Redis).
   * @throws {AppError} USER.NOT_FOUND - Nếu người dùng gắn liền với Token không tồn tại.
   * @throws {AppError} AUTH.ACCOUNT_LOCKED - Nếu tài khoản đã bị khóa, không được phép tiếp tục phiên làm việc.
   */
  public async refresh(dto: RefreshTokenRequestDTO): Promise<ITokens> {
    // 1. Verify chữ ký JWT của Refresh Token
    // Nếu token giả hoặc hết hạn, jwtUtil sẽ ném AppError(401)
    const payload = jwtUtil.verifyRefreshToken(dto.refreshToken);

    // 2. Kiểm tra "Sổ cái" Redis: Refresh Token này đã bị hủy chưa?
    const deviceId = payload.deviceId || 'default';
    const refreshKey = REDIS_KEYS.AUTH.getRefreshTokenKey(
      payload.userId,
      deviceId,
      payload.jti
    );

    // Giả định tokenRepository được bọc trong tokenManager hoặc truy cập trực tiếp
    const isValidSession = await this._tokenManager.exists(refreshKey);

    if (!isValidSession) {
      // Nếu không tìm thấy Key -> Token đã bị dùng rồi hoặc đã Logout
      throw new AppError(ErrorCode.AUTH.UNAUTHORIZED);
    }

    // 3. Kiểm tra thực thể User trong Database
    const user = await this._userQueryService.getUserById(payload.userId);
    if (!user) {
      throw new AppError(ErrorCode.USER.NOT_FOUND);
    }

    if (user.status !== STATUS.ACTIVE) {
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
   * @description Đăng xuất người dùng và thu hồi (revoke) toàn bộ session hiện có.
   * @param {ITokenPayload} payload - Thông tin trích xuất từ JWT hợp lệ.
   * @returns {Promise<void>}
   * @throws {AppError} USER.NOT_FOUND - Nếu người dùng không tồn tại hoặc đã bị xóa/khóa.
   */
  public async logout(payload: ITokenPayload): Promise<void> {
    // Thu hồi mọi token liên quan đến userId này trong Redis
    await this._tokenManager.revokeTokenByPattern(payload.userId);
  }

  /**
   * @description Yêu cầu gửi mã OTP để bắt đầu quy trình khôi phục mật khẩu.
   * @param {string} email - Email của người dùng cần reset mật khẩu.
   * @returns {Promise<void>}
   */
  public async requestForgotPassword(email: string): Promise<void> {
    // 1. Kiểm tra sự tồn tại của người dùng
    const user = await this._userQueryService.getUserByEmail(email);
    if (!user) throw new AppError(ErrorCode.USER.NOT_FOUND);


    // const clientIp = requestIp.getClientIp(req);
    // 2. Sinh mã OTP, lưu Redis và gửi Mail qua OtpService
    await this._otpService.requestOtp(email);
  }

  /**
   * @description Xác thực mã OTP và tiến hành thiết lập mật khẩu mới.
   * @param {ResetPasswordRequestDTO} dto - Dữ liệu gồm email, mã otp và mật khẩu mới.
   * @returns {Promise<void>}
   * @throws {AppError} USER.NOT_FOUND - Nếu người dùng không tồn tại hoặc đã bị xóa/khóa.
   */
  public async resetPassword(dto: ResetPasswordRequestDTO): Promise<void> {
    // 1. DTO tự kiểm tra định dạng dữ liệu

    // 2. Xác thực tính hợp lệ của OTP (Verify & Delete)
    await this._otpService.verifyOtp(dto.email, dto.otp);

    // 3. Tìm người dùng để cập nhật
    const user = await this._userQueryService.getUserByEmail(dto.email);
    if (!user) throw new AppError(ErrorCode.USER.NOT_FOUND);

    // 4. Băm mật khẩu mới và cập nhật trạng thái Entity (Rich Domain)
    await user.resetPassword(dto.newPassword);

    // 5. Lưu thay đổi vào Database qua Service
    await this._userService.update(user);

    // 6. Security Strategy: Đăng xuất khỏi mọi thiết bị sau khi đổi pass
    await this._tokenManager.revokeTokenByPattern(user.id);

    // 7. Dọn dẹp OTP đã sử dụng
    await this._otpService.deleteOtp(dto.email);
  }
}