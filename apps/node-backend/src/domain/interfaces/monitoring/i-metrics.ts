/**
 * @interface IApiMonitorRegistry
 * @description Giao diện chuẩn quản lý các bộ đếm và đo lường hiệu suất hệ thống (Metrics).
 */
export interface IApiMonitorRegistry {
  /**
   * @description Tăng bộ đếm số lượng HTTP request.
   * @param {string} method - Phương thức HTTP (GET, POST, ...).
   * @param {string} route - Đường dẫn API.
   * @param {string} status - Mã trạng thái HTTP trả về (200, 400, 500, ...).
   */
  incRequest(method: string, route: string, status: string): void;

  /**
   * @description Ghi nhận thời gian phản hồi (Latency) của HTTP request vào Histogram.
   * @param {string} method - Phương thức HTTP (GET, POST, ...).
   * @param {string} route - Đường dẫn API.
   * @param {string} status - Mã trạng thái HTTP trả về.
   * @param {number} durationInMs - Thời gian xử lý tính bằng mili-giây.
   */
  observeDuration(method: string, route: string, status: string, durationInMs: number): void;

  /**
   * @description Lấy kiểu nội dung (Content-Type) định dạng chuẩn của Prometheus.
   * @returns {string} Chuỗi định dạng Content-Type.
   */
  getMetricsContentType(): string;

  /**
   * @description Lấy dữ liệu metrics thô (raw) đã thu thập để hệ thống Prometheus pull về.
   * @returns {Promise<string>} Chuỗi dữ liệu metrics định dạng văn bản thô.
   */
  getMetricsRawData(): Promise<string>;
}