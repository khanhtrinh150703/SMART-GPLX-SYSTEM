import { CompleteExamInputRequestDTO } from "@/application/dtos/request/exam/complete-exam.request.dto";
import { ICompleteExamService } from "@/domain/interfaces/services/exam-session";
import { Message } from "@/shared/errors/messages/success-messages-vn";
import { Result } from "@/application/dtos/response/shared/api.response.dto";
import { IAuthRequest } from "@/shared/types/authRequest.types";
import { catchAsync } from "@/shared/utils/catch-async.utils";
import { Response } from "express";

/**
 * @interface IExamAttemptControllerCradle
 * @description "Túi đồ nghề" (Dependency Container) chứa các dịch vụ chuyên biệt để quản lý vòng đời của một lượt làm bài thi (Exam Attempt).
 */
export interface IExamAttemptControllerCradle {
  /** @description Dịch vụ xử lý logic hoàn tất bài thi, chấm điểm và lưu kết quả cuối cùng. */
  completeExamService: ICompleteExamService;
}

/**
 * @class ExamAttemptController
 * @description Lớp điều phối (Orchestrator) các yêu cầu HTTP liên quan đến quá trình nộp bài và tra cứu kết quả thi.
 * @principle Result Integrity - Đảm bảo quá trình chấm điểm và ghi nhận kết quả diễn ra chính xác, minh bạch và không thể bị thao túng.
 */
export class ExamAttemptController {
  /** @private @readonly @description Instance xử lý logic "về đích" và chấm điểm bài thi. */
  private readonly _completeExamService: ICompleteExamService;

  /**
   * @constructor
   * @description Khởi tạo ExamAttemptController bằng cách giải nén các phụ thuộc từ Cradle thông qua Awilix.
   * @param {IExamAttemptControllerCradle} cradle - Chứa các dịch vụ Application cần thiết để quản trị lượt thi.
   */
  constructor({ completeExamService }: IExamAttemptControllerCradle) {
    this._completeExamService = completeExamService;
  }

  /**
   * @description Nộp bài thi, chấm điểm và lưu Snapshot NoSQL.
   * @route POST /api/v1/exam-attempts/complete
   */
  public completeExam = catchAsync(async (req: IAuthRequest, res: Response) => {
    const userId = req.user?.userId || `GUEST_${Date.now()}`;
    const isGuest = !req.user;
    const dto = new CompleteExamInputRequestDTO(req.body);
    const result = await this._completeExamService.completeExam(
      userId,
      dto,
      isGuest,
    );
    Result.ok(
      res,
      result,
      Message.EXAM.COMPLETE_SUCCESS,
      "EXAM_COMPLETE_SUCCESS",
    );
  });
}
