import { Prisma, PrismaClient } from '@prisma/client';
import { IChapterRepository } from '@/domain/interfaces/repositories/i-chapter.repository';
import { Chapter } from '@/domain/entities/chapter/chapter.entity';
import { ChapterMapper } from '@/infrastructure/database/mappers/chapter.mapper';
import { IChapterRecord, PrismaChapter } from '@/infrastructure/persistence/chapter.record';
import { ChapterQueryDTO } from '@/application/dtos/request/chapter/chapter-query.request.dto';

/**
 * @interface IMySQLChapterRepositoryCradle
 * @description Định nghĩa các phụ thuộc (dependencies) cần thiết cho Chapter Repository.
 * Chỉ cho phép tiếp cận PrismaClient để thực hiện các thao tác với Database.
 */
export interface IMySQLChapterRepositoryCradle {
  prisma: PrismaClient;
}

/**
 * @class MySQLChapterRepository
 * @description Triển khai Repository cho Chương lý thuyết sử dụng MySQL và Prisma ORM.
 * Quản lý các bản ghi chương (Khái niệm, Quy tắc, Kỹ thuật lái xe...).
 */
export class MySQLChapterRepository implements IChapterRepository {
  private readonly _prisma: PrismaClient;

  /**
   * @description Khởi tạo Repository với "vũ khí" Prisma được "tiêm" từ DI Container.
   * @param {IMySQLChapterRepositoryCradle} cradle - Chỉ chứa PrismaClient.
   */
  constructor({ prisma }: IMySQLChapterRepositoryCradle) {
    this._prisma = prisma;
  }
  /**
   * Helper: "Thông dịch viên" từ Prisma sang Domain thông qua Record.
   */
  private _toDomain(raw: PrismaChapter | null): Chapter | null {
    if (!raw) return null;

    // Mapping từ CamelCase của Prisma sang SnakeCase của IChapterRecord
    const record: IChapterRecord = {
      id: raw.id,
      name: raw.name,
      description: raw.description,
      orderIndex: raw.orderIndex, // Giả định Prisma dùng orderIndex
      createdAt: raw.createdAt,
      updatedAt: raw.updatedAt,
      deletedAt: raw.deletedAt,
    };

    return ChapterMapper.toDomain(record);
  }

  public async findAll(): Promise<Chapter[]> {
    const records = await this._prisma.chapter.findMany({
      where: { deletedAt: null },
      orderBy: { orderIndex: 'asc' }
    });

    return records
      .map((rec) => this._toDomain(rec as PrismaChapter))
      .filter((item): item is Chapter => item !== null);
  }

  public async findById(id: string): Promise<Chapter | null> {
    const record = await this._prisma.chapter.findFirst({
      where: { id, deletedAt: null }
    });
    return this._toDomain(record as PrismaChapter);
  }

  public async findByIdIncludingDeleted(id: string): Promise<Chapter | null> {
    const record = await this._prisma.chapter.findFirst({
      where: { id }
    });
    return this._toDomain(record as PrismaChapter);
  }

  public async findByName(name: string): Promise<Chapter | null> {
    const record = await this._prisma.chapter.findFirst({
      where: { name, deletedAt: null }
    });
    return this._toDomain(record as PrismaChapter);
  }

  public async save(chapter: Chapter): Promise<void> {
    const data = ChapterMapper.toPersistence(chapter);

    await this._prisma.chapter.create({
      data: {
        id: data.id,
        name: data.name,
        description: data.description,
        orderIndex: data.orderIndex, // Trả lại CamelCase cho Prisma
      }
    });
  }

  public async update(chapter: Chapter): Promise<void> {
    if (!chapter.id) return;

    const data = ChapterMapper.toPersistence(chapter);

    await this._prisma.chapter.update({
      where: { id: chapter.id },
      data: {
        name: data.name,
        description: data.description,
        orderIndex: data.orderIndex,
        updatedAt: new Date(),
        deletedAt: data.deletedAt
      }
    });
  }

  /**
   * @description Kiểm tra sự tồn tại của bản ghi theo ID.
   * @param {string} id - ID của danh mục/chương cần kiểm tra.
   * @returns {Promise<boolean>} Trả về true nếu tồn tại và đang hoạt động (deletedAt là null), ngược lại false.
   */
  public async exists(id: string): Promise<boolean> {
    // Dùng count để Database chỉ đếm số lượng, không bốc dữ liệu thừa (Over-fetching)
    const count = await this._prisma.chapter.count({
      where: {
        id,
        deletedAt: null // Quan trọng: Chỉ tính những bản ghi "đang sống"
      }
    });

    // Nếu count > 0 nghĩa là có tồn tại
    return count > 0;
  }

  /**
   * @description Tìm kiếm và phân trang Chương bài học (Sử dụng gán thủ công để đảm bảo Type-safe)
   * (Search and paginate Chapters with explicit assignment for type-safety)
   */
  /**
    * @description Tìm kiếm và phân trang chương học (Dịch: Find and count chapters with pagination)
    * Sử dụng gán thủ công để đảm bảo Type-safe và xử lý logic All/Active/Deleted.
    */
  public async findAndCount(
    query: ChapterQueryDTO,
    skip: number,
    limit: number
  ): Promise<[Chapter[], number]> {
    // 1. Khai báo kiểu WhereInput chuẩn của Prisma (Dịch: Initialize Prisma WhereInput)
    const where: Prisma.ChapterWhereInput = {};

    // --- 2. LOGIC TRẠNG THÁI (Status Tabs - Dịch: Tab status logic) ---
    // Áp dụng case đặc biệt 'all' để lấy sạch sành sanh
    if (query.status === 'all') {
      // Do nothing -> Fetch everything (including deleted)
    } else if (query.status === 'active') {
      where.deletedAt = null;
    } else if (query.status === 'deleted') {
      where.deletedAt = { not: null };
    }

    // --- 3. GÁN THỦ CÔNG CÁC TRƯỜNG ĐẶC THÙ (Dịch: Specific field assignment) ---
    if (query.orderIndex !== undefined) {
      where.orderIndex = Number(query.orderIndex);
    }

    // --- 4. SEARCH TỔNG QUÁT (Dịch: General Search Logic) ---
    // Dùng OR để search đồng thời cả Tên và Mô tả
    if (query.search) {
      where.OR = [
        { name: { contains: query.search } },
        { description: { contains: query.search } },
      ];
    }

    // --- 5. XỬ LÝ SORT FIELD ---
    const sortField = query.sortBy === 'status' ? 'deletedAt' : (query.sortBy || 'orderIndex');
    const sortOrder = query.sortOrder || 'asc';

    // --- 6. THỰC THI TRUY VẤN ---
    const [rawRecords, total] = await this._prisma.$transaction([
      this._prisma.chapter.findMany({
        where,
        skip,
        take: limit,
        orderBy: [
          {
            // 1. Tiêu chí chính: Theo UI Admin chọn (Dịch: Primary Criteria)
            [sortField]: sortOrder
          },
          {
            // 2. Tiêu chí phụ: Phân xử khi tiêu chí chính bị trùng (Dịch: Tie-breaker)
            // Luôn xếp theo tên để Admin dễ tìm
            name: 'asc'
          },
        ],
      }),
      this._prisma.chapter.count({ where }),
    ]);

    // --- 7. MAPPING & RETURN ---
    // Biến Database Record thành Domain Entity
    const domainEntities = rawRecords.map((record) =>
      ChapterMapper.toDomain(record as unknown as IChapterRecord)
    );

    return [domainEntities, total];
  }

  public async countQuestions(id: string): Promise<number> {
    return await this._prisma.question.count({
      where: { chapterId: id }
    });
  }


  public async restore(id: string): Promise<void> {
    await this._prisma.chapter.update({
      where: { id },
      data: { deletedAt: null }
    });
  }
}