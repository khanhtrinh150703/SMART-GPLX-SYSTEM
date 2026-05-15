import { Status } from "@/shared/config/status.config";
import { BaseQueryDTO } from "@/shared/types/common-query.dto.types";

/**
 * @description DTO dùng để lọc và phân trang danh sách đề thi (Exam).
 * Đảm bảo đồng bộ hóa tuyệt đối với ExamQueryParams từ Frontend và Schema Database.
 * (DTO for filtering and paginating the Exam list, synchronized with Frontend and DB Schema.)
 */
export class ExamQueryDTO extends BaseQueryDTO {
  // --- 1. CÁC TRƯỜNG LỌC CHUỖI (Strings) ---
  public name?: string;
  public fullName?: string; // Khớp với item.userName ở FE table
  public licenseCategoryName?: string;
  public examMatrixId?: string;
  public startedAt?: string;

  // --- 2. CÁC TRƯỜNG SỐ (Integers) ---
  public totalQuestions?: number;
  public durationMinutes?: number;
  public passingScore?: number;
  public minCriticalQuestions?: number;

  // --- 3. CÁC TRƯỜNG LOGIC (Boolean) ---
  public isPassed?: boolean;

  constructor(data: Partial<ExamQueryDTO>) {
    super();

    // Gán dữ liệu thô vào instance
    Object.assign(this, data);

    // --- 1. ÉP KIỂU PHÂN TRANG (Inherited from BaseQueryDTO) ---
    if (this.page) this.page = Number(this.page);
    if (this.limit) this.limit = Number(this.limit);

    // --- 2. ÉP KIỂU DỮ LIỆU SỐ (Numeric Casting) ---
    if (this.totalQuestions) this.totalQuestions = Number(this.totalQuestions);
    if (this.durationMinutes) this.durationMinutes = Number(this.durationMinutes);
    if (this.passingScore) this.passingScore = Number(this.passingScore);
    if (this.minCriticalQuestions) this.minCriticalQuestions = Number(this.minCriticalQuestions);

    // --- 3. XỬ LÝ BOOLEAN (Boolean Casting) ---
    if (this.isPassed !== undefined) {
      // Chuyển đổi "true"/"false" từ URL string sang boolean thực tế
      this.isPassed = String(this.isPassed).toLowerCase() === 'true';
    }

    // --- 4. CHUẨN HÓA DỮ LIỆU CHUỖI (Normalization) ---
    this.name = this.name?.trim();
    this.fullName = this.fullName?.trim();
    this.licenseCategoryName = this.licenseCategoryName?.trim();
    this.examMatrixId = this.examMatrixId?.trim();
    this.status = this.status?.trim() as Status;
    this.startedAt = this.startedAt?.trim();

  }
}