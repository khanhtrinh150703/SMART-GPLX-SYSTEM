import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import { env } from 'node:process';
import { LoginInputDTO } from '../dtos/request/loginInput.dto';
import { LoginResponseDTO } from '../dtos/respone/auth.dto';
import { ErrorCode, AppError } from '@/shared/errors';
import { UserService } from './user.service';
import { UserMapper } from '@/infrastructure/database/mappers/user.mapper';
import { JWT_CONSTANTS } from '@/domain/constants/time.constants';
import { TokenPayload } from '@/shared/types/auth.types';
import { ITokenRepository } from '@/domain/interfaces/repositories/i-token.repository';

/**
 * Service xử lý nghiệp vụ xác thực người dùng.
 */
export class AuthService {
  constructor(
    private readonly userService: UserService, // Dùng Service thay vì Repo
    private readonly tokenRepo: ITokenRepository
  ) { }

  /**
     * Tác dụng: Xử lý đăng nhập, kiểm tra mật khẩu và cấp phát bộ đôi Token.
     * @param {LoginInputDTO} dto - Dữ liệu đăng nhập.
     * @returns {Promise<LoginResponseDTO>}
     */
  public async login(dto: LoginInputDTO): Promise<LoginResponseDTO> {
    // 1. Kiểm tra DTO (Đảm bảo không rỗng)
    if (!dto.isValid()) {
      throw new AppError(ErrorCode.AUTH.INVALID_CREDENTIALS);
    }

    // 2. Tìm User trong DB thông qua UserService
    // Giả sử getUserByUsername trả về Entity User
    const user = await this.userService.getUserByUsername(dto.username);

    // 3. So sánh mật khẩu (Bcrypt)
    const isPasswordMatch = await bcrypt.compare(dto.password, user.passwordHash ?? '');
    if (!isPasswordMatch) {
      throw new AppError(ErrorCode.AUTH.INVALID_CREDENTIALS);
    }

    // 4. Sinh bộ đôi Token
    const accessToken = this.generateAccessToken(user.id, 'USER'); // Tạm thời để Role USER
    const refreshToken = this.generateRefreshToken(user.id, 'USER');

    // 5. Lưu Refresh Token vào Redis để quản lý phiên đăng nhập
    await this.tokenRepo.saveToken(user.id, refreshToken, JWT_CONSTANTS.REFRESH_TOKEN_TTL);

    // 6. Trả về dữ liệu thông qua Mapper (Zero Any)
    return UserMapper.toLoginResponse(user, accessToken, refreshToken);
  }


  // 1. Dùng kiểu dữ liệu chính xác từ thư viện jsonwebtoken
  private signToken(
    payload: TokenPayload,
    secret: jwt.Secret,
    expiresIn: jwt.SignOptions['expiresIn']
  ): string {
    // Ép kiểu qua unknown rồi sang object để thỏa mãn hàm .sign() mà không dùng any
    return jwt.sign(payload as unknown as object, secret, { expiresIn });
  }

  // 2. Hàm sinh Access Token
  private generateAccessToken(userId: string, role: string): string {
    return this.signToken(
      { userId, role },
      env.JWT_SECRET as jwt.Secret,
      JWT_CONSTANTS.ACCESS_TOKEN_EXPIRE
    );
  }

  // 3. Hàm sinh Refresh Token
  private generateRefreshToken(userId: string, role: string): string {
    return this.signToken(
      { userId, role },
      env.JWT_REFRESH_SECRET as jwt.Secret,
      JWT_CONSTANTS.REFRESH_TOKEN_EXPIRE
    );
  }
}