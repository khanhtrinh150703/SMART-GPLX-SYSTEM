import { ActiveSessionEntity } from "@/domain/entities/active-session/active-session.entity";
import { IActiveSessionRepository } from "@/domain/interfaces/repositories/exam-session";
import { ActiveSessionMapper } from "@/infrastructure/database/mappers/exam-session/active-session.mapper";
import { ActiveSessionModel } from "@/infrastructure/database/mongoose/models/active-session.model";
import { IActiveSessionPersistence } from "@/infrastructure/persistence/exam-session/active-session.record";

export class MongoActiveSessionRepository implements IActiveSessionRepository {
    /**
     * @description Lưu phiên nháp mới.
     */
    public async createActiveSession(entity: ActiveSessionEntity): Promise<void> {
        const persistence = ActiveSessionMapper.toCreateActiveSession(entity);
        await ActiveSessionModel.create(persistence);
    }

    /**
     * @description Cập nhật câu trả lời nháp.
     */
    public async updateActiveSession(entity: ActiveSessionEntity): Promise<void> {
        const persistence = ActiveSessionMapper.toUpdateActiveSession(entity);

        await ActiveSessionModel.findOneAndUpdate(
            { _id: persistence._id }, // Lấy trực tiếp từ Entity thay vì lấy từ object mapper bị thiếu
            { $set: persistence },
            { runValidators: true }
        );
    }

    /**
     * @description Tìm phiên theo User ID (trả về Domain Entity).
     */
    public async findByUserId(userId: string): Promise<ActiveSessionEntity | null> {
        // Ép kiểu sang Interface Persistence thay vì any
        const doc = await ActiveSessionModel.findOne({ userId, deletedAt: null }).lean<IActiveSessionPersistence>();

        if (!doc) return null;
        return ActiveSessionMapper.toDomain(doc);
    }

    /**
     * @description Xóa phiên đang dang dở dựa trên userId.
     */
    public async deleteByUserId(userId: string): Promise<void> {
        // ✅ SỬA LẠI ĐÚNG TRƯỜNG userId TRONG MONGODB
        await ActiveSessionModel.deleteMany({ userId: userId });
    }

    /**
     * @description Truy vấn phiên làm bài theo ID (UUID của Entity).
     * @param id - Định danh duy nhất của phiên làm bài.
     * @returns Trả về ActiveSessionEntity nếu tìm thấy, ngược lại là null.
     */
    public async findById(id: string): Promise<ActiveSessionEntity | null> {
        const doc = await ActiveSessionModel
            .findOne({ _id: id, deletedAt: null })
            .lean<IActiveSessionPersistence>()
            .exec();

        if (!doc) {
            return null;
        }

        // Chuyển đổi từ Persistence Model (Plain Object) sang Rich Domain Entity
        return ActiveSessionMapper.toDomain(doc);
    }
}