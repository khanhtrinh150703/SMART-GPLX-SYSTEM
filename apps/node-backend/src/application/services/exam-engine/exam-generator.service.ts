import { ExamEntity } from "@/domain/entities/exam/exam.entity";
import { IExamRepository } from "@/domain/interfaces/repositories/exam-mgmt/i-exam.repository";
import { AppError, ErrorCode } from "@/shared/errors";
import { ExamMapper } from "@/infrastructure/database/mappers/exam-mgmt/exam.mapper";
import { IExamQuestionProps } from "@/domain/entities/exam/exam.props";
import { IExamGeneratorService } from "@/domain/interfaces/services/exam-engine/i-exam-generator.service";
import { LICENSE_HIERARCHY } from "@/domain/constants/license-hierarchy.constant";
import { IMasterDataCacheService } from "@/domain/interfaces/services/exam-mgmt/i-master-data-cache.service";
import { GenerateExamDTO } from "@/application/dtos/request/exam/generate-exam.request.dto";
import { IExamResponse } from "@/application/dtos/response/exam/exam-response.dto";
import { IExamPickerDomainService } from "@/domain/interfaces/services/exam-engine/i-exam-picker.service";
import { ExamStatus } from "@prisma/client";
import { CreateManualExamDTO } from "@/application/dtos/request/exam/create-exam-manual.request.dto";
import { IExamMatrixService } from "@/domain/interfaces/services/exam-session";
import { IQuestionService } from "@/domain/interfaces/services/exam-mgmt";

/**
 * @interface IExamGeneratorServiceCradle
 * @description Tập hợp các phụ thuộc (dependencies) cần thiết để sinh đề thi.
 */
export interface IExamGeneratorServiceCradle {
    examRepository: IExamRepository;
    examMatrixService: IExamMatrixService;
    questionService: IQuestionService;
    masterDataCacheService: IMasterDataCacheService;
    examPickerService: IExamPickerDomainService;
}

/**
 * @class ExamGeneratorService
 * @description Service chịu trách nhiệm điều phối quy trình tạo đề thi từ ma trận và kho câu hỏi.
 */
export class ExamGeneratorService implements IExamGeneratorService {
    private readonly _examRepo: IExamRepository;
    private readonly _cacheService: IMasterDataCacheService;
    private readonly _examPickerService: IExamPickerDomainService;
    private readonly _matrixService: IExamMatrixService;
    private readonly _questionService: IQuestionService;


    /**
     * @description Khởi tạo service bằng cách giải nén (destructure) từ Cradle.
     * @param {IExamGeneratorServiceCradle} cradle - Chứa các Repository cần thiết.
     */
    constructor({
        examRepository,
        examMatrixService,
        questionService,
        masterDataCacheService,
        examPickerService
    }: IExamGeneratorServiceCradle) {
        this._examRepo = examRepository;
        this._matrixService = examMatrixService;
        this._questionService = questionService;
        this._cacheService = masterDataCacheService;
        this._examPickerService = examPickerService;
    }

    /**
     * @description Khởi tạo đề thi ngẫu nhiên từ ma trận cấu hình.
     * @param {GenerateExamDTO} dto - Thông tin matrixId và hạng bằng.
     * @returns {Promise<IExamResponse>} Đề thi kèm danh sách câu hỏi.
     */
    public async generate(dto: GenerateExamDTO): Promise<IExamResponse> {
        const matrix = await this._matrixService.getById(dto.matrixId);

        if (!matrix) throw new AppError(ErrorCode.EXAM.NOT_FOUND);

        const category = this._cacheService.getCategoryById(matrix.props.licenseCategoryId);

        if (!category) {
            throw new AppError(ErrorCode.LICENSE.NOT_FOUND)
        }
        const targetName = category.name;

        const subLicenses = Array.from(new Set([
            targetName,
            ...(LICENSE_HIERARCHY[targetName] || [])
        ]));

        // pool lúc này là IQuestionProps[]
        const questionEntities = await this._questionService.getByLicenseCategory(subLicenses);
        const pool = questionEntities.map(q => q.props);
        const pickedQuestions = this._examPickerService.execute(pool, matrix.props);

        // 1. Đảm bảo lấy đúng LicenseCategoryId từ Matrix Entity
        const matrixProps = matrix.props;

        const exam = ExamEntity.create({
            name: dto.name,
            userId: dto.userId,
            examMatrixId: dto.matrixId,
            licenseCategoryId: matrixProps.licenseCategoryId,
            totalQuestions: matrixProps.totalQuestions,
            passingScore: matrixProps.passingScore,
            durationMinutes: matrixProps.durationMinutes,
            minCriticalQuestions: matrixProps.minCriticalQuestions,
            status: ExamStatus.PUBLISHED,
            questions: pickedQuestions.map((q): IExamQuestionProps => {
                const correctAns = q.answers.findIndex(a => a.isCorrect);

                if (correctAns === -1) {
                    throw new AppError(ErrorCode.EXAM.QUESTION_DATA_INVALID, `Câu hỏi ${q.id} thiếu đáp án đúng.`);
                }

                return {
                    questionId: q.id ?? '',
                    indexNumber: q.indexNumber,
                    isCritical: q.isCritical,
                    chapterName: this._cacheService.getChapterById(q.chapterId)?.name,
                    correctAnswer: correctAns + 1,
                };
            })
        });

        const savedExam = await this._examRepo.createExam(exam);
        return ExamMapper.toResponse(savedExam);
    }

    /**
     * @description Khởi tạo bài thi thủ công.
     * Quy trình: Validate -> Fetch Questions -> Map Snapshot -> Create Entity -> Persist.
     */
    public async createManual(dto: CreateManualExamDTO): Promise<IExamResponse> {
        // 1. Kiểm tra tính toàn vẹn tham chiếu (License, Matrix, Questions)
        await this._validateExamRelations(
            dto.licenseCategoryId,
            dto.questionIds,
            dto.examMatrixId
        );

        // 2. Lấy thông tin chi tiết các câu hỏi từ Repository để tạo Snapshot
        // "Fetching full question details to create an immutable snapshot for the exam"
        const questionsFromDb = await this._questionService.getQuestionsByIds(dto.questionIds);

        // KIỂM TRA BỔ SUNG: Đảm bảo số lượng câu hỏi lấy được khớp với số ID gửi lên
        if (questionsFromDb.length !== dto.questionIds.length) {
            throw new AppError(ErrorCode.QUESTION.NOT_FOUND, "Một số câu hỏi được chọn không tồn tại hoặc đã bị xóa.");
        }

        // 3. Ánh xạ dữ liệu câu hỏi sang định dạng Snapshot (IExamQuestionProps)
        // "Mapping domain questions to exam-specific snapshot properties"
        const examQuestions: IExamQuestionProps[] = questionsFromDb.map((q, index) => {
            const correctAnsIndex = q.answers.findIndex(a => a.isCorrect);

            if (correctAnsIndex === -1) {
                throw new AppError(
                    ErrorCode.EXAM.QUESTION_DATA_INVALID,
                    `Câu hỏi ID: ${q.id} thiếu đáp án đúng để chấm điểm.`
                );
            }

            return {
                questionId: q.id,
                indexNumber: index + 1,
                isCritical: q.isCritical,
                correctAnswer: correctAnsIndex + 1, // Chuyển sang 1-index
                chapterName: this._cacheService.getChapterById(q.props.chapterId)?.name || "Chương chưa xác định",
            };
        });

        // 4. Kiểm tra ràng buộc nghiệp vụ về số lượng câu hỏi điểm liệt
        // "Verifying if the manually selected questions meet the minimum critical requirement"
        const actualCriticalCount = examQuestions.filter(q => q.isCritical).length;
        if (actualCriticalCount < dto.minCriticalQuestions) {
            throw new AppError(
                ErrorCode.EXAM.INSUFFICIENT_CRITICAL_QUESTIONS,
                `Đề thi cần tối thiểu ${dto.minCriticalQuestions} câu điểm liệt (Hiện có: ${actualCriticalCount}).`
            );
        }

        // 5. Khởi tạo thực thể Exam (Aggregate Root) thông qua Factory Method
        // "Instantiating the Exam aggregate with the processed snapshot data"
        const exam = ExamEntity.create({
            name: dto.name,
            userId: dto.userId,
            licenseCategoryId: dto.licenseCategoryId,
            examMatrixId: dto.examMatrixId,
            totalQuestions: dto.totalQuestions ?? examQuestions.length,
            durationMinutes: dto.durationMinutes,
            passingScore: dto.passingScore,
            minCriticalQuestions: dto.minCriticalQuestions,
            questions: examQuestions,
            status: ExamStatus.PUBLISHED,
        });

        // 6. Lưu trữ vào MySQL và trả về kết quả qua Mapper
        // "Persisting the exam session and returning the mapped response DTO"
        const savedExam = await this._examRepo.createExam(exam);

        return ExamMapper.toResponse(savedExam);
    }

    /**
       * @description Kiểm tra tính hợp lệ của các quan hệ thông qua các Service chuyên biệt.
       * "Delegating validation to specific domain services to maintain layer separation"
       */
    private async _validateExamRelations(
        licenseCategoryId: string,
        questionIds: string[],
        examMatrixId?: string | null
    ): Promise<void> {
        const validations: Promise<void>[] = [];

        // 1. Kiểm tra Hạng bằng lái (Dùng Cache cho nhanh vì data này ít biến động)
        // "Referencing Master Cache for static data validation"
        const licenseExists = this._cacheService.getCategoryById(licenseCategoryId);
        if (!licenseExists) {
            throw new AppError(ErrorCode.VALIDATION.LICENSE_CATEGORY_REQUIRED);
        }

        // 2. Kiểm tra Ma trận đề (Giao cho MatrixService xử lý)
        if (examMatrixId) {
            validations.push(this._matrixService.validateExistence(examMatrixId));
        }

        // 3. Kiểm tra danh sách câu hỏi (Giao cho QuestionService xử lý)
        // "Enforcing referential integrity via Question Service"
        if (questionIds.length > 0) {
            validations.push(this._questionService.validateExistence(questionIds));
        }

        // 4. Thực thi song song để tối ưu performance
        await Promise.all(validations);
    }
}