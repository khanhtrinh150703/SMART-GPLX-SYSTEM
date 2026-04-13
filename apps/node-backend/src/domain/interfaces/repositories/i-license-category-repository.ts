import { LicenseCategoryQueryDTO } from "@/application/dtos/request/license-category/license-category-query.request.dto";
import { LicenseCategory } from "@/domain/entities/license-category/license-category.entity";

/**
 * Interface định nghĩa các thao tác dữ liệu (Persistence) cho Hạng bằng lái.
 */
export interface ILicenseCategoryRepository {
  /**
   * Lấy danh sách tất cả hạng bằng lái chưa bị xóa.
   * @returns {Promise<LicenseCategory[]>}
   */
  findAll(): Promise<LicenseCategory[]>;

  /**
   * Tìm kiếm hạng bằng lái theo mã định danh (ID).
   * @param {string} id - UUID của hạng bằng.
   * @returns {Promise<LicenseCategory | null>}
   */
  findById(id: string): Promise<LicenseCategory | null>;

  /**
   * Tìm kiếm hạng bằng lái đang hoạt động theo mã định danh.
   * @param {string} id - UUID của hạng bằng.
   * @returns {Promise<LicenseCategory | null>}
   */
  findByIdActive(id: string): Promise<LicenseCategory | null>;

  /**
   * Tìm kiếm hạng bằng lái theo tên (VD: A1, B2).
   * @param {string} name - Tên hạng bằng cần tìm.
   * @returns {Promise<LicenseCategory | null>}
   */
  findByName(name: string): Promise<LicenseCategory | null>;

  /**
   * Lưu mới một thực thể hạng bằng lái vào cơ sở dữ liệu.
   * @param {LicenseCategory} category - Thực thể hạng bằng lái.
   * @returns {Promise<void>}
   */
  save(category: LicenseCategory): Promise<void>;

  /**
   * Cập nhật thông tin thực thể hạng bằng lái hiện có.
   * @param {LicenseCategory} category - Thực thể đã được thay đổi dữ liệu.
   * @returns {Promise<void>}
   */
  update(category: LicenseCategory): Promise<void>;

  /**
   * Thực hiện xóa mềm hạng bằng lái (đánh dấu deleted_at).
   * @param {string} id - UUID của hạng bằng cần xóa.
   * @returns {Promise<void>}
   */
  delete(id: string): Promise<void>;

  /**
   * Thống kê các dữ liệu liên quan để kiểm tra ràng buộc trước khi xóa.
   * @param {string} id - UUID của hạng bằng.
   * @returns {Promise<{ questions: number; matrices: number; attempts: number }>}
   */
  countRelatedData(id: string): Promise<{ questions: number; matrices: number; attempts: number }>;

  /**
   * Tìm kiếm hạng bằng lái bao gồm cả các bản ghi đã bị xóa mềm.
   * @param {string} id - UUID của hạng bằng.
   * @returns {Promise<LicenseCategory | null>}
   */
  findByIdIncludingDeleted(id: string): Promise<LicenseCategory | null>;

  /**
   * Khôi phục hạng bằng lái đã bị xóa mềm (gỡ bỏ đánh dấu deleted_at).
   * @param {string} id - UUID của hạng bằng cần khôi phục.
   * @returns {Promise<void>}
   */
  restore(id: string): Promise<void>;

  /**
   * @description Tìm kiếm và đếm tổng số lượng hạng bằng lái có phân trang.
   * @param {LicenseCategoryQueryDTO} filter - Bộ lọc tìm kiếm.
   * @param {number} skip - Số bản ghi bỏ qua.
   * @param {number} take - Số bản ghi lấy ra.
   */
  findAndCount(
    filter: LicenseCategoryQueryDTO,
    skip: number,
    take: number
  ): Promise<[LicenseCategory[], number]>;

  /**
   * @description Kiểm tra sự tồn tại của một bản ghi trong hệ thống dựa trên ID.
   * @param {string} id - Mã định danh duy nhất của bản ghi cần kiểm tra.
   * @returns {Promise<boolean>} Trả về `true` nếu bản ghi tồn tại, ngược lại trả về `false`.
   */
  exists(id: string): Promise<boolean>;
}