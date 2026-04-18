import { IQuestionRepository } from "@/domain/interfaces/repositories/i-question.repository";
import { CreateQuestionRequestDto } from "../dtos/request/question/create-question.request.dto";
import { QuestionMapper } from "@/infrastructure/database/mappers/question.mapper";
import { Question } from "@/domain/entities/question/question.entity";
import { AppError, ErrorCode } from "@/shared/errors";
import { UpdateAnswerPayload, UpdateQuestionRequestDto } from "../dtos/request/question/update-question.request.dto";
import { IQuestionService } from "@/domain/interfaces/services/i-question.service";
import { QuestionResponseDTO } from "../dtos/response/question/question.respone.dto";
import { IChapterService } from "@/domain/interfaces/services/i-chapter.service";
import { ILicenseCategoryService } from "@/domain/interfaces/services/i-license-category.service";
import { IFileStorageService } from "@/domain/interfaces/external/i-file-storage.service";
import { STORAGE_FOLDERS } from "@/domain/constants/storage.constant";
import { PaginatedResult } from "@/shared/types/pagination.types";
import { QuestionsAdminQueryDto } from "../dtos/request/question/question-query.request.dto";
import { PaginationUtil } from "@/shared/utils/pagination.util";
import { QuestionAdminResponseDTO } from "../dtos/response/question/admin-question.respone.dto";
import { ImportQuestionCommand } from "../dtos/request/question/import-question.command";

export interface IQuestionServiceCradle {
  questionRepository: IQuestionRepository;
  chapterService: IChapterService;
  licenseCategoryService: ILicenseCategoryService;
  fileStorageService: IFileStorageService;
}

/**
 * @class QuestionService
 * @description Xử lý logic nghiệp vụ cho module Câu hỏi.
 */
export class QuestionService implements IQuestionService {
  private readonly _questionRepo: IQuestionRepository;
  private readonly _licenseService: ILicenseCategoryService;
  private readonly _chapterService: IChapterService;
  private readonly _fileStorageService: IFileStorageService;


  constructor({ questionRepository, chapterService, licenseCategoryService, fileStorageService }: IQuestionServiceCradle) {
    this._questionRepo = questionRepository;
    this._chapterService = chapterService;
    this._licenseService = licenseCategoryService;
    this._fileStorageService = fileStorageService;
  }

  /**
   * @description Tạo câu hỏi mới kèm theo xử lý upload ảnh (Create question with file uploads)
   */
  public async createQuestion(dto: CreateQuestionRequestDto): Promise<QuestionResponseDTO> {

    // 1. Kiểm tra sự tồn tại của Chương và Hạng bằng lái (Cross-Service Validation)
    await this._validateRelations(dto.chapterId, dto.licenseCategoryIds);

    // 2. Upload ảnh chính của câu hỏi (Upload main question image)
    let questionImageUrl: string | null = null;
    if (dto.imageFile) {
      questionImageUrl = await this._fileStorageService.saveFile(
        dto.imageFile,
        STORAGE_FOLDERS.QUESTION // Tránh dùng magic string (Avoid magic strings)
      );
    }

    // 3. Upload song song ảnh của các đáp án (Parallel upload for answer images)
    const answersWithUrls = await Promise.all(
      dto.answers.map(async (ans) => {
        let answerUrl: string | null = null;

        // Nhờ DTO mapping, ta biết chắc chắn đáp án này có ảnh hay không
        // (Thanks to DTO mapping, we safely check if this answer has a physical file attached)
        if (ans.imageFile) {
          answerUrl = await this._fileStorageService.saveFile(
            ans.imageFile,
            STORAGE_FOLDERS.ANSWER
          );
        }

        return {
          content: ans.content,
          isCorrect: ans.isCorrect,
          imageUrl: answerUrl, // URL bền vững sau khi upload (Persistent URL)
          deletedAt: null
        };
      })
    );

    // 4. Khởi tạo Entity (Reconstitute Entity)
    const questionEntity = Question.reconstitute({
      chapterId: dto.chapterId,
      content: dto.content,
      imageUrl: questionImageUrl,
      isCritical: dto.isCritical,
      answers: answersWithUrls,
      licenseCategoryIds: dto.licenseCategoryIds,
      difficultyLevel: dto.difficultyLevel,
      status: dto.status,
      deletedAt: null
    });

    // 5. Lưu vào Database (Persistence)
    const savedEntity = await this._questionRepo.create(questionEntity);

    // 6. Trả về kết quả đã được ánh xạ (Return mapped response)
    return QuestionMapper.toResponse(savedEntity);
  }

  /**
   * @description Tạo câu hỏi từ tiến trình Import (Create question from Import process)
   * Hàm này xử lý ảnh từ đường dẫn vật lý (local path) thay vì bộ đệm Multer (Multer buffer).
   */
  public async createFromImport(cmd: ImportQuestionCommand): Promise<void> {

    // 1. Không gọi _validateRelations ở đây nữa (No relation validation here)
    // Lý do: Các ID này đã được MasterDataCacheService tra cứu và đảm bảo tồn tại 100% 
    // từ lúc ở ImportProcessorService rồi. Việc query lại DB là tốn tài nguyên vô ích.

    // 2. Upload ảnh chính của câu hỏi từ file giải nén (Upload main question image from extracted local file)
    let questionImageUrl: string | null = null;
    if (cmd.imageLocalPath) {
      questionImageUrl = await this._fileStorageService.saveFromLocalPath(
        cmd.imageLocalPath,
        STORAGE_FOLDERS.QUESTION
      );
    }

    // 3. Upload song song ảnh của các đáp án (Parallel upload for answer images)
    const answersWithUrls = await Promise.all(
      cmd.answers.map(async (ans) => {
        let answerUrl: string | null = null;

        // Xử lý ảnh từ đường dẫn local (Process image from local path)
        if (ans.imageLocalPath) {
          answerUrl = await this._fileStorageService.saveFromLocalPath(
            ans.imageLocalPath,
            STORAGE_FOLDERS.ANSWER
          );
        }

        return {
          content: ans.content,
          isCorrect: ans.isCorrect,
          imageUrl: answerUrl, // URL bền vững sau khi upload (Persistent URL)
          deletedAt: null
        };
      })
    );

    // 4. Khởi tạo Entity (Reconstitute Entity)
    const questionEntity = Question.reconstitute({
      chapterId: cmd.chapterId,
      content: cmd.content,
      imageUrl: questionImageUrl,
      isCritical: cmd.isCritical,
      answers: answersWithUrls,
      licenseCategoryIds: cmd.categoryId,
      difficultyLevel: cmd.difficultyLevel,
      status: 'ACTIVE', 
      deletedAt: null
    });

    // 5. Lưu vào Database (Persistence)
    await this._questionRepo.create(questionEntity);

    // 6. Không cần return (No return needed)
    // Trong luồng Worker Import, ta không cần trả về QuestionResponseDTO để gửi cho Frontend.
    // Việc trả về void giúp tiết kiệm bộ nhớ (RAM) khi chạy vòng lặp hàng nghìn câu.
  }

  /**
   * @description [PUT] Cập nhật câu hỏi (Dịch: Update question with 100% type-safety)
   */
  public async updateQuestion(id: string, dto: UpdateQuestionRequestDto): Promise<QuestionResponseDTO> {
    // 1. Kiểm tra tồn tại (Dịch: Existence check)
    const existing = await this._questionRepo.findById(id);
    if (!existing) throw new AppError(ErrorCode.QUESTION.NOT_FOUND);

    // 2. Kiểm tra quyền sở hữu đáp án (Dịch: Answer ownership validation)
    // Chặn đứng hành động gửi ID đáp án của câu hỏi khác vào đây
    this._validateAnswerOwnership(existing.props.answers, dto.answers);

    // 3. Cross-Service Validation (Chapter & License)
    await this._validateRelations(dto.chapterId, dto.licenseCategoryIds);

    // 4. Xử lý ảnh chính của câu hỏi (Dịch: Main image handling)
    let finalQuestionImageUrl = existing.props.imageUrl; // Mặc định giữ ảnh cũ

    if (dto.imageFile) {
      // Nếu có file mới: Upload cái mới và xóa cái cũ
      finalQuestionImageUrl = await this._fileStorageService.saveFile(dto.imageFile, STORAGE_FOLDERS.QUESTION);
      if (existing.props.imageUrl) {
        await this._fileStorageService.deleteFile(existing.props.imageUrl);
      }
    }

    // 5. Xử lý ảnh của từng đáp án (Dịch: Smart answers image processing)
    const updatedAnswers = await Promise.all(
      dto.answers.map(async (ans) => {
        // Dùng URL cũ từ payload (Nếu Admin không đổi ảnh thì payload vẫn gửi lại URL cũ)
        let finalAnswerUrl = ans.imageUrl ?? null;

        if (ans.imageFile) {
          // Nếu đáp án có upload file mới thông qua imageIndex
          finalAnswerUrl = await this._fileStorageService.saveFile(ans.imageFile, STORAGE_FOLDERS.ANSWER);

          // Xóa ảnh cũ của đáp án này nếu nó đã tồn tại trước đó
          const oldAnswer = existing.props.answers.find(a => a.id === ans.id);
          if (oldAnswer?.imageUrl) {
            await this._fileStorageService.deleteFile(oldAnswer.imageUrl);
          }
        }

        return {
          id: ans.id, // Giữ ID để Repository thực hiện Upsert
          content: ans.content,
          isCorrect: ans.isCorrect,
          imageUrl: finalAnswerUrl,
          deletedAt: null
        };
      })
    );

    // 6. Tái tạo Entity và Lưu (Dịch: Reconstitute and Persistence)
    const updatedEntity = Question.reconstitute({
      id: id,
      chapterId: dto.chapterId,
      content: dto.content,
      imageUrl: finalQuestionImageUrl,
      isCritical: dto.isCritical,
      answers: updatedAnswers,
      licenseCategoryIds: dto.licenseCategoryIds,
      difficultyLevel: dto.difficultyLevel,
      status: dto.status,
      deletedAt: existing.props.deletedAt, // Giữ nguyên trạng thái xóa
    });

    const saved = await this._questionRepo.update(id, updatedEntity);

    // 7. Mapping kết quả trả về
    return QuestionMapper.toResponse(saved);
  }

  /**
   * @description Helper kiểm tra ID đáp án (Dịch: Answer ID synchronization helper)
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

  /**
   * @description Lấy danh sách câu hỏi theo ID chương.
   */
  public async getQuestionsByChapter(chapterId: string): Promise<QuestionResponseDTO[]> {
    const entities = await this._questionRepo.findByChapterId(chapterId);
    return QuestionMapper.toResponseList(entities);
  }

  /**
   * @description Lấy chi tiết một câu hỏi.
   */
  public async getQuestionById(id: string): Promise<QuestionResponseDTO> {
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

  /**
   * @description Lấy danh sách câu hỏi đã qua bộ lọc (Dịch: Get filtered paginated questions)
   * @param {QuestionsAdminQueryDto} query - DTO chứa tiêu chí lọc (Chapter, License, Difficulty...) và phân trang.
   * @returns {Promise<PaginatedResult<QuestionAdminResponseDTO>>} Trả về kết quả phân trang chứa DTO sạch.
   */
  public async getPaginatedQuestions(query: QuestionsAdminQueryDto): Promise<PaginatedResult<QuestionAdminResponseDTO>> {
    // 1. Chuẩn hóa thông số phân trang (Dịch: Pagination normalization)
    // Đảm bảo page và limit luôn là số hợp lệ trước khi tính toán
    const page = Number(query.page) || 1;
    const limit = Number(query.limit) || 10;

    // 2. Tính toán skip (Dịch: Skip calculation)
    // Logic tập trung tại Util để đảm bảo tính đồng nhất toàn hệ thống
    const skip = PaginationUtil.getSkip(page, limit);

    // 3. Truy vấn dữ liệu từ DB thông qua Question Repository (Dịch: DB Query via Repository)
    // Repository trả về Tuple [Entity[], total] - Đây là kết quả từ hàm findAndCountAdmin chúng ta đã viết
    const [questions, total] = await this._questionRepo.findAndCountAdmin(query, skip, limit);

    // 4. ÁNH XẠ DỮ LIỆU (Mapping): Chuyển mảng Domain Entity sang mảng Question Response DTO
    // Dịch: Map domain entities to response DTOs for data encapsulation
    // Bước này cực kỳ quan trọng để ẩn các field nhạy cảm (như deletedAt) và làm phẳng dữ liệu (flattening)
    const questionResponses = questions.map((question) =>
      QuestionMapper.toAdminResponse(question)
    );

    // 5. Đóng gói kết quả cuối cùng kèm Metadata (Dịch: Encapsulate result with metadata)
    // Trả về định dạng: { success, data: { items, meta: { total, totalPages... } } }
    return PaginationUtil.createPaginatedResponse(questionResponses, total, page, limit);
  }
}