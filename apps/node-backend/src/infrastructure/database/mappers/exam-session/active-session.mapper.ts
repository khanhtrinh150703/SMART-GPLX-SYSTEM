import { ActiveSessionResponseDTO, IActiveSessionResponseDTO } from "@/application/dtos/response/active-session/active-session.response.dto";
import { ActiveSessionEntity } from "@/domain/entities/active-session/active-session.entity";
import { IActiveSessionProps } from "@/domain/entities/active-session/active-session.props";
import { IActiveSessionPersistence } from "@/infrastructure/persistence/exam-session/active-session.record";
import { AppError, ErrorCode } from "@/shared/errors";

export class ActiveSessionMapper {

    /**
     * @description Chuyển đổi thực thể phiên làm việc sang định dạng lưu trữ MongoDB.
     * @param entity Thực thể phiên làm việc (ActiveSessionEntity).
     * @returns Dữ liệu lưu trữ MongoDB (IActiveSessionPersistence).
     */
    public static toCreateActiveSession(entity: ActiveSessionEntity): IActiveSessionPersistence {
        const { props } = entity;

        // 1. Kiểm tra ID bắt buộc (Sử dụng ID của Entity làm _id cho MongoDB)
        const recordId = entity.id || props.id;
        if (!recordId) {
            throw new AppError(ErrorCode.VALIDATION.ID_REQUIRED);
        }

        return {
            // Sử dụng recordId làm khóa chính cho MongoDB
            _id: recordId,
            userId: props.userId,
            examId: props.examId,

            // 2. Map dữ liệu câu trả lời (Đảm bảo Deep Copy để tránh Side-effect)
            currentAnswers: (props.currentAnswers || []).map(ans => ({
                questionId: ans.questionId,
                selectedAnswerIndex: ans.selectedAnswerIndex,
                updatedAt: ans.updatedAt ?? new Date(),
            })),

            // 3. Metadata và Trạng thái phiên làm việc
            currentQuestionIndex: props.currentQuestionIndex ?? 0,
            expiresAt: props.expiresAt,

            // 4. Xử lý an toàn cho các mốc thời gian (Fallback nếu bị undefined)
            createdAt: props.createdAt ?? new Date(),
            updatedAt: props.updatedAt ?? new Date(),
            deletedAt: props.deletedAt ?? null,
        };
    }

    /**
     * @description Ánh xạ các trường thay đổi để cập nhật phiên làm việc (Tối ưu hóa).
     * @param entity Thực thể phiên làm việc (ActiveSessionEntity).
     * @returns Dữ liệu cập nhật từng phần (Partial Persistence).
     */
    public static toUpdateActiveSession(entity: ActiveSessionEntity): Partial<IActiveSessionPersistence> {
        const { props } = entity;
        return {
            _id: entity.id, // Vẫn nên giữ _id gốc của Entity
            userId: props.userId, // BẮT BUỘC PHẢI CÓ DÒNG NÀY
            currentAnswers: (props.currentAnswers || []).map(ans => ({
                questionId: ans.questionId,
                selectedAnswerIndex: ans.selectedAnswerIndex,
                updatedAt: ans.updatedAt ?? new Date(),
            })),
            currentQuestionIndex: props.currentQuestionIndex ?? 0,
            updatedAt: new Date(), // Luôn cập nhật mốc thời gian mới nhất
        };
    }

    /**
     * @description Khôi phục thực thể từ dữ liệu MongoDB (Reconstitute).
     * @param raw Dữ liệu lưu trữ (IActiveSessionPersistence).
     * @returns Thực thể phiên làm việc (ActiveSessionEntity).
     */
    public static toDomain(raw: IActiveSessionPersistence): ActiveSessionEntity {
        const props: IActiveSessionProps = {
            id: raw._id,
            userId: raw.userId,
            examId: raw.examId,
            currentAnswers: raw.currentAnswers,
            currentQuestionIndex: raw.currentQuestionIndex,
            expiresAt: raw.expiresAt,
            createdAt: raw.createdAt,
            updatedAt: raw.updatedAt,
            deletedAt: raw.deletedAt,
        };
        return ActiveSessionEntity.reconstitute(props);
    }

    /**
     * @description Ánh xạ thực thể sang DTO phản hồi cho Frontend.
     * @param entity Thực thể phiên làm việc (ActiveSessionEntity).
     * @returns DTO phản hồi (IActiveSessionResponseDTO).
     */
    public static toResponse(entity: ActiveSessionEntity): IActiveSessionResponseDTO {
        const { props } = entity;

        return new ActiveSessionResponseDTO({
            sessionId: props.id ?? '',
            examId: props.examId,
            createdAt: props.createdAt ?? new Date(),
            serverTime: new Date(),
            // Map mảng câu trả lời với các thuộc tính cần thiết cho UI
            currentAnswers: props.currentAnswers.map(ans => ({
                questionId: ans.questionId,
                selectedAnswerIndex: ans.selectedAnswerIndex,
                updatedAt: ans.updatedAt ?? new Date(),
            }))
        });
    }
}