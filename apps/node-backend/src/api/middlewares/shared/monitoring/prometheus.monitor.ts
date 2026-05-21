import { Request, Response, NextFunction, Express } from 'express';
import { IApiMonitorRegistry } from '@/domain/interfaces/monitoring';

/**
 * @description Factory Function tạo Middleware Express để tự động ghi nhận và đo lường các HTTP request.
 * @param {IApiMonitorRegistry} monitorRegistry - Đối tượng quản lý và đăng ký metrics được tiêm qua Awilix.
 * @returns {(req: Request, res: Response, next: NextFunction) => void} Middleware function của Express.
 */
export const prometheusMiddleware = (monitorRegistry: IApiMonitorRegistry) => {
  return (req: Request, res: Response, next: NextFunction): void => {
    // Diệt tận gốc log tự cào của Prometheus, không lưu số liệu lặp lại
    if (req.path === "/metrics" || req.baseUrl === "/metrics") {
      return next();
    }

    const start = process.hrtime(); // Bắt đầu bấm giờ hệ thống

    res.on("finish", () => {
      const routePath = req.route ? req.route.path : req.path;
      const statusStr = res.statusCode.toString();

      // Tính toán số mili-giây xử lý thực tế của request
      const diff = process.hrtime(start);
      const durationInMs = parseFloat((diff[0] * 1e3 + diff[1] * 1e-6).toFixed(2));

      // Ghi nhận đồng thời vào hệ thống Prometheus
      monitorRegistry.incRequest(req.method, routePath, statusStr);
      monitorRegistry.observeDuration(req.method, routePath, statusStr, durationInMs);
    });

    next();
  };
};

/**
 * @description Factory Function cấu hình và đăng ký route endpoint `/metrics` phục vụ cho Prometheus Server thu thập dữ liệu (scraping).
 * @param {IApiMonitorRegistry} monitorRegistry - Đối tượng quản lý và đăng ký metrics được tiêm qua Awilix.
 * @returns {(router: Router) => void} Hàm cấu hình route chấp nhận một đối tượng Express Router.
 */
export const apiMetricsRoute = (monitorRegistry: IApiMonitorRegistry) => {
  return (app: Express): void => {
    app.get("/metrics", async (_req: Request, res: Response) => {
      res.setHeader("Content-Type", monitorRegistry.getMetricsContentType());
      const rawData = await monitorRegistry.getMetricsRawData();
      res.end(rawData); // Kết thúc luồng, giải phóng request dính treo log
    });
  };
};