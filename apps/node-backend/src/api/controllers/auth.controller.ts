import { Request, Response, NextFunction } from 'express';
import { AuthService } from '../../application/services/auth.service';
import { OtpService } from '@/application/services/otp.service'; // Thêm mới (Newly added)
import { UserRepository } from '@/infrastructure/repositories/user/user.repository';
import { Result } from '../../shared/utils/response';
import { RegisterDTO } from '@/application/dtos/request/auth.dto';
import { UserMapper } from '@/infrastructure/database/mappers/user.mapper';
import { LoginInputDTO } from '@/application/dtos/request/loginInput.dto';
import { RedisOtpRepository } from '@/infrastructure/repositories/redis/redis.repository.otp';
import { NodemailerService } from '@/application/services/nodemailer.service';
import { Message } from '@/shared/errors/messages/notify-messages-vn';
import { VerifyUserDTO } from '@/application/dtos/request/user.dto';

const userRepo = new UserRepository();
const otpRepo = new RedisOtpRepository();
const emailService = new NodemailerService();
const otpService = new OtpService(otpRepo, emailService);

const authService = new AuthService(userRepo, otpService);

export class AuthController {

  /**
   * @route   POST /api/v1/auth/register/init
   * @desc    Nhận thông tin, lưu tạm vào Redis, gửi OTP qua Email
   * @access  Public
   */
  static async signUpInit(req: Request, res: Response, next: NextFunction) {
    try {
      // 1. Khởi tạo và kiểm tra dữ liệu đầu vào (Initialize and validate input data)
      const dto = new RegisterDTO(req.body);

      // 2. LƯU TẠM DỮ LIỆU (TEMPORARILY SAVE DATA)
      // Thay vì gọi authService.register(dto) để lưu vào DB ngay, 
      await authService.initiateRegistration(dto)

      // 3. Gọi OtpService để sinh mã và gửi Email (Call OtpService to generate code and send Email)
      // 4. Trả về thông báo cho Frontend biết để mở màn hình nhập OTP (Return message to Frontend to open OTP input screen)
      return Result.ok(res, {
        message: Message.AUTH.OTP_EMAIL
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * @route   POST /api/v1/auth/register/verify
   * @desc    Kiểm tra OTP, nếu đúng thì lấy dữ liệu tạm ra và lưu vào Database thật
   * @access  Public
   */
  static async signUpVerify(req: Request, res: Response, next: NextFunction) {
    try {
      const dto = new VerifyUserDTO(req.body);

      // 3. Đưa vào AuthService để tạo User thật trong DB
      const userData = await authService.completeRegistration(dto.email, dto.otp);

      return Result.ok(res, UserMapper.toResponse(userData));
    } catch (error) { next(error); }
  }

  /**
   * @route   POST /api/v1/auth/login
   * @desc    Xác thực người dùng & Trả về JWT Token (Authenticate user & Return JWT Token)
   * @access  Public
   */
  static async login(req: Request, res: Response, next: NextFunction) {
    // Đoạn này của cậu rất chuẩn rồi, KHÔNG CẦN THAY ĐỔI GÌ (NO CHANGES NEEDED)
    try {
      const dto = new LoginInputDTO(req.body);
      const user = await authService.login(dto);
      const cleanUser = UserMapper.toResponse(user);

      return Result.ok(res, { user: cleanUser });
    } catch (error) {
      next(error);
    }
  }

  /**
   * @route   POST /api/v1/auth/resend-otp
   * @desc    Gửi lại mã OTP xác thực (Resend verification OTP)
   * @access  Public
   */
  static async resendOtp(req: Request, res: Response, next: NextFunction) {
    try {
      // 1. Khởi tạo DTO từ request body (chỉ cần email)
      // Giả sử bạn có ResendOtpDTO để validate email
      const { email } = req.body;
      
      // 2. Gọi Service để xử lý logic (Check tồn tại, Check cooldown, Gửi mail)
      await authService.resendOtp(email);

      // 3. Trả về thông báo thành công
      return Result.ok(res, { 
        message: "Mã OTP mới đã được gửi vào email của bạn." 
      });
      
    } catch (error) {
      // Chuyển lỗi sang Middleware xử lý lỗi tập trung
      next(error);
    }
  }
}