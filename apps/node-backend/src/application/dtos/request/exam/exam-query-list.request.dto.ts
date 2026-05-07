/**
 * @description Các tiêu chí tìm kiếm và lọc bổ sung khi tìm bài thi.
 * English: Additional search and filter criteria for finding exams.
 */
export interface IExamUserFilterOptions {
  readonly search?: string;            // Tìm kiếm đơn giản theo tên bài thi
  readonly licenseCode?: string;        // Lọc theo hạng bằng lái
}

/**
 * @description DTO bóc tách tham số truy vấn từ phía người dùng (User/Học viên).
 * Chuyển đổi và làm sạch dữ liệu từ URL Query trước khi đưa vào hệ thống.
 */
export class ExamUserQueryDTO implements IExamUserFilterOptions {
  public readonly search?: string;
  public readonly licenseCode?: string;
  public readonly page?: number;
  public readonly limit?: number;

  /**
   * @param data - Dữ liệu thô từ req.query.
   */
  constructor(data: Record<string, unknown>) {
    // 1. Làm sạch chuỗi tìm kiếm (Tránh các ký tự rác hoặc khoảng trắng)
    this.search = data.search ? String(data.search).trim() : undefined;

    // 2. Định dạng mã hạng bằng lái (A1, B2...)
    this.licenseCode = data.licenseCode ? String(data.licenseCode) : undefined;

    // 3. Ép kiểu an toàn cho phân trang (Mặc định trả về undefined nếu không phải số)
    // English: Safe type casting for pagination (Returns undefined if not a valid number).
    this.page = this._parseNumber(data.page);
    this.limit = this._parseNumber(data.limit);
  }

  /**
   * @description Hàm hỗ trợ ép kiểu số an toàn.
   */
  private _parseNumber(value: unknown): number | undefined {
    const parsed = Number(value);
    return !isNaN(parsed) && parsed > 0 ? parsed : undefined;
  }
}