import { CompleteExamInputRequestDTO } from "@/application/dtos/request/exam/complete-exam.request.dto";
import { IExamUserResultResponseDTO } from "@/application/dtos/response/exam/exam-result.respone.dto";

export interface ICompleteExamService {
    /**
     * @description Thực hiện nộp bài, chấm điểm và lưu kết quả.
     * @param examId - ID bài thi.
     * @param dto - Dữ liệu câu trả lời của User.
     * @param {boolean} isGuest - Cờ xác định có phải khách thi thử hay không.
     */
    completeExam(
        userId: string,
        dto: CompleteExamInputRequestDTO,
        isGuest?: boolean
    ): Promise<IExamUserResultResponseDTO>
}