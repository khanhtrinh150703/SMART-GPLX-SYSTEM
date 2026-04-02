import { Request, Response } from 'express';
import { RegisterDTO, ResetPasswordDTO, VerifyUserDTO } from '@/application/dtos/request/auth.dto';
import { LoginInputDTO } from '@/application/dtos/request/loginInput.dto';
import { UserMapper } from '@/infrastructure/database/mappers/user.mapper';
import { Message } from '@/shared/errors/messages/success-messages-vn';
import { Result } from '@/shared/responses/api-response';

// IMPORT HÀM BỌC LỖI
import { catchAsync } from '@/shared/utils/catch-async';
import { AuthRequest } from '@/shared/types/auth.types';
import { ICradle } from '@/shared/types/container.types';
import { IAuthService } from '@/domain/interfaces/services/i-auth.service';
import { IRegistrationService } from '@/domain/interfaces/services/i-registration.service';

/**
 * Controller xử lý các luồng xác thực và đăng ký người dùng.
 * Tuân thủ quy tắc: KHÔNG dùng try-catch, lỗi được chuyển tiếp cho Global Error Middleware
 * thông qua hàm bọc catchAsync.
 */
export class AuthController {

  private readonly _authService: IAuthService;
  private readonly _registrationService: IRegistrationService;

  // CHỈ NHẬN NHỮNG THỨ ĐÃ ĐĂNG KÝ TRONG CONTAINER
  constructor({ authService, registrationService }: ICradle) {
    this._authService = authService;
    this._registrationService = registrationService;
  }

  /** 
   * Tác dụng: Tiếp nhận thông tin đăng ký ban đầu và yêu cầu gửi OTP.
   * @param {Request} req - Chứa RegisterDTO trong body.
   * @param {Response} res - Phản hồi tiêu chuẩn.
   * @returns {Promise<void>}
   */
  // SỬ DỤNG catchAsync BỌC TOÀN BỘ HÀM
  public signUpInit = catchAsync(async (req: Request, res: Response): Promise<void> => {
    const dto = new RegisterDTO(req.body);

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
    const dto = new VerifyUserDTO(req.body);
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
    const dto = new LoginInputDTO(req.body);
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
   * @param {Request} req - Chứa ResetPasswordDTO (otp, newPassword) trong body.
   * @param {Response} res - Đối tượng Response của Express.
   * @returns {Promise<void>}
   */
  public resetPassword = catchAsync(async (req: Request, res: Response): Promise<void> => {
    const dto = new ResetPasswordDTO(req.body);
    await this._authService.resetPassword(dto);

    Result.ok(res, undefined, Message.AUTH.PASSWORD_RESET, 'AUTH_PASSWORD_RESET_SUCCESS');
  });
}