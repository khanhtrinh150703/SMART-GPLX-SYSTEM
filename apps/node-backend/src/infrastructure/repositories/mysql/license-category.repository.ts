import { PrismaClient } from '@prisma/client';
import { LicenseCategory } from '@/domain/entities/license-category/license-category.entity';
import { ILicenseCategoryRepository } from '@/domain/interfaces/repositories/i-license-category-repository';
import { LicenseCategoryMapper } from '@/infrastructure/database/mappers/license-category.mapper';
import { ILicenseCategoryRecord } from '@/infrastructure/persistence/license-category.record';
import { ICradle } from '@/shared/types/container.types';

/**
 * @description Triển khai Repository cho Hạng bằng lái sử dụng MySQL và Prisma ORM.
 * Chịu trách nhiệm thực thi các truy vấn dữ liệu thuần túy và ánh xạ giữa Record và Entity.
 */
export class MySQLLicenseCategoryRepository implements ILicenseCategoryRepository {
  private readonly _prisma: PrismaClient;

  /**
   * Khởi tạo Repository với Prisma client từ DI Container.
   * @param {ICradle} dependencies - Chứa instance của PrismaClient.
   */
  constructor({ prisma }: ICradle) {
    this._prisma = prisma;
  }

  /**
   * @description Truy vấn danh sách toàn bộ hạng bằng lái chưa bị xóa mềm.
   * @returns {Promise<LicenseCategory[]>} Danh sách thực thể Domain Entity.
   */
  public async findAll(): Promise<LicenseCategory[]> {
    const records = await this._prisma.licenseCategory.findMany({
      where: { deletedAt: null }
    });
    return records.map((record) =>
      LicenseCategoryMapper.toDomain(record as unknown as ILicenseCategoryRecord)
    );
  }

  /**
   * @description Tìm kiếm một hạng bằng lái đang hoạt động theo ID.
   * @param {string} id - UUID của hạng bằng.
   * @returns {Promise<LicenseCategory | null>}
   */
  public async findById(id: string): Promise<LicenseCategory | null> {
    const record = await this._prisma.licenseCategory.findFirst({
      where: { id, deletedAt: null }
    });
    return record ? LicenseCategoryMapper.toDomain(record as unknown as ILicenseCategoryRecord) : null;
  }

  /**
   * @description Tìm kiếm hạng bằng lái theo ID (Không lọc trạng thái xóa).
   * @param {string} id - UUID của hạng bằng.
   * @returns {Promise<LicenseCategory | null>}
   */
  public async findByIdActive(id: string): Promise<LicenseCategory | null> {
    const record = await this._prisma.licenseCategory.findFirst({
      where: { id }
    });
    return record ? LicenseCategoryMapper.toDomain(record as unknown as ILicenseCategoryRecord) : null;
  }

  /**
   * @description Tìm kiếm hạng bằng lái đang hoạt động theo tên duy nhất.
   * @param {string} name - Tên hạng bằng (VD: 'A1', 'B2').
   * @returns {Promise<LicenseCategory | null>}
   */
  public async findByName(name: string): Promise<LicenseCategory | null> {
    const record = await this._prisma.licenseCategory.findFirst({
      where: { name, deletedAt: null }
    });
    return record ? LicenseCategoryMapper.toDomain(record as unknown as ILicenseCategoryRecord) : null;
  }

  /**
   * @description Tạo mới một bản ghi hạng bằng lái vào cơ sở dữ liệu.
   * @param {LicenseCategory} category - Thực thể Domain cần lưu trữ.
   * @returns {Promise<void>}
   */
  public async save(category: LicenseCategory): Promise<void> {
    const data = LicenseCategoryMapper.toPersistence(category);
    await this._prisma.licenseCategory.create({
      data: {
        id: data.id!,
        name: data.name!,
        description: data.description!,
      }
    });
  }

  /**
   * @description Cập nhật các thông tin cơ bản của một hạng bằng lái hiện có.
   * @param {LicenseCategory} category - Thực thể chứa dữ liệu mới.
   * @returns {Promise<void>}
   */
  public async update(category: LicenseCategory): Promise<void> {
    const data = LicenseCategoryMapper.toPersistence(category);
    await this._prisma.licenseCategory.update({
      where: { id: data.id },
      data: {
        name: data.name,
        description: data.description,
      }
    });
  }

  /**
   * @description Thực hiện xóa mềm bằng cách cập nhật thời điểm xóa (deletedAt).
   * @param {string} id - UUID của hạng bằng cần xóa.
   * @returns {Promise<void>}
   */
  public async delete(id: string): Promise<void> {
    await this._prisma.licenseCategory.update({
      where: { id },
      data: { deletedAt: new Date() }
    });
  }

  /**
   * @description Thống kê số lượng dữ liệu liên quan để phục vụ kiểm tra ràng buộc nghiệp vụ.
   * @param {string} id - UUID của hạng bằng.
   * @returns {Promise<{ questions: number; matrices: number; attempts: number }>}
   */
  public async countRelatedData(id: string): Promise<{ questions: number; matrices: number; attempts: number }> {
    const [questions, matrices, attempts] = await Promise.all([
      this._prisma.questionLicenseCategory.count({ where: { licenseCategoryId: id } }),
      this._prisma.examMatrix.count({ where: { licenseCategoryId: id } }),
      this._prisma.examAttempt.count({ where: { licenseCategoryId: id } }),
    ]);

    return { questions, matrices, attempts };
  }

  /**
   * @description Truy vấn thông tin hạng bằng lái bao gồm cả các bản ghi đã bị xóa mềm.
   * @param {string} id - UUID của hạng bằng.
   * @returns {Promise<LicenseCategory | null>}
   */
  public async findByIdIncludingDeleted(id: string): Promise<LicenseCategory | null> {
    const record = await this._prisma.licenseCategory.findUnique({
      where: { id }
    });
    return record ? LicenseCategoryMapper.toDomain(record as unknown as ILicenseCategoryRecord) : null;
  }

  /**
   * @description Khôi phục hạng bằng lái đã bị xóa mềm (đặt lại deletedAt thành null).
   * @param {string} id - UUID của hạng bằng cần khôi phục.
   * @returns {Promise<void>}
   */
  public async restore(id: string): Promise<void> {
    await this._prisma.licenseCategory.update({
      where: { id },
      data: { deletedAt: null }
    });
  }
}