import {
  ICreateExamHistorySummaryInputDTO,
} from "@/application/dtos/request/exam-history/create-exam-history-summary.request.dto";
import { ExamHistorySummaryResponseDTO } from "@/application/dtos/response/exam-history/exam-history-summary.response.dto";
import { ExamHistorySummaryEntity } from "@/domain/entities/exam-history/exam-history-summary.entity";
import { IExamHistorySummaryRepository } from "@/domain/interfaces/repositories/exam-mgmt";
import { IExamHistorySummaryService } from "@/domain/interfaces/services/exam-mgmt";
import { ExamHistorySummaryMapper } from "@/infrastructure/database/mappers/exam-mgmt";
import { AppError, ErrorCode } from "@/shared/errors";

/**
 * @interface IExamHistorySummaryServiceCradle
 * @description Tập hợp các phụ thuộc (Dependencies) cần thiết cho các nghiệp vụ làm thay đổi dữ liệu lịch sử thi.
 */
export interface IExamHistorySummaryServiceCradle {
  /** @description Repository chịu trách nhiệm lưu trữ, cập nhật và xử lý thực thể lịch sử thi trong Database. */
  historySummaryRepository: IExamHistorySummaryRepository;
}

/**
 * @class ExamHistorySummaryService
 * @description Dịch vụ điều phối (Write-side) các thao tác làm thay đổi trạng thái của lịch sử thi.
 * @principle Data Integrity - Đảm bảo tính nhất quán của dữ liệu khi ghi mới hoặc thực hiện xóa mềm.
 */
export class ExamHistorySummaryService implements IExamHistorySummaryService {
  /** @private @readonly @description Instance thực hiện các thao tác ghi dữ liệu lịch sử. */
  private readonly _historySummaryRepo: IExamHistorySummaryRepository;

  /**
   * @constructor
   * @description Khởi tạo dịch vụ lịch sử thi với các phụ thuộc được đóng gói.
   * @param {IExamHistorySummaryServiceCradle} cradle - Chứa các công cụ phục vụ luồng xử lý nghiệp vụ thay đổi dữ liệu.
   */
  constructor({ historySummaryRepository }: IExamHistorySummaryServiceCradle) {
    this._historySummaryRepo = historySummaryRepository;
  }

  /**
   * @description Ghi nhận kết quả bài thi mới vào hệ thống và khởi tạo thực thể nghiệp vụ.
   * @param {ICreateExamHistorySummaryInputDTO} dto - Dữ liệu đầu vào để tạo lịch sử thi.
   * @returns {Promise<ExamHistorySummaryResponseDTO>} Trả về DTO kết quả sau khi đã lưu thành công.
   */
  public async createHistory(
    props: ICreateExamHistorySummaryInputDTO,
  ): Promise<ExamHistorySummaryResponseDTO> {
    // 1. Chuyển đổi trực tiếp sang Domain Entity (Dữ liệu đã sạch từ lớp ngoài)
    const historyEntity = ExamHistorySummaryEntity.create(props);

    // 2. Lưu trữ thực thể vào Database thông qua Repository
    const savedEntity = await this._historySummaryRepo.create(historyEntity);

    // 3. Trả về DTO sạch cho phía gọi
    return ExamHistorySummaryMapper.toResponse(savedEntity);
  }

  /**
   * @description Thực hiện xóa mềm một bản ghi lịch sử thi bằng cách cập nhật dấu thời gian xóa.
   * @param {string} id - ID của bản ghi lịch sử cần xóa.
   * @returns {Promise<void>} Không trả về dữ liệu nếu thành công.
   * @throws {AppError} Ném lỗi nếu ID không hợp lệ hoặc không tìm thấy bản ghi trong hệ thống.
   */
  public async softDeleteHistory(id: string): Promise<void> {
    if (!id) {
      throw new AppError(ErrorCode.VALIDATION.ID_REQUIRED);
    }

    // 1. Kiểm tra sự tồn tại của bản ghi (Guard Clause)
    const history = await this._historySummaryRepo.findByIdSystem(id);

    if (!history) {
      throw new AppError(ErrorCode.EXAM_HISTORY.HISTORY_NOT_FOUND);
    }

    // 2. Thay đổi trạng thái tại Domain Entity (Nghiệp vụ xóa mềm)
    history.softDelete(); // Giả định Entity có hàm delete() để set deletedAt = now()

    // 3. Cập nhật trạng thái mới vào Database thông qua hàm update() của Repo
    await this._historySummaryRepo.update(history);
  }
}
