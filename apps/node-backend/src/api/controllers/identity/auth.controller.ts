import { Request, Response } from 'express';
import { Message } from '@/shared/errors/messages/success-messages-vn';
import { Result } from '@/application/dtos/response/shared/api.response.dto';
import { catchAsync } from '@/shared/utils/catch-async.utils';
import { IAuthRequest } from '@/shared/types/authRequest.types';
import { RegisterRequestDTO } from '@/application/dtos/request/auth/register.request.dto';
import { VerifyUserRequestDTO } from '@/application/dtos/request/auth/verify-otp.request.dto';
import { LoginRequestDTO } from '@/application/dtos/request/auth/login.request.dto';
import { ResetPasswordRequestDTO } from '@/application/dtos/request/auth/reset-password.request.dto';
import { RefreshTokenRequestDTO } from '@/application/dtos/request/auth/refresh.token.request.dto';
import { IAuthService, IRegistrationService } from '@/domain/interfaces/services/identity';

/**
 * @interface IAuthControllerCradle
 * @description "Túi đồ nghề" bảo mật (Security Toolbox) chứa các dịch vụ cần thiết để điều phối luồng Xác thực và Đăng ký.
 */
export interface IAuthControllerCradle {
  /** @description Dịch vụ xử lý đăng nhập, tạo mã thông báo (token) và quản lý phiên làm việc. */
  authService: IAuthService;

  /** @description Dịch vụ chuyên trách quy trình đăng ký tài khoản mới và xác thực thông tin đầu vào. */
  registrationService: IRegistrationService;
}

/**
 * @class AuthController
 * @description Lớp điều phối (Orchestrator) các yêu cầu HTTP liên quan đến Xác thực, Đăng ký và mã OTP.
 * @principle Fail-Safe & Centralized Error Handling - Đảm bảo mọi lỗi phát sinh đều được chuyển tiếp cho Global Error Middleware để xử lý thống nhất, tránh rò rỉ thông tin nhạy cảm.
 */
export class AuthController {
  /** @private @readonly @description Instance xử lý các logic nghiệp vụ về xác thực. */
  private readonly _authService: IAuthService;

  /** @private @readonly @description Instance xử lý các yêu cầu đăng ký người dùng mới. */
  private readonly _registrationService: IRegistrationService;

  /**
   * @constructor
   * @description Khởi tạo AuthController thông qua cơ chế tiêm phụ thuộc (DI).
   * @param {IAuthControllerCradle} cradle - Chứa các dịch vụ chuyên biệt cần thiết để vận hành module bảo mật.
   */
  constructor({ authService, registrationService }: IAuthControllerCradle) {
    // Chỉ nhận các thành phần tối cần thiết để tuân thủ Interface Segregation Principle.
    this._authService = authService;
    this._registrationService = registrationService;
  }

  /** 
   * @description Tác dụng: Tiếp nhận thông tin đăng ký ban đầu và yêu cầu gửi OTP.
   * @param {Request} req - Chứa RegisterRequestDTO trong body.
   * @param {Response} res - Phản hồi tiêu chuẩn.
   * @returns {Promise<void>}
   */
  // SỬ DỤNG catchAsync BỌC TOÀN BỘ HÀM
  public signUpInit = catchAsync(async (req: Request, res: Response): Promise<void> => {
    const dto = new RegisterRequestDTO(req.body);

    // Nếu trong initiate có throw AppError, catchAsync sẽ tự động vớt và gọi next(err)
    await this._registrationService.initiate(dto);

    Result.ok(
      res,
      undefined,
      Message.AUTH.OTP_EMAIL,
      'AUTH_REGISTER_SUCCESS'
    );
  });

  /**
   * @description Làm mới Access Token bằng Refresh Token (Silent Refresh).
   * @route POST /api/v1/auth/refresh-token
   * @param {Request} req - Chứa refreshToken.
   * @param {Response} res - Trả về Access Token mới.
   * @returns {Promise<void>}
   */
  public refreshToken = catchAsync(async (req: Request, res: Response): Promise<void> => {
    const dto = new RefreshTokenRequestDTO(req.body);

    const newToken = await this._authService.refresh(dto);

    Result.ok(
      res,
      newToken,
      Message.AUTH.TOKEN_REFRESHED,
      'AUTH_TOKEN_REFRESH_SUCCESS'
    );
  });

  /**
   * @description API Xác thực OTP và hoàn tất đăng ký tài khoản.
   * @route POST /api/v1/auth/signup-verify
   * @param {Request} req - Chứa email và mã otp trong body.
   * @param {Response} res - Đối tượng Response của Express.
   * @returns {Promise<void>}
   */
  public signUpVerify = catchAsync(async (req: Request, res: Response): Promise<void> => {
    const dto = new VerifyUserRequestDTO(req.body);
    const newUser = await this._registrationService.complete(dto.email, dto.otp);
    Result.created(res, newUser, Message.AUTH.REGISTER_SUCCESS, 'CREATED_SUCCESS');
  });

  /**
   * @description API Đăng nhập và trả về cặp Access/Refresh Token.
   * @route POST /api/v1/auth/login
   * @param {Request} req - Chứa thông tin đăng nhập trong body.
   * @param {Response} res - Đối tượng Response của Express.
   * @returns {Promise<void>}
   */
  public login = catchAsync(async (req: Request, res: Response): Promise<void> => {
    const dto = new LoginRequestDTO(req.body);
    const result = await this._authService.login(dto);

    Result.ok(res, result, Message.AUTH.LOGIN_SUCCESS, 'AUTH_LOGIN_SUCCESS');
  });

  /**
   * @description Tác dụng: Xử lý đăng xuất người dùng bằng cách thu hồi token.
   * @param {IAuthRequest} req - Request đã qua xác thực, chứa TokenPayload.
   * @param {Response} res - Phản hồi tiêu chuẩn.
   * @param {NextFunction} next - Hàm chuyển tiếp lỗi của Express.
   */
  public logout = catchAsync(async (req: IAuthRequest, res: Response): Promise<void> => {
    const payload = req.user;

    // 2. Gọi Service xử lý (catchAsync sẽ lo việc bắt lỗi nếu có)
    await this._authService.logout(payload);

    // 3. Trả về kết quả theo format chuẩn của dự án
    Result.ok(
      res,
      undefined,
      Message.AUTH.LOGOUT_SUCCESS,
      'AUTH_LOGOUT_SUCCESS'
    );
  });

  /**
   * @description API Yêu cầu gửi lại mã OTP xác thực.
   * @route POST /api/v1/auth/resend-otp
   * @param {Request} req - Chứa email trong body.
   * @param {Response} res - Đối tượng Response của Express.
   * @returns {Promise<void>}
   */
  public resendOtp = catchAsync(async (req: Request, res: Response): Promise<void> => {
    const { email } = req.body;
    await this._registrationService.resend(email);

    Result.ok(res, undefined, Message.AUTH.OTP_RESENT, 'AUTH_OTP_RESENT');
  });

  /**
   * @description API Yêu cầu gửi mã OTP để đặt lại mật khẩu.
   * @route POST /api/v1/auth/forgot-password
   * @param {Request} req - Chứa email người dùng trong body.
   * @param {Response} res - Đối tượng Response của Express.
   * @returns {Promise<void>}
   */
  public forgotPassword = catchAsync(async (req: Request, res: Response): Promise<void> => {
    const { email } = req.body;
    await this._authService.requestForgotPassword(email as string);

    Result.ok(res, undefined, Message.AUTH.OTP_EMAIL, 'AUTH_OTP_SENT_SUCCESS');
  });

  /**
   * @description API Xác thực OTP và cập nhật mật khẩu mới.
   * @route POST /api/v1/auth/reset-password
   * @param {Request} req - Chứa ResetPasswordRequestDTO (otp, newPassword) trong body.
   * @param {Response} res - Đối tượng Response của Express.
   * @returns {Promise<void>}
   */
  public resetPassword = catchAsync(async (req: Request, res: Response): Promise<void> => {
    const dto = new ResetPasswordRequestDTO(req.body);
    await this._authService.resetPassword(dto);

    Result.ok(res, undefined, Message.AUTH.PASSWORD_RESET, 'AUTH_PASSWORD_RESET_SUCCESS');
  });
}