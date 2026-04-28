import { Prisma, PrismaClient } from '@prisma/client';
import { LicenseCategory } from '@/domain/entities/license-category/license-category.entity';
import { ILicenseCategoryRepository } from '@/domain/interfaces/repositories/exam-mgmt/i-license-category-repository';
import { LicenseCategoryMapper } from '@/infrastructure/database/mappers/exam-mgmt/license-category.mapper';
import { ILicenseCategoryRecord, PrismaLicenseCategory } from '@/infrastructure/persistence/exam-mgmt/license-category.record';
import { LicenseCategoryQueryDTO } from '@/application/dtos/request/license-category/license-category-query.request.dto';
import { LicenseRelatedCount } from '@/shared/types/count.types';
/**
 * @interface IMySQLLicenseCategoryRepositoryCradle
 * @description Các phụ thuộc cần thiết cho LicenseCategory Repository.
 * Đảm bảo tính đóng gói và chỉ cung cấp đúng PrismaClient cho tầng dữ liệu.
 */
export interface IMySQLLicenseCategoryRepositoryCradle {
  prisma: PrismaClient;
}

/**
 * @class MySQLLicenseCategoryRepository
 * @description Triển khai Repository cho Hạng bằng lái sử dụng MySQL và Prisma ORM.
 */
export class MySQLLicenseCategoryRepository implements ILicenseCategoryRepository {
  private readonly _prisma: PrismaClient;

  /**
   * @description Khởi tạo Repository với "vũ khí" Prisma chuyên dụng.
   * @param {IMySQLLicenseCategoryRepositoryCradle} cradle - Dependencies được tiêm từ DI Container.
   */
  constructor({ prisma }: IMySQLLicenseCategoryRepositoryCradle) {
    // Ép kiểu cụ thể giúp tránh việc các repository khác "đi lạc" vào đây
    this._prisma = prisma;
  }

  /**
   * Helper: Chuyển đổi từ dữ liệu Prisma sang Domain Entity thông qua Record Interface.
   */
  private _toDomain(raw: PrismaLicenseCategory | null): LicenseCategory | null {
    if (!raw) return null;
    return LicenseCategoryMapper.toDomain(raw);
  }

  public async findAll(): Promise<LicenseCategory[]> {
    const records = await this._prisma.licenseCategory.findMany({
      where: { deletedAt: null }
    });

    return records
      .map((rec) => this._toDomain(rec as PrismaLicenseCategory))
      .filter((item): item is LicenseCategory => item !== null);
  }

  public async findById(id: string): Promise<LicenseCategory | null> {
    const record = await this._prisma.licenseCategory.findFirst({
      where: { id, deletedAt: null }
    });
    return this._toDomain(record as PrismaLicenseCategory);
  }

  public async findByIdActive(id: string): Promise<LicenseCategory | null> {
    const record = await this._prisma.licenseCategory.findFirst({
      where: { id }
    });
    return this._toDomain(record as PrismaLicenseCategory);
  }

  public async findByName(name: string): Promise<LicenseCategory | null> {
    const record = await this._prisma.licenseCategory.findFirst({
      where: { name, deletedAt: null }
    });
    return this._toDomain(record as PrismaLicenseCategory);
  }

  public async createLicenseCategory(category: LicenseCategory): Promise<void> {
    const record = LicenseCategoryMapper.toCreatePersistence(category);

    await this._prisma.licenseCategory.create({
      data: record
    });
  }

  public async updateLicenseCategory(id: string, category: LicenseCategory): Promise<void> {
    const persistence = LicenseCategoryMapper.toCreatePersistence(category);

    await this._prisma.licenseCategory.update({
      where: { id },
      data: persistence
    });
  }

  /**
   * @description Kiểm tra sự tồn tại của bản ghi theo ID.
   * @param {string} id - ID của danh mục/chương cần kiểm tra.
   * @returns {Promise<boolean>} Trả về true nếu tồn tại và đang hoạt động (deletedAt là null), ngược lại false.
   */
  public async exists(id: string): Promise<boolean> {
    // Dùng count để Database chỉ đếm số lượng, không bốc dữ liệu thừa (Over-fetching)
    const count = await this._prisma.licenseCategory.count({
      where: {
        id,
        deletedAt: null // Quan trọng: Chỉ tính những bản ghi "đang sống"
      }
    });

    // Nếu count > 0 nghĩa là có tồn tại
    return count > 0;
  }

  /**
   * @description Thống kê chi tiết các dữ liệu đang phụ thuộc vào Hạng bằng lái.
   * @param {string} id - UUID của hạng bằng lái cần kiểm tra.
   * @returns {Promise<LicenseRelatedCount>} Đối tượng chứa số lượng bản ghi liên quan.
   */
  public async countRelatedData(id: string): Promise<LicenseRelatedCount> {
    const [questions, matrices, exams, attempts] = await Promise.all([
      // 1. Đếm số liên kết với câu hỏi (Chỉ tính các câu hỏi chưa bị xóa mềm)
      this._prisma.questionLicenseCategory.count({
        where: {
          licenseCategoryId: id,
          question: { deletedAt: null } // Lọc theo trạng thái của câu hỏi
        }
      }),

      // 2. Đếm số lượng ma trận đề thi (Chỉ tính ma trận chưa bị xóa mềm)
      this._prisma.examMatrix.count({
        where: {
          licenseCategoryId: id,
          deletedAt: null
        }
      }),

      // 3. Đếm số lượng kỳ thi (Chỉ tính kỳ thi chưa bị xóa mềm)
      this._prisma.exam.count({
        where: {
          licenseCategoryId: id,
          deletedAt: null
        }
      }),

      // 4. Đếm số lượt thi (Lịch sử thi - Thường không có xóa mềm nên đếm tất cả)
      this._prisma.examAttempt.count({
        where: { licenseCategoryId: id }
      }),
    ]);

    return {
      questions,
      matrices,
      exams,
      attempts,
    };
  }

  public async findByIdIncludingDeleted(id: string): Promise<LicenseCategory | null> {
    const record = await this._prisma.licenseCategory.findUnique({
      where: { id }
    });
    return this._toDomain(record as PrismaLicenseCategory);
  }

  /**
   * @description Tìm kiếm và phân trang hạng bằng lái (Sử dụng gán thủ công để đảm bảo Type-safe)
   */
  public async findAndCount(
    query: LicenseCategoryQueryDTO,
    skip: number,
    limit: number
  ): Promise<[LicenseCategory[], number]> {
    // Khai báo kiểu WhereInput chuẩn của Prisma ngay từ đầu
    const where: Prisma.LicenseCategoryWhereInput = {};

    // --- 1. GÁN THỦ CÔNG (Explicit Assignment) ---
    // Bạn chọn trường nào trên Dropdown, FE gửi trường đó về, mình gán đúng trường đó.

    if (query.search) {
      where.name = { contains: query.search };
    }

    if (query.description) {
      where.description = { contains: query.description };
    }

    if (query.minAge) {
      // Ép kiểu về Number để tránh lỗi Prisma nếu dữ liệu từ URL là string
      where.minAge = Number(query.minAge);
    }

    // --- 2. LOGIC TRẠNG THÁI (Status Tabs) ---
    if (query.status === 'active') {
      where.deletedAt = null;
    } else if (query.status === 'deleted') {
      where.deletedAt = { not: null };
    }

    // --- 3. SEARCH TỔNG QUÁT (Nếu còn dùng ô search chung) ---
    if (query.search) {
      where.OR = [
        { name: { contains: query.search } },
        { description: { contains: query.search } },
      ];
    }
    const sortField = query.sortBy === 'status' ? 'deletedAt' : query.sortBy;
    // --- 4. THỰC THI TRUY VẤN ---
    const [rawRecords, total] = await this._prisma.$transaction([
      this._prisma.licenseCategory.findMany({
        where,
        // Dùng pagination helper hoặc tính toán trực tiếp
        skip: skip,   // Truyền biến skip vào đây
        take: limit,
        // Sắp xếp động theo sortBy
        orderBy: { [sortField]: query.sortOrder },
      }),
      this._prisma.licenseCategory.count({ where }),
    ]);

    // --- 5. MAPPING & RETURN ---
    const domainEntities = rawRecords.map((record) =>
      LicenseCategoryMapper.toDomain(record as unknown as ILicenseCategoryRecord)
    );

    return [domainEntities, total];
  }

  public async softDelete(id: string): Promise<void> {
    await this._prisma.licenseCategory.update({
      where: { id },
      data: { deletedAt: new Date() }
    });
  }

  public async hardDelete(id: string): Promise<void> {
    await this._prisma.licenseCategory.delete({
      where: { id },
    });
  }

  public async restore(id: string): Promise<void> {
    await this._prisma.licenseCategory.update({
      where: { id },
      data: { deletedAt: null }
    });
  }
}