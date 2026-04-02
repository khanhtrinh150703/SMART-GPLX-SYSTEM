import { PrismaClient } from '@prisma/client';
import { LicenseCategory } from '@/domain/entities/license-category/license-category.entity';
import { ILicenseCategoryRepository } from '@/domain/interfaces/repositories/i-license-category-repository';
import { LicenseCategoryMapper } from '@/infrastructure/database/mappers/license-category.mapper';
import { ILicenseCategoryRecord, PrismaLicenseCategory } from '@/infrastructure/persistence/license-category.record';
import { ICradle } from '@/shared/types/container.types';

/**
 * @description Triển khai Repository cho Hạng bằng lái sử dụng MySQL và Prisma ORM.
 */
export class MySQLLicenseCategoryRepository implements ILicenseCategoryRepository {
  private readonly _prisma: PrismaClient;

  constructor({ prisma }: ICradle) {
    this._prisma = prisma;
  }

  /**
   * Helper: Chuyển đổi từ dữ liệu Prisma sang Domain Entity thông qua Record Interface.
   */
  private _toDomain(raw: PrismaLicenseCategory | null): LicenseCategory | null {
    if (!raw) return null;

    const record: ILicenseCategoryRecord = {
      id: raw.id,
      name: raw.name,
      description: raw.description,
      created_at: raw.createdAt,
      updated_at: raw.updatedAt,
      deleted_at: raw.deletedAt,
    };

    return LicenseCategoryMapper.toDomain(record);
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

  public async delete(id: string): Promise<void> {
    await this._prisma.licenseCategory.update({
      where: { id },
      data: { deletedAt: new Date() }
    });
  }

  public async countRelatedData(id: string): Promise<{ questions: number; matrices: number; attempts: number }> {
    const [questions, matrices, attempts] = await Promise.all([
      this._prisma.questionLicenseCategory.count({ where: { licenseCategoryId: id } }),
      this._prisma.examMatrix.count({ where: { licenseCategoryId: id } }),
      this._prisma.examAttempt.count({ where: { licenseCategoryId: id } }),
    ]);

    return { questions, matrices, attempts };
  }

  public async findByIdIncludingDeleted(id: string): Promise<LicenseCategory | null> {
    const record = await this._prisma.licenseCategory.findUnique({
      where: { id }
    });
    return this._toDomain(record as PrismaLicenseCategory);
  }

  public async restore(id: string): Promise<void> {
    await this._prisma.licenseCategory.update({
      where: { id },
      data: { deletedAt: null }
    });
  }
}