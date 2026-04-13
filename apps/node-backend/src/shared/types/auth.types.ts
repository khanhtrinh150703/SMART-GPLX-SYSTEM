import { UserRole } from '@/domain/constants/roles.constant';
import { Request } from 'express';

export class TokenPayload {
  public readonly userId!: string;
  public readonly roles!: UserRole[];
  public readonly jti!: string;
  public readonly deviceId!: string;


  /** * Thời điểm phát hành token (Unix Timestamp - giây) */
  public readonly iat!: number;

  /** * Thời điểm hết hạn token (Unix Timestamp - giây) */
  public readonly exp!: number;

  // Index Signature: Cho phép chứa bất kỳ thông tin mở rộng nào (deviceId, sessionId,...)
  [key: string]: unknown;

  constructor(init?: Partial<TokenPayload>) {
    if (init) Object.assign(this, init);
  }

  /**
   * @description Kiểm tra xem token đã hết hạn hay chưa.
   * @returns {boolean} True nếu đã hết hạn.
   */
  public get isExpired(): boolean {
    if (!this.exp) return false;
    return Math.floor(Date.now() / 1000) >= this.exp;
  }

  /**
   * @description Tính toán thời gian còn lại của token (tính bằng giây).
   * @returns {number} Số giây còn lại (trả về 0 nếu đã hết hạn).
   */
  public get secondsRemaining(): number {
    if (!this.exp) return 0;
    const remaining = this.exp - Math.floor(Date.now() / 1000);
    return remaining > 0 ? remaining : 0;
  }

  /**
   * @description Chuyển đổi thời điểm hết hạn sang đối tượng Date để dễ hiển thị.
   */
  public get expiryDate(): Date {
    return new Date(this.exp * 1000);
  }
}

/**
 * Request đã được xác thực, luôn chứa đối tượng TokenPayload linh hoạt.
 */
export interface AuthRequest extends Request {
  user: TokenPayload;
}

export class Tokens {
  public readonly accessToken!: string;
  public readonly refreshToken!: string;

  constructor(init?: Partial<Tokens>) {
    if (init) Object.assign(this, init);
  }
}
