import { IUserExamRankResponseDTO } from "@/application/dtos/response/user-rank/user-rank.response.dto";

/**
 * @interface IUserRankQueryService
 * @description Giao diện dịch vụ truy vấn bảng xếp hạng và kỷ lục người dùng (Read-only).
 * @principle CQRS (Query) - Tách biệt hoàn toàn luồng đọc để tối ưu hóa hiệu suất và bảo mật dữ liệu.
 * @principle Boundary Control - Chỉ trả về DTO, không rò rỉ thực thể Domain ra tầng Presentation.
 */
export interface IUserRankQueryService {
    /**
     * @description Lấy danh sách bảng xếp hạng những người có thành tích tốt nhất của một đề thi.
     * @logic Xếp hạng dựa trên: Điểm số (Giảm dần) -> Thời gian hoàn thành (Tăng dần).
     * @param examId - ID của đề thi cần tra cứu.
     * @param limit - Số lượng bản ghi tối đa (mặc định: 10).
     * @returns {Promise<IUserExamRankResponseDTO[]>} - Danh sách DTO đã được định dạng cho Frontend.
     */
    getExamLeaderboard(examId: string, limit?: number): Promise<IUserExamRankResponseDTO[]>;

    /**
     * @description Lấy bảng xếp hạng tổng quát dựa theo hạng bằng lái (A1, B2, C...).
     * @logic Tổng hợp các kỷ lục cao nhất của người dùng trong phân khúc bằng lái tương ứng.
     * @param licenseCategoryId - ID của hạng bằng lái.
     * @param limit - Số lượng bản ghi tối đa.
     * @returns {Promise<IUserExamRankResponseDTO[]>} - Danh sách các "tay lái lụa" đứng đầu phân khúc.
     */
    getCategoryLeaderboard(licenseCategoryId: string, limit?: number): Promise<IUserExamRankResponseDTO[]>;

    /**
     * @description Tra cứu vị trí xếp hạng hiện tại của một người dùng trong một đề thi cụ thể.
     * @param userId - ID người dùng cần kiểm tra.
     * @param examId - ID đề thi.
     * @returns {Promise<number>} - Thứ hạng thực tế (1, 2, 3...). Trả về 0 nếu người dùng chưa có lượt thi nào.
     */
    getUserRankPosition(userId: string, examId: string): Promise<number>;

    /**
     * @description Lấy bộ sưu tập các kỷ lục cá nhân tốt nhất của một người dùng trên tất cả các đề thi.
     * @usage Phục vụ hiển thị Profile hoặc Dashboard thành tích cá nhân.
     * @param userId - ID người dùng.
     * @returns {Promise<IUserExamRankResponseDTO[]>} - Danh sách kỷ lục cá nhân đã qua Mapper.
     */
    getUserBestRecords(userId: string): Promise<IUserExamRankResponseDTO[]>;

    /**
     * @description Kiểm tra xem một thành tích vừa đạt được có phải là kỷ lục mới của người dùng hay không.
     * @param userId - ID người dùng.
     * @param examId - ID đề thi.
     * @param currentScore - Điểm số vừa đạt được trong lượt thi mới nhất.
     * @param currentDuration - Thời gian hoàn thành (giây) của lượt thi mới nhất.
     * @returns {Promise<boolean>} - True nếu thành tích này tốt hơn kỷ lục cũ (hoặc chưa có kỷ lục).
     */
    checkIfPersonalBest(
        userId: string, 
        examId: string, 
        currentScore: number, 
        currentDuration: number
    ): Promise<boolean>;
}