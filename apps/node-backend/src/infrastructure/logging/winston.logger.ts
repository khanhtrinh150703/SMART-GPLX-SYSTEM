import { ILogger } from "@/domain/interfaces/logging/i-logger.interface";
import winston from "winston";
import LokiTransport from "winston-loki";

// Giữ nguyên cấu hình cũ của Trinh
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
      host: "http://127.0.0.1:3100",
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
 * @description Lớp bọc (Wrapper) để triển khai giao diện ILogger, sẵn sàng tiêm qua Awilix.
 */
export class WinstonLogger implements ILogger {
  public info(message: string, meta?: Record<string, unknown>): void {
    winstonInstance.info(message, meta);
  }

  public warn(message: string, meta?: Record<string, unknown>): void {
    winstonInstance.warn(message, meta);
  }

  public error(message: string, meta?: Record<string, unknown>): void {
    winstonInstance.error(message, meta);
  }
}
