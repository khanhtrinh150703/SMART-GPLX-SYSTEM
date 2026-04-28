import { ActiveSessionEntity } from "@/domain/entities/active-session/active-session.entity";
import { AppError, ErrorCode } from "@/shared/errors";
import { IActiveSessionService } from "@/domain/interfaces/services/exam-session/i-active-session.service";
import { IExamService } from "@/domain/interfaces/services/exam-mgmt/i-exam.service";
import { ActiveSessionMapper } from "@/infrastructure/database/mappers/exam-session/active-session.mapper";
import { IStartSessionInputDTO, IUpdateAnswerInputDTO } from "@/application/dtos/request/active-session/active-session.request.dto";
import { IActiveSessionResponseDTO } from "@/application/dtos/response/active-session/active-session.response.dto";
import { IActiveSessionRepository } from "@/domain/interfaces/repositories";

export interface IActiveSessionCradle {
    sessionRepository: IActiveSessionRepository;
    examService: IExamService;
}

/**
 * @class ActiveSessionService
 * @description Quản lý các phiên hoạt động và trạng thái tạm thời của người dùng.
 * @principle Clean Architecture - Điều phối giữa lưu trữ Session và kiểm tra logic bài thi.
 */
export class ActiveSessionService implements IActiveSessionService {
    private readonly _sessionRepo: IActiveSessionRepository;
    private readonly _examService: IExamService;

    constructor({ sessionRepository, examService }: IActiveSessionCradle) {
        this._sessionRepo = sessionRepository;
        this._examService = examService;
    }

    /**
     * @description Bắt đầu phiên làm bài. Nếu đã có phiên cũ của cùng examId thì trả về luôn.
     */
    public async startSession(userId: string, dto: IStartSessionInputDTO): Promise<IActiveSessionResponseDTO> {
        // 1. Kiểm tra xem User đã có phiên làm bài nào chưa
        const existingSession = await this._sessionRepo.findByUserId(userId);

        if (existingSession) {
            // Nếu đang làm dở chính đề này thì trả về để resume
            if (existingSession.props.examId === dto.examId) {
                return ActiveSessionMapper.toResponse(existingSession);
            }
            // Nếu làm đề khác, có thể xóa phiên cũ hoặc báo lỗi
            throw new AppError(ErrorCode.SYSTEM.ALREADY_EXISTS);
        }

        // 2. Kiểm tra đề thi có tồn tại trong MySQL không
        const exam = await this._examService.getExamById(dto.examId);
        if (!exam) throw new AppError(ErrorCode.EXAM.NOT_FOUND);

        // 3. Khởi tạo Entity mới (Hết hạn sau 60 phút)
        const expiresAt = new Date();
        expiresAt.setMinutes(expiresAt.getMinutes() + 60);

        const session = ActiveSessionEntity.create({
            userId,
            examId: dto.examId,
            currentAnswers: [],
            expiresAt
        });

        // 4. Lưu vào NoSQL
        await this._sessionRepo.createActiveSession(session);

        return ActiveSessionMapper.toResponse(session);
    }

    /**
     * @description Cập nhật đáp án theo thời gian thực.
     */
    public async updateAnswer(userId: string, dto: IUpdateAnswerInputDTO): Promise<void> {
        const session = await this._sessionRepo.findByUserId(userId);
        if (!session) throw new AppError(ErrorCode.ACTIVE_SESSION.NOT_FOUND);

        // Sử dụng Domain Method đã viết cực "chặt" ở Entity (Không any)
        session.updateAnswer(dto.questionId, dto.selectedAnswerId);

        // Persist vào NoSQL
        await this._sessionRepo.updateActiveSession(session);
    }

    public async getCurrentSession(userId: string): Promise<IActiveSessionResponseDTO | null> {
        const session = await this._sessionRepo.findByUserId(userId);
        if (!session) return null;

        // Kiểm tra hết hạn
        if (new Date() > session.props.expiresAt) {
            await this._sessionRepo.delete(session.id!);
            return null;
        }

        return ActiveSessionMapper.toResponse(session);
    }

    /**
     * @description Xóa sạch các phiên làm việc của người dùng.
     */
    public async deleteByUserId(userId: string): Promise<void> {
        await this._sessionRepo.delete(userId);
    }
}