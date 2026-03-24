/**
 * Giao diện quản lý dữ liệu người dùng chờ xác thực.
 */
export interface IPendingUserRepository {
  savePendingData(key: string, data: string, ttlSeconds: number): Promise<void>;
  getPendingData(key: string): Promise<string | null>;
  deletePendingData(key: string): Promise<void>;
}