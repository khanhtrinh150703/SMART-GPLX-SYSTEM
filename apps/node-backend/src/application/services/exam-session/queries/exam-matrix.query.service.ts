import { ExamMatrixQueryDTO } from "@/application/dtos/request/exam-matrix/exam-matrix-query.request.dto";
import {
  IExamMatrixResponseDTO,
} from "@/application/dtos/response/exam-matrix/exam-matrix-response.dto";
import { IExamMatrixSelectionResponseDTO } from "@/application/dtos/response/exam-matrix/selection-exam-matrix.respone.dto";
import { ExamMatrix } from "@/domain/entities/exam-matrix/exam-matrix.entity";
import { IExamMatrixRepository } from "@/domain/interfaces/repositories";
import {
  IExamMatrixQueryService,
  IMasterDataCacheService,
} from "@/domain/interfaces/services";
import { ExamMatrixMapper } from "@/infrastructure/database/mappers";
import { PAGINATION_CONFIG } from "@/shared/config/pagination.config";
import { AppError } from "@/shared/errors/error-app";
import { ErrorCode } from "@/shared/errors/error-codes";
import { PaginatedResult } from "@/shared/types/pagination.types";
import { PaginationUtil } from "@/shared/utils/pagination.util";

/**
 * @interface IExamMatrixQueryServiceCradle
 * @description Định nghĩa các phụ thuộc cần thiết cho ExamMatrixQueryService.
 * Đảm bảo tính nhất quán với cơ chế DI Proxy của Awilix.
 */
export interface IExamMatrixQueryServiceCradle {
  examMatrixRepository: IExamMatrixRepository;
  masterDataCacheService: IMasterDataCacheService;
}

/**
 * @class ExamMatrixQueryService
 * @implements {IExamMatrixQueryService}
 * @description Service chuyên trách truy vấn dữ liệu Ma trận đề thi (Exam Matrix).
 * Phục vụ các tác vụ hiển thị cấu trúc đề và chuẩn bị dữ liệu cho việc sinh đề.
 */
export class ExamMatrixQueryService implements IExamMatrixQueryService {
  private readonly _matrixRepo: IExamMatrixRepository;
  private readonly _cacheService: IMasterDataCacheService;

  constructor({
    examMatrixRepository,
    masterDataCacheService,
  }: IExamMatrixQueryServiceCradle) {
    this._matrixRepo = examMatrixRepository;
    this._cacheService = masterDataCacheService;
  }

  /**
   * @description Lấy thông tin chi tiết của một ma trận.
   * @param {string} id - ID ma trận.
   * @returns {Promise<ExamMatrix>}
   */
  public async getById(id: string): Promise<ExamMatrix> {
    if (!id) {
      throw new AppError(ErrorCode.VALIDATION.ID_REQUIRED);
    }
    const entity = await this._matrixRepo.findById(id);
    if (!entity) {
      throw new AppError(ErrorCode.MATRIX.NOT_FOUND);
    }

    return entity;
  }

  /**
   * @description Lấy thông tin chi tiết của một ma trận.
   * @param {string} id - ID ma trận.
   * @returns {Promise<IExamMatrixResponseDTO>}
   */
  public async getDetail(id: string): Promise<IExamMatrixResponseDTO> {
    if (!id) {
      throw new AppError(ErrorCode.VALIDATION.ID_REQUIRED);
    }
    const entity = await this._matrixRepo.findById(id);
    if (!entity) {
      throw new AppError(ErrorCode.MATRIX.NOT_FOUND);
    }

    return ExamMatrixMapper.toResponse(entity);
  }

  /**
   * @description Lấy danh sách các chương được định dạng cho Selection/Dropdown (Dịch: Fetch chapter list formatted for selection inputs)
   * @returns {Promise<IExamMatrixSelectionResponseDTO[]>} - Danh sách các object thường có dạng { id, name } hoặc { value, label }.
   */
  public async getExamMatrixSelections(): Promise<
    IExamMatrixSelectionResponseDTO[]
  > {
    const examMatrices = await this._cacheService.getAllMatrices();
    return ExamMatrixMapper.toSelectionList(examMatrices);
  }

  /**
   * @description Lấy danh sách ma trận đề thi đã qua bộ lọc và ánh xạ sang DTO phản hồi.
   * @param {ExamMatrixQueryDTO} query - DTO chứa các tiêu chí lọc (licenseCategoryId, search, status) và phân trang.
   * @returns {Promise<PaginatedResult<IExamMatrixResponseDTO>>} Kết quả phân trang chứa dữ liệu đã được lọc bỏ trường nhạy cảm.
   */
  public async getPaginatedExamMatrices(
    query: ExamMatrixQueryDTO,
  ): Promise<PaginatedResult<IExamMatrixResponseDTO>> {
    // 1. Chuẩn hóa thông số phân trang (Sử dụng cấu hình hệ thống)
    const page = Number(query.page) || PAGINATION_CONFIG.DEFAULT_PAGE;
    const limit = Math.min(
      Number(query.limit) || PAGINATION_CONFIG.DEFAULT_LIMIT,
      PAGINATION_CONFIG.MAX_LIMIT,
    );

    // 2. Tính toán vị trí bắt đầu (skip) cho Repository
    const skip = PaginationUtil.getSkip(page, limit);

    // 3. Truy vấn dữ liệu từ Database thông qua Repository
    // Kết quả trả về là một Tuple [ExamMatrix[], number]
    const [matrices, total] = await this._matrixRepo.findAndCount(
      query,
      skip,
      limit,
    );

    // 4. ÁNH XẠ DỮ LIỆU (Mapping): Chuyển đổi Domain Entity sang Response DTO
    // Đảm bảo tính đóng gói và không lộ cấu trúc Database ra ngoài API
    const matrixResponses = ExamMatrixMapper.toResponseList(matrices);

    // 5. Đóng gói kết quả kèm theo Metadata phân trang chuẩn
    return PaginationUtil.createPaginatedResponse(
      matrixResponses,
      total,
      page,
      limit,
    );
  }

  /**
   * @description Lấy thông tin chi tiết của một ma trận theo tên.
   * @param {string} name - Tên ma trận cần tìm.
   * @returns {Promise<ExamMatrix>} Thực thể ma trận đề thi.
   */
  public async getByName(name: string): Promise<ExamMatrix> {
    if (!name) {
      throw new AppError(
        ErrorCode.MATRIX.NAME_REQUIRED ,
      );
    }

    // Gọi repo lấy entity gốc (bao gồm cả các bản ghi hệ thống nếu cần)
    const entity = await this._matrixRepo.findByNameSystem(name);
    if (!entity) {
      throw new AppError(ErrorCode.MATRIX.NOT_FOUND);
    }

    return entity;
  }
}
