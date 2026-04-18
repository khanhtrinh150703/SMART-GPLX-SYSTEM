import prisma from "../../../prisma/prisma";

/**
 * @description Cấu trúc dữ liệu Vai trò (Role data structure)
 */
export interface CachedRoleData {
  id: string;
  name: string;
  description: string;
  permissions: string[];
}

/**
 * @description Cấu trúc dữ liệu Chương học (Chapter data structure)
 */
export interface CachedChapterData {
  id: string;
  name: string;
}

/**
 * @description Cấu trúc dữ liệu Hạng bằng (License category data structure)
 */
export interface CachedCategoryData {
  id: string;
  name: string;
}

/**
 * @description Dịch vụ quản lý bộ nhớ đệm cho dữ liệu danh mục cốt lõi (Master Data Cache Service)
 * Giúp truy xuất O(1) và giảm tải tuyệt đối cho Database (Ensures O(1) access and zero DB load).
 */
export class MasterDataCacheService {
  // --- ROLES CACHE ---
  private static _rolesById = new Map<string, CachedRoleData>();
  private static _rolesByName = new Map<string, CachedRoleData>();

  // --- CHAPTERS CACHE ---
  private static _chaptersById = new Map<string, CachedChapterData>();
  /** @description Lưu tên chương ở dạng chữ thường để đối soát Excel (Stores lowercase names for Excel mapping) */
  private static _chaptersByNormalizedName = new Map<string, CachedChapterData>();
  private static _chaptersByCode = new Map<string, CachedChapterData>();

  // --- CATEGORIES CACHE ---
  private static _categoriesById = new Map<string, CachedCategoryData>();
  /** @description Lưu tên hạng bằng ở dạng chữ thường (Stores lowercase category names) */
  private static _categoriesByNormalizedName = new Map<string, CachedCategoryData>();

  /**
   * @description Khởi tạo và nạp toàn bộ Master Data vào RAM (Initialize and load all Master Data into RAM)
   * Sử dụng Promise.all để chạy truy vấn song song giúp khởi động nhanh hơn.
   */
  public static async initialize(): Promise<void> {
    // Chạy song song 3 truy vấn để tiết kiệm thời gian (Run 3 queries in parallel to save time)
    const [rolesFromDb, chaptersFromDb, categoriesFromDb] = await Promise.all([
      prisma.role.findMany({ include: { rolePermissions: { include: { permission: true } } } }),
      prisma.chapter.findMany(),
      prisma.licenseCategory.findMany() // Trinh tự đổi tên model nếu trong Prisma schema của bạn viết khác nhé
    ]);

    // 1. Xóa dữ liệu cũ (Clear old data)
    this._clearAllCaches();

    // 2. Nạp dữ liệu Role (Load Role data)
    rolesFromDb.forEach(role => {
      const cachedRole: CachedRoleData = {
        id: role.id,
        name: role.name,
        description: role.description || "",
        permissions: role.rolePermissions.map(rp => rp.permission.name)
      };
      this._rolesById.set(role.id, cachedRole);
      this._rolesByName.set(role.name, cachedRole);
    });

    // 3. Nạp dữ liệu Chapter (Load Chapter data)
    chaptersFromDb.forEach(chapter => {
      const cachedChapter = { id: chapter.id, name: chapter.name };
      this._chaptersById.set(chapter.id, cachedChapter);

      // Xử lý chống lỗi Excel: Cắt dấu cách và đưa về chữ thường (Trim spaces and toLowerCase)
      const normalizedKey = chapter.name.trim().toLowerCase();
      this._chaptersByNormalizedName.set(normalizedKey, cachedChapter);
      const normalizedCode = String(chapter.code).trim().toLowerCase();
      this._chaptersByCode.set(normalizedCode, cachedChapter);
    });

    // 4. Nạp dữ liệu Category (Load Category data)
    categoriesFromDb.forEach(category => {
      const cachedCategory = { id: category.id, name: category.name };
      this._categoriesById.set(category.id, cachedCategory);

      // Ví dụ: " b2 " -> "b2"
      const normalizedKey = category.name.trim().toLowerCase();
      this._categoriesByNormalizedName.set(normalizedKey, cachedCategory);
    });

    console.log('>>> [CACHE] Master Data initialized successfully!');
  }

  // =========================================================================
  // CÁC HÀM TRUY XUẤT (RETRIEVAL METHODS)
  // =========================================================================

  // --- Roles ---
  public static getRoleById(id: string): CachedRoleData | undefined { return this._rolesById.get(id); }
  public static getRoleByName(name: string): CachedRoleData | undefined { return this._rolesByName.get(name); }

  // --- Chapters ---
  public static getChapterById(id: string): CachedChapterData | undefined { return this._chaptersById.get(id); }
  /**
   * @description Tìm chương bằng tên từ Excel (Find chapter by name from Excel)
   */
  public static getChapterByExcelName(rawName: string): CachedChapterData | undefined {
    return this._chaptersByNormalizedName.get(rawName.trim().toLowerCase());
  }
  public static getChapterByExcelCode(rawCode: string | number): CachedChapterData | undefined {
    // Ép đầu vào về string và cắt khoảng trắng (Cast input to string and trim)
    return this._chaptersByCode.get(String(rawCode).trim().toLowerCase());
  }

  // --- Categories ---
  public static getCategoryById(id: string): CachedCategoryData | undefined { return this._categoriesById.get(id); }
  /**
   * @description Tìm hạng bằng lái từ tên Excel (Find license category by Excel name)
   */
  public static getCategoryByExcelName(rawName: string): CachedCategoryData | undefined {
    return this._categoriesByNormalizedName.get(rawName.trim().toLowerCase());
  }

  // =========================================================================
  // TIỆN ÍCH (UTILITIES)
  // =========================================================================

  private static _clearAllCaches(): void {
    this._rolesById.clear();
    this._rolesByName.clear();
    this._chaptersById.clear();
    this._chaptersByNormalizedName.clear();
    this._chaptersByCode.clear();
    this._categoriesById.clear();
    this._categoriesByNormalizedName.clear();
  }

  /**
   * @description Làm mới toàn bộ bộ nhớ đệm (Refresh all caches)
   */
  public static async refresh(): Promise<void> {
    await this.initialize();
  }
}