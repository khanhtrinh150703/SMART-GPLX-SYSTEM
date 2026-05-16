import { IActiveSessionResponseDTO } from "@/application/dtos/response/active-session/active-session.response.dto";
import { IActiveSessionRepository } from "@/domain/interfaces/repositories";
import { IActiveSessionQueryService } from "@/domain/interfaces/services/exam-session/queries/i-active-session.query.service";
import { ActiveSessionMapper } from "@/infrastructure/database/mappers";

/**
 * @interface IActiveSessionQueryCradle
 * @description Container chứa các phụ thuộc (dependencies) cần thiết để khởi tạo ActiveSessionQueryService.
 */
export interface IActiveSessionQueryCradle {
  /** @description Repository quản lý lưu trữ và truy vấn phiên làm bài (thường là MongoDB/Redis). */
  activeSessionRepository: IActiveSessionRepository;
}

export class ActiveSessionQueryService implements IActiveSessionQueryService {
  /**
   * @private
   * @readonly
   * @description Instance xử lý các thao tác lưu trữ dữ liệu phiên.
   */
  private readonly _sessionRepo: IActiveSessionRepository;

  /**
   * @constructor
   * @param {IActiveSessionQueryCradle} cradle - Danh sách các phụ thuộc được inject tự động thông qua Container.
   */
  constructor({ activeSessionRepository }: IActiveSessionQueryCradle) {
    this._sessionRepo = activeSessionRepository;
  }

  /**
   * @description Truy xuất phiên làm việc hiện tại và tự động xóa nếu đã hết hạn.
   * @param {string} userId - ID định danh của người dùng.
   * @returns {Promise<IActiveSessionResponseDTO | null>} DTO phiên hoạt động hoặc null nếu không tồn tại/hết hạn.
   */
  public async getCurrentSession(
    userId: string,
  ): Promise<IActiveSessionResponseDTO | null> {
    const session = await this._sessionRepo.findByUserId(userId);
    if (!session) return null;

    // Kiểm tra hết hạn
    if (new Date() > session.props.expiresAt) {
      await this._sessionRepo.deleteByUserId(userId);
      return null;
    }

    return ActiveSessionMapper.toResponse(session);
  }
}
