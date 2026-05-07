import { IChapterRepository } from "@/domain/interfaces/repositories/exam-mgmt/i-chapter.repository";
import { ErrorCode } from "@/shared/errors/error-codes";
import { Chapter } from "@/domain/entities/chapter/chapter.entity";
import { IChapterService } from "@/domain/interfaces/services/exam-mgmt/i-chapter.service";
import { AppError } from "@/shared/errors/error-app";
import { ChapterMapper } from "@/infrastructure/database/mappers/exam-mgmt/chapter.mapper";
import { IMasterDataCacheService } from "@/domain/interfaces/services/exam-mgmt/i-master-data-cache.service";
import { IChapterResponseDTO } from "@/application/dtos/response/chapter/chapter.respone.dto";
import { CreateChapterRequestDTO } from "@/application/dtos/request/chapter/create-chapter.request.dto";
import { UpdateChapterRequestDTO } from "@/application/dtos/request/chapter/update-chapter.request.dto";
import { DeleteResponseDTO, IDeleteResponseDTO } from "@/application/dtos/response/shared/delete.response.dto";
import { DeleteType } from "@/domain/constants/delete.constant";

/**
 * @interface IChapterServiceCradle
 * @description Tập hợp các phụ thuộc (Dependencies) cần thiết cho việc quản lý nghiệp vụ Chương.
 */
export interface IChapterServiceCradle {
  /** @description Repository chịu trách nhiệm thay đổi và lưu trữ dữ liệu Chương trong Database. */
  chapterRepository: IChapterRepository;

  /** @description Dịch vụ quản lý bộ nhớ đệm (Dùng để xóa hoặc cập nhật lại cache khi dữ liệu thay đổi). */
  masterDataCacheService: IMasterDataCacheService;
}

/**
 * @class ChapterService
 * @description Dịch vụ điều phối các logic nghiệp vụ (Write-side) liên quan đến các Chương lý thuyết lái xe.
 * @principle Data Consistency - Đảm bảo dữ liệu trong Database và bộ nhớ đệm luôn đồng nhất sau khi thực hiện thay đổi.
 */
export class ChapterService implements IChapterService {
  /** @private @readonly @description Instance thực hiện các thao tác ghi dữ liệu Chapter. */
  private readonly _chapterRepo: IChapterRepository;

  /** @private @readonly @description Dịch vụ xử lý làm mới/xóa bộ nhớ đệm Master Data. */
  private readonly _cacheService: IMasterDataCacheService;

  /**
   * @constructor
   * @description Khởi tạo ChapterService với các công cụ chuyên dụng để quản lý trạng thái dữ liệu Chương.
   * @param {IChapterServiceCradle} cradle - Chứa các phụ thuộc phục vụ luồng nghiệp vụ ghi.
   */
  constructor({ chapterRepository, masterDataCacheService }: IChapterServiceCradle) {
    this._chapterRepo = chapterRepository;
    this._cacheService = masterDataCacheService;
  }

  /**
   * @description Khởi tạo chương mới và trả về thông tin chương vừa tạo (DTO).
   * @param {CreateChapterRequestDTO} dto - Dữ liệu khởi tạo chương.
   * @returns {Promise<IChapterResponseDTO>}
   */
  public async createChapter(dto: CreateChapterRequestDTO): Promise<IChapterResponseDTO> {
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
   * @returns {Promise<IChapterResponseDTO>}
   */
  public async updateChapter(id: string, dto: UpdateChapterRequestDTO): Promise<IChapterResponseDTO> {
    // Lấy Entity để thực hiện logic nghiệp vụ
    const chapter = await this._getChapterEntityOrThrow(id);

    if (dto.name && dto.name !== chapter.name) {
      const existing = await this._chapterRepo.findByName(dto.name.trim());
      if (existing) throw new AppError(ErrorCode.CHAPTER.NAME_ALREADY_EXISTS);
    }

    const existingCode = await this._chapterRepo.findByCode(dto.code.trim());
    if (existingCode) {
      throw new AppError(ErrorCode.CHAPTER.CODE_ALREADY_EXISTS);
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
   * @description Thực hiện xóa chương học dựa trên ràng buộc dữ liệu.
   * @param {string} id - ID của chương học cần xóa. (The ID of the chapter to be deleted.)
   * @returns {Promise<IDeleteResponseDTO>} Kết quả thao tác xóa (SOFT hoặc HARD).
   */
  public async deleteChapter(id: string): Promise<IDeleteResponseDTO> {
    // 1. Kiểm tra tồn tại (Ném lỗi 404 nếu không tìm thấy)
    // (Check existence - Throws 404 if not found)
    const chapter = await this._getChapterEntityOrThrow(id);

    // 2. Thống kê chi tiết các ràng buộc (Questions, MatrixDetails, Weaknesses)
    // (Detailed statistics of constraints)
    const related = await this._chapterRepo.countRelatedData(id);

    const totalRelated =
      related.questions +
      related.matrixDetails +
      related.userWeaknesses;

    let deleteType: DeleteType;

    // 3. Quyết định hướng xử lý (Decision logic)
    if (totalRelated > 0) {
      // TRƯỜNG HỢP 1: CÓ RÀNG BUỘC -> XÓA MỀM (Case 1: Has constraints -> Soft Delete)
      chapter.softDelete(); // Cập nhật trạng thái trong bộ nhớ Entity

      await this._chapterRepo.softDelete(id); // Gọi Repo để set deletedAt trong DB
      deleteType = DeleteType.SOFT;
    } else {
      // TRƯỜNG HỢP 2: DỮ LIỆU SẠCH -> XÓA CỨNG (Case 2: Clean data -> Hard Delete)
      await this._chapterRepo.hardDelete(id);
      deleteType = DeleteType.HARD;
    }

    // 4. Đồng bộ hóa Cache (Synchronize Cache)
    await this._cacheService.refresh();

    // 5. Trả về DTO phản hồi tiêu chuẩn (Return standard response DTO)
    return new DeleteResponseDTO({
      id: id,
      type: deleteType,
      count: totalRelated
    });
  }

  /**
   * @description Khôi phục chương đã xóa mềm và trả về dữ liệu sau khôi phục (DTO).
   * @param {string} id - ID của chương cần khôi phục.
   * @returns {Promise<IChapterResponseDTO>}
   */
  public async restoreChapter(id: string): Promise<IChapterResponseDTO> {
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