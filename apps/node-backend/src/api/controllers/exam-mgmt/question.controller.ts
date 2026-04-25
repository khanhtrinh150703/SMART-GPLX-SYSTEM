import { Request, Response } from "express";
import { Result } from "@/shared/responses/api-response";
import { catchAsync } from "@/shared/utils/catch-async.utils";
import { Message } from "@/shared/errors/messages/success-messages-vn";
import { AppError, ErrorCode } from "@/shared/errors";
import { UpdateQuestionRequestDto } from "@/application/dtos/request/question/update-question.request.dto";
import { CreateQuestionRequestDto, ICreateQuestionInput } from "@/application/dtos/request/question/create-question.request.dto";
import { QuestionsAdminQueryDto } from "@/application/dtos/request/question/question-query.request.dto";
import { IQuestionService } from "@/domain/interfaces/services/exam-mgmt";

/**
 * @interface IQuestionControllerCradle
 * @description "Cổng chào" dependencies cho QuestionController.
 * Chỉ cho phép Controller tiếp cận Service để điều phối luồng dữ liệu.
 */
export interface IQuestionControllerCradle {
  questionService: IQuestionService;
}

/**
 * @class QuestionController
 * @description Tiếp nhận các HTTP Request và điều phối xử lý nghiệp vụ Câu hỏi.
 */
export class QuestionController {
  private readonly _questionService: IQuestionService;

  /**
   * @description Khởi tạo Controller với Service chuyên dụng.
   * @param {IQuestionControllerCradle} cradle - Dependencies được tiêm từ Awilix.
   */
  constructor({ questionService }: IQuestionControllerCradle) {
    this._questionService = questionService;
  }


  /**
   * @description Hàm hỗ trợ trích xuất dữ liệu từ Multipart Request.
   * @param {Request} req - Đối tượng Request từ Express.
   * @returns {ICreateQuestionInput} - Dữ liệu đã được chuẩn hóa để đưa vào Service.
   * @private
   */
  private _getMultipartData(req: Request): ICreateQuestionInput {
    const files = req.files as { [fieldname: string]: Express.Multer.File[] } | undefined;

    return {
      ...req.body, // Spread toàn bộ body (chapterId, content, answers...)
      imageFile: files?.['imageFile']?.[0],
      answerFiles: files?.['answerImages'],
    };
  }

  /**
   * @description [POST] Tạo mới một ma trận đề thi (cấu trúc đề).
   * @route /api/v1/exam-matrices
   * @param {Request} req - Chứa body là CreateExamMatrixDTO.
   * @param {Response} res - Đối tượng Response.
   */
  public create = catchAsync(async (req: Request, res: Response): Promise<void> => {
    // 1. Lấy data nhanh gọn qua helper
    const dto = new CreateQuestionRequestDto(this._getMultipartData(req));
    dto.isValid();

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

    const dto = new UpdateQuestionRequestDto(rawInput);

    dto.isValid();

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

    const data = await this._questionService.getQuestionsByChapter(chapterId);

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

    const data = await this._questionService.getQuestionById(id);

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
   * @description API Xóa (xóa mềm) một hạng bằng lái.
   * @route DELETE /api/v1/license-categories/:id
   * @param {Request} req - Chứa params.id.
   * @param {Response} res - Đối tượng Response của Express.
   * @returns {Promise<void>}
   */
  public delete = catchAsync(async (req: Request, res: Response): Promise<void> => {
    const id = req.params.id as string;
    await this._questionService.deleteQuestion(id);

    Result.ok(
      res,
      undefined,
      Message.QUESTION.DELETE_SUCCESS,
      'QUESTION_DELETE_SUCCESS'
    );
  });


  /**
   * @description API Khôi phục hạng bằng lái đã bị xóa mềm.
   * @route PATCH /api/v1/license-categories/:id/restore
   * @param {Request} req - Chứa UUID hạng bằng trong params.id.
   * @param {Response} res - Đối tượng Response của Express.
   * @returns {Promise<void>}
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

    const categories = await this._questionService.getPaginatedQuestions(query);

    Result.ok(
      res,
      categories,
      Message.QUESTION.FETCH_SUCCESS,
      'QUESTION_FETCH_SUCCESS'
    );
  });
}