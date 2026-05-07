import { StandardResponse } from "@/types/common.type";
import { activeSessionApi } from "../api/exam-session.api";
import {
    IActiveSessionResponseDTO,
    IStartSessionInputDTO,
    IUpdateAnswerInputDTO
} from "../types/active-session.types";
import { useExamStore } from "../store/exam.store.";


/**
 * Active Session Service Layer
 * (Dịch vụ quản lý logic phiên làm bài đang diễn ra)
 */
export const activeSessionService = {
    /**
     * Start a new session for Guest
     * (Khởi tạo phiên thi cho Khách)
     */
    startGuest: async (dto: IStartSessionInputDTO): Promise<StandardResponse<IActiveSessionResponseDTO>> => {
        const response = await activeSessionApi.startGuest(dto);
        // Data Safety Check
        if (!response.data) {
            throw new Error("Không thể khởi tạo phiên thi thử (Cannot start guest session)");
        }

        return response;
    },

    /**
     * Get the current active session
     * (Lấy phiên làm bài hiện tại để Resume)
     */
    getCurrent: async (): Promise<StandardResponse<IActiveSessionResponseDTO | null>> => {
        const response = await activeSessionApi.getCurrent();

        // Lưu ý: data có thể là null nếu không có phiên dở dang (Hành vi bình thường)
        return response;
    },

    /**
     * Start an official session for Student
     * (Bắt đầu phiên thi chính thức)
     */
    startOfficial: async (dto: IStartSessionInputDTO): Promise<StandardResponse<IActiveSessionResponseDTO>> => {
        const response = await activeSessionApi.startOfficial(dto);
        if (!response.data) {
            throw new Error("Không thể bắt đầu phiên thi chính thức (Cannot start official session)");
        }

        return response;
    },

    /**
     * Sync single answer to NoSQL
     * (Đồng bộ đáp án theo thời gian thực)
     */
    sync: async (dto: IUpdateAnswerInputDTO): Promise<StandardResponse<void>> => {
        // Với hàm Sync, ta không cần data trả về, chỉ cần quan tâm success
        const response = await activeSessionApi.sync(dto);

        if (!response.success) {
            throw new Error(response.message || "Lỗi đồng bộ đáp án (Sync failed)");
        }

        return response;
    },

    /**
     * @description Kết thúc/Hủy phiên làm bài hiện tại
     */
    terminate: async (): Promise<StandardResponse<void>> => {
        // 1. Gọi API xóa session hiện tại (Backend tự bóc tách userId từ JWT)
        const response = await activeSessionApi.deleteCurrent();

        // 2. Logic bổ sung: Reset trạng thái trong Zustand Store về mặc định
        // Điều này đảm bảo khi người dùng quay lại trang, dữ liệu cũ không còn hiển thị
        useExamStore.getState().resetStore();

        /**
         * 3. Xử lý bộ nhớ tạm (Tùy chọn): 
         * Nếu ông có lưu nháp bài thi vào LocalStorage hoặc SessionStorage 
         * để chống F5, hãy thực hiện clear key đó tại đây.
         */
        // localStorage.removeItem('exam_draft_storage');

        return response;
    }
};