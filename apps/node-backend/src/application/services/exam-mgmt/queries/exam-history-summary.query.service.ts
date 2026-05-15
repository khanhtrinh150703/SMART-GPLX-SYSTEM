import { ExamHistorySummaryQueryDTO } from "@/application/dtos/request/exam-history/exam-history-summary-query.request.dto";
import { ExamHistorySummaryResponseDTO } from "@/application/dtos/response/exam-history/exam-history-summary.response.dto";
import { IExamHistorySummaryRepository } from "@/domain/interfaces/repositories";
import { IExamHistorySummaryQueryService } from "@/domain/interfaces/services";
import { ExamHistorySummaryMapper } from "@/infrastructure/database/mappers";
import { PAGINATION_CONFIG } from "@/shared/config/pagination.config";
import { AppError, ErrorCode } from "@/shared/errors";
import { PaginatedResult } from "@/shared/types/pagination.types";
import { PaginationUtil } from "@/shared/utils/pagination.util";

/**
 * @interface IExamHistorySummaryQueryServiceCradle
 * @description Tập hợp các phụ thuộc (Dependencies) cần thiết để thực hiện nghiệp vụ truy vấn lịch sử thi.
 */
export interface IExamHistorySummaryQueryServiceCradle {
  /** @description Repository chịu trách nhiệm truy xuất dữ liệu lịch sử thi từ Database. */
  historySummaryRepository: IExamHistorySummaryRepository;
}

/**
 * @class ExamHistorySummartQueryService
 * @description Dịch vụ chuyên trách các thao tác đọc (Read-side) liên quan đến lịch sử thi.
 * @principle Read-only Integrity - Đảm bảo dữ liệu truy vấn chính xác và không làm thay đổi trạng thái hệ thống.
 */
export class ExamHistorySummartQueryService implements IExamHistorySummaryQueryService {
  /** @private @readonly @description Instance thực hiện các thao tác tìm kiếm và đếm dữ liệu lịch sử. */
  private readonly _historySummaryRepo: IExamHistorySummaryRepository;

  /**
   * @constructor
   * @description Khởi tạo dịch vụ truy vấn lịch sử thi với các phụ thuộc được đóng gói.
   * @param {IExamHistorySummaryQueryServiceCradle} cradle - Chứa các công cụ phục vụ luồng truy vấn dữ liệu.
   */
  constructor({ historySummaryRepository }: IExamHistorySummaryQueryServiceCradle) {
    this._historySummaryRepo = historySummaryRepository;
  }

  /**
   * @description Lấy danh sách lịch sử thi đã qua bộ lọc (tìm kiếm/trạng thái) và ánh xạ sang DTO sạch kèm phân trang.
   * @param {ExamHistorySummaryQueryDTO} query - DTO chứa tiêu chí lọc, sắp xếp và thông số phân trang từ Request.
   * @returns {Promise<PaginatedResult<ExamHistorySummaryResponseDTO>>} Trả về kết quả phân trang chứa danh sách DTO để bảo mật dữ liệu thực thể.
   */
  public async getHistorySummaryList(
    query: ExamHistorySummaryQueryDTO,
  ): Promise<PaginatedResult<ExamHistorySummaryResponseDTO>> {
    // 1. Chuẩn hóa thông số phân trang
    const page = Number(query.page) || PAGINATION_CONFIG.DEFAULT_PAGE;
    const limit = Math.min(
      Number(query.limit) || PAGINATION_CONFIG.DEFAULT_LIMIT,
      PAGINATION_CONFIG.MAX_LIMIT,
    );

    // 2. Tính toán skip cho Repository (Sử dụng Util để tập trung logic)
    const skip = PaginationUtil.getSkip(page, limit);

    // 3. Truy vấn dữ liệu từ DB thông qua Repository
    const [entities, total] = await this._historySummaryRepo.findAndCount(
      query,
      skip,
      limit,
    );

    // 4. ÁNH XẠ DỮ LIỆU (Mapping): Chuyển mảng Domain Entity sang mảng Response DTO
    const historyResponses = ExamHistorySummaryMapper.toResponseList(entities);

    // 5. Đóng gói kết quả kèm Metadata phân trang
    return PaginationUtil.createPaginatedResponse(
      historyResponses,
      total,
      page,
      limit,
    );
  }

  /**
   * @description Lấy thông tin chi tiết của một bản ghi lịch sử thi dựa trên ID.
   * @param {string} id - ID của bản ghi lịch sử thi cần truy vấn.
   * @returns {Promise<ExamHistorySummaryResponseDTO>} Trả về DTO chi tiết của bài thi.
   * @throws {AppError} Ném lỗi nếu ID trống hoặc không tìm thấy bản ghi.
   */
  public async getHistorySummaryDetail(id: string): Promise<ExamHistorySummaryResponseDTO> {
    if (!id) {
      throw new AppError(ErrorCode.VALIDATION.ID_REQUIRED);
    }
    // 1. Truy vấn thực thể từ Repository
    const entity = await this._historySummaryRepo.findById(id);

    // 2. Mệnh đề bảo vệ (Guard Clause): Trả lỗi nếu không tìm thấy
    if (!entity) {
      throw new AppError(ErrorCode.EXAM_HISTORY.HISTORY_NOT_FOUND);
    }

    // 3. Ánh xạ sang DTO và trả về
    return ExamHistorySummaryMapper.toResponse(entity);
  }
}
