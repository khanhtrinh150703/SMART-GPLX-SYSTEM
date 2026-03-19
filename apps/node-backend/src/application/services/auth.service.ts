import { IUserRepository } from '../../domain/interfaces/IUserRepository';
import bcrypt from 'bcrypt';
import { RegisterDTO } from '../dtos/auth.dto';
import { ErrorCode, AppError } from '@/shared/errors';

export class AuthService {
  constructor(private userRepo: IUserRepository) {}

  async register(dto: RegisterDTO) {

    // --- 1. VALIDATION LAYER (Kiểm tra dữ liệu đầu vào) ---
    
    // Kiểm tra định dạng Email
    if (!dto.isEmail()) {
      throw new AppError(ErrorCode.VALIDATION.INVALID_EMAIL);
    }

    // Kiểm tra độ phức tạp mật khẩu (dùng phương thức riêng trong DTO)
    // Giả sử logic là: độ dài < 8 hoặc không khớp regex
    if (!dto.isPassword()) {
      throw new AppError(ErrorCode.VALIDATION.INVALID_PASSWORD);
    }

    // (Tùy chọn) Kiểm tra mật khẩu và xác nhận mật khẩu có khớp không
    if (!dto.isPasswordMapping()) {
      // Bạn có thể thêm mã lỗi VAL_006: PASSWORD_MISMATCH vào error-codes nếu cần
      throw new AppError(ErrorCode.VALIDATION.INVALID_MAPPING_PASSWORD); 
    }

    // --- 2. BUSINESS LOGIC LAYER (Xử lý nghiệp vụ) ---

    // Kiểm tra email đã tồn tại trong hệ thống chưa
    const existingUser = await this.userRepo.findByEmail(dto.email);
    if (existingUser) {
      throw new AppError(ErrorCode.USER.ALREADY_EXISTS);
    }

    // Hash mật khẩu
    const hashedPassword = await bcrypt.hash(dto.password, 10);

    // Lưu vào Database qua Repository
    const newUser = await this.userRepo.create({
      username: dto.username,
      email: dto.email,
      passwordHash: hashedPassword,
      fullName: dto.fullName,
    });

    return newUser;
  }
}