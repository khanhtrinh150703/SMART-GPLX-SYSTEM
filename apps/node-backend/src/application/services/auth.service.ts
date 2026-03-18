import { ErrorCode } from '../../domain/constants/error-codes';
import { IUserRepository } from '../../domain/interfaces/IUserRepository';
import bcrypt from 'bcrypt';
import { AppError } from '../../shared/errors/app-error';
import { RegisterDTO } from '../dtos/auth.dto'; // Tạo file này trong thư mục dtos

export class AuthService {
  constructor(private userRepo: IUserRepository) {}

  async register(dto: RegisterDTO) {
    // 1. Kiểm tra tồn tại
    const existingUser = await this.userRepo.findByEmail(dto.email);
    if (existingUser) {
      throw new AppError(ErrorCode.USER_ALREADY_EXISTS);
    }

    // 2. Hash mật khẩu
    const hashedPassword = await bcrypt.hash(dto.password, 10);

    // 3. Chuẩn bị dữ liệu để lưu (khớp với Schema Prisma)
    const newUser = await this.userRepo.create({
      username: dto.username,
      email: dto.email,
      passwordHash: hashedPassword, // Khớp với trường 'passwordHash' trong schema
      fullName: dto.fullName,
    });

    return newUser;
  }
}