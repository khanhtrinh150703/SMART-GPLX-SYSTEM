import { CreateLicenseCategoryRequestDTO } from '@/application/dtos/request/license-category/create-license-category.request.dto';
import { UpdateLicenseCategoryRequestDTO } from '@/application/dtos/request/license-category/update-license-category.request.dto';
import { ILicenseCategoryResponseDTO } from '@/application/dtos/response/license-category/license-category.respone.dto';
import { IDeleteResponseDTO } from "@/application/dtos/response/shared/delete.response.dto";

/**
 * Interface định nghĩa các nghiệp vụ (Use Cases) cho Hạng bằng lái.
 * Controller sẽ phụ thuộc vào Interface này thay vì Implementation cụ thể.
 */
export interface ILicenseCategoryService {
  /**
   * @description Tạo mới một hạng bằng lái.
   * @param {CreateLicenseCategoryRequestDTO} dto - Dữ liệu đầu vào.
   * @returns {Promise<ILicenseCategoryResponseDTO>}
   */
  createCategory(dto: CreateLicenseCategoryRequestDTO): Promise<ILicenseCategoryResponseDTO>;

  /**
   * @description Xóa một hạng bằng lái.
   * @param {string} id - UUID của hạng bằng.
   * @returns {Promise<void>}
   */
  deleteCategory(id: string): Promise<IDeleteResponseDTO>

  /**
   * @description Cập nhật thông tin hạng bằng lái.
   * @param {string} id - ID của hang.
   * @param {UpdateLicenseCategoryRequestDTO} dto - Dữ liệu cập nhật.
   * @returns {Promise<ILicenseCategoryResponseDTO>}
   */
  updateCategory(id: string, dto: UpdateLicenseCategoryRequestDTO): Promise<ILicenseCategoryResponseDTO>;

  /**
   * @description Khôi phục hạng bằng lái đã bị xóa mềm.
   * @param {string} id - UUID của hạng bằng.
   * @returns {Promise<LicenseCILicenseCategoryResponseDTOategoryResponse>}
   */
  restoreCategory(id: string): Promise<ILicenseCategoryResponseDTO>;

  /**
   * @description Kiểm tra sự tồn tại của một bản ghi trong hệ thống dựa trên ID.
   * @param {string} id - Mã định danh duy nhất của bản ghi cần kiểm tra.
   * @returns {Promise<boolean>} Trả về `true` nếu bản ghi tồn tại, ngược lại trả về `false`.
   */
  exists(id: string): Promise<boolean>;
}