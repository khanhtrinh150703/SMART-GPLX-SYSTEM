import { Request, Response, NextFunction } from 'express';
import { AuthService } from '../../application/services/auth.service';
import { UserRepository } from '../../infrastructure/database/user.repository';
import { Result } from '../../shared/utils/response';
import { RegisterDTO } from '@/application/dtos/auth.dto';
import { UserMapper } from '@/infrastructure/database/mappers/user.mapper';

const userRepo = new UserRepository();
const authService = new AuthService(userRepo);

export class AuthController {
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
}