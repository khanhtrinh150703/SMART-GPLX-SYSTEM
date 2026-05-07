/**
 * @description Giao diện dữ liệu trả về cho một phiên làm bài.
 */
export interface IActiveSessionResponseDTO {
  readonly sessionId: string;
  readonly examId: string;
  readonly createdAt: Date;
  readonly serverTime: Date;
  readonly currentAnswers: IActiveSessionAnswerResponseDTO[];
}

/**
 * @description Chi tiết câu trả lời đã lưu trong phiên nháp.
 */
export interface IActiveSessionAnswerResponseDTO {
  readonly questionId: string;
  readonly selectedAnswerIndex: number | null; // Dùng ID thay vì Index để đồng bộ với Database
  readonly updatedAt: Date;
}

/**
 * @description Implementation đơn giản của Response DTO.
 * Không chứa logic validate, chỉ dùng để chứa dữ liệu sạch.
 */
export class ActiveSessionResponseDTO implements IActiveSessionResponseDTO {
  public readonly examId: string;
  public readonly createdAt: Date;
  public readonly serverTime: Date;
  public readonly sessionId: string;
  public readonly currentAnswers: IActiveSessionAnswerResponseDTO[];
  
  constructor(data: IActiveSessionResponseDTO) {
    this.examId = data.examId;
    this.createdAt = data.createdAt;
    this.serverTime = data.serverTime;
    this.currentAnswers = data.currentAnswers;
    this.sessionId = data.sessionId;
  }
}
