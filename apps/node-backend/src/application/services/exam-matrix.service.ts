import { ExamMatrix } from "@/domain/entities/exam-matrix/exam-matrix.entity";
import { IExamMatrixRepository } from "@/domain/interfaces/repositories/i-exam-matrix.repository";
import { ExamMatrixMapper } from "@/infrastructure/database/mappers/exam/exam-matrix.mapper";
import { ExamMatrixResponseDTO } from "@/application/dtos/response/exam-matrix/exam-matrix-response.dto";
import { PrismaClient } from "@prisma/client";
import { CreateExamMatrixDTO } from "../dtos/request/exam-matrix/create-exam-matrix.dto";
import { UpdateExamMatrixDTO } from "../dtos/request/exam-matrix/update-exam-matrix.dto";
import { AppError, ErrorCode } from "@/shared/errors";
import { MasterDataCacheService } from "@/infrastructure/security/master-data-cache.service";
import { IExamMatrixService } from "@/domain/interfaces/services/i-exam-matrix.service";

/**
 * @interface IExamMatrixServiceCradle
 * @description Định nghĩa các phụ thuộc (dependencies) cần thiết cho Exam Matrix Service.
 * Bao gồm Repository để xử lý nghiệp vụ và PrismaClient để quản lý Transaction nếu cần.
 */
export interface IExamMatrixServiceCradle {
    examMatrixRepository: IExamMatrixRepository;
    prisma: PrismaClient;
}

/**
 * @class ExamMatrixService
 * @description Service điều phối nghiệp vụ cho Ma trận đề thi (Exam Matrix).
 * Đảm bảo tính toàn vẹn của Aggregate Root và thực thi chiến lược Smart Delete.
 */
export class ExamMatrixService implements IExamMatrixService {
    private readonly _matrixRepo: IExamMatrixRepository;
    private readonly _prisma: PrismaClient;

    /**
     * @description Khởi tạo Service với các phụ thuộc được "tiêm" từ DI Container.
     * @param {IExamMatrixServiceCradle} cradle - Chứa Repository và PrismaClient.
     */
    constructor({ examMatrixRepository, prisma }: IExamMatrixServiceCradle) {
        this._matrixRepo = examMatrixRepository;
        this._prisma = prisma;
    }

    /**
     * @description Tạo mới một ma trận đề thi kèm theo chi tiết tỉ trọng các chương.
     * @param {CreateExamMatrixDTO} dto - Dữ liệu yêu cầu từ client.
     * @returns {Promise<ExamMatrixResponseDTO>} Ma trận đã được tạo.
     */
    public async create(dto: CreateExamMatrixDTO): Promise<ExamMatrixResponseDTO> {
        const result = MasterDataCacheService.getCategoryById(dto.licenseCategoryId)
        if (!result) {
            throw new AppError(ErrorCode.LICENSE.NOT_FOUND)
        }

        for (const detail of dto.details) {
            const chapter = MasterDataCacheService.getChapterById(detail.chapterId);

            if (!chapter) {
                throw new AppError(ErrorCode.CHAPTER.NOT_FOUND);
            }
        }
        // 1. Khởi tạo Domain Entity (Tự động thực thi logic validate % tại đây)
        const entity = ExamMatrix.create({
            licenseCategoryId: dto.licenseCategoryId,
            totalQuestions: dto.totalQuestions,
            passingScore: dto.passingScore,
            durationMinutes: dto.durationMinutes,
            minCriticalQuestions: dto.minCriticalQuestions,
            details: dto.details,
        });

        // 2. Lưu vào Database thông qua Repository
        const savedEntity = await this._matrixRepo.save(entity);

        // 3. Trả về DTO thông qua Mapper
        return ExamMatrixMapper.toResponse(savedEntity);
    }

    /**
     * @description Cập nhật Ma trận đề thi theo nguyên tắc thay thế Aggregate con.
     * @param {string} id - UUID của Ma trận cần cập nhật.
     * @param {UpdateExamMatrixDTO} dto - Dữ liệu cập nhật từ Client.
     * @returns {Promise<ExamMatrixResponseDTO>} Ma trận đã cập nhật.
     */
    public async update(id: string, dto: UpdateExamMatrixDTO): Promise<ExamMatrixResponseDTO> {

        for (const detail of dto.details) {
            const chapter = MasterDataCacheService.getChapterById(detail.chapterId);

            if (!chapter) {
                throw new AppError(ErrorCode.CHAPTER.NOT_FOUND);
            }
        }

        // 1. Kiểm tra sự tồn tại và lấy dữ liệu cũ (để lấy licenseCategoryId)
        const existing = await this._matrixRepo.findById(id);
        if (!existing) {
            throw new AppError(ErrorCode.MATRIX.NOT_FOUND);
        }

        // 2. Khởi tạo Domain Entity mới bằng cách trộn (merge) dữ liệu cũ và mới.
        // Điều này đảm bảo Rich Logic trong Entity (validate tổng 100%) vẫn hoạt động chính xác.
        const updatedEntity = ExamMatrix.create({
            ...existing.props, // Lấy licenseCategoryId từ đây
            totalQuestions: dto.totalQuestions,
            passingScore: dto.passingScore,
            durationMinutes: dto.durationMinutes,
            minCriticalQuestions: dto.minCriticalQuestions,
            details: dto.details,
            id, // Giữ nguyên ID cũ
        });

        // 3. Thực thi Transaction đảm bảo tính nhất quán (Atomicity)
        return await this._prisma.$transaction(async (tx) => {
            // A. Xóa toàn bộ Details cũ liên quan đến Matrix này
            await tx.examMatrixDetail.deleteMany({
                where: { examMatrixId: id },
            });

            // B. Chuẩn bị dữ liệu Persistence (Dùng Mapper để chuyển sang camelCase cho Prisma)
            const persistenceData = ExamMatrixMapper.toPersistence(updatedEntity);

            // C. Cập nhật thông tin Root và chèn Details mới đồng thời qua Transaction Client (tx)
            // Lưu ý: Sử dụng tx thay vì this._matrixRepo để đảm bảo cùng một Context Transaction
            const updatedRecord = await tx.examMatrix.update({
                where: { id },
                data: {
                    totalQuestions: persistenceData.totalQuestions,
                    passingScore: persistenceData.passingScore,
                    durationMinutes: persistenceData.durationMinutes,
                    minCriticalQuestions: persistenceData.minCriticalQuestions,
                    // Chèn mảng details mới
                    details: persistenceData.details,
                },
                include: { details: true },
            });

            // 4. Map kết quả từ Record DB sang Response DTO thông qua Domain Entity
            const entity = ExamMatrixMapper.toDomain(updatedRecord); // Bước 1: Kiểm tra nghiệp vụ & Ánh xạ domain
            return ExamMatrixMapper.toResponse(entity);      // Bước 2: Lọc dữ liệu nhạy cảm & Trả về DTO
        });
    }

    /**
     * @description Thực thi chiến lược "Smart Delete".
     * Nếu đã có đề thi sử dụng -> Soft Delete. Nếu chưa có -> Hard Delete.
     * @param {string} id - ID của ma trận cần xóa.
     * @returns {Promise<void>}
     */
    public async delete(id: string): Promise<void> {
        if (!id) {
            throw new AppError(ErrorCode.VALIDATION.ID_REQUIRED);
        }
        // 1. Kiểm tra tồn tại
        const existing = await this._matrixRepo.findById(id);
        if (!existing) {
            throw new AppError(ErrorCode.MATRIX.NOT_FOUND);
        }

        // 2. Kiểm tra liên kết với bảng Exam
        const linkedCount = await this._matrixRepo.countLinkedExams(id);

        if (linkedCount > 0) {
            // Trường hợp 1: Có dữ liệu liên quan -> Xóa mềm để bảo toàn Data Integrity
            await this._matrixRepo.softDelete(id);
        } else {
            // Trường hợp 2: Chưa sinh ra đề thi -> Xóa cứng để dọn dẹp DB (Cascade sẽ dọn details)
            await this._matrixRepo.delete(id);
        }
    }

    /**
     * @description Lấy thông tin chi tiết của một ma trận.
     * @param {string} id - ID ma trận.
     * @returns {Promise<ExamMatrixResponseDTO>}
     */
    public async getById(id: string): Promise<ExamMatrixResponseDTO> {
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
     * @description Khôi phục một Ma trận đề thi đã bị xóa mềm (Soft Delete).
     * @param {string} id - Mã định danh duy nhất (UUID) của Ma trận cần khôi phục.
     * @returns {Promise<ExamMatrixResponseDTO>} Đối tượng DTO chứa thông tin Ma trận sau khi phục hồi.
     */
    public async restore(id: string): Promise<ExamMatrixResponseDTO> {
        // 1. Tìm bản ghi kể cả đã xóa mềm (Dùng query riêng không lọc deletedAt)

        if (!id) {
            throw new AppError(ErrorCode.VALIDATION.ID_REQUIRED);
        }

        const existing = await this._matrixRepo.findByIdSystem(id);

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
        await this._matrixRepo.restore(id);

        const restored = await this._matrixRepo.findById(id);
        return ExamMatrixMapper.toResponse(restored!);
    }
}