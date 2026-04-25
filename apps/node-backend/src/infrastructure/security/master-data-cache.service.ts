import {
  IMasterDataCacheService,
} from "@/domain/interfaces/services/exam-mgmt/i-master-data-cache.service";
import prisma from "../../../prisma/prisma";
import { ICachedCategory, ICachedChapter, ICachedRole } from "@/domain/master-data/types/cached-data.type";

/**
 * @description Dịch vụ quản lý bộ nhớ đệm Master Data (Implementation)
 */
export class MasterDataCacheService implements IMasterDataCacheService {
  // Sử dụng private Map để lưu trữ trong RAM
  private _rolesById = new Map<string, ICachedRole>();
  private _rolesByName = new Map<string, ICachedRole>();

  private _chaptersById = new Map<string, ICachedChapter>();
  private _chaptersByNormalizedName = new Map<string, ICachedChapter>();
  private _chaptersByCode = new Map<string, ICachedChapter>();

  private _categoriesById = new Map<string, ICachedCategory>();
  private _categoriesByNormalizedName = new Map<string, ICachedCategory>();

  /**
   * @description Khởi tạo và nạp toàn bộ Master Data vào RAM
   */
  public async initialize(): Promise<void> {
    const [rolesFromDb, chaptersFromDb, categoriesFromDb] = await Promise.all([
      prisma.role.findMany({
        include: { rolePermissions: { include: { permission: true } } }
      }),
      prisma.chapter.findMany(),
      prisma.licenseCategory.findMany()
    ]);

    this._clearAllCaches();

    // 1. Map Roles
    rolesFromDb.forEach(role => {
      const cachedRole: ICachedRole = {
        id: role.id,
        name: role.name,
        description: role.description || "",
        permissions: role.rolePermissions.map(rp => rp.permission.name)
      };
      this._rolesById.set(role.id, cachedRole);
      this._rolesByName.set(role.name, cachedRole);
    });

    // 2. Map Chapters
    chaptersFromDb.forEach(chapter => {
      const cachedChapter: ICachedChapter = { id: chapter.id, name: chapter.name };
      this._chaptersById.set(chapter.id, cachedChapter);

      this._chaptersByNormalizedName.set(chapter.name.trim().toLowerCase(), cachedChapter);
      this._chaptersByCode.set(String(chapter.code).trim().toLowerCase(), cachedChapter);
    });

    // 3. Map Categories
    categoriesFromDb.forEach(category => {
      const cachedCategory: ICachedCategory = { id: category.id, name: category.name };
      this._categoriesById.set(category.id, cachedCategory);
      this._categoriesByNormalizedName.set(category.name.trim().toLowerCase(), cachedCategory);
    });

  }

  public async refresh(): Promise<void> {
    await this.initialize();
  }

  // --- Retrieval Methods (Bỏ static để thỏa mãn Interface) ---

  public getRoleById(id: string) { return this._rolesById.get(id); }
  public getRoleByName(name: string) { return this._rolesByName.get(name); }

  public getChapterById(id: string) { return this._chaptersById.get(id); }
  public getChapterByExcelName(rawName: string) {
    return this._chaptersByNormalizedName.get(rawName.trim().toLowerCase());
  }
  public getChapterByExcelCode(rawCode: string | number) {
    return this._chaptersByCode.get(String(rawCode).trim().toLowerCase());
  }

  public getCategoryById(id: string) { return this._categoriesById.get(id); }
  public getCategoryByExcelName(rawName: string) {
    return this._categoriesByNormalizedName.get(rawName.trim().toLowerCase());
  }
  /**
   * @description Kiểm tra xem ID của Role có trong RAM không
   */
  public existsRole(id: string): boolean {
    return this._rolesById.has(id);
  }

  /**
   * @description Kiểm tra xem ID của Chapter có trong RAM không
   */
  public existsChapter(id: string): boolean {
    return this._chaptersById.has(id);
  }

  /**
   * @description Kiểm tra xem ID của Hạng bằng lái có trong RAM không
   */
  public existsCategory(id: string): boolean {
    return this._categoriesById.has(id);
  }

  private _clearAllCaches(): void {
    this._rolesById.clear();
    this._rolesByName.clear();
    this._chaptersById.clear();
    this._chaptersByNormalizedName.clear();
    this._chaptersByCode.clear();
    this._categoriesById.clear();
    this._categoriesByNormalizedName.clear();
  }
}

export const masterDataCacheService = new MasterDataCacheService();