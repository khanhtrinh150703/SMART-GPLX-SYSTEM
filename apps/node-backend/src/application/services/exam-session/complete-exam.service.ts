import { IExamRepository } from "@/domain/interfaces/repositories/exam-mgmt/i-exam.repository";
import { ExamAttemptMapper } from "@/infrastructure/database/mappers/exam-session/exam-attempt.mapper";
import { AppError, ErrorCode } from "@/shared/errors";
import { ICompleteExamService } from "@/domain/interfaces/services/exam-session/i-complete-exam.service";
import { IQuestionService } from "@/domain/interfaces/services/exam-mgmt/i-question.service";
import { IExamAttemptService } from "@/domain/interfaces/services/exam-session/i-exam-attempts.service";
import { IActiveSessionService } from "@/domain/interfaces/services/exam-session/i-active-session.service";
import { ExamMapper } from "@/infrastructure/database/mappers/exam-mgmt/exam.mapper";
import { CompleteExamInputDTO } from "@/application/dtos/request/exam/complete-exam.request.dto";
import { IExamResponse } from "@/application/dtos/response/exam/exam-response.dto";

export interface ICompleteExamCradle {
    examRepository: IExamRepository;
    questionService: IQuestionService;
    attemptService: IExamAttemptService;
    sessionService: IActiveSessionService;
    // userMatrixRepo: IUserMatrixRepository; // Mở ra nếu dùng sau này
}

/**
 * @description Service điều phối (Orchestrator) toàn bộ quy trình hoàn thành bài thi.
 * @principle Quy trình: Validate Session -> Get Metadata -> Get Content -> Calculate Logic -> Save Snapshot.
 */
export class CompleteExamService implements ICompleteExamService {
    private readonly _examRepo: IExamRepository;
    private readonly _questionService: IQuestionService;
    private readonly _attemptService: IExamAttemptService;
    private readonly _sessionService: IActiveSessionService;

    constructor({
        examRepository,
        questionService,
        attemptService,
        sessionService
    }: ICompleteExamCradle) {
        this._examRepo = examRepository;
        this._questionService = questionService;
        this._attemptService = attemptService;
        this._sessionService = sessionService;
    }

    /**
     * @description Chấm điểm, quyết định Đạt/Trượt và lưu kết quả bằng Transaction.
     * @param {string} examId - ID bài thi.
     * @param {CompleteExamInputDTO} dto - Danh sách đáp án thí sinh chọn.
     * @returns {Promise<IExamResponse>} Kết quả chi tiết sau khi chấm.
     */
    public async completeExam(userId: string, dto: CompleteExamInputDTO): Promise<IExamResponse> {
        // 1. Validate đầu vào
        dto.isValid();

        // 2. Lấy Entity từ DB (đã bao gồm questions bên trong)
        const exam = await this._examRepo.getByIdWithQuestions(dto.examId);
        if (!exam) throw new AppError(ErrorCode.EXAM.NOT_FOUND);

        // 3. Thực thi nghiệp vụ (Domain logic)
        exam.complete(dto.answers);

        const questionIds = exam.props.questions.map(q => q.questionId);
        const fullQuestions = await this._questionService.getQuestionsByIds(questionIds);

        // 5. MAPPING: Chuyển toàn bộ "Đề + Đáp án vừa nộp" sang Props cho NoSQL ExamAttempt
        const userAnswersMap = new Map(dto.answers.map(a => [a.questionId, a.answer]));

        const attemptProps = ExamAttemptMapper.toCreateProps(
            exam,
            fullQuestions,
            userAnswersMap
        );

        // 6. KHỞI TẠO ENTITY KẾT QUẢ

        // 7. LƯU TRỮ & DỌN DẸP (Chỉ làm việc với NoSQL)
        await Promise.all([
            this._attemptService.createAttempt(attemptProps),
            this._sessionService.deleteByUserId(userId)
        ]);

        // 4. Nếu ông muốn lưu NoSQL, hãy bắn Event ở đây
        // this._eventBus.publish(new ExamCompletedEvent(exam));
        return ExamMapper.toResponse(exam);
    }
}