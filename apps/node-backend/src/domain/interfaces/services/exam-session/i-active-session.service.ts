import { 
    IStartSessionInputDTO, 
    IUpdateAnswerInputDTO 
} from "@/application/dtos/request/active-session/active-session.request.dto";
import { IActiveSessionResponseDTO } from "@/application/dtos/response/active-session/active-session.response.dto";

/**
 * @description Giao diện quản lý phiên làm bài (Session) và bản nháp (Draft) của người dùng.
 */
export interface IActiveSessionService {
    /**
     * @description Khởi tạo phiên làm bài mới. Nếu đã có phiên cũ, có thể trả về phiên cũ hoặc ghi đè tùy logic.
     * @param {string} userId - ID người dùng.
     * @param {IStartSessionInputDTO} dto - Dữ liệu khởi tạo (examId, startTime...).
     */
    startSession(userId: string, dto: IStartSessionInputDTO): Promise<IActiveSessionResponseDTO>;

    /**
     * @description Cập nhật câu trả lời của người dùng vào bản nháp (Draft) trong NoSQL.
     * @param {string} userId - ID người dùng.
     * @param {IUpdateAnswerInputDTO} dto - Dữ liệu câu trả lời (questionId, selectedOption...).
     */
    updateAnswer(userId: string, dto: IUpdateAnswerInputDTO): Promise<void>;

    /**
     * @description Lấy thông tin phiên làm bài hiện tại để phục hồi trạng thái giao diện (Resume UI).
     * @param {string} userId - ID người dùng.
     * @returns {Promise<IActiveSessionResponseDTO | null>}
     */
    getCurrentSession(userId: string): Promise<IActiveSessionResponseDTO | null>;

    /**
     * @description Xóa toàn bộ phiên làm việc của một người dùng (Dùng khi đăng xuất hoặc hoàn thành bài).
     * @param {string} userId - ID người dùng cần xóa phiên.
     */
    deleteByUserId(userId: string): Promise<void>;
}