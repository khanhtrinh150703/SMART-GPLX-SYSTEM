import { IUserStatisticsResponseDTO } from "@/application/dtos/response/statistics/user-statistics.response.dto";
import { IUserStatisticsRepository } from "@/domain/interfaces/repositories";
import { IUserStatisticsQueryService } from "@/domain/interfaces/services/statistics/queries";
import { UserStatisticsMapper } from "@/infrastructure/database/mappers";
import { AppError, ErrorCode } from "@/shared/errors";

/**
 * @interface IUserStatisticsQueryServiceCradle
 * @description Tập hợp các phụ thuộc (Dependencies) cần thiết cho nghiệp vụ truy vấn thống kê người dùng.
 */
export interface IUserStatisticsQueryServiceCradle {
  /** @description Repository chịu trách nhiệm truy xuất dữ liệu thống kê từ cơ sở dữ liệu. */
  userStatsRepository: IUserStatisticsRepository;
}

/**
 * @class UserStatisticsQueryService
 * @description Dịch vụ xử lý các tác vụ truy vấn (Read-side) liên quan đến dữ liệu thống kê cá nhân của người dùng.
 * @principle Performance First - Tối ưu hóa tốc độ truy xuất dữ liệu để hiển thị biểu đồ và báo cáo nhanh chóng.
 */
export class UserStatisticsQueryService implements IUserStatisticsQueryService {
  /** @private @readonly @description Instance thực hiện các thao tác đọc dữ liệu thống kê. */
  private readonly _userStatsRepo: IUserStatisticsRepository;

  /**
   * @constructor
   * @description Khởi tạo dịch vụ truy vấn thống kê với các kho lưu trữ dữ liệu tương ứng.
   * @param {IUserStatisticsQueryServiceCradle} cradle - Chứa các phụ thuộc phục vụ luồng truy vấn.
   */
  constructor({ userStatsRepository }: IUserStatisticsQueryServiceCradle) {
    this._userStatsRepo = userStatsRepository;
  }

  /**
   * @description Truy vấn thông tin thống kê tổng hợp của người dùng.
   * @param {string} userId - ID định danh của người dùng.
   * @returns {Promise<IUserStatisticsResponseDTO>} DTO chứa các chỉ số thống kê (mặc định là 0 nếu chưa có dữ liệu).
   */
  public async getUserSummary(
    userId: string,
  ): Promise<IUserStatisticsResponseDTO> {
    // 1. Kiểm tra tính hợp lệ của đầu vào
    if (!userId) {
      throw new AppError(ErrorCode.VALIDATION.ID_REQUIRED);
    }

    // 2. Tìm kiếm bản ghi thống kê trong Database
    const stats = await this._userStatsRepo.findByUserId(userId);

    // 3. XỬ LÝ KHI CHƯA CÓ DỮ LIỆU 
    if (!stats) {
      return UserStatisticsMapper.toEmptyResponse();
    }

    // 4. Map dữ liệu thực tế sang DTO phản hồi
    return UserStatisticsMapper.toResponse(stats);
  }
}
