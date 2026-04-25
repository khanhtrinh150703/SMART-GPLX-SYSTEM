import { IExamAttemptResponseDTO } from "@/application/dtos/response/exam-attempt/exam-attempt.respone.dto";
import { CreateExamAttemptProps } from "@/domain/entities/exam-attempt/exam-attempt.props";

/**
 * @interface IExamAttemptService
 * @description Quản lý lịch sử và truy xuất kết quả các lượt thi.
 * Snapshot là dữ liệu bất biến, tập trung vào việc lưu và đọc.
 */
export interface IExamAttemptService {
    /**
     * @description Lưu một lượt thi mới. 
     * Thường được gọi sau khi logic chấm điểm tại CompleteExamService hoàn tất.
     */
    createAttempt(props: CreateExamAttemptProps): Promise<IExamAttemptResponseDTO>;

    /**
     * @description Lấy chi tiết kết quả thi (bao gồm cả Snapshot câu hỏi).
     * Dùng để hiển thị trang "Review kết quả".
     */
    getAttemptDetail(id: string): Promise<IExamAttemptResponseDTO>;

    /**
     * @description Lấy danh sách lịch sử thi của User 
     */
    getUserAttemptHistory(userId: string): Promise<IExamAttemptResponseDTO[]>;

    /**
     * @description Xóa lượt thi (thường là xóa mềm để phục vụ thống kê hoặc khi User muốn dọn dẹp).
     */
    softDeleteAttempt(id: string): Promise<void>;

    /**
     * @description Xóa lượt thi 
     */
    hardDeleteAttempt(id: string): Promise<void>;
}