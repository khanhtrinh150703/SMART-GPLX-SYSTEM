import { ExamHistoryQueryDTO } from "@/application/dtos/request/exam-history/exam-history-query.request.dto";
import { ExamAttemptEntity } from "@/domain/entities/exam-attempt/exam-attempt.entity";
import { IExamAttemptRepository } from "@/domain/interfaces/repositories/exam-session/i-exam-attempt.repository";
import { ExamAttemptMapper } from "@/infrastructure/database/mappers/exam-session/exam-attempt.mapper";
import { ExamAttemptModel } from "@/infrastructure/database/mongoose/models/exam-attempt.model";

export class MongoExamAttemptRepository implements IExamAttemptRepository {
  /**
   * @description Triển khai hàm tạo mới.
   */
  public async createExamAttempt(
    attempt: ExamAttemptEntity,
  ): Promise<ExamAttemptEntity> {
    const persistenceData = ExamAttemptMapper.toCreatePersistence(attempt);
    await ExamAttemptModel.exists({ _id: persistenceData._id });

    const model = new ExamAttemptModel();
    model._id = persistenceData._id;
    model.set(persistenceData);
    const savedDoc = await model.save();

    return ExamAttemptMapper.toDomain(savedDoc);
  }

  /**
   * @description Triển khai hàm cập nhật.
   */
  public async updateExamAttempt(
    attempt: ExamAttemptEntity,
  ): Promise<ExamAttemptEntity | null> {
    const persistenceData = ExamAttemptMapper.toUpdatePersistence(attempt);

    // Dùng findOneAndUpdate để lấy được Document sau khi update (option { new: true })
    const updatedDoc = await ExamAttemptModel.findOneAndUpdate(
      { _id: persistenceData._id, deletedAt: null },
      {
        $set: {
          ...persistenceData,
          updatedAt: new Date(),
        },
      },
      { new: true }, // Quan trọng: Trả về bản ghi SAU KHI đã update
    ).exec();

    if (!updatedDoc) return null;

    return ExamAttemptMapper.toDomain(updatedDoc);
  }

  public async findById(id: string): Promise<ExamAttemptEntity | null> {
    const raw = await ExamAttemptModel.findOne({ _id: id, deletedAt: null });
    if (!raw) return null;

    return ExamAttemptMapper.toDomain(raw);
  }

  public async findByUserId(userId: string): Promise<ExamAttemptEntity[]> {
    // Đánh index cho userId trong Schema sẽ giúp query này cực nhanh
    const records = await ExamAttemptModel.find({ userId, deletedAt: null })
      .sort({ submittedAt: -1 }) // Bài thi mới nhất lên đầu
      .exec();

    return records.map((record) => ExamAttemptMapper.toDomain(record));
  }

  /**
   * @description Thực hiện xóa mềm bằng cách cập nhật timestamp deletedAt.
   */
  public async softDelete(id: string): Promise<void> {
    // Repo thụ động: chỉ thực thi lệnh, không ném lỗi nghiệp vụ
    await ExamAttemptModel.findByIdAndUpdate(id, {
      $set: { deletedAt: new Date() },
    }).exec();
  }

  /**
   * @description Thực hiện xóa cứng bằng cách xóa hẳn Document.
   */
  public async hardDelete(id: string): Promise<void> {
    await ExamAttemptModel.findByIdAndDelete(id).exec();
  }

  /**
   * @description Tìm kiếm và đếm tổng số lượng lịch sử làm bài (NoSQL).
   * @param {ExamHistoryQueryDTO} filter - Bộ lọc từ query params.
   * @param {number} skip - Offset để phân trang.
   * @param {number} take - Limit để lấy bản ghi.
   * @returns {Promise<[ExamAttemptEntity[], number]>} - Trả về Tuple gồm mảng Entity và tổng số.
   */
  public async findAndCount(
    filter: ExamHistoryQueryDTO,
    skip: number,
    take: number,
  ): Promise<[ExamAttemptEntity[], number]> {
    // 1. Xây dựng query object - Luôn check deletedAt để đảm bảo logic xóa mềm
    const query: Record<string, unknown> = {
      deletedAt: null,
    };

    if (filter.userId) query.userId = filter.userId;

    // Search theo keyword (Regex không phân biệt hoa thường)
    if (filter.search) {
      query.$or = [
        { licenseCategoryId: { $regex: filter.search, $options: "i" } },
        { examName: { $regex: filter.search, $options: "i" } },
      ];
    }

    // 2. Chạy song song - Sử dụng .lean() để lấy POJO cho Mapper xử lý nhanh hơn
    const [rawRecords, total] = await Promise.all([
      ExamAttemptModel.find(query)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(take)
        .lean()
        .exec(),
      ExamAttemptModel.countDocuments(query).exec(),
    ]);

    // 3. Mapping: Chuyển đổi từ dữ liệu thô sang Domain Entity
    const entities = rawRecords.map((raw) => ExamAttemptMapper.toDomain(raw));

    return [entities, total];
  }
}
