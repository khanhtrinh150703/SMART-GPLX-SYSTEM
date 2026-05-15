import { Result } from "@/application/dtos/response/shared/api.response.dto";
import { IUserTopicStatisticsQueryService } from "@/domain/interfaces/services/statistics/queries";
import { IAuthRequest } from "@/shared/types/authRequest.types";
import { catchAsync } from "@/shared/utils/catch-async.utils";
import { Response } from "express";

/**
 * @interface IUserTopicStatisticsControllerCradle
 * @description Dependency Container chứa các dịch vụ truy vấn thống kê theo chủ đề.
 */
export interface IUserTopicStatisticsControllerCradle {
  /** @description Dịch vụ chuyên biệt cho việc đọc dữ liệu thống kê theo từng chủ đề (Query). */
  userTopicStatisticsQueryService: IUserTopicStatisticsQueryService;
}

/**
 * @class UserTopicStatisticsController
 * @description Lớp điều phối các yêu cầu HTTP liên quan đến phân tích thống kê theo chủ đề của người dùng.
 * @principle Granular Analytics - Cung cấp cái nhìn chi tiết về tiến độ học tập theo từng nhóm kiến thức cụ thể.
 */
export class UserTopicStatisticsController {
  private readonly _queryService: IUserTopicStatisticsQueryService;

  /**
   * @constructor
   * @description Khởi tạo thông qua cơ chế tiêm phụ thuộc của Awilix.
   * @param {IUserTopicStatisticsControllerCradle} cradle - Thùng chứa các phụ thuộc cần thiết.
   */
  constructor({
    userTopicStatisticsQueryService,
  }: IUserTopicStatisticsControllerCradle) {
    this._queryService = userTopicStatisticsQueryService;
  }
  /**
   * @description Lấy danh sách tiến độ theo từng chủ đề (Biển báo, Luật, Điểm liệt...).
   */
  public getTopicProgress = catchAsync(
    async (req: IAuthRequest, res: Response): Promise<void> => {
      const userId = req.user.id as string;
      const progress = await this._queryService.getStatisticsByUser(userId);

      Result.ok(res, progress, "Lấy tiến độ theo chủ đề thành công.");
    },
  );

  /**
   * @description Lấy chi tiết thống kê của một chủ đề cụ thể.
   */
  public getTopicDetail = catchAsync(
    async (req: IAuthRequest, res: Response): Promise<void> => {
      const userId = req.user.id as string;
      const topicId = req.params.topicId as string;

      const detail = await this._queryService.getSpecificTopicStats(
        userId,
        topicId,
      );

      Result.ok(res, detail, "Lấy chi tiết chủ đề thành công.");
    },
  );
}
