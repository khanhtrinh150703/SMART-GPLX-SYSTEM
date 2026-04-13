import { IChapterRepository } from "@/domain/interfaces/repositories/i-chapter.repository";
import { ErrorCode } from "@/shared/errors/error-codes";
import { Chapter } from "@/domain/entities/chapter/chapter.entity";
import { IChapterService } from "@/domain/interfaces/services/i-chapter.service";
import { AppError } from "@/shared/errors/error-app";
import { ChapterResponseDTO } from "../dtos/response/chapter/chapter.dto.respone";
import { ChapterMapper } from "@/infrastructure/database/mappers/chapter.mapper";
import { CreateChapterRequestDTO } from "../dtos/request/chapter/create-chapter.request.dto";
import { UpdateChapterRequestDTO } from "../dtos/request/chapter/update-chapter.request.dto";
import { ChapterQueryDTO } from "../dtos/request/chapter/chapter-query.request.dto";
import { PaginatedResult } from "@/shared/types/pagination.types";
import { PaginationUtil } from "@/shared/utils/pagination.util";
import { SelectionResponseDto } from "@/shared/responses/selection-response.dto";

/**
 * @interface IChapterServiceCradle
 * @description Các mảnh ghép (dependencies) dành riêng cho ChapterService.
 * Giúp TypeScript canh gác chặt chẽ, không cho các Repo "đi lạc" vào đây.
 */
export interface IChapterServiceCradle {
  chapterRepository: IChapterRepository;
}

/**
 * @class ChapterService
 * @description Xử lý logic nghiệp vụ cho các Chương lý thuyết lái xe.
 */
export class ChapterService implements IChapterService {
  private readonly _chapterRepo: IChapterRepository;

  /**
   * @description Khởi tạo Service với túi đồ nghề chuyên dụng.
   * @param {IChapterServiceCradle} cradle - Chỉ bao gồm những gì cần thiết để quản lý Chapter.
   */
  constructor({ chapterRepository }: IChapterServiceCradle) {
    this._chapterRepo = chapterRepository;
  }

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
    const page = Number(query.page) || 1;
    const limit = Number(query.limit) || 10;

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
    // 1. Kiểm tra trùng tên (Cheap Check)
    const existing = await this._chapterRepo.findByName(dto.name.trim());
    if (existing) {
      throw new AppError(ErrorCode.CHAPTER.ALREADY_EXISTS);
    }

    // 2. Khởi tạo Entity
    const newChapter = new Chapter({
      id: crypto.randomUUID(),
      name: dto.name.trim(),
      description: dto.description?.trim() || null,
      orderIndex: dto.orderIndex ?? 0,
      createdAt: new Date(),
      updatedAt: new Date(),
      deletedAt: null,
    });

    // 3. Persist vào DB và trả về DTO
    await this._chapterRepo.save(newChapter);
    return ChapterMapper.toResponse(newChapter);
  }

  /**
   * @description Cập nhật thông tin chương và trả về bản ghi mới sau khi cập nhật (DTO).
   * @param {UpdateChapterDTO} dto - Dữ liệu cập nhật.
   * @returns {Promise<ChapterResponseDTO>}
   */
  public async updateChapter(dto: UpdateChapterRequestDTO): Promise<ChapterResponseDTO> {
    // Lấy Entity để thực hiện logic nghiệp vụ
    const chapter = await this._getChapterEntityOrThrow(dto.id);

    if (dto.name && dto.name !== chapter.name) {
      const existing = await this._chapterRepo.findByName(dto.name.trim());
      if (existing) throw new AppError(ErrorCode.CHAPTER.ALREADY_EXISTS);
    }

    // Domain Logic cập nhật bên trong Entity
    chapter.updateDetails({
      name: dto.name?.trim(),
      description: dto.description?.trim(),
      orderIndex: dto.orderIndex,
    });

    await this._chapterRepo.update(chapter);
    return ChapterMapper.toResponse(chapter);
  }

  /**
   * @description Xóa mềm chương lý thuyết và trả về thông tin bản ghi vừa bị xóa (DTO).
   * @param {string} id - ID của chương cần xóa.
   * @returns {Promise<void>}
   */
  public async deleteChapter(id: string): Promise<void> {
    const chapter = await this._getChapterEntityOrThrow(id);
    // Kiểm tra ràng buộc dữ liệu
    const questionCount = await this._chapterRepo.countQuestions(id);
    if (questionCount > 0) {
      throw new AppError(ErrorCode.CHAPTER.HAS_RELATED_QUESTIONS);
    }

    chapter.softDelete();
    await this._chapterRepo.update(chapter);
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

    // Gọi logic khôi phục của Entity (nếu có hàm restore()) hoặc cập nhật DB
    chapter.restore();
    await this._chapterRepo.update(chapter);

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

  public async exists(id: string): Promise<boolean> {
    return await this._chapterRepo.exists(id);
  }
}