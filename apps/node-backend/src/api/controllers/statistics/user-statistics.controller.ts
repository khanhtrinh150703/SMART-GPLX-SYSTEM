import { SyncRankRequestDTO } from "@/application/dtos/request/user-rank/user-rank.request.dto";
import { Result } from "@/application/dtos/response/shared/api.response.dto";
import {
  IUserStatisticsQueryService,
  IUserStatisticsService,
} from "@/domain/interfaces/services";
import { Message } from "@/shared/errors/messages/success-messages-vn";
import { IAuthRequest } from "@/shared/types/authRequest.types";
import { catchAsync } from "@/shared/utils/catch-async.utils";
import { Response } from "express";

/**
 * @interface IUserStatisticsControllerCradle
 * @description Dependency Container chứa các dịch vụ truy vấn và xử lý thống kê.
 */
export interface IUserStatisticsControllerCradle {
  /** @description Dịch vụ chuyên biệt cho việc đọc dữ liệu thống kê (Query). */
  userStatsQueryService: IUserStatisticsQueryService;
  /** @description Dịch vụ xử lý cập nhật/đồng bộ chỉ số (Command). */
  userStatsService: IUserStatisticsService;
}

/**
 * @class UserStatisticsController
 * @description Lớp điều phối các yêu cầu HTTP liên quan đến hiệu suất và thành tích người dùng.
 * @principle Data Integrity & Privacy - Cung cấp cái nhìn chính xác về năng lực học tập của cá nhân.
 */
export class UserStatisticsController {
  private readonly _queryService: IUserStatisticsQueryService;
  private readonly _commandService: IUserStatisticsService;

  /**
   * @constructor
   * @description Khởi tạo thông qua cơ chế tiêm phụ thuộc của Awilix.
   */
  constructor({
    userStatsQueryService,
    userStatsService,
  }: IUserStatisticsControllerCradle) {
    this._queryService = userStatsQueryService;
    this._commandService = userStatsService;
  }

  /**
   * @description Truy xuất bảng tổng quan thống kê của người dùng hiện tại.
   * @route GET /api/v1/statistics/me
   * @access Private (Thí sinh)
   */
  public getMySummary = catchAsync(async (req: IAuthRequest, res: Response) => {
    // 1. Lấy userId từ token đã qua kiểm tra của authMiddleware
    const userId = req.user.userId;

    // 2. Gọi Query Service để lấy thực thể Domain
    const result = await this._queryService.getUserSummary(userId);

    // 3. Trả về response chuẩn mực của hệ thống
    Result.ok(
      res,
      result,
      Message.STATISTICS.FETCH_SUCCESS,
      "STATS_FETCH_SUCCESS",
    );
  });

  /**
   * @description Yêu cầu đồng bộ thủ công thống kê .
   * @route POST /api/v1/statistics/sync
   * @access Private (Internal/Admin)
   */
  public manualSync = catchAsync(async (req: IAuthRequest, res: Response) => {
    // Lưu ý: Thường việc đồng bộ được thực hiện tự động sau khi nộp bài (Nhịp 2).
    const dto = new SyncRankRequestDTO(req.body);
    await this._commandService.syncUserStats(dto);

    Result.ok(res, null, Message.STATISTICS.SYNC_SUCCESS, "STATS_SYNC_SUCCESS");
  });
}
