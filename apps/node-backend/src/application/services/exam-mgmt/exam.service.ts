import { IExamRepository } from '@/domain/interfaces/repositories/exam-mgmt/i-exam.repository';
import { IExamService } from '@/domain/interfaces/services/exam-mgmt/i-exam.service';
import { AppError, ErrorCode } from '@/shared/errors';
import { PrismaClient } from '@prisma/client';
import { ExamEntity } from '@/domain/entities/exam/exam.entity';
import { IQuestionService } from '@/domain/interfaces/services/exam-mgmt/i-question.service';


export interface IExamCradle {
    examRepository: IExamRepository;
    questionService: IQuestionService;
    prisma: PrismaClient;
}

/**
 * @description Service thực thi logic nghiệp vụ cho Exam.
 * @principle Clean Architecture - Logic nghiệp vụ nằm trong Domain Entity.
 */
export class ExamService implements IExamService {
    private readonly _examRepo: IExamRepository;
    private readonly _questionService: IQuestionService;
    private readonly _prisma: PrismaClient;

    constructor({ examRepository, prisma, questionService }: IExamCradle) {
        this._examRepo = examRepository;
        this._prisma = prisma;
        this._questionService = questionService;
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


}