import { Request, Response, NextFunction } from 'express';
import { AuthService } from '../../application/services/auth.service';
import { UserRepository } from '../../infrastructure/database/user.repository';
import { Result } from '../../shared/utils/response';
import { RegisterDTO } from '@/application/dtos/request/auth.dto';
import { UserMapper } from '@/infrastructure/database/mappers/user.mapper';
import { LoginInputDTO } from '@/application/dtos/request/loginInput.dto';

const userRepo = new UserRepository();
const authService = new AuthService(userRepo);

export class AuthController {

  /**
   * @route   POST /api/v1/auth/register
   * @desc    Tạo mới tài khoản người đùng
   * @access  Public
   */
  static async signUp(req: Request, res: Response, next: NextFunction) {
    try {
      const dto = new RegisterDTO(req.body);

      const result = await authService.register(dto);

      const cleanResponse = UserMapper.toResponse(result);
      return Result.ok(res, cleanResponse);
    } catch (error) {
      next(error);
    }
  }

  /**
   * @route   POST /api/v1/auth/login
   * @desc    Xác thực người dùng & Trả về JWT Token
   * @access  Public
   */
  static async login(req: Request, res: Response, next: NextFunction) {
    try {
      // 1. Khởi tạo DTO từ body (DTO sẽ tự check validate cơ bản)
      const dto = new LoginInputDTO(req.body);

      // 2. Gọi Service xử lý logic xác thực
      // Service này cam kết trả về { user, accessToken } hoặc throw AppError
      const user = await authService.login(dto);

      // 3. Sử dụng Mapper để loại bỏ thông tin nhạy cảm (passwordHash, v.v.)
      const cleanUser = UserMapper.toResponse(user);

      // 4. Trả về response chuẩn hóa cho Frontend
      return Result.ok(res, {
        user: cleanUser,
      });

    } catch (error) {
      // Nếu sai pass, sai email... lỗi sẽ "văng" xuống đây và đi thẳng vào Global Error Handler
      next(error);
    }
  }
}