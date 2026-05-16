import { LicenseCategoryQueryDTO } from "@/application/dtos/request/license-category/license-category-query.request.dto";
import { ILicenseCategoryResponseDTO } from "@/application/dtos/response/license-category/license-category.respone.dto";
import { ILicenseCategoryRepository } from "@/domain/interfaces/repositories";
import { ILicenseCategoryQueryService, IMasterDataCacheService } from "@/domain/interfaces/services/exam-mgmt";
import { LicenseCategoryMapper } from "@/infrastructure/database/mappers";
import { PAGINATION_CONFIG } from "@/shared/config/pagination.config";
import { ISelectionResponseDTO } from "@/application/dtos/response/shared/selection.response.dto";
import { PaginatedResult } from "@/shared/types/pagination.types";
import { PaginationUtil } from "@/shared/utils/pagination.util";

/**
 * @interface ILicenseCategoryQueryServiceCradle
 * @description Tập hợp các phụ thuộc (Dependencies) cần thiết cho việc truy vấn thông tin Hạng bằng lái.
 */
export interface ILicenseCategoryQueryServiceCradle {
    /** @description Repository quản lý truy xuất dữ liệu các hạng bằng lái (ví dụ: A1, B2, C). */
    licenseCategoryRepository: ILicenseCategoryRepository;

    /** @description Dịch vụ quản lý bộ nhớ đệm cho dữ liệu danh mục ít thay đổi (Master Data). */
    masterDataCacheService: IMasterDataCacheService;
}

/**
 * @class LicenseCategoryQueryService
 * @description Dịch vụ chuyên trách các tác vụ đọc dữ liệu (Read-side) liên quan đến phân loại hạng giấy phép lái xe.
 * @principle Efficiency - Tận dụng tối đa bộ nhớ đệm để phục vụ các yêu cầu truy vấn lặp lại thường xuyên.
 */
export class LicenseCategoryQueryService implements ILicenseCategoryQueryService {
    /** @private @readonly @description Instance truy xuất dữ liệu hạng bằng lái. */
    private readonly _licenseRepo: ILicenseCategoryRepository;

    /** @private @readonly @description Dịch vụ quản lý cache Master Data. */
    private readonly _cacheService: IMasterDataCacheService;

    /**
     * @constructor
     * @description Khởi tạo Service thông qua cơ chế DI Proxy của Awilix.
     * @param {ILicenseCategoryQueryServiceCradle} cradle - Chứa các Repository và Service Cache cần thiết.
     */
    constructor({ licenseCategoryRepository, masterDataCacheService }: ILicenseCategoryQueryServiceCradle) {
        this._licenseRepo = licenseCategoryRepository;
        this._cacheService = masterDataCacheService;
    }

    /**
    * @description Lấy danh sách các hạng bằng lái dưới dạng tối giản (Selection List) cho UI.
    * @returns {Promise<ISelectionResponseDTO[]>} Mảng các đối tượng chứa ID và tên hạng bằng.
    */
    public async getLicenseSelections(): Promise<ISelectionResponseDTO[]> {
        const licenses = await this._cacheService.getAllCategories();
        return LicenseCategoryMapper.toSelectionList(licenses);
    }

    /**
     * @description Lấy danh sách hạng bằng lái đã qua bộ lọc (tìm kiếm/trạng thái) và ánh xạ sang DTO sạch.
     * @param {LicenseCategoryQueryDTO} query - DTO chứa các tiêu chí lọc và thông số phân trang từ Request.
     * @returns {Promise<PaginatedResult<ILicenseCategoryResponseDTO>>} Trả về DTO thay vì Entity để đảm bảo tính đóng gói và bảo mật.
     */
    public async getPaginatedCategories(query: LicenseCategoryQueryDTO): Promise<PaginatedResult<ILicenseCategoryResponseDTO>> {
        // 1. Chuẩn hóa thông số phân trang (đảm bảo luôn là số dương)
        const page = Number(query.page) || PAGINATION_CONFIG.DEFAULT_PAGE;
        const limit = Math.min(
            Number(query.limit) || PAGINATION_CONFIG.DEFAULT_LIMIT,
            PAGINATION_CONFIG.MAX_LIMIT
        );

        // 2. Tính toán skip cho Repository (Logic phân trang tập trung tại Util)
        const skip = PaginationUtil.getSkip(page, limit);

        // 3. Truy vấn dữ liệu từ DB thông qua Repository (Nhận về Tuple [Entity[], total])
        const [categories, total] = await this._licenseRepo.findAndCount(query, skip, limit);

        // 4. ÁNH XẠ DỮ LIỆU (Mapping): Chuyển mảng Domain Entity sang mảng Response DTO sạch
        // Sử dụng .map() để đảm bảo mọi phần tử đều đi qua "cánh cổng" Mapper
        const categoryResponses = categories.map(category => LicenseCategoryMapper.toResponse(category));

        // 5. Đóng gói kết quả cuối cùng kèm Metadata phân trang (total, page, limit, totalPages)
        return PaginationUtil.createPaginatedResponse(categoryResponses, total, page, limit);
    }
}