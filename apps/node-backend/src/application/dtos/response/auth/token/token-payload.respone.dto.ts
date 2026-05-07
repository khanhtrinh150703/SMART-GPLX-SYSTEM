import { UserRole } from '@/domain/constants/roles.constant';

/**
 * @description Giao diện định nghĩa cấu trúc dữ liệu bên trong Token.
 * (Interface defining the data structure inside the Token.)
 */
export interface ITokenPayload {
  readonly userId: string;
  readonly roles: UserRole[];
  readonly jti: string;
  readonly deviceId: string;
  readonly permissions: string[];
  /** @description Thời điểm phát hành token (Unix Timestamp - giây). */
  readonly iat: number;
  /** @description Thời điểm hết hạn token (Unix Timestamp - giây). */
  readonly exp: number;
  /** @description Dấu ký hiệu chỉ mục: Cho phép chứa bất kỳ thông tin mở rộng nào. */
  [key: string]: unknown;
}

/**
 * @description Lớp xử lý dữ liệu Token Payload.
 * (Token Payload processing class.)
 * Cung cấp các phương thức logic để kiểm tra trạng thái và thời hạn của Token.
 */
export class TokenPayload implements ITokenPayload {
  public readonly userId!: string;
  public readonly roles!: UserRole[];
  public readonly jti!: string;
  public readonly deviceId!: string;
  public readonly permissions!: string[];
  public readonly iat!: number;
  public readonly exp!: number;
  [key: string]: unknown;

  constructor(init?: Partial<ITokenPayload>) {
    if (init) {
      Object.assign(this, init);
    }
  }

  /**
   * @description Kiểm tra xem token đã hết hạn hay chưa.
   * (Checks if the token has expired.)
   * @returns {boolean} True nếu thời điểm hiện tại đã vượt quá thời điểm hết hạn.
   */
  public get isExpired(): boolean {
    if (!this.exp) return false;
    return Math.floor(Date.now() / 1000) >= this.exp;
  }

  /**
   * @description Tính toán thời gian còn lại của token (tính bằng giây).
   * (Calculates the remaining time of the token in seconds.)
   * @returns {number} Số giây còn lại (trả về 0 nếu đã hết hạn).
   */
  public get secondsRemaining(): number {
    if (!this.exp) return 0;
    const remaining = this.exp - Math.floor(Date.now() / 1000);
    return remaining > 0 ? remaining : 0;
  }

  /**
   * @description Chuyển đổi thời điểm hết hạn sang đối tượng Date để dễ hiển thị.
   * (Converts expiration timestamp to a Date object for easier display.)
   */
  public get expiryDate(): Date {
    return new Date(this.exp * 1000);
  }
}

/**
 * @description Giao diện định nghĩa cặp mã thông báo bảo mật.
 * (Interface defining the security token pair.)
 */
export interface ITokens {
  readonly accessToken: string;
  readonly refreshToken: string;
}

/**
 * @description Lớp vận chuyển bộ đôi mã thông báo (Access & Refresh Token).
 * (Class transporting the token pair.)
 */
export class Tokens implements ITokens {
  public readonly accessToken!: string;
  public readonly refreshToken!: string;

  constructor(init?: Partial<ITokens>) {
    if (init) {
      Object.assign(this, init);
    }
  }
}