import { ITokenManager } from "@/domain/interfaces/services/external/commands/i-token-manager.service";
import { ITokenRepository } from "@/domain/interfaces/repositories/identity/i-token.repository";
import { jwtUtil } from "@/shared/utils/jwt.util";
import { User } from "@/domain/entities/user/user.entity";
import { randomUUID } from "node:crypto";
import { UserRole } from "@/domain/constants/roles.constant";
import { ICradle } from "@/shared/types/container.types";
import { AUTH_CONFIG } from "@/shared/config/auth.config";
import { REDIS_KEYS } from "@/shared/config/redis.config";
import {
  ITokenPayload,
  ITokens,
  TokenPayload,
} from "@/application/dtos/response/auth/token/token-payload.respone.dto";

/**
 * Lớp quản lý vòng đời của Token (Tạo và Thu hồi).
 * Phối hợp giữa logic ký JWT (Utility) và lưu trữ (Repository).
 */
export class JwtTokenManager implements ITokenManager {
  // 1. Khai báo thuộc tính riêng tư của class
  private readonly _tokenRepo: ITokenRepository;

  /**
   * Tiêm phụ thuộc qua constructor (Dependency Injection) bằng Cradle.
   * @param {ICradle} cradle - Object chứa các dependencies từ Container.
   */
  constructor({ tokenRepository }: ICradle) {
    // 2. Gán dependency từ object 'cradle' vào thuộc tính class
    // LƯU Ý: Tên 'tokenRepository' phải khớp 100% với Key trong container.ts
    this._tokenRepo = tokenRepository;
  }

  /**
   * @description Tác dụng: Tạo cặp Access/Refresh Token và lưu vào Redis.
   * @param {User} user - Thông tin người dùng cần mã hóa.
   * @returns {Promise< ITokens = { accessToken: string; refreshToken: string }>}
   */
  public async generateAndStoreTokens(user: User): Promise<ITokens> {
    const { access, refresh } = AUTH_CONFIG.jwt;
    // 1. Trích xuất tên các Role
    const userRoles = user.roles.map((r) => r.name as UserRole);
    const finalRoles = userRoles.length > 0 ? userRoles : [UserRole.STUDENT];

    // 2. 🚀 TRÍCH XUẤT PERMISSIONS (Phép màu ở đây)
    // Gộp tất cả permissions của tất cả roles lại thành 1 mảng string phẳng
    const allPermissions = user.roles.flatMap((role) =>
      role.permissions.map((p) => p.name),
    );

    // Loại bỏ quyền trùng lặp (Ví cả Admin và Instructor đều có quyền 'questions:read')
    const uniquePermissions = [...new Set(allPermissions)];

    const jti = randomUUID();
    // 2. Chuẩn bị Payload sạch sẽ
    const payload = new TokenPayload({
      userId: user.id,
      roles: finalRoles,
      permissions: uniquePermissions,
      jti: jti,
    });

    // 1. Ký Token
    const accessToken = jwtUtil.signAccessToken(payload, access.expiresIn);
    const refreshToken = jwtUtil.signRefreshToken(payload, refresh.expiresIn);

    // 2. Định nghĩa 2 loại Key
    const deviceId = payload.deviceId || "default";
    const accessKey = REDIS_KEYS.AUTH.getAccessTokenKey(
      payload.userId,
      deviceId,
      payload.jti,
    );

    const refreshKey = REDIS_KEYS.AUTH.getRefreshTokenKey(
      payload.userId,
      deviceId,
      payload.jti,
    );

    // 3. Lưu vào Redis với TTL tương ứng
    // Access Token: 15 phút (900s)
    // Refresh Token: 7 ngày hoặc 30 ngày (Ví dụ: 604800s)
    await Promise.all([
      this._tokenRepo.save(accessKey, "valid", access.ttlSeconds),
      this._tokenRepo.save(refreshKey, "valid", refresh.ttlSeconds),
    ]);

    return {
      accessToken,
      refreshToken,
    };
  }

  /**
   * @description Tác dụng: Thu hồi TOÀN BỘ Token (Access & Refresh) của một người dùng trên MỌI thiết bị.
   * @param {string} userId - ID của người dùng.
   * @returns {Promise<void>}
   */
  public async revokeTokenByPattern(userId: string): Promise<void> {
    const pattern = REDIS_KEYS.AUTH.getRevokeAllPattern(userId);
    // Xóa tất cả các key khớp với pattern để "đăng xuất từ xa" toàn bộ
    await this._tokenRepo.deleteByPattern(pattern);
  }

  /**
   * @description Tác dụng: Thu hồi cặp Token hiện tại dựa trên Payload (thường dùng cho Logout).
   * @param {ITokenPayload} payload - Chứa userId, jti, deviceId.
   * @returns {Promise<void>}
   */
  public async revokeTokenByPayLoad(payload: ITokenPayload): Promise<void> {
    const deviceId = payload.deviceId || "default";

    // Dựng lại chính xác 2 Key đã lưu lúc generate
    const accessKey = REDIS_KEYS.AUTH.getAccessTokenKey(
      payload.userId,
      deviceId,
      payload.jti,
    );

    const refreshKey = REDIS_KEYS.AUTH.getRefreshTokenKey(
      payload.userId,
      deviceId,
      payload.jti,
    );

    // Gọi Repo xóa cả 2 cùng lúc
    await Promise.all([
      this._tokenRepo.delete(accessKey),
      this._tokenRepo.delete(refreshKey),
    ]);
  }

  /**
   * @description Tác dụng: Kiểm tra trạng thái tồn tại của Token Key trong Redis.
   */
  public async exists(key: string): Promise<boolean> {
    // Gọi Repo để check lệnh EXISTS của Redis
    return await this._tokenRepo.exists(key);
  }
}
