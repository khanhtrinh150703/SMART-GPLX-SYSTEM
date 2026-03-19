import { Request, Response, NextFunction } from 'express';
import { AuthService } from '../../application/services/auth.service';
import { UserRepository } from '../../infrastructure/database/user.repository';
import { Result } from '../../shared/utils/response';
import { RegisterDTO } from '@/application/dtos/auth.dto';

const userRepo = new UserRepository();
const authService = new AuthService(userRepo);

export class AuthController {
  static async signUp(req: Request, res: Response, next: NextFunction) {
    try {
      // BIẾN req.body THÀNH INSTANCE CỦA CLASS
      const dto = new RegisterDTO(req.body);

      // Bây giờ gọi service sẽ không còn lỗi nữa vì dto đã có các hàm isEmail(), isValid()...
      const result = await authService.register(dto);

      return Result.ok(res, result);
    } catch (error) {
      next(error);
    }
  }
}