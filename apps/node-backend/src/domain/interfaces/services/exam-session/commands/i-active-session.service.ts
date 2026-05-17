import {
    StartSessionRequestDTO,
    UpdateAnswerRequestDTO
} from "@/application/dtos/request/active-session/active-session.request.dto";
import { IActiveSessionResponseDTO } from "@/application/dtos/response/active-session/active-session.response.dto";
import { IDeleteResponseDTO } from "@/application/dtos/response/shared/delete.response.dto";

/**
 * @description Giao diện quản lý phiên làm bài (Session) và bản nháp (Draft) của người dùng.
 */
export interface IActiveSessionService {
    /**
     * @description Khởi tạo phiên làm bài mới. 
     * @param {string} userId - ID người dùng (hoặc Guest ID).
     * @param {StartSessionRequestDTO} dto - Dữ liệu khởi tạo.
     * @param {boolean} isGuest - Cờ xác định có phải khách thi thử hay không.
     */
    startSession(
        userId: string,
        dto: StartSessionRequestDTO,
        isGuest?: boolean
    ): Promise<IActiveSessionResponseDTO>;

    /**
     * @description Cập nhật câu trả lời vào bản nháp trong NoSQL (Chỉ chạy khi isGuest = false).
     * @param {string} userId - ID người dùng. (User ID).
     * @param {UpdateAnswerRequestDTO} dto - Dữ liệu câu trả lời. (Answer data).
     * @returns {Promise<IActiveSessionResponseDTO>} Trả về DTO phiên làm bài sau khi đã cập nhật.
     */
    updateAnswer(
        userId: string,
        dto: UpdateAnswerRequestDTO,
    ): Promise<IActiveSessionResponseDTO>;


    /**
     * @description Xóa toàn bộ phiên làm việc của một người dùng (Dùng khi đăng xuất hoặc hoàn thành bài).
     * @param {string} userId - ID người dùng cần xóa phiên.
     */
    deleteByUserId(userId: string): Promise<IDeleteResponseDTO>;
}