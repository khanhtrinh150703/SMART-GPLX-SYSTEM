/**
 * @interface IUserExamRankResponseDTO
 * @description Định nghĩa cấu trúc dữ liệu đầu vào cần thiết để khởi tạo một DTO bảng xếp hạng.
 */
export interface IUserExamRankResponseDTO{
  id: string;
  userId: string;
  examId: string;
  licenseCategoryId: string;
  bestScore: number;
  fastestSeconds: number;
}

/**
 * @class UserExamRankResponseDTO
 * @description Đối tượng truyền tải dữ liệu đầu ra cho Bảng xếp hạng.
 * @principle Data Encapsulation - Đóng gói dữ liệu, chỉ phơi bày những thông tin an toàn và cần thiết.
 */
export class UserExamRankResponseDTO {
  public readonly id: string;
  public readonly userId: string;
  public readonly examId: string;
  public readonly licenseCategoryId: string;
  public readonly bestScore: number;
  public readonly fastestSeconds: number;

  /** @description Thời gian được định dạng sẵn chuỗi (VD: "01:30") để Frontend hiển thị ngay. */
  public readonly durationFormatted: string;

  /**
   * @constructor
   * @description Khởi tạo DTO với kiểu dữ liệu được kiểm soát chặt chẽ thông qua Interface Props.
   * @param {IUserExamRankResponseDTO} props - Dữ liệu thô từ Domain hoặc Database.
   */
  constructor(props: IUserExamRankResponseDTO) {
    this.id = props.id;
    this.userId = props.userId;
    this.examId = props.examId;
    this.licenseCategoryId = props.licenseCategoryId;
    this.bestScore = props.bestScore;
    this.fastestSeconds = props.fastestSeconds;

    // Xử lý logic hiển thị (Presentation Logic) ngay tại DTO
    const minutes = Math.floor(props.fastestSeconds / 60).toString().padStart(2, '0');
    const seconds = (props.fastestSeconds % 60).toString().padStart(2, '0');
    this.durationFormatted = `${minutes}:${seconds}`;
  }
}