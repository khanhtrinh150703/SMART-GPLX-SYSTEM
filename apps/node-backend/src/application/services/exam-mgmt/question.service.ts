import { IQuestionRepository } from "@/domain/interfaces/repositories/exam-mgmt/i-question.repository";
import { QuestionMapper } from "@/infrastructure/database/mappers/exam-mgmt/question.mapper";
import { Question } from "@/domain/entities/question/question.entity";
import { AppError, ErrorCode } from "@/shared/errors";
import { IQuestionService } from "@/domain/interfaces/services/exam-mgmt/i-question.service";
import { STORAGE_FOLDERS } from "@/domain/constants/storage.constant";
import { PaginatedResult } from "@/shared/types/pagination.types";
import { PaginationUtil } from "@/shared/utils/pagination.util";
import { IMediaService } from "@/domain/interfaces/services/integration/i-media.service";
import { IMasterDataCacheService } from "@/domain/interfaces/services/exam-mgmt/i-master-data-cache.service";
import { Answer } from "@/domain/entities/question/answer.entity";
import { QuestionImportEntity } from "@/domain/entities/import/import-question.entity";
import { PAGINATION_CONFIG } from "@/shared/config/pagination.config";
import { CreateQuestionRequestDto } from "@/application/dtos/request/question/create-question.request.dto";
import { QuestionsAdminQueryDto } from "@/application/dtos/request/question/question-query.request.dto";
import { UpdateQuestionRequestDto, UpdateAnswerPayload } from "@/application/dtos/request/question/update-question.request.dto";
import { QuestionAdminResponseDTO } from "@/application/dtos/response/question/admin-question.respone.dto";
import { QuestionResponseDTO } from "@/application/dtos/response/question/question.respone.dto";

export interface IQuestionServiceCradle {
  questionRepository: IQuestionRepository;
  mediaService: IMediaService;
  masterDataCacheService: IMasterDataCacheService;
}

/**
 * @class QuestionService
 * @description Xử lý logic nghiệp vụ cho module Câu hỏi.
 */
export class QuestionService implements IQuestionService {
  private readonly _questionRepo: IQuestionRepository;
  private readonly _mediaService: IMediaService;
  private readonly _cacheService: IMasterDataCacheService;

  constructor({ questionRepository, mediaService, masterDataCacheService }: IQuestionServiceCradle) {
    this._questionRepo = questionRepository;
    this._mediaService = mediaService;
    this._cacheService = masterDataCacheService;
  }

  /**
   * @description Tạo câu hỏi mới và xử lý tải lên hình ảnh đính kèm nếu có.
   * @param {CreateQuestionRequestDto} dto - Dữ liệu nội dung câu hỏi và thông tin file ảnh.
   * @returns {Promise<QuestionResponseDTO>} Thông tin chi tiết câu hỏi sau khi khởi tạo thành công.
   */
  public async createQuestion(dto: CreateQuestionRequestDto): Promise<QuestionResponseDTO> {

    // 1. Kiểm tra sự tồn tại của Chương và Hạng bằng lái (Cross-Service Validation)
    await this._validateRelations(dto.chapterId, dto.licenseCategoryIds);

    // 2. Upload ảnh chính của câu hỏi
    let questionImageUrl: string | null = null;
    if (dto.imageFile) {
      questionImageUrl = await this._mediaService.save(
        dto.imageFile,
        STORAGE_FOLDERS.QUESTION
      );
    }

    // 3. Upload song song ảnh của các đáp án
    const answersData = await Promise.all(
      dto.answers.map(async (ans) => ({
        content: ans.content,
        isCorrect: ans.isCorrect,
        // Dùng Ternary ngay tại đây để gán giá trị cho imageUrl
        imageUrl: ans.imageFile
          ? await this._mediaService.save(ans.imageFile, STORAGE_FOLDERS.ANSWER)
          : '',
      }))
    );

    // 4. Khởi tạo Entity (Reconstitute Entity)
    const questionEntity = Question.create({
      chapterId: dto.chapterId,
      content: dto.content,
      imageUrl: questionImageUrl || '',
      isCritical: dto.isCritical,
      indexNumber: dto.indexNumber,
      answers: answersData,
      licenseCategoryIds: dto.licenseCategoryIds,
      difficultyLevel: dto.difficultyLevel,
    });

    // 5. Lưu vào Database (Persistence)
    const savedEntity = await this._questionRepo.createQuestion(questionEntity);

    // 6. Trả về kết quả đã được ánh xạ (Return mapped response)
    return QuestionMapper.toResponse(savedEntity);
  }

  /**
   * @description Chuyển đổi dữ liệu Import thành câu hỏi chính thức và xử lý tải lên hình ảnh (Side effects).
   * @param {QuestionImportEntity} importEntity - Thực thể chứa dữ liệu câu hỏi từ tiến trình Import.
   * @returns {Promise<void>}
   */
  public async createFromImport(importEntity: QuestionImportEntity): Promise<void> {
    const props = importEntity.props;

    // 1. Upload ảnh chính của câu hỏi (Local Path -> URL)
    let questionImageUrl = '';
    if (props.questionImage) {
      questionImageUrl = await this._mediaService.save(
        props.questionImage,
        STORAGE_FOLDERS.QUESTION
      );
    }

    // 2. Upload ảnh các đáp án song song (Parallel Processing)
    const answersWithUrls = await Promise.all(
      props.answers.map(async (ans) => {
        let answerImageUrl = '';
        if (ans.image) {
          answerImageUrl = await this._mediaService.save(
            ans.image,
            STORAGE_FOLDERS.ANSWER
          );
        }
        return {
          content: ans.text,
          isCorrect: ans.isCorrect,
          imageUrl: answerImageUrl,
        };
      })
    );

    // 3. Khởi tạo thực thể Question CHÍNH THỨC (Domain Entity)
    // Lúc này data đã có URL thay vì Local Path
    const finalQuestion = Question.create({
      content: props.content,
      chapterId: props.chapterId,
      licenseCategoryIds: props.licenseCategoryIds,
      difficultyLevel: props.difficultyLevel,
      isCritical: props.isCritical,
      imageUrl: questionImageUrl,
      answers: answersWithUrls,
      indexNumber: props.indexNumber,
    });

    // 4. Persistence: Lưu vào DB
    // Repository sẽ chịu trách nhiệm DB Transaction cho cả Question và Answers
    await this._questionRepo.createQuestion(finalQuestion);
  }

  /**
   * @description Cập nhật thông tin câu hỏi theo tư duy hướng hành vi (Behavior-Oriented).
   * @param {string} id - ID của câu hỏi cần cập nhật.
   * @param {UpdateQuestionRequestDto} dto - Dữ liệu các trường cần thay đổi.
   * @returns {Promise<QuestionResponseDTO>} Thông tin câu hỏi sau khi cập nhật.
   */
  public async updateQuestion(id: string, dto: UpdateQuestionRequestDto): Promise<QuestionResponseDTO> {
    // 1. Tìm thực thể (Fetch Aggregate Root)
    const question = await this._questionRepo.findById(id);
    if (!question) throw new AppError(ErrorCode.QUESTION.NOT_FOUND);

    // 2. Validate ràng buộc (Security & Business Logic)
    // Đảm bảo các ID đáp án gửi lên thuộc về chính câu hỏi này
    this._validateAnswerOwnership(question.answers, dto.answers);
    await this._validateRelations(dto.chapterId, dto.licenseCategoryIds);

    // 3. Xử lý ảnh chính của câu hỏi
    // Ưu tiên: File mới > URL truyền lên (ảnh cũ) > Ảnh hiện tại trong DB
    const finalQuestionImageUrl = dto.imageFile
      ? await this._mediaService.save(dto.imageFile, STORAGE_FOLDERS.QUESTION)
      : (question.imageUrl || '');

    // Side effect: Xóa ảnh cũ trên storage nếu upload ảnh mới thành công
    if (dto.imageFile && question.imageUrl) {
      await this._mediaService.deleteFile(question.imageUrl);
    }

    // 4. Xử lý danh sách đáp án (Transform DTO to Entities)
    const updatedAnswerEntities = await Promise.all(
      dto.answers.map(async (ans) => {
        const oldAns = question.answers.find(a => a.id === ans.id);

        // Logic ảnh đáp án: File mới > URL cũ > Ảnh cũ trong DB > Rỗng
        const finalAnswerUrl = ans.imageFile
          ? await this._mediaService.save(ans.imageFile, STORAGE_FOLDERS.ANSWER)
          : (ans.imageUrl || oldAns?.imageUrl || '');

        // Xóa ảnh cũ của đáp án nếu thay bằng file mới
        if (ans.imageFile && oldAns?.imageUrl) {
          await this._mediaService.deleteFile(oldAns.imageUrl);
        }

        // Reconstitute lại từng Answer để đưa vào Aggregate
        return Answer.reconstitute({
          id: ans.id || crypto.randomUUID(), // Nếu là đáp án mới thêm lúc update thì sinh ID mới
          content: ans.content,
          isCorrect: ans.isCorrect,
          imageUrl: finalAnswerUrl,
          createdAt: oldAns?.createdAt || new Date(),
          updatedAt: new Date(),
        });
      })
    );

    // 5. THỰC THI NGHIỆP VỤ 
    question.update({
      chapterId: dto.chapterId,
      content: dto.content,
      imageUrl: finalQuestionImageUrl,
      isCritical: dto.isCritical,
      difficultyLevel: dto.difficultyLevel,
      indexNumber: dto.indexNumber,
      status: dto.status,
      answers: updatedAnswerEntities,
      licenseCategoryIds: dto.licenseCategoryIds,
    });

    // 6. Lưu trữ và Phản hồi
    const saved = await this._questionRepo.updateQuestion(id, question);
    return QuestionMapper.toResponse(saved);
  }

  /**
   * @description Truy vấn danh sách câu hỏi thuộc một chương cụ thể.
   * @param {string} chapterId - ID của chương cần lấy dữ liệu.
   * @returns {Promise<QuestionResponseDTO[]>} Danh sách câu hỏi đã được format.
   */
  public async getQuestionsByChapter(chapterId: string): Promise<QuestionResponseDTO[]> {
    const entities = await this._questionRepo.findByChapterId(chapterId);
    return QuestionMapper.toResponseList(entities);
  }

  /**
   * @description Lấy thông tin chi tiết của một câu hỏi theo ID.
   * @param {string} id - ID của câu hỏi cần truy vấn.
   * @returns {Promise<QuestionResponseDTO>} Dữ liệu chi tiết câu hỏi.
   * @throws {AppError} QUESTION.NOT_FOUND nếu không tìm thấy.
   */
  public async getQuestionById(id: string): Promise<QuestionResponseDTO> {
    const entity = await this._questionRepo.findById(id);
    if (!entity) throw new AppError(ErrorCode.QUESTION.NOT_FOUND);
    return QuestionMapper.toResponse(entity);
  } 

  /**
   * @description Lấy danh sách thông tin chi tiết các câu hỏi theo danh sách IDs.
   * @param {string[]} ids - Danh sách các ID câu hỏi cần truy vấn.
   * @returns {Promise<Question[]>} Danh sách thực thể câu hỏi.
   * @throws {AppError} QUESTION.NOT_FOUND nếu không tìm thấy đủ số lượng ID duy nhất được yêu cầu.
   */
  public async getQuestionsByIds(ids: string[]): Promise<Question[]> {
    // 1. Chặn trường hợp mảng rỗng
    if (!ids || ids.length === 0) return [];

    // 2. Xử lý logic trùng lặp ID (Lỗi logic 1)
    const uniqueIds = Array.from(new Set(ids));

    // 3. Gọi Repository lấy danh sách Entities dựa trên danh sách ID duy nhất
    const entities = await this._questionRepo.findByIds(uniqueIds);

    // 4. Kiểm tra tính toàn vẹn dựa trên UNIQUE IDs (Lỗi logic 1 - Fix)
    // Phải so sánh với uniqueIds.length thay vì ids.length gốc
    if (entities.length !== uniqueIds.length) {
      throw new AppError(ErrorCode.QUESTION.NOT_FOUND);
    }

    // 5. Đảm bảo thứ tự trả về khớp với mảng 'ids' ban đầu (Lỗi logic 2)
    // SQL 'IN' không bảo đảm thứ tự. Map này giúp sắp xếp lại đúng thứ tự ids truyền vào.
    const orderedEntities = ids.map(id => {
      const found = entities.find(entity => entity.id === id);
      return found!; 
    });

    return orderedEntities;
  }

  /**
   * @description Thực hiện xóa mềm (Soft Delete) câu hỏi khỏi hệ thống.
   * @param {string} id - ID của câu hỏi cần xóa.
   * @returns {Promise<void>}
   * @throws {AppError} QUESTION.NOT_FOUND nếu không tìm thấy.
   */
  public async deleteQuestion(id: string): Promise<void> {
    const question = await this._questionRepo.findById(id);
    if (!question) throw new AppError(ErrorCode.QUESTION.NOT_FOUND);

    question.delete();

    await this._questionRepo.delete(id);
  }

  /**
   * @description Khôi phục câu hỏi đã bị xóa mềm trở lại trạng thái hoạt động.
   * @param {string} id - ID của câu hỏi cần phục hồi.
   * @returns {Promise<QuestionResponseDTO>} Thông tin câu hỏi sau khi khôi phục.
   * @throws {AppError} QUESTION.NOT_FOUND nếu không tìm thấy hoặc câu hỏi chưa bị xóa.
   */
  public async restoreQuestion(id: string): Promise<QuestionResponseDTO> {
    const question = await this._questionRepo.findByIdSystem(id);
    if (!question) throw new AppError(ErrorCode.QUESTION.NOT_FOUND);
    if (!question.isDeleted()) {
      throw new AppError(ErrorCode.QUESTION.NOT_FOUND);
    }

    question.restore(); // Gán deletedAt = null
    const saved = await this._questionRepo.restore(id);
    return QuestionMapper.toResponse(saved);
  }

  /**
   * @description Lấy danh sách câu hỏi đã qua bộ lọc (Dịch: Get filtered paginated questions)
   * @param {QuestionsAdminQueryDto} query - DTO chứa tiêu chí lọc (Chapter, License, Difficulty...) và phân trang.
   * @returns {Promise<PaginatedResult<QuestionAdminResponseDTO>>} Trả về kết quả phân trang chứa DTO sạch.
   */
  public async getPaginatedQuestions(query: QuestionsAdminQueryDto): Promise<PaginatedResult<QuestionAdminResponseDTO>> {
    // 1. Chuẩn hóa thông số phân trang (Dịch: Pagination normalization)
    const page = Number(query.page) || PAGINATION_CONFIG.DEFAULT_PAGE;
    const limit = Math.min(
      Number(query.limit) || PAGINATION_CONFIG.DEFAULT_LIMIT,
      PAGINATION_CONFIG.MAX_LIMIT
    );

    // 2. Tính toán skip (Dịch: Skip calculation)
    // Logic tập trung tại Util để đảm bảo tính đồng nhất toàn hệ thống
    const skip = PaginationUtil.getSkip(page, limit);

    // 3. Truy vấn dữ liệu từ DB thông qua Question Repository
    const [questions, total] = await this._questionRepo.findAndCountAdmin(query, skip, limit);

    // 4. ÁNH XẠ DỮ LIỆU (Mapping): Chuyển mảng Domain Entity sang mảng Question Response DTO
    const questionResponses = questions.map((question) =>
      QuestionMapper.toAdminResponse(question)
    );

    // 5. Đóng gói kết quả cuối cùng kèm Metadata (Dịch: Encapsulate result with metadata)
    // Trả về định dạng: { success, data: { items, meta: { total, totalPages... } } }
    return PaginationUtil.createPaginatedResponse(questionResponses, total, page, limit);
  }

  /**
   * @description Kiểm tra sự tồn tại của Chương và các Hạng bằng lái.
   * @param {string} chapterId - ID chương cần check.
   * @param {string[]} licenseIds - Danh sách ID hạng bằng lái cần check.
   */
  private async _validateRelations(chapterId: string, licenseIds: string[]): Promise<void> {
    // 1. Kiểm tra Chương 
    const chapterExists = await this._cacheService.existsChapter(chapterId);
    if (!chapterExists) {
      throw new AppError(ErrorCode.CHAPTER.NOT_FOUND);
    }

    // 2. Kiểm tra danh sách Hạng bằng lái (Chạy song song để tiết kiệm thời gian)
    // licenseIds.map sẽ tạo ra một mảng các Promises
    const licenseChecks = licenseIds.map(lid => this._cacheService.existsCategory(lid));

    // Đợi tất cả các Promises hoàn thành cùng lúc
    const results = await Promise.all(licenseChecks);

    // 3. Nếu có bất kỳ kết quả nào là 'false', nghĩa là có ID không tồn tại
    if (results.some(exists => !exists)) {
      throw new AppError(ErrorCode.LICENSE.NOT_FOUND);
    }
  }

  /**
   * @description Kiểm tra tính hợp lệ và quyền sở hữu của danh sách đáp án truyền vào.
   * @param {Array<{ id?: string }>} existingAnswers - Danh sách đáp án hiện có trong Database.
   * @param {UpdateAnswerPayload[]} incomingAnswers - Danh sách đáp án mới cần cập nhật.
   * @throws {AppError} Ném lỗi nếu ID đáp án không thuộc về câu hỏi hiện tại.
   */
  private _validateAnswerOwnership(
    existingAnswers: Array<{ id?: string }>,
    incomingAnswers: UpdateAnswerPayload[]
  ): void {
    // Lấy danh sách ID hiện có trong DB của câu hỏi này
    const existingIds = existingAnswers.map(a => a.id).filter((id): id is string => !!id);

    // Lấy danh sách ID mà Admin gửi lên (những cái có ID là hàng cũ cần update)
    const incomingIds = incomingAnswers
      .map(a => a.id)
      .filter((id): id is string => typeof id === 'string');

    // Tìm xem có ID nào "lạ" không nằm trong danh sách cũ không
    const invalidIds = incomingIds.filter(id => !existingIds.includes(id));

    if (invalidIds.length > 0) {
      throw new AppError(ErrorCode.QUESTION.ANSWERS_SYNC_ERROR);
    }
  }
}