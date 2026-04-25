import { ICachedCategory, ICachedChapter, ICachedRole } from "@/domain/master-data/types/cached-data.type";

/**
 * @interface IMasterDataCacheService
 * @description Hợp đồng dịch vụ quản lý dữ liệu danh mục (Master Data) tập trung tại bộ nhớ đệm (RAM).
 * Mục đích: Tối ưu hóa hiệu năng bằng cách giảm thiểu truy vấn Database và cung cấp logic 
 * đối soát dữ liệu thông minh khi thực hiện Import từ các nguồn tệp tin bên ngoài (Excel/CSV).
 */
export interface IMasterDataCacheService {
  
  /**
   * @description Khởi tạo bộ nhớ đệm. Nạp toàn bộ dữ liệu từ Database vào RAM lần đầu.
   * Thường được gọi trong giai đoạn Bootstrap của ứng dụng (Ví dụ: OnModuleInit).
   * @returns {Promise<void>}
   */
  initialize(): Promise<void>;

  /**
   * @description Làm mới (Hot-reload) toàn bộ dữ liệu trong bộ nhớ đệm.
   * Sử dụng khi có sự thay đổi dữ liệu danh mục từ phía Admin mà không muốn khởi động lại Server.
   * @returns {Promise<void>}
   */
  refresh(): Promise<void>;

  // --- Role Retrieval (Truy vấn Vai trò) ---

  /**
   * @description Tìm kiếm thông tin vai trò trong Cache theo ID hệ thống.
   * @param {string} id - Mã định danh duy nhất của Role.
   * @returns {ICachedRole | undefined} Thông tin vai trò hoặc undefined nếu không tồn tại.
   */
  getRoleById(id: string): ICachedRole | undefined;

  /**
   * @description Tìm kiếm thông tin vai trò theo tên định danh (Slug).
   * @param {string} name - Tên vai trò (Ví dụ: 'ADMIN', 'STUDENT').
   * @returns {ICachedRole | undefined}
   */
  getRoleByName(name: string): ICachedRole | undefined;

  // --- Chapter Retrieval (Truy vấn Chương/Chuyên đề) ---

  /**
   * @description Tìm kiếm chương bài học theo mã ID hệ thống.
   * @param {string} id - UUID của chương.
   * @returns {ICachedChapter | undefined}
   */
  getChapterById(id: string): ICachedChapter | undefined;

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

  // --- License Category Retrieval (Truy vấn Hạng bằng lái) ---

  /**
   * @description Tìm kiếm hạng bằng lái (A1, B2, C...) theo ID hệ thống.
   * @param {string} id - UUID của hạng bằng.
   * @returns {ICachedCategory | undefined}
   */
  getCategoryById(id: string): ICachedCategory | undefined;

  /**
   * @description Đối soát hạng bằng lái từ tên thô trong Excel.
   * Ví dụ: " b2 ", "B2" hoặc "Hạng B2" sẽ được chuẩn hóa để tìm kiếm.
   * @param {string} rawName - Tên hạng bằng từ Excel.
   * @returns {ICachedCategory | undefined}
   */
  getCategoryByExcelName(rawName: string): ICachedCategory | undefined;

  // --- Integrity Checks (Kiểm tra sự tồn tại) ---

  /** @description Kiểm tra nhanh sự tồn tại của Vai trò trong Cache */
  existsRole(id: string): boolean;

  /** @description Kiểm tra nhanh sự tồn tại của Chương trong Cache */
  existsChapter(id: string): boolean;

  /** @description Kiểm tra nhanh sự tồn tại của Hạng bằng lái trong Cache */
  existsCategory(id: string): boolean;
}