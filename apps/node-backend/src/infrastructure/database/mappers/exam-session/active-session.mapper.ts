import { IActiveSessionResponseDTO } from "@/application/dtos/response/active-session/active-session.response.dto";
import { ActiveSessionEntity } from "@/domain/entities/active-session/active-session.entity";
import { IActiveSessionProps } from "@/domain/entities/active-session/active-session.props";
import { IActiveSessionPersistence } from "@/infrastructure/persistence/exam-session/active-session.record";
import { AppError, ErrorCode } from "@/shared/errors";

export class ActiveSessionMapper {
    /**
     * @description Chuyển đổi sang định dạng MongoDB (Persistence).
     */
    public static toPersistence(entity: ActiveSessionEntity): IActiveSessionPersistence {
        const { props } = entity;
        if (!props.id) {
            throw new AppError(ErrorCode.VALIDATION.ID_REQUIRED)
        }
        return {
            _id: props.id,
            userId: props.userId,
            examId: props.examId,
            currentAnswers: props.currentAnswers,
            expiresAt: props.expiresAt,
            createdAt: props.createdAt as Date,
            updatedAt: props.updatedAt as Date,
            deletedAt: props.deletedAt || null,
        };
    }

    /**
     * @description Hồi sinh Entity từ dữ liệu MongoDB (Domain).
     */
    public static toDomain(raw: IActiveSessionPersistence): ActiveSessionEntity {
        const props: IActiveSessionProps = {
            id: raw._id,
            userId: raw.userId,
            examId: raw.examId,
            currentAnswers: raw.currentAnswers,
            expiresAt: raw.expiresAt,
            createdAt: raw.createdAt,
            updatedAt: raw.updatedAt,
            deletedAt: raw.deletedAt,
        };
        return ActiveSessionEntity.reconstitute(props);
    }

    /**
   * @description Chuyển đổi từ Domain Entity sang Response DTO để trả về cho Frontend.
   * Đảm bảo tính đóng gói và không rò rỉ logic nghiệp vụ.
   */
  public static toResponse(entity: ActiveSessionEntity): IActiveSessionResponseDTO {
    const { props } = entity;
    
    return {
      examId: props.examId,
      expiresAt: props.expiresAt,
      // Map mảng câu trả lời với các thuộc tính cần thiết cho UI
      currentAnswers: props.currentAnswers.map(ans => ({
        questionId: ans.questionId,
        selectedAnswerIndex: ans.selectedAnswerId, 
        updatedAt: ans.updatedAt
      }))
    };
  }
}