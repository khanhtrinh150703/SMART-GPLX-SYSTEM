import { ExamMatrix } from "@/domain/entities/exam-matrix/exam-matrix.entity";
import { IExamMatrixRepository } from "@/domain/interfaces/repositories/exam-session/i-exam-matrix.repository";
import { ExamMatrixMapper } from "@/infrastructure/database/mappers/exam-session/exam-matrix.mapper";
import { ExamMatrixResponseDTO } from "@/application/dtos/response/exam-matrix/exam-matrix-response.dto";
import { PrismaClient } from "@prisma/client";
import { AppError, ErrorCode } from "@/shared/errors";
import { IExamMatrixService } from "@/domain/interfaces/services/exam-session/i-exam-matrix.service";
import { IMasterDataCacheService } from "@/domain/interfaces/services/exam-mgmt/i-master-data-cache.service";
import { CreateExamMatrixDTO } from "@/application/dtos/request/exam-matrix/create-exam-matrix.request.dto";
import { UpdateExamMatrixDTO } from "@/application/dtos/request/exam-matrix/update-exam-matrix.request.dto";
import { ExamMatrixQueryDTO } from "@/application/dtos/request/exam-matrix/exam-matrix-query.request.dto";
import { PaginatedResult } from "@/shared/types/pagination.types";
import { PAGINATION_CONFIG } from "@/shared/config/pagination.config";
import { PaginationUtil } from "@/shared/utils/pagination.util";
import { SelectionResponseDto } from "@/shared/responses/selection-response.dto";
import { DeleteResponse, DeleteType } from "@/domain/constants/delete.constant";

/**
 * @interface IExamMatrixServiceCradle
 * @description Định nghĩa các phụ thuộc (dependencies) cần thiết cho Exam Matrix Service.
 * Bao gồm Repository để xử lý nghiệp vụ và PrismaClient để quản lý Transaction nếu cần.
 */
export interface IExamMatrixServiceCradle {
    examMatrixRepository: IExamMatrixRepository;
    masterDataCacheService: IMasterDataCacheService;
    prisma: PrismaClient;
}

/**
 * @class ExamMatrixService
 * @description Service điều phối nghiệp vụ cho Ma trận đề thi (Exam Matrix).
 * Đảm bảo tính toàn vẹn của Aggregate Root và thực thi chiến lược Smart Delete.
 */
export class ExamMatrixService implements IExamMatrixService {
    private readonly _examMatrixRepo: IExamMatrixRepository;
    private readonly _cacheService: IMasterDataCacheService;
    private readonly _prisma: PrismaClient;

    /**
     * @description Khởi tạo Service với các phụ thuộc được "tiêm" từ DI Container.
     * @param {IExamMatrixServiceCradle} cradle - Chứa Repository và PrismaClient.
     */
    constructor({ examMatrixRepository, masterDataCacheService, prisma }: IExamMatrixServiceCradle) {
        this._examMatrixRepo = examMatrixRepository;
        this._cacheService = masterDataCacheService;
        this._prisma = prisma;
    }


    /**
     * @description Lấy danh sách các chương được định dạng cho Selection/Dropdown (Dịch: Fetch chapter list formatted for selection inputs)
     * @returns {Promise<SelectionResponseDto[]>} - Danh sách các object thường có dạng { id, name } hoặc { value, label }.
     */
    public async getExamMatrixSelections(): Promise<SelectionResponseDto[]> {
        const examMatrices = await this._cacheService.getAllMatrices();
        return ExamMatrixMapper.toSelectionList(examMatrices);
    }

    /**
     * @description Lấy danh sách ma trận đề thi đã qua bộ lọc và ánh xạ sang DTO phản hồi.
     * @param {ExamMatrixQueryDTO} query - DTO chứa các tiêu chí lọc (licenseCategoryId, search, status) và phân trang.
     * @returns {Promise<PaginatedResult<ExamMatrixResponseDTO>>} Kết quả phân trang chứa dữ liệu đã được lọc bỏ trường nhạy cảm.
     */
    public async getPaginatedExamMatrices(query: ExamMatrixQueryDTO): Promise<PaginatedResult<ExamMatrixResponseDTO>> {
        // 1. Chuẩn hóa thông số phân trang (Sử dụng cấu hình hệ thống)
        const page = Number(query.page) || PAGINATION_CONFIG.DEFAULT_PAGE;
        const limit = Math.min(
            Number(query.limit) || PAGINATION_CONFIG.DEFAULT_LIMIT,
            PAGINATION_CONFIG.MAX_LIMIT
        );

        // 2. Tính toán vị trí bắt đầu (skip) cho Repository
        const skip = PaginationUtil.getSkip(page, limit);

        // 3. Truy vấn dữ liệu từ Database thông qua Repository
        // Kết quả trả về là một Tuple [ExamMatrix[], number]
        const [matrices, total] = await this._examMatrixRepo.findAndCount(query, skip, limit);

        // 4. ÁNH XẠ DỮ LIỆU (Mapping): Chuyển đổi Domain Entity sang Response DTO
        // Đảm bảo tính đóng gói và không lộ cấu trúc Database ra ngoài API
        const matrixResponses = ExamMatrixMapper.toResponseList(matrices);

        // 5. Đóng gói kết quả kèm theo Metadata phân trang chuẩn
        return PaginationUtil.createPaginatedResponse(matrixResponses, total, page, limit);
    }

    /**
     * @description Tạo mới một ma trận đề thi kèm theo chi tiết tỉ trọng các chương.
     * @param {CreateExamMatrixDTO} dto - Dữ liệu yêu cầu từ client.
     * @returns {Promise<ExamMatrixResponseDTO>} Ma trận đã được tạo.
     */
    public async create(dto: CreateExamMatrixDTO): Promise<ExamMatrixResponseDTO> {
        const result = this._cacheService.getCategoryById(dto.licenseCategoryId);
        if (!result) {
            throw new AppError(ErrorCode.LICENSE.NOT_FOUND);
        }

        for (const detail of dto.details) {
            const chapter = this._cacheService.getChapterById(detail.chapterId);

            if (!chapter) {
                throw new AppError(ErrorCode.CHAPTER.NOT_FOUND);
            }
        }
        // 1. Khởi tạo Domain Entity (Tự động thực thi logic validate % tại đây)
        const entity = ExamMatrix.create({
            name: dto.name,
            licenseCategoryId: dto.licenseCategoryId,
            totalQuestions: dto.totalQuestions,
            passingScore: dto.passingScore,
            durationMinutes: dto.durationMinutes,
            minCriticalQuestions: dto.minCriticalQuestions,
            details: dto.details,
            isDefault: dto.isDefault,
        });

        // 2. Lưu vào Database thông qua Repository
        const savedEntity = await this._examMatrixRepo.createExamMatrix(entity);

        // 3. Trả về DTO thông qua Mapper
        return this.toResponse(savedEntity);
    }

    /**
     * @description Cập nhật Ma trận đề thi theo nguyên tắc thay thế Aggregate con.
     * @param {string} id - UUID của Ma trận cần cập nhật.
     * @param {UpdateExamMatrixDTO} dto - Dữ liệu cập nhật từ Client.
     * @returns {Promise<ExamMatrixResponseDTO>} Ma trận đã cập nhật.
     */
    public async update(id: string, dto: UpdateExamMatrixDTO): Promise<ExamMatrixResponseDTO> {

        for (const detail of dto.details) {
            const chapter = this._cacheService.getChapterById(detail.chapterId);

            if (!chapter) {
                throw new AppError(ErrorCode.CHAPTER.NOT_FOUND);
            }
        }

        // 1. Kiểm tra sự tồn tại và lấy dữ liệu cũ (để lấy licenseCategoryId)
        const existingEntity = await this._examMatrixRepo.findById(id);
        if (!existingEntity) {
            throw new AppError(ErrorCode.MATRIX.NOT_FOUND);
        }

        // 2. Khởi tạo Domain Entity mới bằng cách trộn (merge) dữ liệu cũ và mới.
        existingEntity.updateConfig({
            name: dto.name,
            totalQuestions: dto.totalQuestions,
            passingScore: dto.passingScore,
            durationMinutes: dto.durationMinutes,
            minCriticalQuestions: dto.minCriticalQuestions,
            details: dto.details,
            isDefault: dto.isDefault,
        });

        // 3. Giao cho Repository lưu trữ toàn vẹn trạng thái mới
        const result = await this._examMatrixRepo.updateExamMatrix(id, existingEntity);

        // 4. Map Entity sang DTO để trả về Client
        return this.toResponse(result);
    }

    /**
     * @description Thực thi chiến lược "Smart Delete".
     * Nếu đã có đề thi sử dụng -> Soft Delete. Nếu chưa có -> Hard Delete.
     * @param {string} id - ID của ma trận cần xóa.
     * @returns {Promise<DeleteResponse>}
     */
    public async delete(id: string): Promise<DeleteResponse> {
        if (!id) {
            throw new AppError(ErrorCode.VALIDATION.ID_REQUIRED);
        }
        // 1. Kiểm tra tồn tại
        const existing = await this._examMatrixRepo.findById(id);
        if (!existing) {
            throw new AppError(ErrorCode.MATRIX.NOT_FOUND);
        }

        // 2. Kiểm tra liên kết với bảng Exam
        const linkedCount = await this._examMatrixRepo.countLinkedExams(id);

        if (linkedCount > 0) {
            // Trường hợp 1: Có dữ liệu liên quan -> Xóa mềm để bảo toàn Data Integrity
            await this._examMatrixRepo.softDelete(id);
            return { type: DeleteType.SOFT };
        }
        await this._examMatrixRepo.delete(id);
        return { type: DeleteType.HARD };
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
        const entity = await this._examMatrixRepo.findById(id);
        if (!entity) {
            throw new AppError(ErrorCode.MATRIX.NOT_FOUND);
        }

        return entity;
    }
    /**
     * @description Chuyển đổi thực thể ma trận đề thi sang định dạng phản hồi (DTO).
     * @param {ExamMatrix} data - Thực thể Domain của ma trận đề thi.
     * @returns {Promise<ExamMatrixResponseDTO>} DTO chứa thông tin chi tiết ma trận đề.
     */
    public async toResponse(data: ExamMatrix): Promise<ExamMatrixResponseDTO> {
        if (!data) {
            throw new AppError(ErrorCode.MATRIX.NOT_FOUND);
        }
        return ExamMatrixMapper.toResponse(data);
    }

    /**
     * @description Khôi phục một Ma trận đề thi đã bị xóa mềm (Soft Delete).
     * @param {string} id - Mã định danh duy nhất (UUID) của Ma trận cần khôi phục.
     * @returns {Promise<ExamMatrixResponseDTO>} Đối tượng DTO chứa thông tin Ma trận sau khi phục hồi.
     */
    public async restore(id: string): Promise<ExamMatrixResponseDTO> {
        // 1. Tìm bản ghi kể cả đã xóa mềm (Dùng query riêng không lọc deletedAt)

        if (!id) {
            throw new AppError(ErrorCode.VALIDATION.ID_REQUIRED);
        }

        const existing = await this._examMatrixRepo.findByIdSystem(id);

        if (!existing || !existing.isDeleted()) {
            throw new AppError(ErrorCode.MATRIX.NOT_FOUND);
        }

        // 2. KIỂM TRA UNIQUE CONSTRAINT TRƯỚC KHI RESTORE
        // Kiểm tra xem đã có Ma trận nào khác đang hoạt động cho hạng bằng này chưa
        const duplicate = await this._prisma.examMatrix.findFirst({
            where: {
                // Trỏ vào id của category, không truyền cả object existing
                licenseCategoryId: existing.props.licenseCategoryId,
                deletedAt: null,
                id: { not: id }
            }
        });

        if (duplicate) {
            // Nếu đã có ma trận mới đang chạy cho hạng bằng này, không cho khôi phục cái cũ
            throw new AppError(ErrorCode.MATRIX.RESTORE_FAILED_DUPLICATE);
        }

        // 3. Thực hiện khôi phục
        await this._examMatrixRepo.restore(id);

        const restored = await this._examMatrixRepo.findById(id);
        return this.toResponse(restored!);
    }

    public async validateExistence(id: string): Promise<void> {
        const matrix = await this._examMatrixRepo.findById(id);

        if (!matrix) {
            throw new AppError(
                ErrorCode.EXAM.INVALID_MATRIX_ID);
        }
    }
}