import { IQuestionRepository } from "@/domain/interfaces/repositories/i-question.repository";
import { CreateQuestionRequestDto } from "../dtos/request/question/create-question.request.dto";
import { QuestionMapper } from "@/infrastructure/database/mappers/question.mapper";
import { Question } from "@/domain/entities/question/question.entity";
import { AppError, ErrorCode } from "@/shared/errors";
import { UpdateQuestionRequestDto } from "../dtos/request/question/update-question.request.dto";
import { IQuestionService } from "@/domain/interfaces/services/i-question.service";
import { QuestionResponseDto } from "../dtos/response/question/question.respone.dto";
import { IChapterService } from "@/domain/interfaces/services/i-chapter.service";
import { ILicenseCategoryService } from "@/domain/interfaces/services/i-license-category.service";

export interface IQuestionServiceCradle {
  questionRepository: IQuestionRepository;
  chapterService: IChapterService;
  licenseCategoryService: ILicenseCategoryService;
}

/**
 * @class QuestionService
 * @description Xử lý logic nghiệp vụ cho module Câu hỏi.
 */
export class QuestionService implements IQuestionService {
  private readonly _questionRepo: IQuestionRepository;
  private readonly _licenseService: ILicenseCategoryService;
  private readonly _chapterService: IChapterService;

  constructor({ questionRepository, chapterService, licenseCategoryService }: IQuestionServiceCradle) {
    this._questionRepo = questionRepository;
    this._chapterService = chapterService;
    this._licenseService = licenseCategoryService;
  }

  /**
   * @description Tạo câu hỏi mới kèm theo validation liên kết.
   */
  public async createQuestion(dto: CreateQuestionRequestDto): Promise<QuestionResponseDto> {
    dto.isValid();

    // 1. Kiểm tra sự tồn tại của Chương và Hạng bằng lái (Cross-Service Validation)
    await this._validateRelations(dto.chapterId, dto.licenseCategoryIds);

    const questionEntity = Question.reconstitute({
      chapterId: dto.chapterId,
      content: dto.content,
      imageUrl: dto.imageUrl,
      isCritical: dto.isCritical,
      answers: dto.answers.map(ans => ({ ...ans, deletedAt: null })),
      licenseCategoryIds: dto.licenseCategoryIds,
      difficultyLevel: dto.difficultyLevel,
      deletedAt: null
    });

    const savedEntity = await this._questionRepo.create(questionEntity);
    return QuestionMapper.toResponse(savedEntity);
  }

  /**
   * @description Cập nhật thông tin câu hỏi với chốt chặn an toàn.
   */
  public async updateQuestion(id: string, dto: UpdateQuestionRequestDto): Promise<QuestionResponseDto> {
    const existing = await this._questionRepo.findById(id);
    if (!existing) throw new AppError(ErrorCode.QUESTION.NOT_FOUND);

    dto.isValid();

    // 1. Kiểm tra ID đáp án "chính chủ" (Chống Hijacking dữ liệu)
    const existingAnswerIds = existing.props.answers.map(a => a.id);
    const incomingExistingIds = dto.answers.map(a => a.id).filter((aid): aid is string => !!aid);
    const invalidIds = incomingExistingIds.filter(aid => !existingAnswerIds.includes(aid));

    if (invalidIds.length > 0) {
      throw new AppError(ErrorCode.QUESTION.ANSWERS_SYNC_ERROR);
    }

    // 2. Kiểm tra lại Chương và Hạng bằng lái nếu có thay đổi  
    await this._validateRelations(dto.chapterId, dto.licenseCategoryIds);
    
    const updatedEntity = Question.reconstitute({
      id: id,
      chapterId: dto.chapterId,
      content: dto.content,
      imageUrl: dto.imageUrl,
      isCritical: dto.isCritical,
      deletedAt: existing.props.deletedAt,
      answers: dto.answers.map(ans => ({ ...ans, deletedAt: null })),
      licenseCategoryIds: dto.licenseCategoryIds,
      difficultyLevel: dto.difficultyLevel,
    });

    const saved = await this._questionRepo.update(id, updatedEntity);
    return QuestionMapper.toResponse(saved);
  }

  /**
   * @description Lấy danh sách câu hỏi theo ID chương.
   */
  public async getQuestionsByChapter(chapterId: string): Promise<QuestionResponseDto[]> {
    const entities = await this._questionRepo.findByChapterId(chapterId);
    return QuestionMapper.toResponseList(entities);
  }

  /**
   * @description Lấy chi tiết một câu hỏi.
   */
  public async getQuestionById(id: string): Promise<QuestionResponseDto> {
    const entity = await this._questionRepo.findById(id);
    if (!entity) throw new AppError(ErrorCode.QUESTION.NOT_FOUND);
    return QuestionMapper.toResponse(entity);
  }

  /**
   * @description Xóa mềm câu hỏi.
   */
  public async deleteQuestion(id: string): Promise<void> {
    const question = await this._questionRepo.findById(id);
    if (!question) throw new AppError(ErrorCode.QUESTION.NOT_FOUND);

    question.delete();
    await this._questionRepo.delete(id);
  }

  /**
   * @description Khôi phục câu hỏi.
   */
  public async restoreQuestion(id: string): Promise<QuestionResponseDto> {
    // Lưu ý: findById ở đây nên lấy được cả bản ghi đã bị xóa (deletedAt != null)
    const question = await this._questionRepo.findByIdSystem(id);
    if (!question) throw new AppError(ErrorCode.QUESTION.NOT_FOUND);

    question.restore();
    const saved = await this._questionRepo.restore(id);
    return QuestionMapper.toResponse(saved);
  }

  /**
   * @description Kiểm tra sự tồn tại của Chương và các Hạng bằng lái.
   * Sử dụng các hàm .exists() để tối ưu hiệu năng truy vấn.
   * @param {string} chapterId - ID chương cần check.
   * @param {string[]} licenseIds - Danh sách ID hạng bằng lái cần check.
   */
  private async _validateRelations(chapterId: string, licenseIds: string[]): Promise<void> {
    // 1. Kiểm tra Chương 
    const chapterExists = await this._chapterService.exists(chapterId);
    if (!chapterExists) {
      throw new AppError(ErrorCode.CHAPTER.NOT_FOUND);
    }

    // 2. Kiểm tra danh sách Hạng bằng lái (Chạy song song để tiết kiệm thời gian)
    // licenseIds.map sẽ tạo ra một mảng các Promises
    const licenseChecks = licenseIds.map(lid => this._licenseService.exists(lid));

    // Đợi tất cả các Promises hoàn thành cùng lúc
    const results = await Promise.all(licenseChecks);

    // 3. Nếu có bất kỳ kết quả nào là 'false', nghĩa là có ID không tồn tại
    if (results.some(exists => !exists)) {
      throw new AppError(ErrorCode.LICENSE.NOT_FOUND);
    }
  }
}