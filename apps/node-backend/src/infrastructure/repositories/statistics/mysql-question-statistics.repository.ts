import { QuestionStatisticsEntity } from "@/domain/entities/statistics/question-statistics.entity";
import { IQuestionStatisticsRepository } from "@/domain/interfaces/repositories/statistics";
import { QuestionStatisticsMapper } from "@/infrastructure/database/mappers/statistics";
import { PrismaClient } from "@prisma/client";

/**
 * @interface IMySQLQuestionStatisticsRepositoryCradle
 * @description Định nghĩa các phụ thuộc cần thiết cho Question Statistics Repository qua DI Container.
 */
export interface IMySQLQuestionStatisticsRepositoryCradle {
  prisma: PrismaClient;
}

/**
 * @class MySQLQuestionStatisticsRepository
 * @description Triển khai Repository cho thống kê câu hỏi sử dụng MySQL và Prisma.
 * Đảm bảo tính nhất quán dữ liệu thông qua cơ chế Upsert và Transaction.
 */
export class MySQLQuestionStatisticsRepository implements IQuestionStatisticsRepository {
  private readonly _prisma: PrismaClient;

  /**
   * @description Khởi tạo Repository với PrismaClient được tiêm (injected) từ Cradle.
   * @param {IMySQLQuestionStatisticsRepositoryCradle} cradle - Chứa các phụ thuộc hệ thống.
   */
  constructor({ prisma }: IMySQLQuestionStatisticsRepositoryCradle) {
    this._prisma = prisma;
  }

  /**
   * @description Tìm kiếm thống kê của một câu hỏi theo ID.
   * @param {string} questionId - ID định danh của câu hỏi.
   * @returns {Promise<QuestionStatisticsEntity | null>} Thực thể Domain hoặc null nếu không tìm thấy.
   */
  public async findById(
    questionId: string,
  ): Promise<QuestionStatisticsEntity | null> {
    const record = await this._prisma.questionStatistics.findUnique({
      where: { questionId },
    });

    if (!record) return null;

    return QuestionStatisticsMapper.toDomain(record);
  }

  /**
   * @description Lấy danh sách các câu hỏi có tỷ lệ sai cao nhất toàn hệ thống.
   * Thường dùng để hiển thị các "Câu hỏi hay sai" hoặc "Câu hỏi điểm liệt".
   * @param {number} limit - Số lượng bản ghi tối đa.
   */
  public async findTopDifficultQuestions(
    limit: number,
  ): Promise<QuestionStatisticsEntity[]> {
    const records = await this._prisma.questionStatistics.findMany({
      orderBy: {
        errorRate: "desc",
      },
      take: limit,
    });

    return QuestionStatisticsMapper.toDomainList(records);
  }

  /**
   * @description Khởi tạo bản ghi thống kê mới trong Database.
   * @param {QuestionStatisticsEntity} entity - Thực thể domain chứa dữ liệu mới.
   */
  public async create(
    entity: QuestionStatisticsEntity,
  ): Promise<QuestionStatisticsEntity> {
    const data = QuestionStatisticsMapper.toCreateRecord(entity);

    const record = await this._prisma.questionStatistics.create({
      data: {
        questionId: data.questionId,
        totalAttempts: data.totalAttempts,
        wrongCount: data.wrongCount,
        errorRate: data.errorRate,
        createdAt: data.createdAt,
        updatedAt: data.updatedAt,
      },
    });

    return QuestionStatisticsMapper.toDomain(record);
  }

  /**
   * @description Cập nhật trạng thái thống kê đã tồn tại.
   * @param {QuestionStatisticsEntity} entity - Thực thể domain đã được thay đổi logic.
   */
  public async update(
    entity: QuestionStatisticsEntity,
  ): Promise<QuestionStatisticsEntity> {
    const updateData = QuestionStatisticsMapper.toUpdateRecord(entity);
    const id = entity.props.id;

    const record = await this._prisma.questionStatistics.update({
      where: { questionId: id },
      data: updateData,
    });

    return QuestionStatisticsMapper.toDomain(record);
  }

  /**
   * @description Cập nhật hàng loạt dữ liệu thống kê của nhiều câu hỏi.
   * @param {QuestionStatisticsEntity[]} entities - Danh sách các thực thể cần cập nhật.
   */
  public async saveBulk(entities: QuestionStatisticsEntity[]): Promise<void> {
    // Chuyển đổi toàn bộ danh sách sang định dạng Persistence
    const rawRecords = entities.map((e) =>
      QuestionStatisticsMapper.toPersistence(e),
    );

    // Thực hiện transaction để tối ưu hóa I/O và đảm bảo toàn vẹn dữ liệu
    await this._prisma.$transaction(
      rawRecords.map((record) =>
        this._prisma.questionStatistics.upsert({
          where: { questionId: record.questionId },
          update: {
            totalAttempts: record.totalAttempts,
            wrongCount: record.wrongCount,
            errorRate: record.errorRate,
          },
          create: {
            questionId: record.questionId,
            totalAttempts: record.totalAttempts,
            wrongCount: record.wrongCount,
            errorRate: record.errorRate,
          },
        }),
      ),
    );
  }

  /**
   * @description Tìm kiếm hàng loạt thống kê (Batch Fetching).
   * @param {string[]} questionIds - Danh sách các ID câu hỏi cần truy vấn.
   * @returns {Promise<QuestionStatisticsEntity[]>}
   */
  public async findByIds(
    questionIds: string[],
  ): Promise<QuestionStatisticsEntity[]> {
    const records = await this._prisma.questionStatistics.findMany({
      where: {
        questionId: { in: questionIds },
      },
    });

    // Map toàn bộ kết quả trả về thành danh sách các Domain Entities
    return records.map((record) => QuestionStatisticsMapper.toDomain(record));
  }
}
