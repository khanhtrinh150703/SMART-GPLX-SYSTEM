import bcrypt from 'bcrypt';
import { LoginInputDTO } from '../dtos/request/loginInput.dto';
import { LoginResponseDTO } from '../dtos/response/auth.dto';
import { ErrorCode, AppError } from '@/shared/errors';
import { UserService } from './user.service';
import { UserMapper } from '@/infrastructure/database/mappers/user.mapper';
import { JWT_CONSTANTS } from '@/domain/constants/time.constants';
import { ITokenRepository } from '@/domain/interfaces/repositories/i-token.repository';
import { JwtUtil } from '@/shared/utils/jwt.util';
import { TokenPayload } from '@/shared/types/auth.types';

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
    const user = await this.userService.getUserByIdentifier(dto.username);

    // 3. So sánh mật khẩu (Bcrypt)
    const isPasswordMatch = await bcrypt.compare(dto.password, user.passwordHash ?? '');
    if (!isPasswordMatch) {
      throw new AppError(ErrorCode.AUTH.INVALID_CREDENTIALS);
    }

    const payload1 = new TokenPayload({ userId: user.id, role: 'USER' });
    // 4. Sinh bộ đôi Token
    // Sử dụng JwtUtil đã fix
    const accessToken = JwtUtil.signAccessToken(
      payload1,
      JWT_CONSTANTS.ACCESS_TOKEN_EXPIRE
    );
    // Tạm thời để Role USER
    const refreshToken = JwtUtil.signRefreshToken(
      payload1,
      JWT_CONSTANTS.REFRESH_TOKEN_EXPIRE
    );

    // 5. Lưu Refresh Token vào Redis để quản lý phiên đăng nhập
    await this.tokenRepo.saveToken(user.id, refreshToken, JWT_CONSTANTS.REFRESH_TOKEN_TTL);

    // 6. Trả về dữ liệu thông qua Mapper (Zero Any)
    return UserMapper.toLoginResponse(user, accessToken, refreshToken);
  }

  
  /**
   * Đăng xuất người dùng.
   * @param {TokenPayload} payload - Toàn bộ thông tin từ Token.
   */
  public async logout(payload: TokenPayload): Promise<void> {
    // 1. Lấy userId (Bắt buộc)
    const userId = payload.userId;

    // 2. Lấy thêm các thông tin linh hoạt (nếu có) để xóa chính xác session đó
    // Ví dụ: const sessionId = payload.sessionId as string;

    // Xóa Refresh Token trong Redis
    await this.tokenRepo.deleteToken(userId);
  }
}