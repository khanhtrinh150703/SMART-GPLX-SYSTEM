import { ILogger } from "@/domain/interfaces/monitoring/i-logger";
import { loki } from "@/shared/config/loki.config";
import winston from "winston";
import LokiTransport from "winston-loki";

const winstonInstance = winston.createLogger({
  level: "info",
  format: winston.format.json(),
  transports: [
    new winston.transports.Console({
      format: winston.format.combine(
        winston.format.colorize(),
        winston.format.simple(),
      ),
    }),
    new LokiTransport({
      host: loki.host,
      labels: { app: "smart-gplx-system" },
      json: true,
      batching: false,
      replaceTimestamp: true,
      onConnectionError: (err) => console.error("❌ LỖI LOKI:", err),
    }),
  ],
});

/**
 * @class WinstonLogger
 * @description Lớp bọc (Wrapper) triển khai giao diện ILogger, sử dụng Winston và Grafana Loki làm công cụ ghi nhật ký.
 */
export class WinstonLogger implements ILogger {
  /**
   * @description Ghi nhận nhật ký thông tin thông thường (Information).
   * @param {string} message - Thông điệp log chính.
   * @param {Record<string, unknown>} [meta] - Dữ liệu bổ sung đi kèm (không bắt buộc).
   */
  public info(message: string, meta?: Record<string, unknown>): void {
    winstonInstance.info(message, meta);
  }

  /**
   * @description Ghi nhận nhật ký cảnh báo về các sự cố hệ thống có thể xảy ra (Warning).
   * @param {string} message - Thông điệp cảnh báo.
   * @param {Record<string, unknown>} [meta] - Dữ liệu bối cảnh đi kèm lỗi (không bắt buộc).
   */
  public warn(message: string, meta?: Record<string, unknown>): void {
    winstonInstance.warn(message, meta);
  }

  /**
   * @description Ghi nhận nhật ký lỗi nghiêm trọng trong hệ thống (Error).
   * @param {string} message - Thông điệp mô tả lỗi.
   * @param {Record<string, unknown>} [meta] - Chi tiết vết lỗi hoặc dữ liệu liên quan (không bắt buộc).
   */
  public error(message: string, meta?: Record<string, unknown>): void {
    winstonInstance.error(message, meta);
  }
}