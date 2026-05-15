import { SyncRankRequestDTO } from "@/application/dtos/request/user-rank/user-rank.request.dto";
import { UserStatisticsEntity } from "@/domain/entities/statistics/user-statistics.entity";
import { IUserStatisticsRepository } from "@/domain/interfaces/repositories/statistics";
import { IUserStatisticsService } from "@/domain/interfaces/services/statistics/commands";

/**
 * @interface IUserStatisticsServiceCradle
 * @description Tập hợp các phụ thuộc (Dependencies) cần thiết để xử lý nghiệp vụ thay đổi dữ liệu thống kê.
 */
export interface IUserStatisticsServiceCradle {
  /** @description Repository chịu trách nhiệm lưu trữ, cập nhật và đồng bộ dữ liệu thống kê người dùng. */
  userStatsRepository: IUserStatisticsRepository;
}

/**
 * @class UserStatisticsService
 * @description Dịch vụ điều phối (Write-side) các logic nghiệp vụ làm thay đổi trạng thái thống kê người dùng.
 * @principle Data Consistency - Đảm bảo dữ liệu thống kê luôn được cập nhật chính xác sau mỗi lượt thi.
 */
export class UserStatisticsService implements IUserStatisticsService {
  /** @private @readonly @description Instance thực hiện các thao tác ghi dữ liệu thống kê vào Database. */
  private readonly _userStatsRepo: IUserStatisticsRepository;

  /**
   * @constructor
   * @description Khởi tạo dịch vụ thống kê người dùng với các phụ thuộc cần thiết.
   * @param {IUserStatisticsServiceCradle} cradle - Chứa các công cụ quản lý dữ liệu thống kê.
   */
  constructor({ userStatsRepository }: IUserStatisticsServiceCradle) {
    this._userStatsRepo = userStatsRepository;
  }

  /**
   * @description Cập nhật thống kê người dùng dựa trên kết quả thi mới nhất.
   */
  public async syncUserStats(payload: SyncRankRequestDTO): Promise<void> {
    const { userId } = payload;
    // 1. Lấy dữ liệu thống kê hiện tại từ Repository
    let stats = await this._userStatsRepo.findByUserId(userId);
    
    if (!stats) {
      stats = UserStatisticsEntity.create({ userId });
    }

    stats.updatePerformance(payload);

    // 3. Persistence: Đồng bộ dữ liệu xuống Database dựa trên trạng thái ban đầu
    await this._userStatsRepo.upsert(stats);
  }
}
