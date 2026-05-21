// --- 1. THIRD-PARTY PACKAGES (Thư viện bên thứ ba) ---
import client from "prom-client";

// --- 2. DOMAIN INTERFACES (Giao diện tầng nghiệp vụ) ---
import { IApiMonitorRegistry } from "@/domain/interfaces/monitoring";

/**
 * @class PrometheusRegistry
 * @implements {IApiMonitorRegistry}
 * @description Lớp triển khai thu thập và quản lý số liệu hiệu năng hệ thống (Metrics).
 * Bọc lớp công cụ `prom-client` nhằm cung cấp các bộ đếm độc lập phục vụ giám sát hạ tầng qua Prometheus.
 */
export class PrometheusRegistry implements IApiMonitorRegistry {
  /** @private @property {client.Registry} _registry Kho lưu trữ tập trung các bộ đo lường (Metrics Registry). */
  private _registry: client.Registry;

  /** @private @property {client.Counter} _httpRequestCounter Bộ đếm cộng dồn tổng số lượng HTTP Requests. */
  private _httpRequestCounter: client.Counter;

  /** @private @property {client.Histogram} _httpRequestDurationHistogram Bộ phân tích phân phối thời gian phản hồi HTTP. */
  private _httpRequestDurationHistogram: client.Histogram;

  constructor() {
    // Sử dụng bộ đăng ký mặc định toàn cục của prom-client
    this._registry = client.register;

    // Tự động thu thập các chỉ số cơ bản của runtime Node.js (CPU, Memory, Event Loop, GC...)
    client.collectDefaultMetrics({ register: this._registry });

    /**
     * @description 1. Khởi tạo bộ đếm tổng số lượng request (Counter).
     * Giá trị chỉ tăng tiến theo thời gian, dùng để tính toán tốc độ Request Per Second (RPS).
     */
    this._httpRequestCounter = new client.Counter({
      name: "http_requests_total",
      help: "Total number of HTTP requests received by the Smart-GPLX Backend",
      labelNames: ["method", "route", "status"],
      registers: [this._registry],
    });

    /**
     * @description 2. Khởi tạo bộ đo thời gian phản hồi (Histogram).
     * Phân tích thời gian xử lý dựa trên các nhóm phân phối (Buckets) để tính Latency và Percentiles (p95, p99).
     */
    this._httpRequestDurationHistogram = new client.Histogram({
      name: "http_request_duration_seconds",
      help: "HTTP request response time in seconds",
      labelNames: ["method", "route", "status"],
      buckets: [
        0.05,
        0.1,
        0.25,
        0.5,
        1,
        2.5,
        5,
        10,
        30, // Các mốc tính bằng giây như cũ
        60, // 1 phút
        120, // 2 phút
        180, // 3 phút
        300, // 5 phút 
      ],
      registers: [this._registry],
    });
  }

  /**
   * @description Tăng bộ đếm tổng số lượng HTTP request (Counter) lên 1 đơn vị.
   * @param {string} method - Phương thức HTTP tác động (e.g., 'GET', 'POST', 'PUT').
   * @param {string} route - Đường dẫn API định tuyến định danh (e.g., '/api/v1/exams/:id').
   * @param {string} status - Mã phản hồi trạng thái HTTP từ phía server (e.g., '200', '401', '500').
   * @returns {void}
   */
  public incRequest(method: string, route: string, status: string): void {
    this._httpRequestCounter.inc({ method, route, status });
  }

  /**
   * @description Ghi nhận và phân phối thời gian xử lý request vào hệ thống Histogram Buckets.
   * @param {string} method - Phương thức HTTP tác động (e.g., 'GET', 'POST').
   * @param {string} route - Đường dẫn API định tuyến định danh (e.g., '/api/v1/auth/login').
   * @param {string} status - Mã phản hồi trạng thái HTTP từ phía server (e.g., '200', '400').
   * @param {number} durationInMs - Khoảng thời gian đo đạc thực tế tính bằng Mili-giây (ms).
   * @returns {void}
   */
  public observeDuration(
    method: string,
    route: string,
    status: string,
    durationInMs: number,
  ): void {
    // Chuẩn hóa đơn vị đo lường từ Mili-giây sang Giây theo đặc tả thiết kế của Prometheus
    const durationInSeconds = durationInMs / 1000;
    this._httpRequestDurationHistogram.observe(
      { method, route, status },
      durationInSeconds,
    );
  }

  /**
   * @description Lấy thông tin định dạng nội dung phản hồi tiêu chuẩn (Content-Type) yêu cầu bởi Prometheus.
   * @returns {string} Chuỗi văn bản định dạng kiểu dữ liệu (Mặc định: 'text/plain; version=0.0.4; charset=utf-8').
   */
  public getMetricsContentType(): string {
    return this._registry.contentType;
  }

  /**
   * @description Trích xuất toàn bộ dữ liệu chỉ số hệ thống dạng văn bản thô (Raw Text) phục vụ chu trình thu thập dữ liệu (Scrape/Pull).
   * @returns {Promise<string>} Chuỗi dữ liệu tổng hợp metrics hợp lệ, sẵn sàng để xuất ra HTTP Endpoint `/metrics`.
   */
  public async getMetricsRawData(): Promise<string> {
    return await this._registry.metrics();
  }
}
