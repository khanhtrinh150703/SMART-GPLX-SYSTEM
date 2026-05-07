import { UserExamRankEntity } from "@/domain/entities/user-rank/user-exam-rank.entity";
import { IUserExamRankRepository } from "@/domain/interfaces/repositories";
import { UserExamRankMapper } from "@/infrastructure/database/mappers";
import { PrismaClient } from "@prisma/client";

/**
 * @interface IMySQLUserExamRankRepositoryCradle
 * @description Định nghĩa các phụ thuộc (dependencies) dành riêng cho User Exam Rank Repository.
 * Tập trung vào việc cung cấp PrismaClient để xử lý các truy vấn xếp hạng trên MySQL.
 */
export interface IMySQLUserExamRankRepositoryCradle {
  prisma: PrismaClient;
}

/**
 * @class MySQLUserExamRankRepository
 * @description Triển khai Repository cho bảng xếp hạng sử dụng Prisma (MySQL).
 * Quản lý các nghiệp vụ lưu trữ điểm số cao nhất, tính toán thứ hạng và lịch sử đạt hạng của người dùng.
 * Tuân thủ nghiêm ngặt giao diện IUserExamRankRepository.
 */
export class MySQLUserExamRankRepository implements IUserExamRankRepository {
  private readonly _prisma: PrismaClient;

  /**
   * @description Khởi tạo Repository với "vũ khí" Prisma được "tiêm" từ DI Container.
   * @param {IMySQLUserExamRankRepositoryCradle} cradle - Chứa instance PrismaClient để thao tác với database.
   */
  constructor({ prisma }: IMySQLUserExamRankRepositoryCradle) {
    this._prisma = prisma;
  }

  /**
   * @description Tìm kỷ lục dựa trên cặp khóa duy nhất (userId, examId).
   */
  public async findByUserAndExam(
    userId: string,
    examId: string,
  ): Promise<UserExamRankEntity | null> {
    const record = await this._prisma.userExamRank.findUnique({
      where: {
        user_exam_unique_key: {
          userId,
          examId,
        },
      },
    });

    return record ? UserExamRankMapper.toDomain(record) : null;
  }

  /**
   * @description Lưu mới một bản ghi kỷ lục.
   */
  public async save(entity: UserExamRankEntity): Promise<void> {
    const data = UserExamRankMapper.toPersistence(entity);
    await this._prisma.userExamRank.create({
      data,
    });
  }

  /**
   * @description Cập nhật thành tích tốt nhất.
   */
  public async update(entity: UserExamRankEntity): Promise<void> {
    const data = UserExamRankMapper.toUpdatePersistence(entity);
    await this._prisma.userExamRank.update({
      where: { id: entity.id },
      data,
    });
  }

  /**
   * @description Lấy bảng xếp hạng theo đề thi (Sắp xếp: Điểm cao nhất -> Thời gian ngắn nhất).
   */
  public async getLeaderboardByExam(
    examId: string,
    limit: number,
  ): Promise<UserExamRankEntity[]> {
    const records = await this._prisma.userExamRank.findMany({
      where: { examId },
      orderBy: [{ bestScore: "desc" }, { fastestSeconds: "asc" }],
      take: limit,
    });

    return records.map((record) => UserExamRankMapper.toDomain(record));
  }

  /**
   * @description Lấy bảng xếp hạng theo hạng bằng lái.
   */
  public async getLeaderboardByCategory(
    licenseCategoryId: string,
    limit: number,
  ): Promise<UserExamRankEntity[]> {
    const records = await this._prisma.userExamRank.findMany({
      where: { licenseCategoryId },
      orderBy: [{ bestScore: "desc" }, { fastestSeconds: "asc" }],
      take: limit,
    });

    return records.map((record) => UserExamRankMapper.toDomain(record));
  }

  /**
   * @description Tính toán thứ hạng bằng cách đếm số người có thành tích tốt hơn.
   * Logic: (Điểm > Điểm hiện tại) HOẶC (Điểm = Điểm hiện tại VÀ Thời gian < Thời gian hiện tại).
   */
  public async countBetterRanks(
    examId: string,
    score: number,
    durationSeconds: number,
  ): Promise<number> {
    const count = await this._prisma.userExamRank.count({
      where: {
        examId,
        OR: [
          { bestScore: { gt: score } },
          {
            AND: [
              { bestScore: score },
              { fastestSeconds: { lt: durationSeconds } },
            ],
          },
        ],
      },
    });

    // Thứ hạng = Số người đứng trên + 1
    return count + 1;
  }

  /**
   * @description Lấy tất cả kỷ lục cá nhân của người dùng.
   */
  public async findAllByUser(userId: string): Promise<UserExamRankEntity[]> {
    const records = await this._prisma.userExamRank.findMany({
      where: { userId },
      orderBy: { updatedAt: "desc" },
    });

    return records.map((record) => UserExamRankMapper.toDomain(record));
  }

  /**
   * @description Kiểm tra tồn tại nhanh bằng phương thức count.
   */
  public async exists(userId: string, examId: string): Promise<boolean> {
    const count = await this._prisma.userExamRank.count({
      where: { userId, examId },
    });
    return count > 0;
  }

  /**
   * @description Xóa bản ghi kỷ lục.
   */
  public async delete(id: string): Promise<void> {
    await this._prisma.userExamRank.delete({
      where: { id },
    });
  }

  /**
   * @description Lấy danh sách kỷ lục từ SQL (Prisma) dựa trên ID từ Redis.
   */
  public async findByUserIdsAndExam(
    userIds: string[],
    examId: string,
  ): Promise<UserExamRankEntity[]> {
    // 1. Chặn sớm nếu mảng rỗng
    if (!userIds.length) return [];

    // 2. Query bằng Prisma với toán tử 'in'
    const records = await this._prisma.userExamRank.findMany({
      where: {
        userId: { in: userIds },
        examId: examId,
      },
    });

    // 3. Map sang Domain Entity
    const entities = records.map((record) =>
      UserExamRankMapper.toDomain(record),
    );

    /**
     * 4. QUAN TRỌNG: Sắp xếp lại theo đúng thứ tự userIds truyền vào.
     */
    return userIds
      .map((id) => entities.find((entity) => entity.props.userId === id))
      .filter((entity): entity is UserExamRankEntity => !!entity);
  }
}
