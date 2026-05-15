import { UserTopicStatisticsEntity } from "@/domain/entities/statistics/user-topic-statistics.entity";
import { IUserTopicStatisticsRepository } from "@/domain/interfaces/repositories/statistics";
import { UserTopicStatisticsMapper } from "@/infrastructure/database/mappers/statistics";
import { PrismaClient } from "@prisma/client";

/**
 * @interface IMySQLUserTopicStatisticsRepositoryCradle
 * @description Định nghĩa các phụ thuộc cần thiết cho User Topic Statistics Repository.
 */
export interface IMySQLUserTopicStatisticsRepositoryCradle {
  prisma: PrismaClient;
}

/**
 * @class MySQLUserTopicStatisticsRepository
 * @description Triển khai Repository cho thống kê chủ đề của người dùng sử dụng MySQL và Prisma.
 * Đảm bảo tính nhất quán dữ liệu và hỗ trợ xóa mềm (Soft Delete).
 */
export class MySQLUserTopicStatisticsRepository implements IUserTopicStatisticsRepository {
  private readonly _prisma: PrismaClient;

  /**
   * @description Khởi tạo Repository với PrismaClient được tiêm từ DI Container.
   * @param {IMySQLUserTopicStatisticsRepositoryCradle} cradle - Cradle chứa các dependencies.
   */
  constructor({ prisma }: IMySQLUserTopicStatisticsRepositoryCradle) {
    this._prisma = prisma;
  }

  /**
   * @description Tìm kiếm thống kê theo ID (UUID).
   * @param {string} id - ID duy nhất của bản ghi.
   */
  public async findById(id: string): Promise<UserTopicStatisticsEntity | null> {
    const record = await this._prisma.userTopicStatistics.findFirst({
      where: { id },
    });

    if (!record) return null;

    return UserTopicStatisticsMapper.toDomain(record);
  }

  /**
   * @description Tìm kiếm bản ghi thống kê dựa trên cặp User và Topic.
   * @param {string} userId - ID người dùng.
   * @param {string} topicId - ID chủ đề.
   */
  public async findByUserAndTopic(
    userId: string,
    topicId: string,
  ): Promise<UserTopicStatisticsEntity | null> {
    const record = await this._prisma.userTopicStatistics.findFirst({
      where: {
        userId,
        topicId,
      },
    });

    if (!record) return null;

    return UserTopicStatisticsMapper.toDomain(record);
  }

  /**
   * @description Lấy toàn bộ danh sách thống kê các chủ đề của một người dùng.
   * @param {string} userId - ID người dùng.
   */
  public async findAllByUserId(userId: string): Promise<UserTopicStatisticsEntity[]> {
    const records = await this._prisma.userTopicStatistics.findMany({
      where: {
        userId,
      },
      orderBy: {
        updatedAt: "desc",
      },
    });

    return UserTopicStatisticsMapper.toDomainList(records);
  }

  /**
   * @description Tạo mới một bản ghi thống kê chủ đề.
   * @param {UserTopicStatisticsEntity} entity - Thực thể cần lưu.
   */
  public async create(entity: UserTopicStatisticsEntity): Promise<UserTopicStatisticsEntity> {
    const data = UserTopicStatisticsMapper.toCreateRecord(entity);

    const record = await this._prisma.userTopicStatistics.create({
      data: {
        id: data.id,
        userId: data.userId,
        topicId: data.topicId,
        topicName: data.topicName,
        totalQuestions: data.totalQuestions,
        wrongAnswers: data.wrongAnswers,
        errorRate: data.errorRate,
        createdAt: data.createdAt,
        updatedAt: data.updatedAt,
      },
    });

    return UserTopicStatisticsMapper.toDomain(record);
  }

  /**
   * @description Cập nhật các chỉ số thống kê của chủ đề.
   * @param {UserTopicStatisticsEntity} entity - Thực thể mang dữ liệu cập nhật.
   */
  public async update(entity: UserTopicStatisticsEntity): Promise<UserTopicStatisticsEntity> {
    const updateData = UserTopicStatisticsMapper.toUpdateRecord(entity);
    const id = entity.props.id!;

    const record = await this._prisma.userTopicStatistics.update({
      where: { id },
      data: updateData,
    });

    return UserTopicStatisticsMapper.toDomain(record);
  }
}