/**
 * @description Dữ liệu khởi tạo phiên làm bài mới.
 */
export interface IStartSessionInputDTO {
  readonly examId: string;
  readonly clientStartedAt: string;
  readonly isForce: boolean;
}

/**
 * @description Dữ liệu cập nhật từng câu trả lời (Dùng cho Sync 10s).
 */
export interface IUpdateAnswerInputDTO {
  readonly examId: string;
  readonly sessionId: string;
  readonly currentQuestionIndex: number;
  /**
   * Record<questionId, selectedOptionPosition>
   * Ví dụ: { "q-123": 2, "q-456": 1 }
   */
  readonly answers: Record<string, number | null>;
  readonly clientTimestamp: string;
}

/**
 * @description Chi tiết câu trả lời trong bản nháp.
 */
export interface IActiveSessionAnswerResponseDTO {
  readonly questionId: string;
  readonly selectedAnswerIndex: number | null;
  readonly updatedAt: string; // ISO String
  readonly timeSpent: number;
}

/**
 * @description Phản hồi về phiên làm bài hiện tại.
 */
export interface IActiveSessionResponseDTO {
  readonly sessionId: string; // ID của phiên làm bài để đối chiếu
  readonly examId: string;
  readonly createdAt: string; // ISO String - Thời điểm hết hạn (Chốt bởi BE)
  readonly serverTime: string; // ISO String - Thời điểm hiện tại của Server
  readonly remainingSeconds: number;
  readonly timeSpent: number;
  readonly currentAnswers: IActiveSessionAnswerResponseDTO[];
}