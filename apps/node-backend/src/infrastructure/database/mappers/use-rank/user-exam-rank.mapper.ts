import { UserExamRankEntity } from "@/domain/entities/user-rank/user-exam-rank.entity";
import { IUserExamRankRecord } from "@/infrastructure/persistence/user-rank/user-exam-rank.record";
import { IUserExamRankProps } from "@/domain/entities/user-rank/user-exam-rank.props";
import { ErrorCode } from "@/shared/errors/error-codes";
import { AppError } from "@/shared/errors/error-app";
import {
  IUserExamRankResponseDTO,
  UserExamRankResponseDTO,
} from "@/application/dtos/response/user-rank/user-rank.response.dto";

/**
 * @description Mapper dùng để chuyển đổi dữ liệu cho Kỷ lục người dùng (UserExamRank).
 */
export class UserExamRankMapper {
  /**
   * @description Ánh xạ dữ liệu chung, dùng nội bộ để tránh lặp code.
   */
  private static _toCommonPersistence(
    entity: UserExamRankEntity,
  ): IUserExamRankRecord {
    if (!entity.id) throw new AppError(ErrorCode.SYSTEM.INVALID_INPUT);

    return {
      id: entity.id,
      userId: entity.props.userId,
      examId: entity.props.examId,
      licenseCategoryId: entity.props.licenseCategoryId,
      bestScore: entity.props.bestScore,
      fastestSeconds: entity.props.fastestSeconds,
      lastAttemptId: entity.props.lastAttemptId,
      createdAt: entity.props.createdAt as Date,
      updatedAt: entity.props.updatedAt as Date,
    };
  }

  /**
   * @description Ánh xạ dữ liệu để tạo mới (INSERT) vào Database.
   * Yêu cầu đầy đủ tất cả các trường.
   */
  public static toPersistence(entity: UserExamRankEntity): IUserExamRankRecord {
    return this._toCommonPersistence(entity);
  }

  /**
   * @description Ánh xạ dữ liệu để cập nhật (UPDATE) vào Database.
   * Loại bỏ các trường bất biến (immutable) để tránh ghi đè sai sót.
   * @param entity Thực thể chứa trạng thái mới.
   * @returns Dữ liệu an toàn để đưa vào lệnh Update.
   */
  public static toUpdatePersistence(
    entity: UserExamRankEntity,
  ): Partial<IUserExamRankRecord> {
    const record = this._toCommonPersistence(entity);

    // Bóc tách và loại bỏ các trường KHÔNG ĐƯỢC PHÉP update.
    // Dùng alias (gắn thêm "_") để "lách" quy tắc Linting (no-unused-vars).
    const {
      id: _id, // ID là khóa chính, không bao giờ update
      userId: _userId, // Không được đổi chủ kỷ lục
      examId: _examId, // Không được đổi đề thi của kỷ lục này
      createdAt: _createdAt, // Thời gian tạo là bất biến
      ...updateData // Gom phần còn lại vào biến updateData
    } = record;

    return updateData;
  }

  /**
   * @description Tái tạo Entity từ dữ liệu thô (Record) lấy từ Database.
   */
  public static toDomain(raw: IUserExamRankRecord): UserExamRankEntity {
    const props: IUserExamRankProps = {
      ...raw,
      deletedAt: null,
    };
    return UserExamRankEntity.reconstitute(props);
  }

  /**
   * @description Chuyển đổi một thực thể Domain thành DTO phản hồi.
   * @param {UserExamRankEntity} entity - Thực thể chứa nghiệp vụ gốc.
   * @returns {IUserExamRankResponseDTO} - Đối tượng dữ liệu thuần túy (Plain Data Object).
   */
  public static toResponseDTO(
    entity: UserExamRankEntity,
  ): IUserExamRankResponseDTO {
    return new UserExamRankResponseDTO({
      id: entity.id ?? "",
      userId: entity.props.userId,
      examId: entity.props.examId,
      licenseCategoryId: entity.props.licenseCategoryId,
      bestScore: entity.props.bestScore,
      fastestSeconds: entity.props.fastestSeconds,
    });
  }

  /**
   * @description Chuyển đổi một mảng thực thể thành mảng DTO (Dùng cho API Leaderboard).
   * @param {UserExamRankEntity[]} entities - Danh sách thực thể.
   * @returns {UserExamRankResponseDTO[]} - Danh sách DTO trả về cho Client.
   */
  public static toResponseList(
    entities: UserExamRankEntity[],
  ): IUserExamRankResponseDTO[] {
    return entities.map((entity) => this.toResponseDTO(entity));
  }
}
