import { AppError, ErrorCode } from "@/shared/errors";
import { isUUID } from "@/shared/utils/uuid.util";

/**
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
 * @description Giao diện vận chuyển dữ liệu lệnh cập nhật thống kê chủ đề.
 */
export interface IUpdateUserTopicStatisticsCommand {
  readonly userId: string;
  readonly results: IUserTopicDelta[];
}

/**
 * @description DTO xử lý lệnh cập nhật thống kê chủ đề sau khi kết thúc bài thi.
 */
export class UpdateUserTopicStatisticsCommand implements IUpdateUserTopicStatisticsCommand {
  public readonly userId: string;
  public readonly results: IUserTopicDelta[];

  constructor(data: IUpdateUserTopicStatisticsCommand) {
    if (!data) {
      throw new AppError(ErrorCode.SYSTEM.INVALID_INPUT);
    }

    this.userId = String(data.userId || "").trim();

    // Mapping và ép kiểu tường minh cho từng trường dữ liệu trong mảng results
    this.results = Array.isArray(data.results)
      ? data.results.map((delta) => {
          // Xử lý ép kiểu Boolean an toàn (chấp nhận cả "true" string và true boolean)
          const isCorrect =
            String(delta.isCorrect).toLowerCase() === "true" ||
            delta.isCorrect === true;
          const isUnanswered =
            String(delta.isUnanswered).toLowerCase() === "true" ||
            delta.isUnanswered === true;

          return {
            topicId: String(delta.topicId || "").trim(),
            topicName: String(delta.topicName || "").trim(),
            isCorrect,
            duration: Number(delta.duration), // Ép về kiểu Number
            isUnanswered,
          };
        })
      : [];

    this.validate();
  }
  
  /**
   * @description Hàm gác cổng kiểm tra logic nghiệp vụ cho tập dữ liệu thống kê dựa trên instance.
   */
  private validate(): void {
    const { USER_TOPIC_STATS: UTS } = ErrorCode;

    if (!this.userId) {
      throw new AppError(
        UTS?.USER_ID_REQUIRED || ErrorCode.EXAM_HISTORY.USER_ID_REQUIRED,
      );
    }

    if (!isUUID(this.userId)) {
      throw new AppError(ErrorCode.VALIDATION.ID_INVALID_UUID);
    }

    if (this.results.length === 0) {
      throw new AppError(
        UTS?.RESULTS_REQUIRED || ErrorCode.SYSTEM.INVALID_INPUT,
      );
    }

    for (const delta of this.results) {
      if (!delta.topicId) {
        throw new AppError(
          UTS?.TOPIC_ID_REQUIRED || ErrorCode.SYSTEM.INVALID_INPUT,
        );
      }

      if (!isUUID(delta.topicId)) {
        throw new AppError(ErrorCode.VALIDATION.ID_INVALID_UUID);
      }

      if (!delta.topicName) {
        throw new AppError(
          UTS?.TOPIC_NAME_REQUIRED || ErrorCode.SYSTEM.INVALID_INPUT,
        );
      }

      if (typeof delta.isCorrect !== "boolean") {
        throw new AppError(
          UTS?.CORRECT_STATUS_REQUIRED || ErrorCode.SYSTEM.INVALID_INPUT,
        );
      }

      if (typeof delta.duration !== "number" || delta.duration < 0) {
        throw new AppError(ErrorCode.SYSTEM.INVALID_INPUT);
      }
    }
  }
}
