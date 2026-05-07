import { Result } from "@/application/dtos/response/shared/api.response.dto";
import { IUserRankQueryService } from "@/domain/interfaces/services";
import { Message } from "@/shared/errors/messages/success-messages-vn";
import { IAuthRequest } from "@/shared/types/authRequest.types";
import { catchAsync } from "@/shared/utils/catch-async.utils";
import { Request, Response } from "express";

/**
 * @interface IUserRankControllerCradle
 * @description "Túi đồ nghề" chứa các dịch vụ cần thiết để xử lý truy vấn bảng xếp hạng và kỷ lục.
 * @guard Interface Segregation - Đảm bảo Controller chỉ tiếp cận đúng Query Service.
 */
export interface IUserRankControllerCradle {
  /** @description Dịch vụ chuyên trách truy vấn dữ liệu bảng xếp hạng (Read-only). */
  userRankQueryService: IUserRankQueryService;
}

/**
 * @class UserRankController
 * @description Lớp điều phối (Orchestrator) các yêu cầu HTTP liên quan đến hệ thống xếp hạng và thành tích.
 * @principle Boundary Control - Tiếp nhận yêu cầu lọc, phân trang và điều phối vào tầng Query Service.
 */
export class UserRankController {
  /** @private @readonly @description Instance chuyên trách truy vấn kỷ lục/bảng xếp hạng. */
  private readonly _userRankQueryService: IUserRankQueryService;

  /**
   * @constructor
   * @description Khởi tạo UserRankController thông qua cơ chế giải nén phụ thuộc của Awilix.
   * @param {IUserRankControllerCradle} cradle - Chứa các dịch vụ truy vấn cần thiết.
   */
  constructor({ userRankQueryService }: IUserRankControllerCradle) {
    this._userRankQueryService = userRankQueryService;
  }

  /**
   * @description [GET] Lấy bảng xếp hạng của một đề thi cụ thể.
   * @route /api/v1/leaderboard/exams/:examId
   * @param {Request} req - Chứa params.examId và query.limit.
   * @returns {Promise<void>}
   */
  public getExamLeaderboard = catchAsync(
    async (req: Request, res: Response) => {
      // 1. Thu thập và chuẩn hóa tham số đầu vào (Dịch: Collect and normalize input params)
      const examId = req.params.examId as string;
      const limit = req.query.limit
        ? parseInt(req.query.limit as string, 10)
        : 10;

      // 2. Thực thi truy vấn thông qua Service
      const response = await this._userRankQueryService.getExamLeaderboard(
        examId,
        limit,
      );

      Result.ok(
        res,
        response,
        Message.RANK.FETCH_SUCCESS,
        "FETCH_EXAM_LEADERBOARD_SUCCESS",
      );
    },
  );

  /**
   * @description [GET] Lấy bảng xếp hạng tổng quát theo hạng bằng lái (A1, B2...).
   * @route /api/v1/leaderboard/categories/:categoryId
   * @param {Request} req - Chứa params.categoryId và query.limit.
   * @returns {Promise<void>}
   */
  public getCategoryLeaderboard = catchAsync(
    async (req: Request, res: Response) => {
      const categoryId = req.params.categoryId as string;
      const limit = req.query.limit
        ? parseInt(req.query.limit as string, 10)
        : 10;

      const response = await this._userRankQueryService.getCategoryLeaderboard(
        categoryId,
        limit,
      );

      Result.ok(
        res,
        response,
        Message.RANK.FETCH_SUCCESS,
        "FETCH_CATEGORY_LEADERBOARD_SUCCESS",
      );
    },
  );

  /**
   * @description [GET] Lấy danh sách kỷ lục cá nhân tốt nhất của người dùng hiện tại.
   * @route /api/v1/leaderboard/me
   * @param {IAuthRequest} req - Yêu cầu đã qua xác thực chứa thông tin user.
   * @returns {Promise<void>}
   */
  public getMyBestRecords = catchAsync(
    async (req: IAuthRequest, res: Response) => {
      // 1. Trích xuất ID người dùng từ Token (Đã qua AuthMiddleware)
      const userId = req.user.userId;

      // 2. Lấy dữ liệu thành tích tốt nhất
      const response =
        await this._userRankQueryService.getUserBestRecords(userId);

      Result.ok(
        res,
        response,
        Message.RANK.FETCH_SUCCESS,
        "FETCH_MY_RECORDS_SUCCESS",
      );
    },
  );
}
