import { ExamHistorySummaryQueryDTO } from "@/application/dtos/request/exam-history/exam-history-summary-query.request.dto";
import { Result } from "@/application/dtos/response/shared/api.response.dto";
import { IExamHistorySummaryQueryService } from "@/domain/interfaces/services";
import { Message } from "@/shared/errors/messages/success-messages-vn";
import { IAuthRequest } from "@/shared/types/authRequest.types";
import { catchAsync } from "@/shared/utils/catch-async.utils";
import { Response } from "express";

/**
 * @interface IExamHistorySummaryControllerCradle
 * @description Tập hợp các phụ thuộc (Dependencies) cần thiết cho bộ điều phối truy vấn tổng hợp lịch sử thi.
 */
export interface IExamHistorySummaryControllerCradle {
  /** @description Dịch vụ chuyên biệt xử lý các thao tác đọc (Read-only) lịch sử thi. */
  examHistoryQuerySummaryService: IExamHistorySummaryQueryService;
}

/**
 * @class ExamHistorySummaryController
 * @description Lớp điều phối các yêu cầu HTTP liên quan đến việc xem lại tóm tắt lịch sử và kết quả thi.
 * @principle Data Transparency & Ownership - Cung cấp dữ liệu minh bạch nhưng phải đảm bảo quyền sở hữu (chỉ xem dữ liệu hợp lệ).
 */
export class ExamHistorySummaryController {
  /** @private @readonly @description Instance dịch vụ xử lý các logic truy vấn lịch sử. */
  private readonly _historyQueryService: IExamHistorySummaryQueryService;

  /**
   * @constructor
   * @description Khởi tạo controller thông qua cơ chế Cradle (Awilix DI).
   * @param {IExamHistorySummaryControllerCradle} cradle - Chứa các phụ thuộc đã được đóng gói và tiêm vào (injected).
   */
  constructor({
    examHistoryQuerySummaryService,
  }: IExamHistorySummaryControllerCradle) {
    this._historyQueryService = examHistoryQuerySummaryService;
  }

  /**
   * @description Lấy danh sách lịch sử thi (bản tóm tắt) kèm phân trang & lọc.
   * @route GET /api/v1/exam-histories
   * @access Private (Thí sinh)
   */
  public getHistorySummaryList = catchAsync(
    async (req: IAuthRequest, res: Response) => {
      // 1. Ép kiểu vào DTO Summary chuyên biệt
      const queryDto = new ExamHistorySummaryQueryDTO({
        ...req.query,
        userId: req.user.userId,
      }); 

      // 2. Gọi Query Service để lấy danh sách tổng quan (Summary List)
      const result =
        await this._historyQueryService.getHistorySummaryList(queryDto);
        
      // 3. Trả về response với mã định danh rõ ràng
      Result.ok(
        res,
        result,
        Message.HISTORY.FETCH_SUCCESS,
        "HISTORY_SUMMARY_LIST_SUCCESS",
      );
    },
  );

  /**
   * @description Lấy thông tin chi tiết tổng quan (Summary Detail) của một bài thi cụ thể.
   * @route GET /api/v1/exam-histories/:id
   * @access Private (Thí sinh)
   */
  public getHistorySummaryDetail = catchAsync(
    async (req: IAuthRequest, res: Response) => {
      const id = req.params.id as string;

      // Truy xuất chi tiết tổng quan từ MySQL
      const result =
        await this._historyQueryService.getHistorySummaryDetail(id);

      // Lưu ý: Logic check Ownership (userId) nên nằm ở tầng Service
      Result.ok(
        res,
        result,
        Message.HISTORY.DETAIL_SUCCESS,
        "HISTORY_SUMMARY_DETAIL_SUCCESS",
      );
    },
  );
}
