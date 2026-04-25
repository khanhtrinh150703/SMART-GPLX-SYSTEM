/**
 * @description DTO phản hồi kết quả lượt thi cho người dùng.
 */
export interface IExamAttemptResponseDTO {
  readonly id: string;
  readonly examId: string;
  readonly examTitle: string;        
  readonly score: number;
  readonly isPassed: boolean;
  readonly correctCount: number;
  readonly totalQuestions: number;   
  readonly durationSeconds: number;  
  readonly submittedAt: Date;
}