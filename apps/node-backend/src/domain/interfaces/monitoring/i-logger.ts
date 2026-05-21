/**
 * @description Hợp đồng giao tiếp định nghĩa các phương thức cho hệ thống ghi nhật ký (Logging).
 */
export interface ILogger {
  /**
   * @description Ghi nhận nhật ký thông tin thông thường (Information).
   * @param {string} message - Thông điệp log chính.
   * @param {Record<string, unknown>} [meta] - Dữ liệu bổ sung đi kèm (không bắt buộc).
   */
  info(message: string, meta?: Record<string, unknown>): void;

  /**
   * @description Ghi nhận nhật ký cảnh báo về các sự cố có thể xảy ra (Warning).
   * @param {string} message - Thông điệp cảnh báo.
   * @param {Record<string, unknown>} [meta] - Dữ liệu bối cảnh đi kèm lỗi (không bắt buộc).
   */
  warn(message: string, meta?: Record<string, unknown>): void;

  /**
   * @description Ghi nhận nhật ký lỗi nghiêm trọng trong hệ thống (Error).
   * @param {string} message - Thông điệp mô tả lỗi.
   * @param {Record<string, unknown>} [meta] - Chi tiết vết lỗi hoặc dữ liệu liên quan (không bắt buộc).
   */
  error(message: string, meta?: Record<string, unknown>): void;
}