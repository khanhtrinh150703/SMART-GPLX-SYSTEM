import { Request, Response } from 'express';
import { UserMapper } from '@/infrastructure/database/mappers/user.mapper';
import { Message } from '@/shared/errors/messages/success-messages-vn';
import { Result } from '@/shared/responses/api-response';
import { catchAsync } from '@/shared/utils/catch-async';
import { AuthRequest } from '@/shared/types/auth.types';
import { IAuthService } from '@/domain/interfaces/services/i-auth.service';
import { IRegistrationService } from '@/domain/interfaces/services/i-registration.service';
import { RegisterRequestDTO } from '@/application/dtos/request/auth/register.request.dto';
import { VerifyUserRequestDTO } from '@/application/dtos/request/auth/verify-otp.request.dto';
import { LoginRequestDTO } from '@/application/dtos/request/auth/login.request.dto';
import { ResetPasswordRequestDTO } from '@/application/dtos/request/auth/reset-password.request.dto';

/**
 * @interface IAuthControllerCradle
 * @description "Túi đồ nghề" bảo mật cho AuthController.
 * Tập hợp các service cần thiết để điều phối luồng Xác thực và Đăng ký.
 */
export interface IAuthControllerCradle {
  authService: IAuthService;
  registrationService: IRegistrationService;
}

/**
 * @class AuthController
 * @description Tiếp nhận và điều phối các yêu cầu HTTP liên quan đến Xác thực, Đăng ký và OTP.
 * Tuân thủ: Chuyển tiếp lỗi cho Global Error Middleware qua wrapper (ví dụ: catchAsync).
 */
export class AuthController {
  private readonly _authService: IAuthService;
  private readonly _registrationService: IRegistrationService;

  /**
   * @description Khởi tạo AuthController với các phụ thuộc chuyên biệt.
   * @param {IAuthControllerCradle} cradle - Dependencies được tiêm tự động từ DI Container.
   */
  constructor({ authService, registrationService }: IAuthControllerCradle) {
    // CHỈ NHẬN NHỮNG THỨ CẦN THIẾT CHO AUTH & REGISTRATION
    this._authService = authService;
    this._registrationService = registrationService;
  }

  /** 
   * Tác dụng: Tiếp nhận thông tin đăng ký ban đầu và yêu cầu gửi OTP.
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
   * API Xác thực OTP và hoàn tất đăng ký tài khoản.
   * @route POST /api/v1/auth/signup-verify
   * @param {Request} req - Chứa email và mã otp trong body.
   * @param {Response} res - Đối tượng Response của Express.
   * @returns {Promise<void>}
   */
  public signUpVerify = catchAsync(async (req: Request, res: Response): Promise<void> => {
    const dto = new VerifyUserRequestDTO(req.body);
    const newUser = await this._registrationService.complete(dto.email, dto.otp);
    const result = UserMapper.toResponse(newUser);

    Result.created(res, result, Message.AUTH.REGISTER_SUCCESS, 'CREATED_SUCCESS');
  });

  /**
   * API Đăng nhập và trả về cặp Access/Refresh Token.
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
   * Tác dụng: Xử lý đăng xuất người dùng bằng cách thu hồi token.
   * @param {AuthRequest} req - Request đã qua xác thực, chứa TokenPayload.
   * @param {Response} res - Phản hồi tiêu chuẩn.
   * @param {NextFunction} next - Hàm chuyển tiếp lỗi của Express.
   */
  public logout = catchAsync(async (req: AuthRequest, res: Response): Promise<void> => {
    // 1. Không dùng '!', dùng trực tiếp từ AuthRequest (đã được middleware đảm bảo)
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
   * API Yêu cầu gửi lại mã OTP xác thực.
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
   * API Yêu cầu gửi mã OTP để đặt lại mật khẩu.
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
   * API Xác thực OTP và cập nhật mật khẩu mới.
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