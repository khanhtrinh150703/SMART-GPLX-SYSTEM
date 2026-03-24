import { ITokenManager } from '@/domain/interfaces/token-manager.interface'
import { ITokenRepository } from '../../domain/interfaces/token.repository.interface';
import { JwtService } from '@/application/services/jwt.service';
import { TokenPayload } from '@/shared/types/auth.types';

/**
 * Triển khai thực tế việc quản lý Token sử dụng JWT và Redis.
 * Tác dụng: Kết hợp việc sinh chuỗi JWT và lưu trữ vào Redis vào một khối thống nhất.
 */
export class JwtTokenManager implements ITokenManager {
  constructor(private readonly tokenRepo: ITokenRepository) {}

  public async generateAndStoreTokens(payload: TokenPayload): Promise<{ accessToken: string; refreshToken: string }> {
    const accessTokenTTL = parseInt(process.env.REDIS_ACCESS_TOKEN_TTL || '3600', 10);
    const refreshTokenExp = process.env.JWT_REFRESH_EXPIRES_IN || '7d';

    // 1. Sinh chuỗi token
    const accessToken = JwtService.generateToken(payload, accessTokenTTL);
    const refreshToken = JwtService.generateToken(payload, refreshTokenExp);

    // 2. Lưu vào Redis
    await this.tokenRepo.saveAccessToken(payload.userId, accessToken, accessTokenTTL);

    return { accessToken, refreshToken };
  }
}