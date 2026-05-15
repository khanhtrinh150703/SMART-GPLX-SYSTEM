import { Prisma, PrismaClient, Chapter as PrismaChapter } from "@prisma/client";
import { IChapterRepository } from "@/domain/interfaces/repositories/exam-mgmt/i-chapter.repository";
import { Chapter } from "@/domain/entities/chapter/chapter.entity";
import { ChapterMapper } from "@/infrastructure/database/mappers/exam-mgmt/chapter.mapper";
import { ChapterQueryDTO } from "@/application/dtos/request/chapter/chapter-query.request.dto";
import { ChapterRelatedCount } from "@/shared/types/count.types";

export interface IMySQLChapterRepositoryCradle {
  prisma: PrismaClient;
}

export class MySQLChapterRepository implements IChapterRepository {
  private readonly _prisma: PrismaClient;

  constructor({ prisma }: IMySQLChapterRepositoryCradle) {
    this._prisma = prisma;
  }

  /**
   * Helper: Chuyển đổi an toàn từ Prisma Record sang Domain Entity.
   * Xử lý tập trung logic null-check để tránh lỗi Runtime.
   */
  private _mapToDomain(record: PrismaChapter | null): Chapter | null {
    if (!record) return null;
    return ChapterMapper.toDomain(record);
  }

  public async findAll(): Promise<Chapter[]> {
    const records = await this._prisma.chapter.findMany({
      where: { deletedAt: null },
      orderBy: { orderIndex: "asc" },
    });

    // Sử dụng Type Guard để đảm bảo mảng trả về là Chapter[] không chứa null
    return records
      .map((rec) => this._mapToDomain(rec))
      .filter((item): item is Chapter => item !== null);
  }

  public async findById(id: string): Promise<Chapter | null> {
    const record = await this._prisma.chapter.findFirst({
      where: { id, deletedAt: null },
    });
    return this._mapToDomain(record);
  }

  public async findByIdIncludingDeleted(id: string): Promise<Chapter | null> {
    // findUnique tối ưu hơn findFirst khi tìm theo Primary Key (ID)
    const record = await this._prisma.chapter.findUnique({
      where: { id },
    });
    return this._mapToDomain(record);
  }

  public async findByName(name: string): Promise<Chapter | null> {
    const record = await this._prisma.chapter.findFirst({
      where: { name },
    });
    // Đã fix: Sử dụng helper để check null trước khi gọi Mapper
    return this._mapToDomain(record);
  }

  public async createChapter(chapter: Chapter): Promise<void> {
    // Ép kiểu chuẩn từ Mapper sang Prisma Input
    const persistence = ChapterMapper.toCreatePersistence(chapter);

    await this._prisma.chapter.create({ data: persistence });
  }

  public async updateChapter(chapter: Chapter): Promise<void> {
    if (!chapter.id) return;

    const persistence = ChapterMapper.toUpdatePersistence(chapter);
    await this._prisma.chapter.update({
      where: { id: chapter.id },
      data: persistence,
    });
  }

  public async exists(id: string): Promise<boolean> {
    const count = await this._prisma.chapter.count({
      where: { id, deletedAt: null },
    });
    return count > 0;
  }

  public async findAndCount(
    query: ChapterQueryDTO,
    skip: number,
    limit: number,
  ): Promise<[Chapter[], number]> {
    const where: Prisma.ChapterWhereInput = {};

    // Logic lọc trạng thái (Active/Deleted/All)
    if (query.status === "active") {
      where.deletedAt = null;
    } else if (query.status === "deleted") {
      where.deletedAt = { not: null };
    }

    if (query.orderIndex !== undefined) {
      where.orderIndex = Number(query.orderIndex);
    }

    if (query.description !== undefined) {
      where.description = { contains: query.description };
    }

    if (query.name !== undefined) {
      where.name = { contains: query.name };
    }

    if (query.code !== undefined) {
      where.code = { contains: query.code };
    }

    const sortField =
      query.sortBy === "status" ? "deletedAt" : query.sortBy || "orderIndex";
    const sortOrder = query.sortOrder || "asc";

    const orderBy: Prisma.ChapterOrderByWithRelationInput[] = [];

    orderBy.push({ deletedAt: sortOrder });

    if (sortField !== "deletedAt") {
      orderBy.push({ [sortField]: sortOrder });
    }

    if (sortField !== "name") {
      orderBy.push({ name: "asc" });
    }

    const [rawRecords, total] = await this._prisma.$transaction([
      this._prisma.chapter.findMany({
        where,
        skip,
        take: limit,
        orderBy: orderBy, 
      }),
      this._prisma.chapter.count({ where }),
    ]);

    const domainEntities = rawRecords
      .map((rec) => this._mapToDomain(rec))
      .filter((item): item is Chapter => item !== null);

    return [domainEntities, total];
  }

  public async findByCode(code: string): Promise<Chapter | null> {
    const record = await this._prisma.chapter.findUnique({
      where: { code: code.trim() },
    });
    return this._mapToDomain(record);
  }

  /**
   * @description Thống kê chi tiết các dữ liệu đang phụ thuộc vào Chương.
   * @param {string} id - UUID của chương cần kiểm tra.
   * @returns {Promise<ChapterRelatedCount>} Đối tượng chứa số lượng ở các bảng con.
   */
  public async countRelatedData(id: string): Promise<ChapterRelatedCount> {
    const [questions, matrixDetails] = await Promise.all([
      // 1. Đếm số lượng câu hỏi thuộc chương này (chỉ đếm câu chưa bị xóa mềm)
      this._prisma.question.count({
        where: {
          chapterId: id,
          deletedAt: null,
        },
      }),

      // 2. Đếm số lượng cấu hình ma trận đề thi đang sử dụng chương này
      this._prisma.examMatrixDetail.count({
        where: { chapterId: id },
      }),
    ]);

    return {
      questions,
      matrixDetails,
    };
  }

  public async softDelete(id: string): Promise<void> {
    await this._prisma.chapter.update({
      where: { id },
      data: { deletedAt: new Date() },
    });
  }

  public async hardDelete(id: string): Promise<void> {
    await this._prisma.chapter.delete({
      where: { id },
    });
  }

  public async restore(id: string): Promise<void> {
    await this._prisma.chapter.update({
      where: { id },
      data: { deletedAt: null },
    });
  }
}
