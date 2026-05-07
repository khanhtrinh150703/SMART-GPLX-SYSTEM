import { QuestionsAdminQueryDto } from "@/application/dtos/request/question/question-query.request.dto";
import { GetSelectionPoolDto } from "@/application/dtos/request/question/selection-question.request.dto";
import { IQuestionAdminResponseDTO } from "@/application/dtos/response/question/admin-question.respone.dto";
import { IExamQuestionSummaryResponseDTO } from "@/application/dtos/response/question/exam-question-summary.respone.dto";
import { IQuestionResponseDTO, } from "@/application/dtos/response/question/question.respone.dto";
import { Question } from "@/domain/entities/question/question.entity";
import { IQuestionRepository } from "@/domain/interfaces/repositories/exam-mgmt";
import { IMasterDataCacheService, IQuestionQueryService } from "@/domain/interfaces/services";
import { QuestionMapper } from "@/infrastructure/database/mappers";
import { PAGINATION_CONFIG } from "@/shared/config/pagination.config";
import { AppError, ErrorCode } from "@/shared/errors";
import { PaginatedResult } from "@/shared/types/pagination.types";
import { PaginationUtil } from "@/shared/utils/pagination.util";

/**
 * @interface IQuestionQueryServiceCradle
 * @description Tập hợp các phụ thuộc (Dependencies) cần thiết cho việc truy vấn dữ liệu Câu hỏi.
 */
export interface IQuestionQueryServiceCradle {
    /** @description Repository chuyên trách truy xuất ngân hàng câu hỏi và các phương án trả lời. */
    questionRepository: IQuestionRepository;

    /** @description Dịch vụ quản lý bộ nhớ đệm để tối ưu tốc độ tải danh sách câu hỏi theo bộ đề. */
    masterDataCacheService: IMasterDataCacheService;
}

/**
 * @class QuestionQueryService
 * @description Dịch vụ chuyên trách các tác vụ đọc dữ liệu (Read-side) liên quan đến ngân hàng câu hỏi.
 * @principle Performance & Scalability - Tối ưu hóa việc trả về DTO sạch và sử dụng Cache để giảm tải cho Database khi số lượng câu hỏi lớn.
 */
export class QuestionQueryService implements IQuestionQueryService {
    /** @private @readonly @description Instance truy xuất dữ liệu câu hỏi. */
    private readonly _questionRepo: IQuestionRepository;

    /** @private @readonly @description Dịch vụ quản lý cache Master Data. */
    private readonly _cacheService: IMasterDataCacheService;

    /**
     * @constructor
     * @description Khởi tạo QuestionQueryService thông qua cơ chế DI Proxy của Awilix.
     * @param {IQuestionQueryServiceCradle} cradle - Chứa các Repository và Service bổ trợ cần thiết.
     */
    constructor({ questionRepository, masterDataCacheService }: IQuestionQueryServiceCradle) {
        this._questionRepo = questionRepository;
        this._cacheService = masterDataCacheService;
    }

    /**
     * @description Truy vấn danh sách câu hỏi thuộc một chương cụ thể.
     * @param {string} chapterId - ID của chương cần lấy dữ liệu.
     * @returns {Promise<IQuestionResponseDTO[]>} Danh sách câu hỏi đã được format.
     */
    public async getQuestionsByChapter(chapterId: string): Promise<IQuestionResponseDTO[]> {
        const entities = await this._questionRepo.findByChapterId(chapterId);
        return QuestionMapper.toResponseList(entities);
    }

    /**
     * @description Lấy thông tin chi tiết của một câu hỏi theo ID.
     * @param {string} id - ID của câu hỏi cần truy vấn.
     * @returns {Promise<IQuestionResponseDTO>} Dữ liệu chi tiết câu hỏi.
     * @throws {AppError} VALIDATION.ID_REQUIRED - Khi định danh (ID) của lượt thi bị thiếu hoặc không hợp lệ trong yêu cầu.
     * @throws {AppError} QUESTION.NOT_FOUND nếu không tìm thấy.
     */
    public async getQuestionById(id: string): Promise<IQuestionResponseDTO> {
        if (!id) {
            throw new AppError(ErrorCode.VALIDATION.ID_REQUIRED);
        }
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
     * @description Lấy danh sách thông tin chi tiết các câu hỏi theo danh sách IDs.
     * @param {string[]} ids - Danh sách các ID câu hỏi cần truy vấn.
     * @returns {Promise<Question[]>} Danh sách thực thể câu hỏi.
     * @throws {AppError} QUESTION.NOT_FOUND nếu không tìm thấy đủ số lượng ID duy nhất được yêu cầu.
     */
    public async getByLicenseCategory(ids: string[]): Promise<Question[]> {
        // 1. Chặn trường hợp mảng rỗng
        if (!ids || ids.length === 0) return [];

        // 2. Xử lý logic trùng lặp ID (Lỗi logic 1)
        const uniqueIds = Array.from(new Set(ids));

        // 3. Gọi Repository lấy danh sách Entities dựa trên danh sách ID duy nhất
        const entities = await this._questionRepo.findByLicenseCategory(uniqueIds);

        // 4. Kiểm tra tính toàn vẹn dựa trên UNIQUE IDs (Lỗi logic 1 - Fix)
        // Phải so sánh với uniqueIds.length thay vì ids.length gốc
        if (entities.length === 0) {
            throw new AppError(ErrorCode.QUESTION.NOT_FOUND);
        }

        return entities;
    }

    /**
     * @description Lấy danh sách câu hỏi đã qua bộ lọc (Dịch: Get filtered paginated questions)
     * @param {QuestionsAdminQueryDto} query - DTO chứa tiêu chí lọc (Chapter, License, Difficulty...) và phân trang.
     * @returns {Promise<PaginatedResult<IQuestionAdminResponseDTO>>} Trả về kết quả phân trang chứa DTO sạch.
     */
    public async getPaginatedQuestions(query: QuestionsAdminQueryDto): Promise<PaginatedResult<IQuestionAdminResponseDTO>> {
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
     * @description Lấy danh sách tóm tắt câu hỏi thi (Get summary of exam questions)
     * @param filter Tiêu chí lọc danh sách (Filter criteria)
     * @returns Danh sách tóm tắt câu hỏi kèm chỉ mục chương (List of question summaries with chapter index)
     */
    public async getQuestionsSummary(filter: GetSelectionPoolDto): Promise<IExamQuestionSummaryResponseDTO[]> {
        // 1. Lấy danh sách câu hỏi thô từ Repo
        const questions = await this._questionRepo.findSelectionPool(filter);

        // 2. Sử dụng Cache (ví dụ: masterDataCacheService) để lấy orderIndex
        // Truyền callback lookup vào Mapper
        return QuestionMapper.toSummaryDTOList(questions, (chapterId) => {
            const chapter = this._cacheService.getChapterById(chapterId);
            return chapter?.orderIndex ?? 0;
        });
    }
}