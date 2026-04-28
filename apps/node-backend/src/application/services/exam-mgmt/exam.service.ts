import { IExamRepository } from '@/domain/interfaces/repositories/exam-mgmt/i-exam.repository';
import { IExamService } from '@/domain/interfaces/services/exam-mgmt/i-exam.service';
import { AppError, ErrorCode } from '@/shared/errors';
import { PrismaClient } from '@prisma/client';
import { ExamEntity } from '@/domain/entities/exam/exam.entity';
import { PAGINATION_CONFIG } from '@/shared/config/pagination.config';
import { ExamQueryDTO } from '@/application/dtos/request/exam/exam-query.request.dto';
import { ExamMapper } from '@/infrastructure/database/mappers';
import { PaginatedResult } from '@/shared/types/pagination.types';
import { PaginationUtil } from '@/shared/utils/pagination.util';
import { IExamResponse } from '@/application/dtos/response/exam/exam-response.dto';
import { UpdateExamDTO } from '@/application/dtos/request/exam/update-exam.request.dto';


export interface IExamCradle {
    examRepository: IExamRepository;
    prisma: PrismaClient;
}

/**
 * @description Service thực thi logic nghiệp vụ cho Exam.
 * @principle Clean Architecture - Logic nghiệp vụ nằm trong Domain Entity.
 */
export class ExamService implements IExamService {
    private readonly _examRepo: IExamRepository;
    private readonly _prisma: PrismaClient;

    constructor({ examRepository, prisma, }: IExamCradle) {
        this._examRepo = examRepository;
        this._prisma = prisma;
    }

    /**
     * @description Lấy danh sách đề thi đã qua bộ lọc (tìm kiếm/trạng thái) và ánh xạ sang DTO sạch.
     * @param {ExamQueryDTO} query - DTO chứa các tiêu chí lọc và thông số phân trang từ Request.
     * @returns {Promise<PaginatedResult<IExamResponse>>} Trả về DTO thay vì Entity để đảm bảo tính đóng gói và bảo mật.
     */
    public async getPaginatedExams(query: ExamQueryDTO): Promise<PaginatedResult<IExamResponse>> {
        // 1. Chuẩn hóa thông số phân trang (Sử dụng dữ liệu đã được ép kiểu trong constructor của DTO)
        const page = query.page || PAGINATION_CONFIG.DEFAULT_PAGE;
        const limit = Math.min(
            query.limit || PAGINATION_CONFIG.DEFAULT_LIMIT,
            PAGINATION_CONFIG.MAX_LIMIT
        );

        // 2. Tính toán skip cho Repository (Sử dụng Utility tập trung)
        const skip = PaginationUtil.getSkip(page, limit);

        // 3. Truy vấn dữ liệu từ DB thông qua Repository
        // Kết quả nhận về là Tuple [ExamEntity[], total] để phục vụ phân trang
        const [exams, total] = await this._examRepo.findAndCount(query, skip, limit);

        // 4. ÁNH XẠ DỮ LIỆU (Mapping): Chuyển mảng Domain Entity sang mảng Response DTO
        // Đảm bảo dữ liệu trả về cho Client chỉ chứa các thông tin cần thiết (không chứa dữ liệu nhạy cảm)
        const examResponses = exams.map(exam => ExamMapper.toResponse(exam));

        // 5. Đóng gói kết quả cuối cùng kèm Metadata phân trang
        return PaginationUtil.createPaginatedResponse(
            examResponses,
            total,
            page,
            limit
        );
    }

    /**
     * @description Lấy thông tin chi tiết một bài thi theo ID.
     * @param id - Mã định danh bài thi.
     * @returns {Promise<ExamEntity>}
     * @throws {AppError} Nếu không tìm thấy bài thi hoặc ID trống.
     */
    public async getExamById(id: string): Promise<ExamEntity> {
        // 1. Kiểm tra ID đầu vào có hợp lệ không
        if (!id) {
            throw new AppError(ErrorCode.EXAM_ATTEMPT.ID_REQUIRED);
        }

        // 2. Gọi Repository để truy vấn dữ liệu
        const exam = await this._examRepo.findById(id);

        // 3. Xử lý trường hợp không tìm thấy (Null Object)
        if (!exam) {
            throw new AppError(ErrorCode.EXAM_ATTEMPT.NOT_FOUND,);
        }

        // 4. Trả về thực thể (Entity) để xử lý tiếp ở tầng Controller
        return exam;
    }

    /**
     * @description Cập nhật thông tin đề thi theo tư duy hướng hành vi (Behavior-Oriented).
     * @param {string} id - ID của đề thi cần cập nhật.
     * @param {UpdateExamDTO} dto - Dữ liệu các trường cần thay đổi.
     * @returns {Promise<IExamResponse>} Thông tin đề thi sau khi cập nhật thành công.
     */
    public async updateExam(id: string, dto: UpdateExamDTO): Promise<IExamResponse> {
        // 1. Tìm thực thể gốc (Fetch Aggregate Root)
        const exam = await this._examRepo.findById(id);
        if (!exam) throw new AppError(ErrorCode.EXAM.NOT_FOUND);

        // 2. Kiểm tra ràng buộc (Security & Business Logic)
        // (Kiểm tra các ràng buộc nghiệp vụ trước khi tiến hành cập nhật)
        if (exam.isDeleted()) throw new AppError(ErrorCode.EXAM.NOT_FOUND);

        const licenseCategoryId = dto.licenseCategoryId ?? exam.props.licenseCategoryId;
        const examMatrixId = dto.examMatrixId !== undefined ? dto.examMatrixId : exam.props.examMatrixId;

        // Lấy danh sách questionIds để validate (nếu DTO không gửi mảng mới thì lấy mảng hiện tại)
        const questionIds = dto.questions?.map(q => q.questionId) ?? exam.props.questions.map(q => q.questionId);

        // Kiểm tra tính tồn tại của các quan hệ (Hạng bằng lái, Ma trận) nếu có thay đổi
        await this._validateExamRelations(licenseCategoryId, questionIds, examMatrixId);

        // 3. Xử lý danh sách câu hỏi Snapshot (Transform DTO to Value Objects/Props)
        // Vì đây là Snapshot, ta sẽ ánh xạ lại mảng questions từ DTO
        let updatedQuestions = exam.props.questions;
        if (dto.questions) {
            updatedQuestions = dto.questions.map((q) => ({
                questionId: q.questionId,
                indexNumber: q.indexNumber,
                isCritical: q.isCritical,
                correctAnswer: q.correctAnswer,
                // Giữ lại metadata cũ hoặc cập nhật mới từ DTO nếu cần
                chapterId: q.chapterId,
                chapterName: q.chapterName,
            }));
        }

        // 4. THỰC THI NGHIỆP VỤ TRÊN DOMAIN ENTITY
        // "Execute domain logic through the entity's update method"
        // (Thực thi logic nghiệp vụ thông qua phương thức update của thực thể)
        exam.update({
            name: dto.name,
            status: dto.status,
            score: dto.score,
            totalQuestions: dto.totalQuestions,
            passingScore: dto.passingScore,
            durationMinutes: dto.durationMinutes,
            minCriticalQuestions: dto.minCriticalQuestions,
            questions: updatedQuestions,
            licenseCategoryId: dto.licenseCategoryId,
            examMatrixId: dto.examMatrixId,
        });

        // 5. Lưu trữ và Phản hồi (Persistence & Response)
        const saved = await this._examRepo.updateExam(id, exam);
        return ExamMapper.toResponse(saved);
    }

    /**
     * @description Khôi phục một Đề thi đã bị xóa mềm (Soft Delete).
     * @param {string} id - Mã định danh duy nhất (UUID) của Đề thi cần khôi phục.
     * @returns {Promise<IExamResponse>} Đối tượng DTO chứa thông tin Đề thi sau khi phục hồi.
     */
    public async restoreExam(id: string): Promise<IExamResponse> {
        // 1. Kiểm tra ID đầu vào
        // "ID is required for the restore operation"
        // (ID là bắt buộc cho thao tác khôi phục)
        if (!id) {
            throw new AppError(ErrorCode.VALIDATION.ID_REQUIRED);
        }

        // Tìm bản ghi kể cả đã xóa mềm (Dùng query hệ thống không lọc deletedAt)
        const existing = await this._examRepo.findByIdSystem(id);

        if (!existing || !existing.isDeleted()) {
            throw new AppError(ErrorCode.EXAM.NOT_FOUND);
        }

        // 2. KIỂM TRA RÀNG BUỘC DUY NHẤT (UNIQUE CONSTRAINT) TRƯỚC KHI KHÔI PHỤC
        // Kiểm tra xem đã có Đề thi nào khác đang hoạt động cho hạng bằng/người dùng này chưa
        // "Checking for active duplicates to prevent data conflict"
        // (Kiểm tra các bản sao đang hoạt động để tránh xung đột dữ liệu)
        const duplicate = await this._prisma.exam.findFirst({
            where: {
                licenseCategoryId: existing.props.licenseCategoryId,
                userId: existing.props.userId, // Thêm kiểm tra theo User nếu cần
                deletedAt: null,
                id: { not: id }
            }
        });

        if (duplicate) {
            // Nếu đã có đề thi mới đang chạy, không cho khôi phục cái cũ
            throw new AppError(ErrorCode.VALIDATION.RESTORE_FAILED_DUPLICATE);
        }

        // 3. Thực hiện khôi phục
        await this._examRepo.restore(id);

        const restored = await this._examRepo.findById(id);
        return ExamMapper.toResponse(restored!);
    }

    /**
     * @description Thực thi chiến lược "Xóa thông minh" (Smart Delete).
     * Nếu đề thi đã có kết quả/lịch sử -> Soft Delete. Nếu chưa có dữ liệu liên quan -> Hard Delete.
     * @param {string} id - ID của đề thi cần xóa.
     * @returns {Promise<void>}
     */
    public async deleteExam(id: string): Promise<void> {
        if (!id) {
            throw new AppError(ErrorCode.VALIDATION.ID_REQUIRED);
        }

        // 1. Kiểm tra tồn tại
        const existing = await this._examRepo.findById(id);
        if (!existing) {
            throw new AppError(ErrorCode.EXAM.NOT_FOUND);
        }

        // 2. Kiểm tra liên kết dữ liệu (ví dụ: liên kết với bảng kết quả hoặc lịch sử trả lời)
        // "Checking for linked data to ensure Data Integrity"
        // (Kiểm tra dữ liệu liên kết để đảm bảo tính toàn vẹn dữ liệu)
        const linkedCount = await this._examRepo.countRelatedData(id);
        const totalRelated = linkedCount.questions;

        if (totalRelated > 0) {
            // Trường hợp 1: Đã có kết quả thi -> Xóa mềm (Soft Delete) để giữ lịch sử
            await this._examRepo.softDelete(id);
        } else {
            // Trường hợp 2: Đề thi mới tạo, chưa làm -> Xóa cứng (Hard Delete) để dọn dẹp DB
            await this._examRepo.hardDelete(id);
        }
    }

    /**
     * @description Kiểm tra tính hợp lệ của các mối quan hệ và dữ liệu câu hỏi của Đề thi.
     * Đảm bảo mọi ID tham chiếu đều tồn tại trong Database trước khi thực hiện thao tác.
     */
    private async _validateExamRelations(
        licenseCategoryId: string,
        questionIds: string[],
        examMatrixId?: string | null
    ): Promise<void> {
        // 1. Tạo danh sách các tác vụ kiểm tra song song
        // "Defining parallel tasks to verify referential integrity"
        const validations: Promise<void>[] = [];

        // 2. Kiểm tra Hạng bằng lái
        validations.push(
            this._prisma.licenseCategory.findUnique({
                where: { id: licenseCategoryId },
                select: { id: true }
            }).then((exists): void => {
                if (!exists) throw new AppError(ErrorCode.VALIDATION.LICENSE_CATEGORY_REQUIRED);
            })
        );

        // 3. Kiểm tra Ma trận đề (nếu có)
        if (examMatrixId) {
            validations.push(
                this._prisma.examMatrix.findUnique({
                    where: { id: examMatrixId },
                    select: { id: true }
                }).then((exists): void => {
                    if (!exists) throw new AppError(ErrorCode.EXAM.INVALID_MATRIX_ID);
                })
            );
        }

        // 4. Kiểm tra sự tồn tại của danh sách câu hỏi (Quan trọng nhất)
        // Đảm bảo các ID câu hỏi không bị "fake"
        if (questionIds.length > 0) {
            validations.push(
                this._prisma.question.count({
                    where: {
                        id: { in: questionIds },
                        deletedAt: null // Chỉ tính các câu hỏi chưa bị xóa
                    }
                }).then((count): void => {
                    if (count !== questionIds.length) {
                        // "Throwing error if some question IDs do not exist in the system"
                        throw new AppError(ErrorCode.EXAM.QUESTION_DATA_INVALID);
                    }
                })
            );
        }

        // 5. Thực thi tất cả các kiểm tra đồng thời
        // "Executing all validations in parallel to optimize response time"
        await Promise.all(validations);
    }
}