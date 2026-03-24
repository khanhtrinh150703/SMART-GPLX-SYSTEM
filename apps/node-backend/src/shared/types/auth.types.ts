/**
 * Interface định nghĩa dữ liệu (payload) được mã hóa bên trong JWT.
 */
export interface TokenPayload {
  userId: string;
  role: string;
}