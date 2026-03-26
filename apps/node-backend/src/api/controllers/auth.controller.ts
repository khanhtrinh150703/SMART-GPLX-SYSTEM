import { Request, Response } from 'express';
import { AuthService } from '@/application/services/auth.service';
import { RegistrationService } from '@/application/services/registration.service';
import { RegisterDTO, VerifyUserDTO } from '@/application/dtos/request/auth.dto';
import { LoginInputDTO } from '@/application/dtos/request/loginInput.dto';
import { UserMapper } from '@/infrastructure/database/mappers/user.mapper';
import { Message } from '@/shared/errors/messages/success-messages-vn';
import { Result } from '@/shared/responses/api-response';

// IMPORT HÀM BỌC LỖI
import { catchAsync } from '@/shared/utils/catch-async';
import { AuthRequest } from '@/shared/types/auth.types';

/**
 * Controller xử lý các luồng xác thực và đăng ký người dùng.
 * Tuân thủ quy tắc: KHÔNG dùng try-catch, lỗi được chuyển tiếp cho Global Error Middleware
 * thông qua hàm bọc catchAsync.
 */
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly registrationService: RegistrationService
  ) { }

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
    await this.registrationService.initiate(dto);

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
    const newUser = await this.registrationService.complete(dto.email, dto.otp);
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
    const result = await this.authService.login(dto);

    Result.ok(
      res,
      result,
      Message.AUTH.LOGIN_SUCCESS,
      'AUTH_LOGIN_SUCCESS'
    );
  });

  /**
     * Endpoint Logout: Sử dụng TokenPayload linh hoạt.
     */
  public logout = async (req: AuthRequest, res: Response): Promise<void> => {
    /**
     * TRƯỚC ĐÂY: Bạn chỉ lấy userId (const userId = req.user!.id)
     * BÂY GIỜ: Bạn truyền nguyên đối tượng Payload linh hoạt vào Service.
     */
    const payload = req.user!;

    await this.authService.logout(payload);

    Result.ok(
      res,
      undefined,
      Message.AUTH.LOGOUT_SUCCESS,
      'AUTH_LOGOUT_SUCCESS'
    );
  };
  /**
   * Tác dụng: Yêu cầu gửi lại mã OTP.
   */
  public resendOtp = catchAsync(async (req: Request, res: Response): Promise<void> => {
    const { email } = req.body;
    await this.registrationService.resend(email);

    Result.ok(
      res,
      undefined,
      Message.AUTH.OTP_RESENT,
      'AUTH_OTP_RESENT'
    );
  });
}