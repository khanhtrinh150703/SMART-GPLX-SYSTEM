/**
 * @description Lỗi đặc thù cho việc validate dữ liệu theo từng dòng (Excel/Import).
 * Hỗ trợ bóc tách chi tiết lỗi đến từng cột để cung cấp báo cáo chính xác cho người dùng.
 */
export class RowValidationError extends Error {
  public readonly details: string[];
  public readonly column: string;

  /**
   * @param message - Thông báo lỗi tổng quát của dòng (vd: "Dữ liệu không hợp lệ").
   * @param details - Danh sách các vi phạm cụ thể (vd: ["Nội dung quá ngắn", "Thiếu ảnh"]).
   * @param column - Tên cột hoặc trường dữ liệu gặp lỗi (vd: "Nội dung", "Ảnh câu hỏi").
   */
  constructor(
    message: string, 
    details: string[] = [], 
    column: string = 'General'
  ) {
    super(message);
    this.name = 'RowValidationError';
    this.details = details;
    this.column = column;

    // Đảm bảo prototype được thiết lập chính xác khi extend Error trong TS
    Object.setPrototypeOf(this, RowValidationError.prototype);
  }

  /**
   * @description Hợp nhất thông tin cột, thông báo chính và các chi tiết thành một chuỗi văn bản duy nhất.
   * Định dạng: [Cột] Thông báo: Chi tiết 1, Chi tiết 2
   */
  public getCombinedMessage(): string {
    const detailText = this.details.length > 0 ? `: ${this.details.join(', ')}` : '';
    return `[${this.column}] ${this.message}${detailText}`;
  }
}