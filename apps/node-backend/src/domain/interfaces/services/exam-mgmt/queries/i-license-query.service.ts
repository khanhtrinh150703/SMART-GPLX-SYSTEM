import { LicenseCategoryQueryDTO } from "@/application/dtos/request/license-category/license-category-query.request.dto";
import { ILicenseCategoryResponseDTO } from "@/application/dtos/response/license-category/license-category.respone.dto";
import { ISelectionResponseDTO } from "@/application/dtos/response/shared/selection.response.dto";
import { PaginatedResult } from "@/shared/types/pagination.types";

export interface ILicenseCategoryQueryService {

      /**
       * @description Lấy danh sách các chương học định dạng selection (value/label) có hỗ trợ tìm kiếm theo tên.
       * @returns {Promise<ISelectionResponseDTO[]>} - Danh sách các bản ghi đã được map sang định dạng value/label.
       */
      getLicenseSelections(): Promise<ISelectionResponseDTO[]>;

      /**
       * @description Lấy danh sách các hạng bằng lái có hỗ trợ tìm kiếm (theo tên/mô tả), 
       * @param {LicenseCategoryQueryDTO} query - Đối tượng chứa các tiêu chí lọc và thông số phân trang.
       * @returns {Promise<{ items: ILicenseCategoryResponseDTO[], meta: IPaginationMeta }>} 
       */
      getPaginatedCategories(query: LicenseCategoryQueryDTO): Promise<PaginatedResult<ILicenseCategoryResponseDTO>>
}