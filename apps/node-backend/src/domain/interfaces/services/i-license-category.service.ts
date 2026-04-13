import { CreateLicenseCategoryRequestDTO } from '@/application/dtos/request/license-category/create-license-category.request.dto';
import { LicenseCategoryQueryDTO } from '@/application/dtos/request/license-category/license-category-query.request.dto';
import { UpdateLicenseCategoryRequestDTO } from '@/application/dtos/request/license-category/update-license-category.request.dto';
import { LicenseCategoryResponse } from '@/application/dtos/response/license-category/license-category.respone.dto';
import { SelectionResponseDto } from '@/shared/responses/selection-response.dto';
import { PaginatedResult } from '@/shared/types/pagination.types';

/**
 * Interface định nghĩa các nghiệp vụ (Use Cases) cho Hạng bằng lái.
 * Controller sẽ phụ thuộc vào Interface này thay vì Implementation cụ thể.
 */
export interface ILicenseCategoryService {

  /**
   * @description Lấy danh sách các chương học định dạng selection (value/label) có hỗ trợ tìm kiếm theo tên.
   * @returns {Promise<SelectionResponseDto[]>} - Danh sách các bản ghi đã được map sang định dạng value/label.
   */
  getLicenseSelections(): Promise<SelectionResponseDto[]>;

  /**
   * @description Lấy danh sách các hạng bằng lái có hỗ trợ tìm kiếm (theo tên/mô tả), 
   * @param {LicenseCategoryQueryDTO} query - Đối tượng chứa các tiêu chí lọc và thông số phân trang.
   * @returns {Promise<{ items: LicenseCategoryResponseDTO[], meta: IPaginationMeta }>} 
   */
  getPaginatedCategories(query: LicenseCategoryQueryDTO): Promise<PaginatedResult<LicenseCategoryResponse>>;

  /**
   * @description Tạo mới một hạng bằng lái.
   * @param {CreateLicenseCategoryRequestDTO} dto - Dữ liệu đầu vào.
   * @returns {Promise<LicenseCategoryResponse>}
   */
  createCategory(dto: CreateLicenseCategoryRequestDTO): Promise<LicenseCategoryResponse>;

  /**
   * @description Xóa mềm một hạng bằng lái.
   * @param {string} id - UUID của hạng bằng.
   * @returns {Promise<void>}
   */
  deleteCategory(id: string): Promise<void>;

  /**
   * @description Cập nhật thông tin hạng bằng lái.
   * @param {UpdateLicenseCategoryRequestDTO} dto - Dữ liệu cập nhật.
   * @returns {Promise<LicenseCategoryResponse>}
   */
  updateCategory(dto: UpdateLicenseCategoryRequestDTO): Promise<LicenseCategoryResponse>;

  /**
   * @description Khôi phục hạng bằng lái đã bị xóa mềm.
   * @param {string} id - UUID của hạng bằng.
   * @returns {Promise<LicenseCategoryResponse>}
   */
  restoreCategory(id: string): Promise<LicenseCategoryResponse>;

  /**
   * @description Kiểm tra sự tồn tại của một bản ghi trong hệ thống dựa trên ID.
   * @param {string} id - Mã định danh duy nhất của bản ghi cần kiểm tra.
   * @returns {Promise<boolean>} Trả về `true` nếu bản ghi tồn tại, ngược lại trả về `false`.
   */
  exists(id: string): Promise<boolean>;
}