import { ExamHistoryQueryDTO } from "@/application/dtos/request/exam-history/exam-history-query.request.dto";
import { IExamAttemptResponseDTO } from "@/application/dtos/response/exam-attempt/exam-attempt.respone.dto";
import { IExamAttemptRepository } from "@/domain/interfaces/repositories";
import { IExamAttemptQueryService } from "@/domain/interfaces/services";
import { ExamAttemptMapper } from "@/infrastructure/database/mappers";
import { PAGINATION_CONFIG } from "@/shared/config/pagination.config";
import { AppError } from "@/shared/errors/error-app";
import { ErrorCode } from "@/shared/errors/error-codes";
import { PaginatedResult } from "@/shared/types/pagination.types";
import { PaginationUtil } from "@/shared/utils/pagination.util";

/**
 * @interface IExamAttemptQueryServiceCradle
 * @description Định nghĩa các phụ thuộc cần thiết cho ExamAttemptQueryService qua Awilix.
 */
export interface IExamAttemptQueryServiceCradle {
  /** @description Repository chuyên trách truy vấn dữ liệu Snapshot lượt thi từ Database. */
  examAttemptRepository: IExamAttemptRepository;
}

/**
 * @class ExamAttemptQueryService
 * @implements {IExamAttemptQueryService}
 * @description Triển khai các xử lý truy vấn (Read-side) cho lượt thi.
 * Tập trung vào việc trích xuất dữ liệu Snapshot bất biến để phục vụ hiển thị.
 */
export class ExamAttemptQueryService implements IExamAttemptQueryService {
  private readonly _attemptRepo: IExamAttemptRepository;

  constructor({ examAttemptRepository }: IExamAttemptQueryServiceCradle) {
    this._attemptRepo = examAttemptRepository;
  }

  /**
   * @description Truy xuất thông tin chi tiết một lượt thi bao gồm snapshot nội dung đề bài và kết quả.
   * @param {string} id - ID định danh duy nhất của lượt thi (Dạng UUID từ NoSQL).
   * @returns {Promise<IExamAttemptResponseDTO>} DTO chứa thông tin snapshot và kết quả bài làm.
   * @throws {AppError} Ném lỗi EXAM_ATTEMPT.NOT_FOUND nếu không tìm thấy dữ liệu trong hệ thống.
   */
  public async getAttemptDetail(id: string): Promise<IExamAttemptResponseDTO> {
    if (!id) {
      throw new AppError(ErrorCode.VALIDATION.ID_REQUIRED);
    }

    const attempt = await this._attemptRepo.findById(id);
    if (!attempt) {
      throw new AppError(ErrorCode.EXAM_ATTEMPT.NOT_FOUND);
    }
    
    return ExamAttemptMapper.toResponseDTO(attempt);
  }

  /**
   * @description Lấy danh sách tóm tắt lịch sử thi đã qua bộ lọc và ánh xạ sang DTO sạch kèm phân trang.
   * @param {ExamHistoryQueryDTO} query - DTO chứa các tiêu chí lọc (userId, isPassed...) và thông số phân trang.
   * @returns {Promise<PaginatedResult<IExamAttemptResponseDTO>>} Kết quả phân trang chứa dữ liệu tóm tắt lịch sử thi.
   */
  public async getPaginatedAttempt(
    query: ExamHistoryQueryDTO,
  ): Promise<PaginatedResult<IExamAttemptResponseDTO>> {
    // 1. CHUẨN HÓA: Đảm bảo thông số phân trang luôn nằm trong ngưỡng an toàn
    const page = Number(query.page) || PAGINATION_CONFIG.DEFAULT_PAGE;
    const limit = Math.min(
      Number(query.limit) || PAGINATION_CONFIG.DEFAULT_LIMIT,
      PAGINATION_CONFIG.MAX_LIMIT,
    );

    // 2. TÍNH TOÁN: Xác định số lượng bản ghi cần bỏ qua (Skip) cho Repository
    const skip = PaginationUtil.getSkip(page, limit);

    // 3. TRUY VẤN: Lấy dữ liệu thô (Entities) và tổng số lượng từ Database
    // Nhận về Tuple [Entity[], total] để phục vụ việc đóng gói Metadata
    const [histories, total] = await this._attemptRepo.findAndCount(
      query,
      skip,
      limit,
    );

    // 4. ÁNH XẠ (Mapping): Chuyển đổi Domain Entities sang Response DTOs
    // Sử dụng Mapper để định dạng lại ngày tháng, điểm số và loại bỏ các trường thừa
    const historyResponses = histories.map((history) =>
      ExamAttemptMapper.toResponseDTO(history),
    );

    // 5. ĐÓNG GÓI: Tạo phản hồi cuối cùng kèm theo Metadata phân trang đầy đủ
    return PaginationUtil.createPaginatedResponse(
      historyResponses,
      total,
      page,
      limit,
    );
  }
}
