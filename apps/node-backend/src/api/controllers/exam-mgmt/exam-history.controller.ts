import { IExamAttemptQueryService } from "@/domain/interfaces/services/exam-session";
import { Message } from "@/shared/errors/messages/success-messages-vn";
import { Result } from "@/application/dtos/response/shared/api.response.dto";
import { IAuthRequest } from "@/shared/types/authRequest.types";
import { catchAsync } from "@/shared/utils/catch-async.utils";
import { Response } from "express";
import { ExamHistoryQueryDTO } from "@/application/dtos/request/exam-history/exam-history-query.request.dto";

/**
 * @interface IExamHistoryControllerCradle
 * @description Tập hợp các phụ thuộc (Dependencies) cần thiết để quản lý vòng đời và lưu trữ lịch sử thi.
 */
export interface IExamHistoryControllerCradle {
  /** @description Dịch vụ cung cấp khả năng truy vấn danh sách và tóm tắt lịch sử thi của người dùng. */
  examAttemptQueryService: IExamAttemptQueryService;
}

/**
 * @class ExamHistoryController
 * @description Lớp điều phối (Orchestrator) các yêu cầu HTTP liên quan đến việc ghi nhận kết quả và tra cứu lịch sử thi.
 * @principle Result Integrity - Đảm bảo kết quả thi được lưu trữ chính xác, minh bạch và nhất quán trong lịch sử.
 */
export class ExamHistoryController {
  /** @private @readonly @description Instance xử lý các yêu cầu truy vấn và tóm tắt lịch sử thi. */
  private readonly _examAttemptQueryService: IExamAttemptQueryService;

  /**
   * @constructor
   * @description Khởi tạo ExamHistoryController thông qua cơ chế Cradle (Awilix DI).
   * @param {IExamHistoryControllerCradle} cradle - Chứa các dịch vụ Application phụ trách lịch sử bài thi.
   */
  constructor({ examAttemptQueryService }: IExamHistoryControllerCradle) {
    this._examAttemptQueryService = examAttemptQueryService;
  }

  /**
   * @description Lấy danh sách lịch sử thi của người dùng.
   * @route GET /api/v1/exam-attempts/history
   */
  public getHistories = catchAsync(async (req: IAuthRequest, res: Response) => {
    const query = new ExamHistoryQueryDTO(req.query as Record<string, unknown>);
    const result =
      await this._examAttemptQueryService.getPaginatedAttempt(query);

    Result.ok(
      res,
      result,
      Message.EXAM.GET_HISTORY_SUCCESS,
      "GET_HISTORY_SUCCESS",
    );
  });

  /**
   * @description Xem chi tiết một bài làm cũ (Review câu đúng/sai từ Snapshot).
   * @route GET /api/v1/exam-attempts/:id/detail
   */
  public getHistoryDetail = catchAsync(
    async (req: IAuthRequest, res: Response) => {
      const id = req.params.id as string;
      const result = await this._examAttemptQueryService.getAttemptDetail(id);

      Result.ok(
        res,
        result,
        Message.EXAM.GET_DETAIL_SUCCESS,
        "GET_DETAIL_SUCCESS",
      );
    },
  );
}
