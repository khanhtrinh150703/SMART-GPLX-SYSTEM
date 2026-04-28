import {
  IMasterDataCacheService,
} from "@/domain/interfaces/services/exam-mgmt/i-master-data-cache.service";
import prisma from "../../../prisma/prisma";
import { ICachedCategory, ICachedChapter, ICachedExamMatrix, ICachedRole } from "@/shared/master-data";
import { AppError, ErrorCode } from "@/shared/errors";


/**
 * @description Dịch vụ quản lý bộ nhớ đệm Master Data (Implementation)
 */
export class MasterDataCacheService implements IMasterDataCacheService {
  private _isInitialized = false;

  private _rolesById = new Map<string, ICachedRole>();
  private _rolesByName = new Map<string, ICachedRole>();

  private _chaptersById = new Map<string, ICachedChapter>();
  private _chaptersByNormalizedName = new Map<string, ICachedChapter>();
  private _chaptersByCode = new Map<string, ICachedChapter>();

  private _categoriesById = new Map<string, ICachedCategory>();
  private _categoriesByNormalizedName = new Map<string, ICachedCategory>();

  private _matricesById = new Map<string, ICachedExamMatrix>();
  private _matricesByLicenseId = new Map<string, ICachedExamMatrix[]>();

  public async initialize(): Promise<void> {
    try {
      const [rolesFromDb, chaptersFromDb, categoriesFromDb, matricesFromDb] = await Promise.all([
        prisma.role.findMany({
          include: { rolePermissions: { include: { permission: true } } }
        }),
        prisma.chapter.findMany(),
        prisma.licenseCategory.findMany(),
        prisma.examMatrix.findMany({ where: { deletedAt: null } })
      ]);

      // 1. Kiểm tra dữ liệu sống còn (Dữ liệu bắt buộc phải có trong DB)
      if (categoriesFromDb.length === 0 || chaptersFromDb.length === 0) {
        throw new AppError(ErrorCode.CACHE.EMPTY_DATA);
      }

      this._clearAllCaches();

      // 2. Map Roles
      rolesFromDb.forEach(role => {
        const cached: ICachedRole = {
          id: role.id,
          name: role.name,
          description: role.description || "",
          permissions: role.rolePermissions.map(rp => rp.permission.name)
        };
        this._rolesById.set(role.id, cached);
        this._rolesByName.set(role.name, cached);
      });

      // 3. Map Chapters
      chaptersFromDb.forEach(chapter => {
        const cached: ICachedChapter = { id: chapter.id, name: chapter.name, orderIndex: chapter.orderIndex };
        this._chaptersById.set(chapter.id, cached);
        this._chaptersByNormalizedName.set(chapter.name.trim().toLowerCase(), cached);
        this._chaptersByCode.set(String(chapter.code).trim().toLowerCase(), cached);
      });

      // 4. Map Categories
      categoriesFromDb.forEach(category => {
        const cached: ICachedCategory = { id: category.id, name: category.name, orderIndex: category.orderIndex };
        this._categoriesById.set(category.id, cached);
        this._categoriesByNormalizedName.set(category.name.trim().toLowerCase(), cached);
      });

      // 5. Map ExamMatrices
      matricesFromDb.forEach(matrix => {
        const cached: ICachedExamMatrix = {
          id: matrix.id,
          name: matrix.name,
          licenseCategoryId: matrix.licenseCategoryId,
          totalQuestions: matrix.totalQuestions,
          durationMinutes: matrix.durationMinutes,
          passingScore: matrix.passingScore,
          createdAt: matrix.createdAt,
        };
        this._matricesById.set(matrix.id, cached);

        const existing = this._matricesByLicenseId.get(matrix.licenseCategoryId) || [];
        this._matricesByLicenseId.set(matrix.licenseCategoryId, [...existing, cached]);
      });

      this._isInitialized = true;

    } catch (error) {
      this._isInitialized = false;
      // Nếu là lỗi AppError (như EMPTY_DATA) thì ném tiếp, nếu không thì ném lỗi REFRESH_FAILED
      if (error instanceof AppError) throw error;
      throw new AppError(ErrorCode.CACHE.REFRESH_FAILED);
    }
  }

  // --- Hàm kiểm tra trạng thái khởi tạo ---
  private _ensureInitialized(): void {
    if (!this._isInitialized) {
      throw new AppError(ErrorCode.CACHE.NOT_INITIALIZED);
    }
  }

  // --- Retrieval Methods (Single) ---
  public getRoleById(id: string) {
    this._ensureInitialized();
    return this._rolesById.get(id);
  }

  public getChapterById(id: string) {
    this._ensureInitialized();
    return this._chaptersById.get(id);
  }

  public getCategoryById(id: string) {
    this._ensureInitialized();
    return this._categoriesById.get(id);
  }

  public getMatrixById(id: string) {
    this._ensureInitialized();
    return this._matricesById.get(id);
  }

  // --- Excel Retrieval Methods (Có phòng vệ) ---

  public getChapterByExcelName(rawName: string) {
    this._ensureInitialized();
    if (!rawName) return undefined;
    return this._chaptersByNormalizedName.get(rawName.trim().toLowerCase());
  }

  public getChapterByExcelCode(rawCode: string | number) {
    this._ensureInitialized();
    if (rawCode === undefined || rawCode === null) return undefined;
    return this._chaptersByCode.get(String(rawCode).trim().toLowerCase());
  }

  public getCategoryByExcelName(rawName: string) {
    this._ensureInitialized();
    if (!rawName) return undefined;
    return this._categoriesByNormalizedName.get(rawName.trim().toLowerCase());
  }


  /** * @description Lấy thông tin Role dựa trên tên chính xác.
   * @param name Tên Role (ví dụ: 'Admin', 'User').
   * @returns Đối tượng Role hoặc undefined.
   */
  public getRoleByName(name: string) {
    this._ensureInitialized();
    if (!name) return undefined;
    return this._rolesByName.get(name);
  }

  // --- Retrieval Methods (Find All / List) ---

  public getAllRoles(): ICachedRole[] {
    this._ensureInitialized();
    return Array.from(this._rolesById.values());
  }

  public getAllChapters(): ICachedChapter[] {
    this._ensureInitialized();
    return Array.from(this._chaptersById.values());
  }

  public getAllCategories(): ICachedCategory[] {
    this._ensureInitialized();
    return Array.from(this._categoriesById.values());
  }

  public getAllMatrices(): ICachedExamMatrix[] {
    this._ensureInitialized();
    return Array.from(this._matricesById.values());
  }

  public getMatricesByLicense(licenseId: string): ICachedExamMatrix[] {
    this._ensureInitialized();
    return this._matricesByLicenseId.get(licenseId) || [];
  }

  // --- Check Methods ---
  public existsRole(id: string) { this._ensureInitialized(); return this._rolesById.has(id); }
  public existsChapter(id: string) { this._ensureInitialized(); return this._chaptersById.has(id); }
  public existsCategory(id: string) { this._ensureInitialized(); return this._categoriesById.has(id); }
  public existsMatrix(id: string) { this._ensureInitialized(); return this._matricesById.has(id); }

  private _clearAllCaches(): void {
    this._rolesById.clear();
    this._rolesByName.clear();
    this._chaptersById.clear();
    this._chaptersByNormalizedName.clear();
    this._chaptersByCode.clear();
    this._categoriesById.clear();
    this._categoriesByNormalizedName.clear();
    this._matricesById.clear();
    this._matricesByLicenseId.clear();
  }

  public async refresh(): Promise<void> {
    await this.initialize();
  }
}

export const masterDataCacheService = new MasterDataCacheService();