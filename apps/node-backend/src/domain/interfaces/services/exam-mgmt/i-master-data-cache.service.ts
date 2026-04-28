import {
  ICachedCategory,
  ICachedChapter,
  ICachedExamMatrix,
  ICachedRole
}
  from "@/shared/master-data";

/**
 * @interface IMasterDataCacheService
 * @description Định nghĩa các phương thức quản lý và truy vấn dữ liệu chủ (Master Data) từ bộ nhớ đệm RAM.
 */
export interface IMasterDataCacheService {

  /**
   * @description Khởi tạo và nạp toàn bộ Master Data từ cơ sở dữ liệu vào RAM.
   * @returns {Promise<void>}
   */
  initialize(): Promise<void>;

  /**
   * @description Làm mới lại toàn bộ dữ liệu trong bộ nhớ đệm để đồng bộ với cơ sở dữ liệu.
   * @returns {Promise<void>}
   */
  refresh(): Promise<void>;

  // --- SINGLE RETRIEVAL METHODS ---

  /**
   * @description Tìm kiếm vai trò người dùng theo mã ID hệ thống.
   * @param {string} id - UUID của vai trò.
   * @returns {ICachedRole | undefined}
   */
  getRoleById(id: string): ICachedRole | undefined;

  /**
   * @description Tìm kiếm chương bài học theo mã ID hệ thống.
   * @param {string} id - UUID của chương.
   * @returns {ICachedChapter | undefined}
   */
  getChapterById(id: string): ICachedChapter | undefined;

  /**
   * @description Tìm kiếm hạng bằng lái theo mã ID hệ thống.
   * @param {string} id - UUID của hạng bằng lái.
   * @returns {ICachedCategory | undefined}
   */
  getCategoryById(id: string): ICachedCategory | undefined;

  /**
   * @description Tìm kiếm ma trận đề thi theo mã ID hệ thống.
   * @param {string} id - UUID của ma trận đề.
   * @returns {ICachedExamMatrix | undefined}
   */
  getMatrixById(id: string): ICachedExamMatrix | undefined;

  // --- LIST RETRIEVAL METHODS (FIND ALL) ---

  /**
   * @description Lấy danh sách toàn bộ các vai trò hiện có trong bộ nhớ đệm.
   * @returns {ICachedRole[]}
   */
  getAllRoles(): ICachedRole[];

  /**
   * @description Tìm kiếm thông tin vai trò theo tên định danh (Slug).
   * @param {string} name - Tên vai trò (Ví dụ: 'ADMIN', 'STUDENT').
   * @returns {ICachedRole | undefined}
   */
  getRoleByName(name: string): ICachedRole | undefined;

  /**
  * @description Đối soát chương dựa trên tên hiển thị từ file Excel.
  * Logic: Tự động loại bỏ khoảng trắng và không phân biệt hoa thường để tăng tỷ lệ so khớp thành công.
  * @param {string} rawName - Tên chương thô đọc được từ tệp Excel.
  * @returns {ICachedChapter | undefined}
  */
  getChapterByExcelName(rawName: string): ICachedChapter | undefined;

  /**
   * @description Đối soát chương dựa trên mã hiệu (Code) nghiệp vụ.
   * Chấp nhận cả định dạng số (1) hoặc chuỗi ("01") tùy theo định dạng của ô trong Excel.
   * @param {string | number} rawCode - Mã chương thô từ Excel.
   * @returns {ICachedChapter | undefined}
   */
  getChapterByExcelCode(rawCode: string | number): ICachedChapter | undefined;

  /**
   * @description Lấy danh sách toàn bộ các chương bài học hiện có trong bộ nhớ đệm.
   * @returns {ICachedChapter[]}
   */
  getAllChapters(): ICachedChapter[];

  /**
   * @description Lấy danh sách toàn bộ các hạng bằng lái hiện có trong bộ nhớ đệm.
   * @returns {ICachedCategory[]}
   */
  getAllCategories(): ICachedCategory[];

  /**
   * @description Lấy danh sách toàn bộ các ma trận đề thi đang hoạt động.
   * @returns {ICachedExamMatrix[]}
   */
  getAllMatrices(): ICachedExamMatrix[];

  /**
   * @description Lấy danh sách các ma trận đề thi được lọc theo mã hạng bằng lái.
   * @param {string} licenseId - UUID của hạng bằng lái (A1, B2...).
   * @returns {ICachedExamMatrix[]}
   */
  getMatricesByLicense(licenseId: string): ICachedExamMatrix[];

  /**
  * @description Đối soát hạng bằng lái từ tên thô trong Excel.
  * Ví dụ: " b2 ", "B2" hoặc "Hạng B2" sẽ được chuẩn hóa để tìm kiếm.
  * @param {string} rawName - Tên hạng bằng từ Excel.
  * @returns {ICachedCategory | undefined}
  */
  getCategoryByExcelName(rawName: string): ICachedCategory | undefined;
  
  // --- EXISTENCE CHECK METHODS ---

  /**
   * @description Kiểm tra sự tồn tại của vai trò trong bộ nhớ đệm qua mã ID.
   * @param {string} id - UUID cần kiểm tra.
   * @returns {boolean}
   */
  existsRole(id: string): boolean;

  /**
   * @description Kiểm tra sự tồn tại của chương bài học trong bộ nhớ đệm qua mã ID.
   * @param {string} id - UUID cần kiểm tra.
   * @returns {boolean}
   */
  existsChapter(id: string): boolean;

  /**
   * @description Kiểm tra sự tồn tại của hạng bằng lái trong bộ nhớ đệm qua mã ID.
   * @param {string} id - UUID cần kiểm tra.
   * @returns {boolean}
   */
  existsCategory(id: string): boolean;

  /**
   * @description Kiểm tra sự tồn tại của ma trận đề thi trong bộ nhớ đệm qua mã ID.
   * @param {string} id - UUID cần kiểm tra.
   * @returns {boolean}
   */
  existsMatrix(id: string): boolean;
}