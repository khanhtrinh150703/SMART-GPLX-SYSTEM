import { IQuestionRepository } from "@/domain/interfaces/repositories/exam-mgmt/i-question.repository";
import { QuestionMapper } from "@/infrastructure/database/mappers/exam-mgmt/question.mapper";
import { Question } from "@/domain/entities/question/question.entity";
import { AppError, ErrorCode } from "@/shared/errors";
import { IQuestionService } from "@/domain/interfaces/services/exam-mgmt/i-question.service";
import { STORAGE_FOLDERS } from "@/domain/constants/storage.constant";
import { IMediaService } from "@/domain/interfaces/services/integration/i-media.service";
import { IMasterDataCacheService } from "@/domain/interfaces/services/exam-mgmt/i-master-data-cache.service";
import { Answer } from "@/domain/entities/question/answer.entity";
import { QuestionImportEntity } from "@/domain/entities/import/import-question.entity";
import { IQuestionResponseDTO } from "@/application/dtos/response/question/question.respone.dto";
import { CreateQuestionRequestDTO } from "@/application/dtos/request/question/create-question.request.dto";
import { IUpdateAnswerPayload, UpdateQuestionRequestDTO } from "@/application/dtos/request/question/update-question.request.dto";
import { IDeleteResponseDTO, DeleteResponseDTO } from "@/application/dtos/response/shared/delete.response.dto";
import { DeleteType } from "@/domain/constants/delete.constant";

/**
 * @interface IQuestionServiceCradle
 * @description Tập hợp các phụ thuộc (Dependencies) cần thiết để quản lý nghiệp vụ Câu hỏi.
 */
export interface IQuestionServiceCradle {
  /** @description Repository chịu trách nhiệm lưu trữ và thay đổi dữ liệu câu hỏi trong Database. */
  questionRepository: IQuestionRepository;

  /** @description Dịch vụ xử lý tài nguyên đa phương tiện (Hình ảnh biển báo, video sa hình). */
  mediaService: IMediaService;

  /** @description Dịch vụ quản lý bộ nhớ đệm (Dùng để đồng bộ lại danh sách câu hỏi sau khi cập nhật). */
  masterDataCacheService: IMasterDataCacheService;
}

/**
 * @class QuestionService
 * @description Dịch vụ điều phối (Write-side) các logic nghiệp vụ liên quan đến Ngân hàng câu hỏi.
 * @principle Resource Integrity - Đảm bảo sự đồng bộ giữa dữ liệu câu hỏi và tệp tin đa phương tiện đính kèm.
 */
export class QuestionService implements IQuestionService {
  /** @private @readonly @description Instance thực hiện các thao tác ghi dữ liệu Câu hỏi. */
  private readonly _questionRepo: IQuestionRepository;

  /** @private @readonly @description Dịch vụ quản lý tệp tin (Upload/Delete media). */
  private readonly _mediaService: IMediaService;

  /** @private @readonly @description Dịch vụ xử lý làm mới bộ nhớ đệm Master Data. */
  private readonly _cacheService: IMasterDataCacheService;

  /**
   * @constructor
   * @description Khởi tạo QuestionService với các công cụ quản lý nội dung và tài nguyên.
   * @param {IQuestionServiceCradle} cradle - Chứa các phụ thuộc phục vụ luồng nghiệp vụ ghi và xử lý Media.
   */
  constructor({ questionRepository, mediaService, masterDataCacheService }: IQuestionServiceCradle) {
    this._questionRepo = questionRepository;
    this._mediaService = mediaService;
    this._cacheService = masterDataCacheService;
  }

  /**
   * @description Tạo câu hỏi mới và xử lý tải lên hình ảnh đính kèm nếu có.
   * @param {CreateQuestionRequestDTO} dto - Dữ liệu nội dung câu hỏi và thông tin file ảnh.
   * @returns {Promise<IQuestionResponseDTO>} Thông tin chi tiết câu hỏi sau khi khởi tạo thành công.
   */
  public async createQuestion(dto: CreateQuestionRequestDTO): Promise<IQuestionResponseDTO> {

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
   * @param {UpdateQuestionRequestDTO} dto - Dữ liệu các trường cần thay đổi.
   * @returns {Promise<IQuestionResponseDTO>} Thông tin câu hỏi sau khi cập nhật.
   * @throws {AppError} QUESTION.NOT_FOUND - Khi không tìm thấy câu hỏi yêu cầu trong ngân hàng dữ liệu. (Question not found).
   */
  public async updateQuestion(id: string, dto: UpdateQuestionRequestDTO): Promise<IQuestionResponseDTO> {
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
    const saved = await this._questionRepo.updateQuestion(question);
    return QuestionMapper.toResponse(saved);
  }

  /**
   * @description Thực hiện chiến lược "Xóa thông minh" (Smart Delete) cho câu hỏi.
   * @param {string} id - ID của câu hỏi cần xóa. (The ID of the question to be deleted.)
   * @returns {Promise<IDeleteResponseDTO>} Kết quả thao tác xóa kèm thông báo chuẩn hóa.
   * @throws {AppError} QUESTION.NOT_FOUND nếu không tìm thấy câu hỏi.
   */
  public async deleteQuestion(id: string): Promise<IDeleteResponseDTO> {
    // 1. Kiểm tra tồn tại (Ném lỗi 404 nếu không tìm thấy)
    // (Check existence - Throws 404 if not found)
    const question = await this._questionRepo.findById(id);
    if (!question) {
      throw new AppError(ErrorCode.QUESTION.NOT_FOUND);
    }

    // 2. Thống kê ràng buộc (Câu hỏi đã nằm trong đề thi hoặc có lịch sử làm bài)
    // (Statistics of constraints - Question in exams or has attempt history)
    const related = await this._questionRepo.countRelatedData(id);

    // Giả sử các ràng buộc gồm: chi tiết ma trận đề và câu trả lời của người dùng
    const totalRelated = related.chapter + related.examQuestions + related.licenseLinks;
    let type: DeleteType;

    // 3. Quyết định hướng xử lý (Decision logic)
    if (totalRelated > 0) {
      // TRƯỜNG HỢP 1: CÓ RÀNG BUỘC -> XÓA MỀM (Case 1: Has constraints -> Soft Delete)
      question.delete(); // Cập nhật trạng thái xóa trong Entity (Domain Logic)
      await this._questionRepo.softDelete(id);
      type = DeleteType.SOFT;
    } else {
      // TRƯỜNG HỢP 2: DỮ LIỆU SẠCH -> XÓA VĨNH VIỄN (Case 2: Clean data -> Hard Delete)
      await this._questionRepo.hardDelete(id);
      type = DeleteType.HARD;
    }

    // 4. Đồng bộ Cache nếu cần thiết (Sync cache if necessary)
    await this._cacheService.refresh();

    // 5. Trả về DTO - Tận dụng Class để tự động tạo message
    // (Return DTO - Utilize Class for automated message generation)
    return new DeleteResponseDTO({
      id,
      type,
      count: totalRelated
    });
  }

  /**
   * @description Khôi phục câu hỏi đã bị xóa mềm trở lại trạng thái hoạt động.
   * @param {string} id - ID của câu hỏi cần phục hồi.
   * @returns {Promise<IQuestionResponseDTO>} Thông tin câu hỏi sau khi khôi phục.
   * @throws {AppError} QUESTION.NOT_FOUND nếu không tìm thấy hoặc câu hỏi chưa bị xóa.
   */
  public async restoreQuestion(id: string): Promise<IQuestionResponseDTO> {
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
   * @description Xác thực hàng loạt danh sách câu hỏi.
   * "Ensuring bulk referential integrity by comparing counts"
   */
  public async validateExistence(ids: string[]): Promise<void> {
    if (!ids || ids.length === 0) return;

    // Loại bỏ các ID trùng lặp trước khi đếm (nếu có)
    const uniqueIds = [...new Set(ids)];

    // Gọi Repo để đếm số lượng bản ghi thực tế tồn tại trong DB (và chưa bị xóa)
    const count = await this._questionRepo.countActiveByIds(uniqueIds);

    if (count !== uniqueIds.length) {
      // "Inconsistency detected: Some IDs provided do not match active records in DB"
      throw new AppError(
        ErrorCode.EXAM.QUESTION_DATA_INVALID,
      );
    }
  }

  /**
   * @description Kiểm tra sự tồn tại của Chương và các Hạng bằng lái.
   * @param {string} chapterId - ID chương cần check.
   * @param {string[]} licenseIds - Danh sách ID hạng bằng lái cần check.
   * @throws {AppError} CHAPTER.NOT_FOUND - Khi không tìm thấy thông tin chương lý thuyết yêu cầu trong hệ thống.
   * @throws {AppError} LICENSE.NOT_FOUND - Khi hạng bằng lái hoặc thông tin giấy phép không tồn tại trong cơ sở dữ liệu. 
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
   * @param {IUpdateAnswerPayload[]} incomingAnswers - Danh sách đáp án mới cần cập nhật.
   * @throws {AppError} Ném lỗi nếu ID đáp án không thuộc về câu hỏi hiện tại.
   * @throws {AppError} QUESTION.ANSWERS_SYNC_ERROR - Lỗi xảy ra khi dữ liệu các phương án trả lời không đồng bộ được với câu hỏi chính trong cơ sở dữ liệu. 
   */
  private _validateAnswerOwnership(
    existingAnswers: { id: string }[],
    incomingAnswers: IUpdateAnswerPayload[]
  ): void {
    // 1. Chuyển danh sách ID hiện có vào Set để tìm kiếm cực nhanh
    // "Using a Set for O(1) lookup performance"
    const existingIds = new Set(existingAnswers.map(ans => ans.id));

    // 2. Lọc ra các ID từ Payload gửi lên (chỉ lấy những cái đã có ID - tức là hàng cũ cần update)
    // "Filtering incoming IDs to identify which ones are being updated"
    const invalidIds = incomingAnswers
      .map(ans => ans.id)
      .filter((id): id is string => !!id) // Type Guard để loại bỏ undefined/null và giữ kiểu string
      .filter(id => !existingIds.has(id)); // Tìm những ID không tồn tại trong Set của DB

    // 3. Nếu phát hiện ID "lạ", tung lỗi ngay lập tức
    // "Throwing a sync error if foreign IDs are detected"
    if (invalidIds.length > 0) {
      throw new AppError(ErrorCode.QUESTION.ANSWERS_SYNC_FAILED);
    }
  }
}