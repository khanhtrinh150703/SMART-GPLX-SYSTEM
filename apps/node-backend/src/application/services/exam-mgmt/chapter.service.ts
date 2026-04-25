import { IChapterRepository } from "@/domain/interfaces/repositories/exam-mgmt/i-chapter.repository";
import { ErrorCode } from "@/shared/errors/error-codes";
import { Chapter } from "@/domain/entities/chapter/chapter.entity";
import { IChapterService } from "@/domain/interfaces/services/exam-mgmt/i-chapter.service";
import { AppError } from "@/shared/errors/error-app";
import { ChapterMapper } from "@/infrastructure/database/mappers/exam-mgmt/chapter.mapper";
import { PaginatedResult } from "@/shared/types/pagination.types";
import { PaginationUtil } from "@/shared/utils/pagination.util";
import { SelectionResponseDto } from "@/shared/responses/selection-response.dto";
import { IMasterDataCacheService } from "@/domain/interfaces/services/exam-mgmt/i-master-data-cache.service";
import { PAGINATION_CONFIG } from "@/shared/config/pagination.config";
import { DeleteResponse, DeleteType } from "@/domain/constants/delete.constant";
import { ChapterQueryDTO } from "@/application/dtos/request/chapter/chapter-query.request.dto";
import { CreateChapterRequestDTO } from "@/application/dtos/request/chapter/create-chapter.request.dto";
import { UpdateChapterRequestDTO } from "@/application/dtos/request/chapter/update-chapter.request.dto";
import { ChapterResponseDTO } from "@/application/dtos/response/chapter/chapter.respone.dto";
import { CreateChapterValidator } from "@/application/validators/chapter/create-chatper.validator";
import { UpdateChapterValidator } from "@/application/validators/chapter/update-chapter.validator";

/**
 * @interface IChapterServiceCradle
 * @description Các mảnh ghép (dependencies) dành riêng cho ChapterService.
 * Giúp TypeScript canh gác chặt chẽ, không cho các Repo "đi lạc" vào đây.
 */
export interface IChapterServiceCradle {
  chapterRepository: IChapterRepository;
  masterDataCacheService: IMasterDataCacheService;
}

/**
 * @class ChapterService
 * @description Xử lý logic nghiệp vụ cho các Chương lý thuyết lái xe.
 */
export class ChapterService implements IChapterService {
  private readonly _chapterRepo: IChapterRepository;
  private readonly _cacheService: IMasterDataCacheService;


  /**
   * @description Khởi tạo Service với túi đồ nghề chuyên dụng.
   * @param {IChapterServiceCradle} cradle - Chỉ bao gồm những gì cần thiết để quản lý Chapter.
   */
  constructor({ chapterRepository, masterDataCacheService }: IChapterServiceCradle) {
    this._chapterRepo = chapterRepository;
    this._cacheService = masterDataCacheService;
  }

  /**
   * @description Lấy danh sách các chương được định dạng cho Selection/Dropdown (Dịch: Fetch chapter list formatted for selection inputs)
   * @returns {Promise<SelectionResponseDto[]>} - Danh sách các object thường có dạng { id, name } hoặc { value, label }.
   */
  public async getChapterSelections(): Promise<SelectionResponseDto[]> {
    const chapters = await this._chapterRepo.findAll();
    return ChapterMapper.toSelectionList(chapters);
  }

  /**
   * @description Lấy danh sách chương bài học đã qua bộ lọc (tìm kiếm/trạng thái) và ánh xạ sang DTO sạch.
   * @param {ChapterQueryDTO} query - DTO chứa các tiêu chí lọc và thông số phân trang từ Request.
   * @returns {Promise<PaginatedResult<ChapterResponseDTO>>} Trả về DTO thay vì Entity để đảm bảo tính đóng gói.
   */
  public async getPaginatedChapters(query: ChapterQueryDTO): Promise<PaginatedResult<ChapterResponseDTO>> {
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
   * @returns {Promise<ChapterResponseDTO>}
   */
  public async getChapterById(id: string): Promise<ChapterResponseDTO> {
    const chapter = await this._getChapterEntityOrThrow(id);
    return ChapterMapper.toResponse(chapter);
  }

  /**
   * @description Khởi tạo chương mới và trả về thông tin chương vừa tạo (DTO).
   * @param {CreateChapterRequestDTO} dto - Dữ liệu khởi tạo chương.
   * @returns {Promise<ChapterResponseDTO>}
   */
  public async createChapter(dto: CreateChapterRequestDTO): Promise<ChapterResponseDTO> {
    CreateChapterValidator.validate(dto);
    // 1. Kiểm tra trùng tên (Dịch: Check duplicate name)
    const existingName = await this._chapterRepo.findByName(dto.name.trim());
    if (existingName) {
      throw new AppError(ErrorCode.CHAPTER.NAME_ALREADY_EXISTS);
    }

    // 2. QUAN TRỌNG: Kiểm tra trùng mã chương (Dịch: Check duplicate code)
    // Đây là "điểm neo" cho import nên tuyệt đối không được trùng
    const existingCode = await this._chapterRepo.findByCode(dto.code.trim());
    if (existingCode) {
      throw new AppError(ErrorCode.CHAPTER.CODE_ALREADY_EXISTS);
    }

    // 3. Khởi tạo Entity 
    const newChapter = Chapter.create({
      name: dto.name.trim(),
      code: dto.code.trim(),
      description: dto.description?.trim() || null,
      orderIndex: dto.orderIndex ?? 0,
    });

    // 4. Lưu vào DB và trả về DTO
    await this._chapterRepo.createChapter(newChapter);
    this._cacheService.refresh();

    return ChapterMapper.toResponse(newChapter);
  }

  /**
   * @description Cập nhật thông tin chương và trả về bản ghi mới sau khi cập nhật (DTO).
   * @param {UpdateChapterDTO} dto - Dữ liệu cập nhật.
   * @returns {Promise<ChapterResponseDTO>}
   */
  public async updateChapter(dto: UpdateChapterRequestDTO): Promise<ChapterResponseDTO> {
    UpdateChapterValidator.validate(dto);
    // Lấy Entity để thực hiện logic nghiệp vụ
    const chapter = await this._getChapterEntityOrThrow(dto.id);

    if (dto.name && dto.name !== chapter.name) {
      const existing = await this._chapterRepo.findByName(dto.name.trim());
      if (existing) throw new AppError(ErrorCode.CHAPTER.NAME_ALREADY_EXISTS);
    }

    // Domain Logic cập nhật bên trong Entity
    chapter.updateDetails({
      name: dto.name?.trim(),
      description: dto.description?.trim(),
      orderIndex: dto.orderIndex,
    });

    await this._chapterRepo.updateChapter(chapter);
    this._cacheService.refresh();

    return ChapterMapper.toResponse(chapter);
  }

  /**
   * @description Xóa chương lý thuyết với cơ chế thích nghi (Hybrid Delete):
   * @param {string} id - ID của chương cần xóa.
   * @returns {Promise<DeleteResponse>} Kết quả phân loại phương thức xóa đã thực hiện.
   */
  public async deleteChapter(id: string): Promise<DeleteResponse> {
    // 1. Kiểm tra tồn tại (Ném lỗi 404 nếu không tìm thấy)
    const chapter = await this._getChapterEntityOrThrow(id);

    // 2. Thống kê chi tiết các ràng buộc (Questions, MatrixDetails, Weaknesses)
    const related = await this._chapterRepo.countRelatedData(id);

    const totalRelated =
      related.questions +
      related.matrixDetails +
      related.userWeaknesses;

    // 3. Quyết định hướng xử lý
    if (totalRelated > 0) {
      // TRƯỜNG HỢP 1: CÓ RÀNG BUỘC -> XÓA MỀM
      chapter.softDelete(); // Cập nhật trạng thái trong bộ nhớ Entity

      await this._chapterRepo.softDelete(id); // Gọi Repo để set deletedAt trong DB

      await this._cacheService.refresh();
      return { type: DeleteType.SOFT };
    }

    // TRƯỜNG HỢP 2: DỮ LIỆU SẠCH -> XÓA CỨNG
    await this._chapterRepo.hardDelete(id);

    await this._cacheService.refresh();
    return { type: DeleteType.HARD };
  }

  /**
   * @description Khôi phục chương đã xóa mềm và trả về dữ liệu sau khôi phục (DTO).
   * @param {string} id - ID của chương cần khôi phục.
   * @returns {Promise<ChapterResponseDTO>}
   */
  public async restoreChapter(id: string): Promise<ChapterResponseDTO> {
    const chapter = await this._chapterRepo.findByIdIncludingDeleted(id);

    if (!chapter) {
      throw new AppError(ErrorCode.CHAPTER.NOT_FOUND);
    }

    chapter.restore();
    await this._chapterRepo.restore(id);
    this._cacheService.refresh();
    return ChapterMapper.toResponse(chapter);
  }

  /**
   * @description Hàm trợ giúp nội bộ để lấy Entity hoặc ném lỗi (Tránh lặp code).
   * @private
   * @param {string} id - ID của chương cần khôi phục.
   * @returns {Promise<Chapter>}
   */
  private async _getChapterEntityOrThrow(id: string): Promise<Chapter> {
    const chapter = await this._chapterRepo.findById(id);
    if (!chapter) {
      throw new AppError(ErrorCode.CHAPTER.NOT_FOUND);
    }
    return chapter;
  }

  /**
   * @description Kiểm tra sự tồn tại của chương (Chapter) trong hệ thống dựa trên ID.
   * @param {string} id - Mã định danh duy nhất của chương cần kiểm tra.
   * @returns {Promise<boolean>} Trả về true nếu chương tồn tại, ngược lại trả về false.
   */
  public async exists(id: string): Promise<boolean> {
    return await this._chapterRepo.exists(id);
  }
}