import { UserStatisticsEntity } from "@/domain/entities/statistics/user-statistics.entity";
import { IUserStatisticsRepository } from "@/domain/interfaces/repositories/statistics";
import { UserStatisticsMapper } from "@/infrastructure/database/mappers";
import { PrismaClient } from "@prisma/client";

/**
 * @interface IMySQLUserStatisticsRepositoryCradle
 * @description Định nghĩa các phụ thuộc (dependencies) cho User Statistics Repository.
 */
export interface IMySQLUserStatisticsRepositoryCradle {
  prisma: PrismaClient;
}

/**
 * @class MySQLUserStatisticsRepository
 * @description Triển khai Repository cho Thống kê người dùng sử dụng MySQL và Prisma.
 * Quản lý các chỉ số tổng hợp như điểm trung bình, số bài thi đã đạt, và rank.
 */
export class MySQLUserStatisticsRepository implements IUserStatisticsRepository {
  private readonly _prisma: PrismaClient;

  /**
   * @description Khởi tạo với PrismaClient được tiêm từ DI Container (Awilix).
   */
  constructor({ prisma }: IMySQLUserStatisticsRepositoryCradle) {
    this._prisma = prisma;
  }

  /**
   * @description Khởi tạo bản ghi thống kê mới cho người dùng.
   * @param {UserStatisticsEntity} entity - Thực thể thống kê ban đầu.
   * @returns {Promise<UserStatisticsEntity>} Thực thể đã được khởi tạo.
   */
  public async create(entity: UserStatisticsEntity): Promise<UserStatisticsEntity> {
    // 1. Ánh xạ từ Entity sang Record dành riêng cho việc INSERT (có đầy đủ userId)
    const record = UserStatisticsMapper.toCreateRecord(entity);
    
    // 2. Thực hiện lưu vào Database qua Prisma
    const savedRecord = await this._prisma.userStatistics.create({
      data: record,
    });

    // 3. Trả về Domain Entity thông qua Static Mapper
    return UserStatisticsMapper.toDomain(savedRecord);
  }

  /**
   * @description Lấy thông tin thống kê của người dùng dựa trên userId.
   * @param {string} userId - ID của người dùng (cũng là PK của bảng thống kê).
   * @returns {Promise<UserStatisticsEntity | null>} Trả về Entity hoặc null nếu chưa có thống kê.
   */
  public async findByUserId(
    userId: string,
  ): Promise<UserStatisticsEntity | null> {
    const record = await this._prisma.userStatistics.findUnique({
      where: {
        userId,
        deletedAt: null, // Chỉ lấy bản ghi chưa bị xóa mềm
      },
    });

    if (!record) return null;

    // Chuyển đổi từ Prisma Record sang Domain Entity
    return UserStatisticsMapper.toDomain(record);
  }

  /**
   * @description Cập nhật hoặc tạo mới thống kê (Atomic Upsert).
   * @param {UserStatisticsEntity} entity - Thực thể thống kê đã được tính toán logic.
   */
  public async upsert(
    entity: UserStatisticsEntity,
  ): Promise<UserStatisticsEntity> {
    const createData = UserStatisticsMapper.toCreateRecord(entity);
    const updateData = UserStatisticsMapper.toUpdateRecord(entity);

    const savedRecord = await this._prisma.userStatistics.upsert({
      where: { userId: entity.userId },
      create: createData,
      update: updateData,
    });

    return UserStatisticsMapper.toDomain(savedRecord);
  }

  /**
   * @description Cập nhật các chỉ số thống kê hiện có.
   * @param {UserStatisticsEntity} entity - Thực thể mang dữ liệu mới.
   */
  public async update(
    entity: UserStatisticsEntity,
  ): Promise<UserStatisticsEntity> {
    const updateData = UserStatisticsMapper.toUpdateRecord(entity);

    const updatedRecord = await this._prisma.userStatistics.update({
      where: { userId: entity.userId },
      data: updateData,
    });

    return UserStatisticsMapper.toDomain(updatedRecord);
  }
}
