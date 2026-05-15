import { ActiveSessionEntity } from "@/domain/entities/active-session/active-session.entity";
import { AppError, ErrorCode } from "@/shared/errors";
import { IActiveSessionService } from "@/domain/interfaces/services/exam-session/commands/i-active-session.service";
import { ActiveSessionMapper } from "@/infrastructure/database/mappers/exam-session/active-session.mapper";
import { StartSessionRequestDTO, UpdateAnswerRequestDTO } from "@/application/dtos/request/active-session/active-session.request.dto";
import { IActiveSessionResponseDTO } from "@/application/dtos/response/active-session/active-session.response.dto";
import { IActiveSessionRepository } from "@/domain/interfaces/repositories";
import { IExamQueryService } from "@/domain/interfaces/services/exam-mgmt/queries";
import { IDeleteResponseDTO, DeleteResponseDTO } from "@/application/dtos/response/shared/delete.response.dto";
import { DeleteType } from "@/domain/constants/delete.constant";

/**
 * @interface IActiveSessionCradle
 * @description Container chứa các phụ thuộc (dependencies) cần thiết để khởi tạo ActiveSessionService.
 */
export interface IActiveSessionCradle {
    /** @description Repository quản lý lưu trữ và truy vấn phiên làm bài (thường là MongoDB/Redis). */
    activeSessionRepository: IActiveSessionRepository;

    /** @description Dịch vụ truy vấn thông tin chi tiết đề thi từ cơ sở dữ liệu chính. */
    examQueryService: IExamQueryService;
}

/**
 * @class ActiveSessionService
 * @description Quản lý vòng đời phiên hoạt động và trạng thái tạm thời của người dùng trong quá trình thi.
 * @principle Clean Architecture - Điều phối giữa lớp hạ tầng (Repository) và logic nghiệp vụ bài thi.
 */
export class ActiveSessionService implements IActiveSessionService {
    /** 
     * @private 
     * @readonly 
     * @description Instance xử lý các thao tác lưu trữ dữ liệu phiên. 
     */
    private readonly _sessionRepo: IActiveSessionRepository;

    /** 
     * @private 
     * @readonly 
     * @description Instance truy vấn dữ liệu đề thi từ hệ thống. 
     */
    private readonly _examQueryService: IExamQueryService;

    /**
     * @constructor
     * @param {IActiveSessionCradle} cradle - Danh sách các phụ thuộc được inject tự động thông qua Container.
     */
    constructor({ activeSessionRepository, examQueryService }: IActiveSessionCradle) {
        this._sessionRepo = activeSessionRepository;
        this._examQueryService = examQueryService;
    }

    /**
     * @description Khởi tạo phiên làm bài mới. 
     * Nếu là User: Kiểm tra trùng lặp và lưu vào NoSQL. 
     * Nếu là Guest: Chỉ khởi tạo thực thể trong bộ nhớ, không lưu DB.
     * @param {string} userId - ID định danh của người dùng hoặc khách.
     * @param {StartSessionRequestDTO} dto - Dữ liệu yêu cầu bắt đầu phiên (chứa examId).
     * @param {boolean} [isGuest=false] - Cờ xác định chế độ khách không lưu vết.
     * @returns {Promise<IActiveSessionResponseDTO>} DTO thông tin phiên làm bài đang hoạt động.
     * @throws {AppError} SYSTEM.ALREADY_EXISTS - Nếu User đã có phiên làm bài khác.
     * @throws {AppError} EXAM.NOT_FOUND - Nếu mã đề thi không tồn tại trong hệ thống.
     */
    public async startSession(
        userId: string,
        dto: StartSessionRequestDTO,
        isGuest: boolean = false
    ): Promise<IActiveSessionResponseDTO> {

        // 1. Kiểm tra tồn tại và xử lý logic 'isForce' cho User đăng nhập
        if (!isGuest) {
            const existingSession = await this._sessionRepo.findByUserId(userId);

            if (existingSession) {
                // TH1: Người dùng YÊU CẦU làm lại từ đầu -> Xóa session cũ
                if (dto.isForce) {
                    await this._sessionRepo.deleteByUserId(userId);
                }
                // TH2: Người dùng KHÔNG YÊU CẦU xóa -> Xử lý theo logic Resume
                else {
                    if (existingSession.props.examId === dto.examId) {
                        return ActiveSessionMapper.toResponse(existingSession);
                    }
                    throw new AppError(ErrorCode.SYSTEM.ALREADY_EXISTS);
                }
            }
        }

        // 2. Kiểm tra đề thi tồn tại (MySQL)
        const exam = await this._examQueryService.getExamById(dto.examId);
        if (!exam) throw new AppError(ErrorCode.EXAM.NOT_FOUND);

        // 3. Khởi tạo Entity mới cho phiên làm bài
        const expiresAt = new Date();
        expiresAt.setMinutes(expiresAt.getMinutes() + 60);

        const session = ActiveSessionEntity.create({
            userId,
            examId: dto.examId,
            currentAnswers: [],
            expiresAt
        });

        // 4. KIỂM SOÁT HẠ TẦNG: Lưu vào NoSQL nếu là User
        if (!isGuest) {
            await this._sessionRepo.createActiveSession(session);
        }

        // 5. Trả về Response DTO
        return ActiveSessionMapper.toResponse(session);
    }

    /**
     * @description Cập nhật đáp án theo thời gian thực vào bản nháp.
     * @param {string} userId - ID người dùng. (User ID).
     * @param {UpdateAnswerRequestDTO} dto - Dữ liệu câu trả lời mới. (New answer data).
     * @returns {Promise<IActiveSessionResponseDTO>} Phiên làm bài mới nhất sau khi cập nhật.
     */
    public async updateAnswer(
        _userId: string,
        dto: UpdateAnswerRequestDTO,
    ): Promise<IActiveSessionResponseDTO> {
        // 1. Tìm phiên làm bài đang hoạt động (Find active session)
        const session = await this._sessionRepo.findById(dto.sessionId);
        if (!session) {
            throw new AppError(ErrorCode.ACTIVE_SESSION.NOT_FOUND);
        }
        // 2. Domain Logic: Cập nhật trạng thái ngay trong Entity Object
        // (Domain Logic: Update state within Entity Object)
        // Đảm bảo Entity sẽ tự xử lý logic như thay đổi updatedAt của câu trả lời
        session.syncAnswers(dto.answers, dto.currentQuestionIndex);

        // 3. Persist: Đồng bộ trạng thái mới xuống Database (NoSQL/Redis)
        // (Persist: Sync new state down to Database)
        await this._sessionRepo.updateActiveSession(session);

        // 4. Trả về DTO thông qua Mapper
        // (Return DTO via Mapper to ensure clean, structured data for Frontend)
        return ActiveSessionMapper.toResponse(session);
    }

    /**
     * @description Truy xuất phiên làm việc hiện tại và tự động xóa nếu đã hết hạn.
     * @param {string} userId - ID định danh của người dùng.
     * @returns {Promise<IActiveSessionResponseDTO | null>} DTO phiên hoạt động hoặc null nếu không tồn tại/hết hạn.
     */
    public async getCurrentSession(userId: string): Promise<IActiveSessionResponseDTO | null> {
        const session = await this._sessionRepo.findByUserId(userId);
        if (!session) return null;

        // Kiểm tra hết hạn
        if (new Date() > session.props.expiresAt) {
            await this._sessionRepo.deleteByUserId(userId);
            return null;
        }

        return ActiveSessionMapper.toResponse(session);
    }

    /**
     * @description Xóa sạch các phiên làm việc của người dùng khỏi hệ thống.
     * @param {string} userId - ID của người dùng cần xóa phiên. (The ID of the user whose sessions will be cleared.)
     * @returns {Promise<IDeleteResponseDTO>} Kết quả xác nhận thao tác xóa thành công.
     */
    public async deleteByUserId(userId: string): Promise<IDeleteResponseDTO> {
        if( !userId) {
            throw new AppError(ErrorCode.SYSTEM.INVALID_INPUT)
        }
        // 1. Thực hiện xóa toàn bộ dữ liệu phiên trong Repository (NoSQL/Cache)
        // (Clear all session data in the Repository)
        await this._sessionRepo.deleteByUserId(userId);

        // 2. Trả về DTO phản hồi tiêu chuẩn thay vì void
        // Vì đây là hành động dọn dẹp hoàn toàn, ta sử dụng DeleteType.HARD
        return new DeleteResponseDTO({
            id: userId,
            type: DeleteType.HARD,
        });
    }
}