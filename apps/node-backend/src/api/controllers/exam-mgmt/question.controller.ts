import { Request, Response } from "express";
import { Result } from '@/application/dtos/response/shared/api.response.dto';
import { catchAsync } from "@/shared/utils/catch-async.utils";
import { Message } from "@/shared/errors/messages/success-messages-vn";
import { AppError, ErrorCode } from "@/shared/errors";
import { UpdateQuestionRequestDTO } from "@/application/dtos/request/question/update-question.request.dto";
import { CreateQuestionRequestDTO, ICreateQuestionInputDTO } from "@/application/dtos/request/question/create-question.request.dto";
import { QuestionsAdminQueryDto } from "@/application/dtos/request/question/question-query.request.dto";
import { IQuestionService } from "@/domain/interfaces/services/exam-mgmt";
import { IQuestionQueryService } from "@/domain/interfaces/services/exam-mgmt/queries";
import { GetSelectionPoolDto } from "@/application/dtos/request/question/selection-question.request.dto";

/**
 * @interface IQuestionControllerCradle
 * @description "Cổng chào" (Dependency Container) chuyên biệt cho QuestionController.
 * Đảm bảo tính minh bạch và an toàn khi chỉ cho phép Controller tiếp cận các dịch vụ quản lý ngân hàng câu hỏi.
 */
export interface IQuestionControllerCradle {
  /** @description Dịch vụ thực hiện các thay đổi dữ liệu (Thêm mới, cập nhật, xóa, import câu hỏi). (Command service for question management). */
  questionService: IQuestionService;

  /** @description Dịch vụ chuyên trách các yêu cầu truy vấn, tìm kiếm và lọc câu hỏi từ DB. (Query service for question retrieval and filtering). */
  questionQueryService: IQuestionQueryService;
}

/**
 * @class QuestionController
 * @description Lớp điều phối (Orchestrator) các yêu cầu HTTP liên quan đến Ngân hàng câu hỏi lý thuyết.
 * @principle Core Domain Logic - Quản lý thực thể trung tâm của hệ thống Smart-GPLX, đòi hỏi sự chính xác tuyệt đối trong việc điều phối dữ liệu. (Managing the central entity of the system with high precision).
 */
export class QuestionController {
  /** @private @readonly @description Instance xử lý các logic nghiệp vụ thay đổi trạng thái câu hỏi. */
  private readonly _questionService: IQuestionService;

  /** @private @readonly @description Instance xử lý các yêu cầu đọc, tìm kiếm và thống kê câu hỏi. */
  private readonly _questionQueryService: IQuestionQueryService;

  /**
   * @constructor
   * @description Khởi tạo QuestionController thông qua cơ chế tiêm phụ thuộc (Dependency Injection).
   * @param {IQuestionControllerCradle} cradle - Chứa các dịch vụ chuyên biệt cần thiết để vận hành module Câu hỏi.
   */
  constructor({ questionService, questionQueryService }: IQuestionControllerCradle) {
    this._questionService = questionService;
    this._questionQueryService = questionQueryService;
  }

  /**
   * @description Hàm hỗ trợ trích xuất dữ liệu từ Multipart Request.
   * @param {Request} req - Đối tượng Request từ Express.
   * @returns {ICreateQuestionInputDTO} - Dữ liệu đã được chuẩn hóa để đưa vào Service.
   * @private
   */
  private _getMultipartData(req: Request): ICreateQuestionInputDTO {
    const files = req.files as { [fieldname: string]: Express.Multer.File[] } | undefined;

    return {
      ...req.body, // Spread toàn bộ body (chapterId, content, answers...)
      imageFile: files?.['imageFile']?.[0],
      answerFiles: files?.['answerImages'],
    };
  }

  /**
   * @description [POST] Tạo mới một câu hỏi vào ngân hàng dữ liệu. (Create a new question in the database).
   * @route /api/v1/questions
   * @access Private (Admin/Moderator)
   * @param {Request} req - Chứa dữ liệu câu hỏi (thường là Multipart để hỗ trợ đính kèm hình ảnh).
   * @param {Response} res - Trả về đối tượng Question vừa được tạo.
   * @note Sử dụng 'catchAsync' để chuyển tiếp lỗi về Global Error Middleware, triệt tiêu hoàn toàn try-catch cục bộ.
   */
  public create = catchAsync(async (req: Request, res: Response): Promise<void> => {
    // 1. Lấy data nhanh gọn qua helper
    const dto = new CreateQuestionRequestDTO(this._getMultipartData(req));

    const data = await this._questionService.createQuestion(dto);

    Result.ok(res, data, Message.QUESTION.CREATE_SUCCESS, 'QUESTION_CREATE_SUCCESS');
  });

  /**
  * @description [PUT] Cập nhật thông tin chi tiết của một câu hỏi.
  * @route /api/v1/questions/:id
  * @param {Request} req - Chứa params.id và body là UpdateQuestionDTO.
  * @param {Response} res - Đối tượng Response.
  */
  public update = catchAsync(async (req: Request, res: Response): Promise<void> => {
    const id = req.params.id as string;

    const rawInput = { ...this._getMultipartData(req), id };

    const dto = new UpdateQuestionRequestDTO(rawInput);

    const data = await this._questionService.updateQuestion(id, dto);

    Result.ok(res, data, Message.QUESTION.UPDATE_SUCCESS, 'QUESTION_UPDATE_SUCCESS');
  });

  /**
   * @description [GET] Lấy danh sách câu hỏi theo ID chương.
   * @route /api/v1/questions/chapter/:chapterId
   * @param {Request} req - Chứa params.chapterId.
   * @returns {Promise<void>}
   */
  public getByChapter = catchAsync(async (req: Request, res: Response): Promise<void> => {
    // Lưu ý: Tên param phải khớp với cấu hình Route của cậu (ví dụ :chapterId)
    const chapterId = req.params.id as string;

    const data = await this._questionQueryService.getQuestionsByChapter(chapterId);

    Result.ok(
      res,
      data,
      Message.QUESTION.FETCH_SUCCESS,
      'QUESTION_FETCH_BY_CHAPTER_SUCCESS'
    );
  });

  /**
   * @description [GET] Lấy chi tiết một ma trận đề thi bằng ID.
   * @route /api/v1/exam-matrices/:id
   * @param {Request} req - Chứa params.id.
   */
  public getById = catchAsync(async (req: Request, res: Response): Promise<void> => {
    const id = req.params.id as string;

    const data = await this._questionQueryService.getQuestionById(id);

    // Lưu ý: Nếu Service của cậu đã throw AppError khi không tìm thấy, 
    // thì ở đây không cần check data nữa. Nhưng check lại cho chắc cũng không sao.
    if (!data) {
      throw new AppError(ErrorCode.QUESTION.NOT_FOUND);
    }

    Result.ok(
      res,
      data,
      Message.QUESTION.FETCH_SUCCESS,
      'QUESTION_FETCH_BY_ID_SUCCESS'
    );
  });


  /**
   * @description [GET] Truy vấn thông tin chi tiết của một Ma trận đề thi (Exam Matrix) theo ID. (Retrieve detailed exam matrix configuration by ID).
   * @route /api/v1/exam-matrices/:id
   * @param {Request} req - Đối tượng Request (chứa params.id là UUID của ma trận).
   * @param {Response} res - Đối tượng Response trả về dữ liệu ma trận.
   * @note Theo cơ chế Error Handling tập trung, nếu Service không tìm thấy dữ liệu sẽ tự động throw AppError. Việc check null tại Controller chỉ đóng vai trò chốt chặn cuối cùng (Double-check).
   */
  public delete = catchAsync(async (req: Request, res: Response): Promise<void> => {
    const id = req.params.id as string;
    const result = await this._questionService.deleteQuestion(id);

    Result.ok(
      res,
      result,
      Message.QUESTION.DELETE_SUCCESS,
      'QUESTION_DELETE_SUCCESS'
    );
  });

  /**
   * @description [PATCH] Khôi phục một hạng bằng lái đã bị xóa mềm (Soft Deleted). (Restore a soft-deleted license category).
   * @route /api/v1/license-categories/:id/restore
   * @param {Request} req - Đối tượng Request (chứa params.id là định danh của hạng bằng).
   * @param {Response} res - Trả về dữ liệu hạng bằng đã được khôi phục.
   * @note Hàm này sẽ đảo ngược trạng thái của 'deletedAt' về null, cho phép hạng bằng xuất hiện lại trong các truy vấn thông thường. (Reverts 'deletedAt' to null, making the category visible again).
   */
  public restore = catchAsync(async (req: Request, res: Response): Promise<void> => {
    const id = req.params.id as string;

    const result = await this._questionService.restoreQuestion(id);

    Result.ok(
      res,
      result,
      Message.QUESTION.RESTORE_SUCCESS,
      'QUESTION_RESTORE_SUCCESS'
    );
  });

  /**
   * @description API Lấy danh sách câu hỏi dành cho Admin (Hỗ trợ phân trang, tìm kiếm và bộ lọc kết hợp).
   * @route GET /api/v1/admin/questions
   * @param {Request} req - Chứa Query Params: chapterId, licenseCategoryId, difficultyLevel, isCritical, search, status, page, limit.
   * @param {Response} res - Đối tượng Response trả về kết quả chuẩn hóa.
   * @returns {Promise<void>} Trả về PaginatedResult chứa danh sách QuestionResponseDTO.
   */
  public list = catchAsync(async (req: Request, res: Response): Promise<void> => {
    const query = new QuestionsAdminQueryDto(req.query as Record<string, unknown>);

    const categories = await this._questionQueryService.getPaginatedQuestions(query);

    Result.ok(
      res,
      categories,
      Message.QUESTION.FETCH_SUCCESS,
      'QUESTION_FETCH_SUCCESS'
    );
  });

  /**
   * @description API truy xuất danh sách tóm tắt câu hỏi phục vụ việc chọn lọc vào Ma trận hoặc Đề thi (Selection Pool).
   * @route GET /api/v1/questions/selection-pool
   * @param {Request} req - Chứa Query Params: licenseId (bắt buộc), chapterId, search, isCritical, excludeIds.
   * @param {Response} res - Đối tượng Response trả về kết quả chuẩn hóa.
   * @returns {Promise<void>} Trả về mảng IExamQuestionSummary[].
   */
  public getSelectionPool = catchAsync(async (req: Request, res: Response): Promise<void> => {
    // 1. Khởi tạo DTO từ query params và thực thi constructor để gán giá trị mặc định
    const query = new GetSelectionPoolDto(req.query as Record<string, unknown>);
    // 2. Gọi Service để lấy dữ liệu đã qua xử lý Cache & Mapper
    const summaries = await this._questionQueryService.getQuestionsSummary(query);
    // 3. Trả về kết quả thành công theo chuẩn của hệ thống
    Result.ok(
      res,
      summaries,
      Message.QUESTION.FETCH_SUMMARY_SUCCESS,
      'QUESTION_SUMMARY_FETCH_SUCCESS'
    );
  });
}