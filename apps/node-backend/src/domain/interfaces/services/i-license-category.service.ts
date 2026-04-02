import { CreateLicenseCategoryDTO } from '@/application/dtos/request/license-category/create-license-category.request.dto';
import { UpdateLicenseCategoryDTO } from '@/application/dtos/request/license-category/update-license-category.request.dto';
import { LicenseCategoryResponse } from '@/application/dtos/response/license-category/license-category.respone.dto';

/**
 * Interface định nghĩa các nghiệp vụ (Use Cases) cho Hạng bằng lái.
 * Controller sẽ phụ thuộc vào Interface này thay vì Implementation cụ thể.
 */
export interface ILicenseCategoryService {
  /**
   * @description Lấy danh sách toàn bộ hạng bằng lái.
   * @returns {Promise<LicenseCategoryResponse[]>}
   */
  getAll(): Promise<LicenseCategoryResponse[]>;

  /**
   * @description Tạo mới một hạng bằng lái.
   * @param {CreateLicenseCategoryDTO} dto - Dữ liệu đầu vào.
   * @returns {Promise<LicenseCategoryResponse>}
   */
  createCategory(dto: CreateLicenseCategoryDTO): Promise<LicenseCategoryResponse>;

  /**
   * @description Xóa mềm một hạng bằng lái.
   * @param {string} id - UUID của hạng bằng.
   * @returns {Promise<void>}
   */
  deleteCategory(id: string): Promise<void>;

  /**
   * @description Cập nhật thông tin hạng bằng lái.
   * @param {UpdateLicenseCategoryDTO} dto - Dữ liệu cập nhật.
   * @returns {Promise<LicenseCategoryResponse>}
   */
  updateCategory(dto: UpdateLicenseCategoryDTO): Promise<LicenseCategoryResponse>;

  /**
   * @description Khôi phục hạng bằng lái đã bị xóa mềm.
   * @param {string} id - UUID của hạng bằng.
   * @returns {Promise<LicenseCategoryResponse>}
   */
  restoreCategory(id: string): Promise<LicenseCategoryResponse>;
}