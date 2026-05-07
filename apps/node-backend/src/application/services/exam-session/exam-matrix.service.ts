import { ExamMatrix } from "@/domain/entities/exam-matrix/exam-matrix.entity";
import { IExamMatrixRepository } from "@/domain/interfaces/repositories/exam-session/i-exam-matrix.repository";
import { ExamMatrixMapper } from "@/infrastructure/database/mappers/exam-session/exam-matrix.mapper";
import { IExamMatrixResponseDTO } from "@/application/dtos/response/exam-matrix/exam-matrix-response.dto";
import { PrismaClient } from "@prisma/client";
import { AppError, ErrorCode } from "@/shared/errors";
import { IExamMatrixService } from "@/domain/interfaces/services/exam-session/i-exam-matrix.service";
import { IMasterDataCacheService } from "@/domain/interfaces/services/exam-mgmt/i-master-data-cache.service";
import { CreateExamMatrixRequestDTO } from "@/application/dtos/request/exam-matrix/create-exam-matrix.request.dto";
import { UpdateExamMatrixRequestDTO } from "@/application/dtos/request/exam-matrix/update-exam-matrix.request.dto";
import { IDeleteResponseDTO, DeleteResponseDTO } from "@/application/dtos/response/shared/delete.response.dto";
import { DeleteType } from "@/domain/constants/delete.constant";

/**
 * @interface IExamMatrixServiceCradle
 * @description Tập hợp các phụ thuộc (Dependencies) cần thiết cho ExamMatrixService.
 */
export interface IExamMatrixServiceCradle {
    /** @description Repository quản lý lưu trữ và thực thi các quy tắc nghiệp vụ cho Ma trận đề. */
    examMatrixRepository: IExamMatrixRepository;

    /** @description Dịch vụ quản lý bộ nhớ đệm cho dữ liệu danh mục hệ thống. */
    masterDataCacheService: IMasterDataCacheService;

    /** @description Instance Prisma dùng để thực hiện các thao tác dữ liệu và quản lý Transaction. */
    prisma: PrismaClient;
}

/**
 * @class ExamMatrixService
 * @description Service điều phối nghiệp vụ cho Ma trận đề thi (Exam Matrix).
 * @principle Đảm bảo tính toàn vẹn cho Aggregate Root và thực hiện chiến lược Smart Delete.
 */
export class ExamMatrixService implements IExamMatrixService {
    /** 
     * @private 
     * @readonly 
     * @description Instance xử lý các thao tác dữ liệu ma trận. 
     */
    private readonly _examMatrixRepo: IExamMatrixRepository;

    /** 
     * @private 
     * @readonly 
     * @description Instance truy xuất dữ liệu từ lớp Cache. 
     */
    private readonly _cacheService: IMasterDataCacheService;

    /** 
     * @private 
     * @readonly 
     * @description Client điều phối các giao dịch cơ sở dữ liệu. 
     */
    private readonly _prisma: PrismaClient;

    /**
     * @constructor
     * @param {IExamMatrixServiceCradle} cradle - Danh sách phụ thuộc được tiêm (inject) qua Container.
     */
    constructor({ examMatrixRepository, masterDataCacheService, prisma }: IExamMatrixServiceCradle) {
        this._examMatrixRepo = examMatrixRepository;
        this._cacheService = masterDataCacheService;
        this._prisma = prisma;
    }

    /**
     * @description Tạo mới một ma trận đề thi kèm theo chi tiết tỉ trọng các chương.
     * @param {CreateExamMatrixRequestDTO} dto - Dữ liệu yêu cầu từ client.
     * @returns {Promise<IExamMatrixResponseDTO>} Ma trận đã được tạo.
     */
    public async create(dto: CreateExamMatrixRequestDTO): Promise<IExamMatrixResponseDTO> {
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
        this._cacheService.refresh();

        // 3. Trả về DTO thông qua Mapper
        return this.toResponse(savedEntity);
    }

    /**
     * @description Cập nhật Ma trận đề thi theo nguyên tắc thay thế Aggregate con.
     * @param {string} id - UUID của Ma trận cần cập nhật.
     * @param {UpdateExamMatrixRequestDTO} dto - Dữ liệu cập nhật từ Client.
     * @returns {Promise<IExamMatrixResponseDTO>} Ma trận đã cập nhật.
     */
    public async update(id: string, dto: UpdateExamMatrixRequestDTO): Promise<IExamMatrixResponseDTO> {

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
        const result = await this._examMatrixRepo.updateExamMatrix(existingEntity);
        this._cacheService.refresh();

        // 4. Map Entity sang DTO để trả về Client
        return this.toResponse(result);
    }

    /**
    * @description Thực thi chiến lược "Xóa thông minh" (Smart Delete) cho Ma trận đề thi.
    * @param {string} id - ID của ma trận cần xóa. (The ID of the matrix to be deleted.)
    * @returns {Promise<IDeleteResponseDTO>} Kết quả thao tác xóa kèm thông báo tự động.
    */
    public async delete(id: string): Promise<IDeleteResponseDTO> {
        if (!id) {
            throw new AppError(ErrorCode.VALIDATION.ID_REQUIRED);
        }

        // 1. Kiểm tra tồn tại (Ném lỗi 404 nếu không tìm thấy)
        // (Check existence - Throws 404 if not found)
        const existing = await this._examMatrixRepo.findById(id);
        if (!existing) {
            throw new AppError(ErrorCode.MATRIX.NOT_FOUND);
        }

        // 2. Kiểm tra liên kết với bảng Exam để bảo toàn tính toàn vẹn dữ liệu
        // (Checking links with the Exam table to ensure Data Integrity)
        const linkedCount = await this._examMatrixRepo.countLinkedExams(id);

        let type: DeleteType;

        // 3. Quyết định hướng xử lý (Decision logic)
        if (linkedCount > 0) {
            // TRƯỜNG HỢP 1: Đã có đề thi sử dụng ma trận này -> Xóa mềm
            // (Case 1: Matrix already used in exams -> Soft Delete)
            await this._examMatrixRepo.softDelete(id);
            type = DeleteType.SOFT;
        } else {
            // TRƯỜNG HỢP 2: Ma trận mới, chưa có dữ liệu liên quan -> Xóa cứng
            // (Case 2: New matrix, no related data -> Hard Delete)
            await this._examMatrixRepo.delete(id);
            type = DeleteType.HARD;
        }

        // 4. Đồng bộ hóa Cache (Synchronize Cache)
        await this._cacheService.refresh();

        // 5. Trả về DTO phản hồi tiêu chuẩn - DTO sẽ tự tạo message dựa trên type và count
        // (Return standard response DTO - The DTO generates the message based on type and count)
        return new DeleteResponseDTO({
            id,
            type,
            count: linkedCount
        });
    }

    /**
     * @description Chuyển đổi thực thể ma trận đề thi sang định dạng phản hồi (DTO).
     * @param {ExamMatrix} data - Thực thể Domain của ma trận đề thi.
     * @returns {Promise<IExamMatrixResponseDTO>} DTO chứa thông tin chi tiết ma trận đề.
     */
    public async toResponse(data: ExamMatrix): Promise<IExamMatrixResponseDTO> {
        if (!data) {
            throw new AppError(ErrorCode.MATRIX.NOT_FOUND);
        }
        return ExamMatrixMapper.toResponse(data);
    }

    /**
     * @description Khôi phục một Ma trận đề thi đã bị xóa mềm (Soft Delete).
     * @param {string} id - Mã định danh duy nhất (UUID) của Ma trận cần khôi phục.
     * @returns {Promise<IExamMatrixResponseDTO>} Đối tượng DTO chứa thông tin Ma trận sau khi phục hồi.
     */
    public async restore(id: string): Promise<IExamMatrixResponseDTO> {
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
        this._cacheService.refresh();
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