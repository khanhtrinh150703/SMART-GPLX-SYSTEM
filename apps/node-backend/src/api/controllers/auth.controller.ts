import { Request, Response } from 'express';
import { AuthService } from '@/application/services/auth.service';
import { RegistrationService } from '@/application/services/registration.service';
import { RegisterDTO, ResetPasswordDTO, VerifyUserDTO } from '@/application/dtos/request/auth.dto';
import { LoginInputDTO } from '@/application/dtos/request/loginInput.dto';
import { UserMapper } from '@/infrastructure/database/mappers/user.mapper';
import { Message } from '@/shared/errors/messages/success-messages-vn';
import { Result } from '@/shared/responses/api-response';

// IMPORT HÀM BỌC LỖI
import { catchAsync } from '@/shared/utils/catch-async';
import { AuthRequest } from '@/shared/types/auth.types';
import { ICradle } from '@/shared/types/container.types';

/**
 * Controller xử lý các luồng xác thực và đăng ký người dùng.
 * Tuân thủ quy tắc: KHÔNG dùng try-catch, lỗi được chuyển tiếp cho Global Error Middleware
 * thông qua hàm bọc catchAsync.
 */
export class AuthController {

  private readonly _authService: AuthService;
  private readonly _registrationService: RegistrationService;

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
   * Tác dụng: Xác thực mã OTP và hoàn tất quy trình tạo tài khoản.
   */
  public signUpVerify = catchAsync(async (req: Request, res: Response): Promise<void> => {
    const dto = new VerifyUserDTO(req.body);
    const newUser = await this._registrationService.complete(dto.email, dto.otp);
    const result = UserMapper.toResponse(newUser);

    Result.created(
      res,
      result,
      Message.AUTH.REGISTER_SUCCESS,
      'CREATED_SUCCESS'
    );
  });

  /**
   * Tác dụng: Thực hiện đăng nhập và trả về cặp Token.
   */
  public login = catchAsync(async (req: Request, res: Response): Promise<void> => {
    const dto = new LoginInputDTO(req.body);
    const result = await this._authService.login(dto);

    Result.ok(
      res,
      result,
      Message.AUTH.LOGIN_SUCCESS,
      'AUTH_LOGIN_SUCCESS'
    );
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
   * Tác dụng: Yêu cầu gửi lại mã OTP.
   */
  public resendOtp = catchAsync(async (req: Request, res: Response): Promise<void> => {
    const { email } = req.body;
    await this._registrationService.resend(email);

    Result.ok(
      res,
      undefined,
      Message.AUTH.OTP_RESENT,
      'AUTH_OTP_RESENT'
    );
  });

  /**
     * BƯỚC 1: API Yêu cầu gửi mã OTP quên mật khẩu.
     * Endpoint: POST /api/v1/auth/forgot-password
     */
  public forgotPassword = catchAsync(async (req: Request, res: Response): Promise<void> => {
    const { email } = req.body;

    // Điều phối xuống Service xử lý (Check user + Sinh OTP + Gửi Mail)
    await this._authService.requestForgotPassword(email as string);

    // Trả về thành công (Message sẽ được map từ SuccessMessages-VN qua code)
    Result.ok(
      res,
      undefined,
      Message.AUTH.OTP_EMAIL,
      'AUTH_OTP_SENT_SUCCESS'
    );
  });

  /**
   * BƯỚC 2: API Xác thực OTP và đặt lại mật khẩu mới.
   * Endpoint: POST /api/v1/auth/reset-password
   */
  public resetPassword = catchAsync(async (req: Request, res: Response): Promise<void> => {
    // 1. Đưa dữ liệu vào DTO để chuẩn bị validate
    const dto = new ResetPasswordDTO(req.body);

    // 2. Gọi Service thực hiện nghiệp vụ "2 trong 1" (Verify OTP + Update Pass)
    await this._authService.resetPassword(dto);

    // 3. Trả về thành công
    Result.ok(
      res,
      undefined,
      Message.AUTH.PASSWORD_RESET,
      'AUTH_PASSWORD_RESET_SUCCESS'
    );
  });

}