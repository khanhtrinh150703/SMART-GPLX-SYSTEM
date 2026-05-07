import { IExamRepository } from '@/domain/interfaces/repositories/exam-mgmt/i-exam.repository';
import { IExamService } from '@/domain/interfaces/services/exam-mgmt/i-exam.service';
import { AppError, ErrorCode } from '@/shared/errors';
import { ExamStatus, PrismaClient } from '@prisma/client';
import { ExamMapper } from '@/infrastructure/database/mappers';
import { IExamResponseDTO } from '@/application/dtos/response/exam/exam.response.dto';
import { UpdateExamRequestDTO } from '@/application/dtos/request/exam/update-exam.request.dto';
import { CreateManualExamRequestDTO } from '@/application/dtos/request/exam/create-exam-manual.request.dto';
import { ExamEntity } from '@/domain/entities/exam/exam.entity';
import { IQuestionQueryService } from '@/domain/interfaces/services/exam-mgmt/queries';
import { IMasterDataCacheService } from '@/domain/interfaces/services/exam-mgmt';
import { IExamQuestionProps } from '@/domain/entities/exam/exam.props';
import { DeleteResponseDTO, IDeleteResponseDTO } from '@/application/dtos/response/shared/delete.response.dto';
import { DeleteType } from '@/domain/constants/delete.constant';

/**
 * @interface IExamCradle
 * @description Tập hợp các phụ thuộc (Dependencies) cần thiết cho luồng nghiệp vụ tổ chức thi và chấm điểm.
 */
export interface IExamCradle {
    /** @description Repository quản lý lưu trữ và thay đổi trạng thái lượt thi (Exam Attempt). */
    examRepository: IExamRepository;

    /** @description Dịch vụ truy vấn ngân hàng câu hỏi để phục vụ việc sinh đề thi. */
    questionQueryService: IQuestionQueryService;

    /** @description Dịch vụ quản lý bộ nhớ đệm cho các cấu hình bài thi hoặc Master Data. */
    masterDataCacheService: IMasterDataCacheService;

    /** @description Instance ORM để quản lý các giao dịch (Transactions) đa repository. */
    prisma: PrismaClient;
}

/**
 * @class ExamService
 * @description Dịch vụ điều phối (Orchestration) các nghiệp vụ phức tạp liên quan đến lượt thi, sinh đề tự động và chấm điểm.
 * @principle Clean Architecture & Transactional - Logic nghiệp vụ chính nằm trong Entity, đảm bảo toàn vẹn dữ liệu qua giao dịch Database.
 */
export class ExamService implements IExamService {
    /** @private @readonly @description Repository lượt thi. */
    private readonly _examRepo: IExamRepository;

    /** @private @readonly @description Dịch vụ truy vấn câu hỏi. */
    private readonly _questionQueryService: IQuestionQueryService;

    /** @private @readonly @description Dịch vụ quản lý cache. */
    private readonly _cacheService: IMasterDataCacheService;

    /** @private @readonly @description Client quản lý giao dịch database. */
    private readonly _prisma: PrismaClient;

    /**
     * @constructor
     * @description Khởi tạo ExamService với các công cụ điều phối nghiệp vụ và quản lý giao dịch.
     * @param {IExamCradle} cradle - Chứa các phụ thuộc được tiêm qua cơ chế DI Proxy.
     */
    constructor({ examRepository, prisma, questionQueryService, masterDataCacheService }: IExamCradle) {
        this._examRepo = examRepository;
        this._cacheService = masterDataCacheService;
        this._questionQueryService = questionQueryService;
        this._prisma = prisma;
    }

    /**
     * @description Khởi tạo bài thi thủ công từ danh sách câu hỏi được chỉ định.
     * @param {CreateManualExamRequestDTO} dto - Dữ liệu yêu cầu tạo đề thi.
     * @returns {Promise<IExamResponseDTO>} Thông tin bài thi đã được khởi tạo.
     * @throws {AppError} QUESTION.NOT_FOUND - Khi ID câu hỏi không tồn tại.
     * @throws {AppError} EXAM.INSUFFICIENT_CRITICAL_QUESTIONS - Không đủ câu hỏi điểm liệt.
     */
    public async createManual(dto: CreateManualExamRequestDTO): Promise<IExamResponseDTO> {
        // 1. Kiểm tra tính toàn vẹn tham chiếu (License, Matrix, Questions)
        await this._validateExamRelations(
            dto.licenseCategoryId,
            dto.questionIds,
            dto.examMatrixId
        );

        // 2. Lấy thông tin chi tiết các câu hỏi từ Repository để tạo Snapshot
        // "Fetching full question details to create an immutable snapshot for the exam"
        const questionsFromDb = await this._questionQueryService.getQuestionsByIds(dto.questionIds);

        // 3. Kiểm tra tính nhất quán về số lượng
        if (questionsFromDb.length !== dto.questionIds.length) {
            throw new AppError(ErrorCode.QUESTION.NOT_FOUND, "Một số câu hỏi được chọn không tồn tại hoặc đã bị xóa.");
        }

        // 4. Khởi tạo Aggregate Root qua Factory Method
        const exam = ExamEntity.create({
            name: dto.name,
            userId: dto.userId,
            licenseCategoryId: dto.licenseCategoryId,
            examMatrixId: dto.examMatrixId,
            totalQuestions: dto.totalQuestions,
            durationMinutes: dto.durationMinutes,
            passingScore: dto.passingScore,
            minCriticalQuestions: dto.minCriticalQuestions,
            rawQuestions: questionsFromDb,
            status: ExamStatus.PUBLISHED,
        });

        // 5. Lưu trữ Persistence và trả về kết quả qua Mapper
        const savedExam = await this._examRepo.createExam(exam);

        return ExamMapper.toResponse(savedExam);
    }

    /**
     * @description Cập nhật thông tin đề thi theo tư duy hướng hành vi (Behavior-Oriented).
     * @param {string} id - ID của đề thi cần cập nhật.
     * @param {UpdateExamRequestDTO} dto - Dữ liệu các trường cần thay đổi.
     * @returns {Promise<IExamResponseDTO>} Thông tin đề thi sau khi cập nhật thành công.
     */
    public async updateExam(id: string, dto: UpdateExamRequestDTO): Promise<IExamResponseDTO> {
        // 1. Tìm thực thể gốc và kiểm tra trạng thái
        const exam = await this._examRepo.findById(id);
        if (!exam || exam.isDeleted()) {
            throw new AppError(ErrorCode.EXAM.NOT_FOUND);
        }

        // 2. Chuẩn bị dữ liệu cho Validation & Enriching
        let updatedQuestions: IExamQuestionProps[] | undefined = undefined;

        // Xác định các ID quan hệ "hiệu lực" (Ưu tiên DTO, nếu không có thì lấy từ thực thể cũ)
        const effectiveLicenseId = dto.licenseCategoryId ?? exam.props.licenseCategoryId;
        const effectiveMatrixId = dto.examMatrixId !== undefined ? dto.examMatrixId : exam.props.examMatrixId;

        // 3. Xử lý logic Snapshot nếu Client cập nhật danh sách câu hỏi
        if (dto.questionIds && dto.questionIds.length > 0) {
            const questionsFromDb = await this._questionQueryService.getQuestionsByIds(dto.questionIds);

            if (questionsFromDb.length !== dto.questionIds.length) {
                throw new AppError(ErrorCode.QUESTION.NOT_FOUND, "Một số ID câu hỏi không hợp lệ.");
            }

            // Map chi tiết câu hỏi sang Snapshot props
            updatedQuestions = questionsFromDb.map((q, index) => ({
                questionId: q.id,
                indexNumber: index + 1,
                isCritical: q.props.isCritical,
                correctAnswer: (q.props.answers?.findIndex(a => a.isCorrect) ?? -1) + 1,
                chapterId: q.props.chapterId,
                chapterName: q.props.chapterName
            }));
        }

        // 4. Validate toàn bộ quan hệ (Chạy sau khi đã có đầy đủ thông tin bổ trợ)
        await this._validateExamRelations(effectiveLicenseId, dto.questionIds, effectiveMatrixId);

        // 5. Cập nhật thực thể (Chỉ truyền những gì Entity cần, loại bỏ metadata của DTO)
        const { questionIds: _questionIds, ...updateData } = dto;
        exam.update({
            ...updateData,
            questions: updatedQuestions
        });

        // 6. Lưu trữ và trả về kết quả
        // ID đã nằm sẵn trong thực thể 'exam'
        const saved = await this._examRepo.updateExam(exam);

        return ExamMapper.toResponse(saved);
    }

    /**
     * @description Khôi phục một Đề thi đã bị xóa mềm (Soft Delete).
     * @param {string} id - Mã định danh duy nhất (UUID) của Đề thi cần khôi phục.
     * @returns {Promise<IExamResponseDTO>} Đối tượng DTO chứa thông tin Đề thi sau khi phục hồi.
     */
    public async restoreExam(id: string): Promise<IExamResponseDTO> {
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
     * @description Thực thi chiến lược "Xóa thông minh" (Smart Delete) cho đề thi.
     * @param {string} id - ID của đề thi cần xóa. (The ID of the exam to be deleted.)
     * @returns {Promise<IDeleteResponseDTO>} Kết quả thao tác xóa kèm thông báo định dạng sẵn.
     */
    public async deleteExam(id: string): Promise<IDeleteResponseDTO> {
        if (!id) {
            throw new AppError(ErrorCode.VALIDATION.ID_REQUIRED);
        }

        // 1. Kiểm tra tồn tại (Ném lỗi 404 nếu không tìm thấy)
        // (Check existence - Throws 404 if not found)
        const existing = await this._examRepo.findById(id);
        if (!existing) {
            throw new AppError(ErrorCode.EXAM.NOT_FOUND);
        }

        // 2. Kiểm tra dữ liệu liên kết để đảm bảo tính toàn vẹn (Kết quả thi, lịch sử làm bài)
        // (Checking for linked data to ensure Data Integrity - Exam results, attempt history)
        const linkedCount = await this._examRepo.countRelatedData(id);
        const totalRelated = linkedCount.questions; // Tổng các ràng buộc quan trọng

        let type: DeleteType;

        // 3. Quyết định hướng xử lý dựa trên ràng buộc (Decision logic based on constraints)
        if (totalRelated > 0) {
            // TRƯỜNG HỢP 1: Đã có kết quả thi -> Xóa mềm để giữ lịch sử
            // (Case 1: Already has results -> Soft Delete to preserve history)
            await this._examRepo.softDelete(id);
            type = DeleteType.SOFT;
        } else {
            // TRƯỜNG HỢP 2: Đề thi mới tạo, chưa ai làm -> Xóa cứng để dọn dẹp DB
            // (Case 2: Newly created exam, no attempts -> Hard Delete to clean up DB)
            await this._examRepo.hardDelete(id);
            type = DeleteType.HARD;
        }

        // 4. Đồng bộ hóa Cache nếu cần (Sync Cache if necessary)

        // 5. Trả về DTO - Logic tạo tin nhắn đã nằm gọn trong Class DeleteResponseDTO
        // (Return DTO - Message generation logic is encapsulated within DeleteResponseDTO)
        return new DeleteResponseDTO({
            id,
            type,
            count: totalRelated
        });
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