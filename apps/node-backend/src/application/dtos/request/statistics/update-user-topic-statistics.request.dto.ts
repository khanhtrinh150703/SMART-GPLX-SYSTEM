import { AppError, ErrorCode } from "@/shared/errors";

/**
 * @interface IUserTopicDelta
 * @description Đại diện cho sự thay đổi dữ liệu của một chủ đề cụ thể.
 */
export interface IUserTopicDelta {
  readonly topicId: string;
  readonly topicName: string;
  readonly isCorrect: boolean;
  readonly duration: number;     
  readonly isUnanswered: boolean; 
}

/**
 * @interface IUpdateUserTopicStatisticsCommand
 * @description Giao diện vận chuyển dữ liệu lệnh cập nhật thống kê chủ đề.
 */
export interface IUpdateUserTopicStatisticsCommand {
  readonly userId: string;
  readonly results: IUserTopicDelta[];
}

/**
 * @class UpdateUserTopicStatisticsCommand
 * @description DTO xử lý lệnh cập nhật thống kê chủ đề sau khi kết thúc bài thi.
 * @principle Data Integrity - Đảm bảo mảng kết quả và thông tin người dùng luôn đầy đủ.
 */
export class UpdateUserTopicStatisticsCommand implements IUpdateUserTopicStatisticsCommand {
  public readonly userId: string;
  public readonly results: IUserTopicDelta[];

  constructor(data: IUpdateUserTopicStatisticsCommand) {
    // 1. Kiểm tra tính hợp lệ của lệnh tại cửa ngõ
    this.validate(data);

    // 2. Gán giá trị và chuẩn hóa dữ liệu
    this.userId = data.userId;
    // Chuẩn hóa tên chủ đề bên trong mảng kết quả
    this.results = data.results.map((delta) => ({
      ...delta,
      topicName: delta.topicName.trim(),
    }));
  }

  /**
   * @description Hàm gác cổng kiểm tra logic nghiệp vụ cho tập dữ liệu thống kê.
   * @private
   */
  private validate(data: IUpdateUserTopicStatisticsCommand): void {
    if (!data) {
      throw new AppError(ErrorCode.SYSTEM.INVALID_INPUT);
    }

    // Giả định bạn đã định nghĩa group ERROR cho Statistics
    // Nếu chưa có, bạn có thể bổ sung vào ErrorCode của hệ thống
    const { USER_TOPIC_STATS: UTS } = ErrorCode;

    // 1. Kiểm tra định danh người dùng
    if (!data.userId || typeof data.userId !== "string") {
      throw new AppError(UTS.USER_ID_REQUIRED || ErrorCode.EXAM_HISTORY.USER_ID_REQUIRED);
    }

    // 2. Kiểm tra danh sách kết quả (Results Array)
    if (!Array.isArray(data.results) || data.results.length === 0) {
      throw new AppError(UTS.RESULTS_REQUIRED || ErrorCode.SYSTEM.INVALID_INPUT);
    }

    // 3. Kiểm tra tính hợp lệ của từng phần tử delta trong mảng
    for (const delta of data.results) {
      if (!delta.topicId || typeof delta.topicId !== "string") {
        throw new AppError(UTS.TOPIC_ID_REQUIRED || ErrorCode.SYSTEM.INVALID_INPUT);
      }
      
      if (!delta.topicName || typeof delta.topicName !== "string") {
        throw new AppError(UTS.TOPIC_NAME_REQUIRED || ErrorCode.SYSTEM.INVALID_INPUT);
      }

      if (typeof delta.isCorrect !== "boolean") {
        throw new AppError(UTS.CORRECT_STATUS_REQUIRED || ErrorCode.SYSTEM.INVALID_INPUT);
      }
    }
  }
}