import { Request } from 'express';

export class TokenPayload {
  public readonly userId!: string;
  public readonly role!: string;

  // Index Signature: Cho phép chứa bất kỳ thông tin mở rộng nào (deviceId, sessionId,...)
  [key: string]: unknown;

  constructor(init?: Partial<TokenPayload>) {
    if (init) Object.assign(this, init);
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