import { IExamAttemptRepository } from "@/domain/interfaces/repositories/exam-session/i-exam-attempt.repository";
import { ExamAttemptEntity } from "@/domain/entities/exam-attempt/exam-attempt.entity";
import { AppError, ErrorCode } from "@/shared/errors";
import { IExamAttemptService } from "@/domain/interfaces/services/exam-session/commands/i-exam-attempts.service";

export interface IExamAttemptCradle {
  examAttemptRepository: IExamAttemptRepository;
}

/**
 * @class ExamAttemptService
 * @description Triển khai các xử lý nghiệp vụ cho lượt thi (Snapshot).
 * @principle Clean Architecture - Tập trung vào việc Persistence (Lưu trữ) và Retrieval (Truy xuất).
 */
export class ExamAttemptService implements IExamAttemptService {
  private readonly _attemptRepo: IExamAttemptRepository;

  constructor({ examAttemptRepository }: IExamAttemptCradle) {
    this._attemptRepo = examAttemptRepository;
  }

  /**
   * @description Thực hiện lưu trữ bền vững (Persistence) thực thể lượt thi đã được định danh và kiểm soát nghiệp vụ.
   * @param {ExamAttemptEntity} entity - Thực thể lượt thi hoàn chỉnh (Đã có ID và Snapshot dữ liệu).
   * @returns {Promise<ExamAttemptEntity>} Thực thể sau khi đã đồng bộ hóa thành công xuống cơ sở dữ liệu.
   */
  public async createAttempt(
    entity: ExamAttemptEntity,
  ): Promise<ExamAttemptEntity> {
    return await this._attemptRepo.createExamAttempt(entity);
  }

  /**
   * @description Thực hiện xóa mềm lượt thi (Soft Delete) để ẩn dữ liệu phía người dùng nhưng vẫn giữ lại bản ghi phục vụ mục đích thống kê.
   * @param {string} id - ID định danh của lượt thi cần xử lý.
   * @returns {Promise<void>}
   * @throws {AppError} EXAM_ATTEMPT.NOT_FOUND nếu lượt thi không tồn tại trong hệ thống.
   */
  public async softDeleteAttempt(id: string): Promise<void> {
    const attempt = await this._attemptRepo.findById(id);

    if (!attempt) {
      throw new AppError(ErrorCode.EXAM_ATTEMPT.NOT_FOUND);
    }

    await this._attemptRepo.softDelete(id);
  }

  /**
   * @description Xóa vĩnh viễn (Hard Delete) bản ghi lượt thi khỏi cơ sở dữ liệu. Hành động này không thể hoàn tác.
   * @param {string} id - ID định danh của lượt thi cần xóa bỏ hoàn toàn.
   * @returns {Promise<void>}
   * @throws {AppError} EXAM_ATTEMPT.NOT_FOUND nếu lượt thi không tồn tại trong hệ thống.
   */
  public async hardDeleteAttempt(id: string): Promise<void> {
    const attempt = await this._attemptRepo.findById(id);

    if (!attempt) {
      throw new AppError(ErrorCode.EXAM_ATTEMPT.NOT_FOUND);
    }

    await this._attemptRepo.hardDelete(id);
  }
}
