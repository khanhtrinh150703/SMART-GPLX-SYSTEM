import { ExamEntity } from "@/domain/entities/exam/exam.entity";
import { IExamMatrixRepository } from "@/domain/interfaces/repositories/exam-session/i-exam-matrix.repository";
import { IExamRepository } from "@/domain/interfaces/repositories/exam-mgmt/i-exam.repository";
import { IQuestionRepository } from "@/domain/interfaces/repositories/exam-mgmt/i-question.repository";
import { AppError, ErrorCode } from "@/shared/errors";
import { ExamPickerDomainService } from "../../../domain/service/exam-picker.domain.service";
import { ExamMapper } from "@/infrastructure/database/mappers/exam-mgmt/exam.mapper";
import { IExamQuestionProps } from "@/domain/entities/exam/exam.props";
import { IExamGeneratorService } from "@/domain/interfaces/services/exam-engine/i-exam-generator.service";
import { LICENSE_HIERARCHY } from "@/domain/constants/license-hierarchy.constant";
import { IMasterDataCacheService } from "@/domain/interfaces/services/exam-mgmt/i-master-data-cache.service";
import { GenerateExamDTO } from "@/application/dtos/request/exam/generate-exam.request.dto";
import { IExamResponse } from "@/application/dtos/response/exam/exam-response.dto";

/**
 * @interface IExamGeneratorServiceCradle
 * @description Tập hợp các phụ thuộc (dependencies) cần thiết để sinh đề thi.
 */
export interface IExamGeneratorServiceCradle {
    questionRepository: IQuestionRepository;
    examMatrixRepository: IExamMatrixRepository;
    examRepository: IExamRepository;
    masterDataCacheService: IMasterDataCacheService;
}

/**
 * @class ExamGeneratorService
 * @description Service chịu trách nhiệm điều phối quy trình tạo đề thi từ ma trận và kho câu hỏi.
 */
export class ExamGeneratorService implements IExamGeneratorService {
    private readonly _questionRepo: IQuestionRepository;
    private readonly _matrixRepo: IExamMatrixRepository;
    private readonly _examRepo: IExamRepository;
    private readonly _cacheService: IMasterDataCacheService;


    /**
     * @description Khởi tạo service bằng cách giải nén (destructure) từ Cradle.
     * @param {IExamGeneratorServiceCradle} cradle - Chứa các Repository cần thiết.
     */
    constructor({
        questionRepository,
        examMatrixRepository,
        examRepository,
        masterDataCacheService
    }: IExamGeneratorServiceCradle) {
        this._questionRepo = questionRepository;
        this._matrixRepo = examMatrixRepository;
        this._examRepo = examRepository;
        this._cacheService = masterDataCacheService;
    }

    /**
     * @description Khởi tạo đề thi ngẫu nhiên từ ma trận cấu hình.
     * @param {GenerateExamDTO} dto - Thông tin matrixId và hạng bằng.
     * @returns {Promise<IExamResponse>} Đề thi kèm danh sách câu hỏi.
     */
    public async generate(dto: GenerateExamDTO): Promise<IExamResponse> {
        const matrix = await this._matrixRepo.findById(dto.matrixId);

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
        const questionEntities = await this._questionRepo.getByLicenseCategory(subLicenses);
        const pool = questionEntities.map(q => q.props);
        const pickedQuestions = ExamPickerDomainService.execute(pool, matrix.props);

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

        // const savedExam = await this._examRepo.save(exam);
        return ExamMapper.toResponse(exam);
    }
}