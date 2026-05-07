/**
 * @description Hợp đồng giao tiếp cho hệ thống ghi nhật ký.
 * Tuân thủ Zero-Any bằng cách dùng Record<string, unknown>.
 */
export interface ILogger {
  info(message: string, meta?: Record<string, unknown>): void;
  warn(message: string, meta?: Record<string, unknown>): void;
  error(message: string, meta?: Record<string, unknown>): void;
}
