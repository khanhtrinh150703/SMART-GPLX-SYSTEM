import { ChapterQueryDTO } from "@/application/dtos/request/chapter/chapter-query.request.dto";
import { IChapterResponseDTO } from "@/application/dtos/response/chapter/chapter.respone.dto";
import { Chapter } from "@/domain/entities/chapter/chapter.entity";
import { IChapterRepository } from "@/domain/interfaces/repositories/exam-mgmt";
import { IChapterQueryService, IMasterDataCacheService } from "@/domain/interfaces/services/exam-mgmt";
import { ChapterMapper } from "@/infrastructure/database/mappers";
import { PAGINATION_CONFIG } from "@/shared/config/pagination.config";
import { AppError } from "@/shared/errors/error-app";
import { ErrorCode } from "@/shared/errors/error-codes";
import { ISelectionResponseDTO } from "@/application/dtos/response/shared/selection.response.dto";
import { PaginatedResult } from "@/shared/types/pagination.types";
import { PaginationUtil } from "@/shared/utils/pagination.util";

/**
 * @interface IChapterQueryServiceCradle
 * @description Tập hợp các phụ thuộc (Dependencies) dành riêng cho việc truy vấn dữ liệu Chương.
 */
export interface IChapterQueryServiceCradle {
    /** @description Repository thực hiện các truy vấn dữ liệu Chương từ Database. */
    chapterRepository: IChapterRepository;

    /** @description Dịch vụ quản lý bộ nhớ đệm để tăng tốc độ truy xuất dữ liệu danh mục Chương. */
    masterDataCacheService: IMasterDataCacheService;
}

/**
 * @class ChapterQueryService
 * @description Dịch vụ chuyên trách các thao tác đọc dữ liệu (Read-side) liên quan đến các Chương học/thi.
 * @principle Performance Optimization - Ưu tiên truy xuất từ Cache để giảm tải cho Database.
 */
export class ChapterQueryService implements IChapterQueryService {
    /** @private @readonly @description Instance truy xuất dữ liệu Chapter. */
    private readonly _chapterRepo: IChapterRepository;

    /** @private @readonly @description Dịch vụ quản lý bộ nhớ đệm hệ thống. */
    private readonly _cacheService: IMasterDataCacheService;

    /**
     * @constructor
     * @description Khởi tạo Service với các phụ thuộc được tiêm qua cơ chế DI.
     * @param {IChapterQueryServiceCradle} cradle - Chứa instance của Repository và Service Cache.
     */
    constructor({ chapterRepository, masterDataCacheService }: IChapterQueryServiceCradle) {
        this._chapterRepo = chapterRepository;
        this._cacheService = masterDataCacheService;
    }

    /**
     * @description Lấy danh sách các chương được định dạng cho Selection/Dropdown (Dịch: Fetch chapter list formatted for selection inputs)
     * @returns {Promise<ISelectionResponseDTO[]>} - Danh sách các object thường có dạng { id, name } hoặc { value, label }.
     */
    public async getChapterSelections(): Promise<ISelectionResponseDTO[]> {
        const chapters = await this._cacheService.getAllChapters();
        return ChapterMapper.toSelectionList(chapters);
    }

    /**
     * @description Lấy danh sách chương bài học đã qua bộ lọc (tìm kiếm/trạng thái) và ánh xạ sang DTO sạch.
     * @param {ChapterQueryDTO} query - DTO chứa các tiêu chí lọc và thông số phân trang từ Request.
     * @returns {Promise<PaginatedResult<IChapterResponseDTO>>} Trả về DTO thay vì Entity để đảm bảo tính đóng gói.
     */
    public async getPaginatedChapters(query: ChapterQueryDTO): Promise<PaginatedResult<IChapterResponseDTO>> {
        // 1. Chuẩn hóa thông số phân trang (đảm bảo luôn là số dương)
        const page = Number(query.page) || PAGINATION_CONFIG.DEFAULT_PAGE;
        const limit = Math.min(
            Number(query.limit) || PAGINATION_CONFIG.DEFAULT_LIMIT,
            PAGINATION_CONFIG.MAX_LIMIT
        );
        // 2. Tính toán skip cho Repository (Logic phân trang tập trung tại Util)
        const skip = PaginationUtil.getSkip(page, limit);

        // 3. Truy vấn dữ liệu từ DB thông qua Chapter Repository
        // Nhận về Tuple [Entity[], total] để phục vụ tính toán Metadata
        const [chapters, total] = await this._chapterRepo.findAndCount(query, skip, limit);

        // 4. ÁNH XẠ DỮ LIỆU (Mapping): Chuyển mảng Domain Entity sang mảng Chapter Response DTO
        // Sử dụng ChapterMapper để lọc bỏ các trường nhạy cảm hoặc không cần thiết
        const chapterResponses = chapters.map(chapter => ChapterMapper.toResponse(chapter));

        // 5. Đóng gói kết quả cuối cùng kèm Metadata phân trang (total, page, limit, totalPages, hooks...)
        return PaginationUtil.createPaginatedResponse(chapterResponses, total, page, limit);
    }

    /**
     * @description Lấy thông tin chi tiết một chương theo ID và trả về DTO.
     * @param {string} id - ID định danh chương.
     * @returns {Promise<IChapterResponseDTO>}
     */
    public async getChapterById(id: string): Promise<IChapterResponseDTO> {
        const chapter = await this._getChapterEntityOrThrow(id);
        return ChapterMapper.toResponse(chapter);
    }

    /**
     * @description Hàm trợ giúp nội bộ để lấy Entity hoặc ném lỗi (Tránh lặp code).
     * @private
     * @param {string} id - ID của chương cần khôi phục.
     * @returns {Promise<Chapter>}
     * @throws {AppError} VALIDATION.ID_REQUIRED - Khi định danh (ID) của lượt thi bị thiếu hoặc không hợp lệ trong yêu cầu.
     * @throws {AppError} CHAPTER.NOT_FOUND - Khi không tìm thấy thông tin chương lý thuyết trong cơ sở dữ liệu. (Chapter not found).
     */
    private async _getChapterEntityOrThrow(id: string): Promise<Chapter> {
        if (!id) {
            throw new AppError(ErrorCode.VALIDATION.ID_REQUIRED);
        }
        const chapter = await this._chapterRepo.findById(id);
        if (!chapter) {
            throw new AppError(ErrorCode.CHAPTER.NOT_FOUND);
        }
        return chapter;
    }
}