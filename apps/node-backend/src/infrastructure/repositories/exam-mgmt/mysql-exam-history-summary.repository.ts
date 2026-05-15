import { ExamHistorySummaryQueryDTO } from "@/application/dtos/request/exam-history/exam-history-summary-query.request.dto";
import { ExamHistorySummaryEntity } from "@/domain/entities/exam-history/exam-history-summary.entity";
import { IExamHistorySummaryRepository } from "@/domain/interfaces/repositories/exam-mgmt";
import { ExamHistorySummaryMapper } from "@/infrastructure/database/mappers";
import { PrismaClient, Prisma } from "@prisma/client";

/**
 * @interface IMySQLExamHistorySummaryRepositoryCradle
 * @description Định nghĩa phụ thuộc cho Exam History Repository.
 */
export interface IMySQLExamHistorySummaryRepositoryCradle {
  prisma: PrismaClient;
}

/**
 * @class MySQLExamHistorySummaryRepository
 * @description Triển khai lưu trữ lịch sử thi sử dụng MySQL và Prisma.
 */
export class MySQLExamHistorySummaryRepository implements IExamHistorySummaryRepository {
  private readonly _prisma: PrismaClient;

  constructor({ prisma }: IMySQLExamHistorySummaryRepositoryCradle) {
    this._prisma = prisma;
  }

  /**
   * @description Lưu bản ghi lịch sử thi mới.
   */
  public async create(
    entity: ExamHistorySummaryEntity,
  ): Promise<ExamHistorySummaryEntity> {
    const record = ExamHistorySummaryMapper.toCreateRecord(entity);
    const savedRecord = await this._prisma.examHistory.create({
      data: record,
    });
    return ExamHistorySummaryMapper.toDomain(savedRecord);
  }

  /**
   * @description Cập nhật bản ghi lịch sử thi.
   * @param {ExamHistorySummaryEntity} entity - Thực thể mang dữ liệu cần cập nhật.
   * @returns {Promise<ExamHistorySummaryEntity>} Thực thể sau khi đã cập nhật thành công.
   */
  public async update(
    entity: ExamHistorySummaryEntity,
  ): Promise<ExamHistorySummaryEntity> {
    // 1. Dùng Mapper để lấy ra những trường ĐƯỢC PHÉP update
    const updateData = ExamHistorySummaryMapper.toUpdateRecord(entity);

    // 2. Thực hiện update trong MySQL thông qua Prisma
    const updatedRecord = await this._prisma.examHistory.update({
      where: { id: entity.id! },
      data: updateData,
    });

    // 3. Trả về Domain Entity
    return ExamHistorySummaryMapper.toDomain(updatedRecord);
  }

  /**
   * @description Tìm kiếm bài thi theo ID.
   */
  public async findById(id: string): Promise<ExamHistorySummaryEntity | null> {
    const record = await this._prisma.examHistory.findUnique({
      where: { id, deletedAt: null },
    });

    if (!record) return null;
    return ExamHistorySummaryMapper.toDomain(record);
  }

  /**
   * @description Tìm kiếm bài thi theo ID.
   */
  public async findByIdSystem(
    id: string,
  ): Promise<ExamHistorySummaryEntity | null> {
    const record = await this._prisma.examHistory.findUnique({
      where: { id },
    });

    if (!record) return null;
    return ExamHistorySummaryMapper.toDomain(record);
  }

  /**
   * @description Tìm kiếm và đếm tổng số lượng lịch sử thi có phân trang.
   */
  public async findAndCount(
    filter: ExamHistorySummaryQueryDTO,
    skip: number,
    limit: number,
  ): Promise<[ExamHistorySummaryEntity[], number]> {
    const where: Prisma.ExamHistoryWhereInput = {};

    // 1. Logic lọc trạng thái (Status Logic: Active/Deleted/All)
    if (filter.status === "passed") {
      where.isPassed = true;
    } else if (filter.status === "failed") {
      where.isPassed = false;
    }

    // 2. Bộ lọc tìm kiếm chung (Global Search)
    if (filter.search) {
      where.OR = [
        { examName: { contains: filter.search } },
        { licenseCategoryName: { contains: filter.search } },
      ];
    }

    // 3. Lọc theo các trường cụ thể (Specific Filters)
    if (filter.userId) {
      where.userId = filter.userId;
    }

    if (filter.licenseCategoryId) {
      where.licenseCategoryId = filter.licenseCategoryId;
    }

    if (filter.licenseCategoryName) {
      where.licenseCategoryName = { contains: filter.licenseCategoryName };
    }

    if (filter.isPassed !== undefined) {
      where.isPassed = filter.isPassed;
    }

    if (filter.score !== undefined) {
      where.score = filter.score;
    }

    if (filter.durationTime !== undefined) {
      where.duration = filter.durationTime;
    }

    if (filter.title) {
      where.examName = { contains: filter.title };
    }

    // 4. Lọc theo khoảng thời gian (Date Range Filter)
    if (filter.fromDate || filter.toDate) {
      where.createdAt = {
        gte: filter.fromDate,
        lte: filter.toDate,
      };
    }

    // 5. Cấu trúc sắp xếp đa tầng (Multi-level Sorting)
    const sortField =
      filter.sortBy === "status" ? "deletedAt" : filter.sortBy || "createdAt";
    const sortOrder = filter.sortOrder || "desc";

    const orderBy: Prisma.ExamHistoryOrderByWithRelationInput[] = [];

    // Ưu tiên sắp xếp theo trạng thái xóa trước
    orderBy.push({ deletedAt: sortOrder });

    // Sắp xếp theo trường động (Dynamic Sort)
    if (sortField !== "deletedAt") {
      orderBy.push({ [sortField]: sortOrder });
    }

    // Fallback sắp xếp để đảm bảo tính nhất quán (Deterministic sorting)
    if (sortField !== "createdAt") {
      orderBy.push({ createdAt: "desc" });
    }

    // 6. Thực thi truy vấn song song qua Transaction
    const [rawRecords, total] = await this._prisma.$transaction([
      this._prisma.examHistory.findMany({
        where,
        skip,
        take: limit,
        orderBy: orderBy,
      }),
      this._prisma.examHistory.count({ where }),
    ]);

    // 7. Chuyển đổi sang Domain Entity và kiểm tra kiểu (Type Guarding)
    const domainEntities = rawRecords
      .map((rec) => ExamHistorySummaryMapper.toDomain(rec))
      .filter((item): item is ExamHistorySummaryEntity => item !== null);

    return [domainEntities, total];
  }

  /**
   * @description Thực hiện Soft Delete bằng cách gán mốc thời gian hiện tại.
   */
  public async softDelete(id: string): Promise<void> {
    await this._prisma.examHistory.update({
      where: { id },
      data: { deletedAt: new Date() },
    });
  }

  /**
   * @description Thực hiện Hard Delete - "Một đi không trở lại".
   */
  public async hardDelete(id: string): Promise<void> {
    await this._prisma.examHistory.delete({
      where: { id },
    });
  }
}
