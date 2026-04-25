import { CompleteExamInputDTO } from "@/application/dtos/request/exam/complete-exam.request.dto";
import { IExamResponse } from "@/application/dtos/response/exam/exam-response.dto";

export interface ICompleteExamService {
    /**
     * @description Thực hiện nộp bài, chấm điểm và lưu kết quả.
     * @param examId - ID bài thi.
     * @param dto - Dữ liệu câu trả lời của User.
     */
    completeExam(userId: string, dto: CompleteExamInputDTO): Promise<IExamResponse> 
}