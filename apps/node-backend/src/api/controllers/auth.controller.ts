import { Request, Response, NextFunction } from 'express';
import { AuthService } from '../../application/services/auth.service';
import { UserRepository } from '../../infrastructure/database/user.repository';
import { ErrorCode } from '../../domain/constants/error-codes';
import { Result } from '../../shared/utils/result';

// Khởi tạo (Trong thực tế bạn có thể dùng các thư viện DI như Inversify hoặc Tsyringe)
const userRepo = new UserRepository();
const authService = new AuthService(userRepo);

export class AuthController {
  static async signUp(req: Request, res: Response, next: NextFunction) {
    try {
      const user = await authService.register(req.body);
      return Result.ok(user)
    } catch (error) {
      next(error); // Lỗi ném về Global Error Middleware
    }
  }
}