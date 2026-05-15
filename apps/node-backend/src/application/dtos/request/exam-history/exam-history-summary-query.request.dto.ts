import {
  BaseQueryDTO,
  IBaseQueryDTO,
} from "@/shared/types/common-query.dto.types";

/**
 * @interface IExamHistorySummaryQueryDTO
 * @description Giao diện chứa các tham số truy vấn tóm tắt lịch sử thi.
 */
export interface IExamHistorySummaryQueryDTO extends IBaseQueryDTO {
  // Bộ lọc tìm kiếm & Trạng thái (Search & Status Filters)
  userId?: string;
  licenseCategoryId?: string;
  isPassed?: boolean;

  // Lọc theo thời gian (Date Range Filters)
  fromDate?: Date;
  toDate?: Date;

  // --- CÁC TRƯỜNG BỔ SUNG MỚI ---
  licenseCategoryName?: string;
  score?: number;
  title?: string;
  durationTime?: number;
}

/**
 * @class ExamHistorySummaryQueryDTO
 * @extends BaseQueryDTO
 * @description DTO xử lý và làm sạch dữ liệu truy vấn tóm tắt lịch sử thi từ URL.
 * @principle Filter Integrity - Đảm bảo các tham số lọc dữ liệu luôn đúng định dạng và an toàn.
 */
export class ExamHistorySummaryQueryDTO
  extends BaseQueryDTO
  implements IExamHistorySummaryQueryDTO
{
  public readonly userId?: string;
  public readonly licenseCategoryId?: string;
  public readonly isPassed?: boolean;
  public readonly fromDate?: Date;
  public readonly toDate?: Date;

  // Trường mới (New fields)
  public readonly licenseCategoryName?: string;
  public readonly score?: number;
  public readonly title?: string;
  public readonly durationTime?: number;

  /**
   * @description Khởi tạo và chuẩn hóa dữ liệu từ req.query.
   * @param data - Dữ liệu thô từ URL (Partial Record).
   */
  constructor(
    data: Partial<
      Record<
        keyof IExamHistorySummaryQueryDTO | "startDate" | "endDate",
        unknown
      >
    >,
  ) {
    super();

    // 1. Ép kiểu và gán các thuộc tính phân trang từ BaseQueryDTO
    this.page = data.page ? Number(data.page) : 1;
    this.limit = data.limit ? Number(data.limit) : 10;

    // 2. Làm sạch chuỗi (Strings)
    this.search = this.sanitizeString(data.search);
    this.userId = this.sanitizeString(data.userId);
    this.title = this.sanitizeString(data.title);

    // Chuẩn hóa mã/tên hạng bằng lái (Viết hoa)
    this.licenseCategoryId = this.sanitizeString(
      data.licenseCategoryId,
    )?.toUpperCase();
    this.licenseCategoryName = this.sanitizeString(
      data.licenseCategoryName,
    )?.toUpperCase();

    // 3. Xử lý logic Boolean
    this.status = typeof data.status === "string" ? data.status : undefined;

    // 4. Xử lý số (Numbers) cho score và durationTime
    this.score = this.parseNumber(data.score);
    this.durationTime = this.parseNumber(data.durationTime);

    // 5. Xử lý Date an toàn (Mapping startDate -> fromDate, endDate -> toDate)
    this.fromDate = this.parseDate(data.fromDate ?? data.startDate);
    this.toDate = this.parseDate(data.toDate ?? data.endDate);
  }

  /**
   * @description Làm sạch chuỗi và loại bỏ khoảng trắng.
   */
  private sanitizeString(value: unknown): string | undefined {
    return typeof value === "string" ? value.trim() : undefined;
  }

  /**
   * @description Chuyển đổi giá trị sang kiểu số an toàn.
   */
  private parseNumber(value: unknown): number | undefined {
    if (value === null || value === undefined || value === "") return undefined;
    const parsed = Number(value);
    return isNaN(parsed) ? undefined : parsed;
  }

  /**
   * @description Hàm hỗ trợ nội bộ để phân giải ngày tháng an toàn.
   */
  private parseDate(value: unknown): Date | undefined {
    if (!value) return undefined;

    const dateValue =
      typeof value === "string" || typeof value === "number"
        ? new Date(value)
        : null;

    if (dateValue && !isNaN(dateValue.getTime())) {
      return dateValue;
    }

    return undefined;
  }
}
