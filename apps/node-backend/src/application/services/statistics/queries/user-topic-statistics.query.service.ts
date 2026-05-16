import { UserTopicStatisticsResponseDTO } from "@/application/dtos/response/statistics/user-topic-statistics.response.dto";
import { IUserTopicStatisticsRepository } from "@/domain/interfaces/repositories/statistics";
import { IUserTopicStatisticsQueryService } from "@/domain/interfaces/services/statistics/queries";
import { UserTopicStatisticsMapper } from "@/infrastructure/database/mappers/statistics";

/**
 * @interface IUserTopicStatisticsQueryCradle
 * @description Định nghĩa các phụ thuộc cần thiết cho UserTopicStatisticsQuery qua Awilix.
 */
export interface IUserTopicStatisticsQueryCradle {
  /** @description Repository chịu trách nhiệm truy xuất dữ liệu thống kê theo chủ đề của người dùng từ Database. */
  userTopicStatisticsRepository: IUserTopicStatisticsRepository;
}

/**
 * @class UserTopicStatisticsQuery
 * @description Triển khai các yêu cầu truy vấn dữ liệu thống kê chủ đề của người dùng.
 * Tuân thủ quy tắc CQRS: Chỉ đọc dữ liệu, không gây ra tác dụng phụ (side-effects).
 */
export class UserTopicStatisticsQueryService implements IUserTopicStatisticsQueryService {
  private readonly _userTopicRepo: IUserTopicStatisticsRepository;

  /**
   * @description Khởi tạo Query Service.
   * @param {IUserTopicStatisticsQueryCradle} cradle - Chứa Repository được tiêm vào.
   */
  constructor({
    userTopicStatisticsRepository,
  }: IUserTopicStatisticsQueryCradle) {
    this._userTopicRepo = userTopicStatisticsRepository;
  }

  /**
   * @description Lấy danh sách thống kê toàn bộ các chủ đề mà người dùng đã học/thi.
   * @param {string} userId - ID của người dùng cần truy vấn.
   * @returns {Promise<UserTopicStatisticsResponseDTO[]>} Danh sách DTO thống kê.
   */
  public async getStatisticsByUser(
    userId: string,
  ): Promise<UserTopicStatisticsResponseDTO[]> {
    // Gọi trực tiếp Repository để lấy danh sách thực thể (Domain Entities)
    const entities = await this._userTopicRepo.findAllByUserId(userId);

    // Sử dụng BaseMapper để chuyển đổi hàng loạt sang DTO an toàn
    return UserTopicStatisticsMapper.toResponseList(entities);
  }

  /**
   * @description Lấy thống kê chi tiết của một chủ đề cụ thể cho một người dùng.
   * @param {string} userId - ID người dùng.
   * @param {string} topicId - ID chủ đề (ví dụ: Biển báo, Luật đường bộ).
   * @returns {Promise<UserTopicStatisticsResponseDTO | null>}
   */
  public async getSpecificTopicStats(
    userId: string,
    topicId: string,
  ): Promise<UserTopicStatisticsResponseDTO | null> {
    const entity = await this._userTopicRepo.findByUserAndTopic(
      userId,
      topicId,
    );

    if (!entity) return null;

    // Chuyển đổi thực thể đơn lẻ sang DTO trước khi rời khỏi tầng Application
    return UserTopicStatisticsMapper.toResponse(entity);
  }
}
