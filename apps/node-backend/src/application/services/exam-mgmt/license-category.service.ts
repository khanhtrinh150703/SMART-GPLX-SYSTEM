
import { LicenseCategory } from '@/domain/entities/license-category/license-category.entity';
import { ILicenseCategoryRepository } from '@/domain/interfaces/repositories/exam-mgmt/i-license-category-repository';
import { AppError, ErrorCode } from '@/shared/errors';
import { LicenseCategoryMapper } from '@/infrastructure/database/mappers/exam-mgmt/license-category.mapper';
import { ILicenseCategoryService } from '@/domain/interfaces/services/exam-mgmt/i-license-category.service';
import { PaginationUtil } from '@/shared/utils/pagination.util';
import { PaginatedResult } from '@/shared/types/pagination.types';
import { SelectionResponseDto } from '@/shared/responses/selection-response.dto';
import { IMasterDataCacheService } from '@/domain/interfaces/services/exam-mgmt/i-master-data-cache.service';
import { PAGINATION_CONFIG } from '@/shared/config/pagination.config';
import { DeleteResponse, DeleteType } from '@/domain/constants/delete.constant';
import { CreateLicenseCategoryRequestDTO } from '@/application/dtos/request/license-category/create-license-category.request.dto';
import { LicenseCategoryQueryDTO } from '@/application/dtos/request/license-category/license-category-query.request.dto';
import { UpdateLicenseCategoryRequestDTO } from '@/application/dtos/request/license-category/update-license-category.request.dto';
import { LicenseCategoryResponse } from '@/application/dtos/response/license-category/license-category.respone.dto';

/**
 * @interface ILicenseCategoryServiceCradle
 * @description Định nghĩa các phụ thuộc (dependencies) cần thiết cho LicenseCategoryService.
 * Giúp tuân thủ nguyên tắc Interface Segregation (ISP).
 */
export interface ILicenseCategoryServiceCradle {
    licenseCategoryRepository: ILicenseCategoryRepository;
    masterDataCacheService: IMasterDataCacheService;
}

/**
 * @class LicenseCategoryService
 * @description Service xử lý logic nghiệp vụ liên quan đến các Hạng bằng lái (A1, A2, B1, B2...).
 */
export class LicenseCategoryService implements ILicenseCategoryService {
    private readonly _repo: ILicenseCategoryRepository;
    private readonly _cacheService: IMasterDataCacheService;


    /**
     * @description Khởi tạo Service với các dependency được "tiêm" từ DI Container.
     * @param {ILicenseCategoryServiceCradle} cradle - Chỉ chứa những thứ Service này thực sự cần.
     */
    constructor({ licenseCategoryRepository, masterDataCacheService }: ILicenseCategoryServiceCradle) {
        this._repo = licenseCategoryRepository;
        this._cacheService = masterDataCacheService;
    }

    /**
     * @description Lấy danh sách các hạng bằng lái dưới dạng tối giản (Selection List) cho UI.
     * @returns {Promise<SelectionResponseDto[]>} Mảng các đối tượng chứa ID và tên hạng bằng.
     */
    public async getLicenseSelections(): Promise<SelectionResponseDto[]> {
        const licenses = await this._repo.findAll();
        return LicenseCategoryMapper.toSelectionList(licenses);
    }

    /**
     * @description Lấy danh sách hạng bằng lái đã qua bộ lọc (tìm kiếm/trạng thái) và ánh xạ sang DTO sạch.
     * @param {LicenseCategoryQueryDTO} query - DTO chứa các tiêu chí lọc và thông số phân trang từ Request.
     * @returns {Promise<PaginatedResult<LicenseCategoryResponseDTO>>} Trả về DTO thay vì Entity để đảm bảo tính đóng gói và bảo mật.
     */
    public async getPaginatedCategories(query: LicenseCategoryQueryDTO): Promise<PaginatedResult<LicenseCategoryResponse>> {
        // 1. Chuẩn hóa thông số phân trang (đảm bảo luôn là số dương)
        const page = Number(query.page) || PAGINATION_CONFIG.DEFAULT_PAGE;
        const limit = Math.min(
            Number(query.limit) || PAGINATION_CONFIG.DEFAULT_LIMIT,
            PAGINATION_CONFIG.MAX_LIMIT
        );

        // 2. Tính toán skip cho Repository (Logic phân trang tập trung tại Util)
        const skip = PaginationUtil.getSkip(page, limit);

        // 3. Truy vấn dữ liệu từ DB thông qua Repository (Nhận về Tuple [Entity[], total])
        const [categories, total] = await this._repo.findAndCount(query, skip, limit);

        // 4. ÁNH XẠ DỮ LIỆU (Mapping): Chuyển mảng Domain Entity sang mảng Response DTO sạch
        // Sử dụng .map() để đảm bảo mọi phần tử đều đi qua "cánh cổng" Mapper
        const categoryResponses = categories.map(category => LicenseCategoryMapper.toResponse(category));

        // 5. Đóng gói kết quả cuối cùng kèm Metadata phân trang (total, page, limit, totalPages)
        return PaginationUtil.createPaginatedResponse(categoryResponses, total, page, limit);
    }

    /**
     * @description Tạo mới một hạng bằng lái vào hệ thống.
     * @param {CreateLicenseCategoryRequestDTO} dto - Dữ liệu cấu hình hạng bằng mới.
     * @returns {Promise<LicenseCategoryResponse>} Thông tin hạng bằng vừa được tạo.
     */
    public async createCategory(dto: CreateLicenseCategoryRequestDTO): Promise<LicenseCategoryResponse> {

        const existing = await this._repo.findByName(dto.name);
        if (existing) {
            throw new AppError(ErrorCode.LICENSE.NAME_ALREADY_EXISTS);
        }

        const category = LicenseCategory.create({
            name: dto.name,
            description: dto.description,
            minAge: dto.minAge,
        });

        await this._repo.createLicenseCategory(category);
        this._cacheService.refresh();
        return LicenseCategoryMapper.toResponse(category);
    }

    /**
     * @description Cập nhật thông tin hạng bằng lái.
     * @param {UpdateLicenseCategoryRequestDTO} dto - Dữ liệu cập nhật từ Client.
     * @returns {Promise<void>}
     */
    public async updateCategory(dto: UpdateLicenseCategoryRequestDTO): Promise<LicenseCategoryResponse> {

        // 1. Kiểm tra sự tồn tại của hạng bằng lái
        const category = await this._repo.findById(dto.id);
        if (!category) {
            throw new AppError(ErrorCode.LICENSE.NOT_FOUND);
        }

        // 2. Nếu tên thay đổi, kiểm tra xem tên mới đã tồn tại chưa (Unique Check)
        if (category.name !== dto.name) {
            const existingName = await this._repo.findByName(dto.name);
            if (existingName) {
                throw new AppError(ErrorCode.LICENSE.ALREADY_EXISTS);
            }
        }

        // 3. Sử dụng Rich Domain Model để cập nhật logic bên trong Entity
        category.updateDetails(dto.name, dto.description, dto.minAge);

        // 4. Lưu lại thay đổi thông qua Repository
        await this._repo.updateLicenseCategory(category);
        this._cacheService.refresh();
        return LicenseCategoryMapper.toResponse(category);
    }

    /**
     * @description Xóa hạng bằng lái với cơ chế thông minh (Hybrid Delete).
     * @param {string} id - Mã định danh của hạng bằng.
     * @returns {Promise<DeleteResponse>} Kết quả cho biết hạng bằng được xóa cứng hay xóa mềm.
     */
    public async deleteCategory(id: string): Promise<DeleteResponse> {
        // 1. Kiểm tra tồn tại (Vẫn giữ AppError cho trường hợp không tìm thấy)
        const category = await this._repo.findById(id);
        if (!category) {
            throw new AppError(ErrorCode.LICENSE.NOT_FOUND);
        }

        // 2. Lấy chi tiết các ràng buộc từ Repository
        const related = await this._repo.countRelatedData(id);

        // Tính tổng số lượng liên kết từ tất cả các phân hệ
        const totalRelated =
            related.questions +
            related.matrices +
            related.exams +
            related.attempts;

        // 3. Quyết định phương thức xóa dựa trên trạng thái dữ liệu
        if (totalRelated > 0) {
            category.softDelete(); 
            await this._repo.softDelete(id); // Đồng bộ vào Database

            await this._cacheService.refresh();
            return { type: DeleteType.SOFT };
        }

        // TH2: DỮ LIỆU SẠCH -> XÓA VĨNH VIỄN (HARD DELETE)
        await this._repo.hardDelete(id);

        await this._cacheService.refresh();
        return { type: DeleteType.HARD };
    }

    /**
     * @description Khôi phục hạng bằng lái đã bị xóa mềm (Soft Delete) trở lại trạng thái hoạt động.
     * @param {string} id - Mã định danh của hạng bằng cần khôi phục.
     * @returns {Promise<LicenseCategoryResponse>} Thông tin hạng bằng sau khi phục hồi.
     */
    public async restoreCategory(id: string): Promise<LicenseCategoryResponse> {
        // 1. Tìm bản ghi (bao gồm cả đã xóa)
        const category = await this._repo.findByIdIncludingDeleted(id);
        if (!category) {
            throw new AppError(ErrorCode.LICENSE.NOT_FOUND);
        }

        // 2. Kiểm tra xem có đang thực sự bị xóa không
        // (Lưu ý: Domain Entity LicenseCategory cần có getter cho deletedAt hoặc prop tương đương)
        // Nếu bản ghi chưa xóa thì không cần restore
        if (!category.isDeleted()) {
            throw new AppError(ErrorCode.LICENSE.ALREADY_EXISTS);
        }

        // 3. QUAN TRỌNG: Kiểm tra trùng tên với các bản ghi đang Active
        const existingActive = await this._repo.findByName(category.name);
        if (existingActive) {
            throw new AppError(ErrorCode.LICENSE.ALREADY_EXISTS);
        }

        category.restore();
        // 4. Thực hiện khôi phục
        await this._repo.restore(id);
        this._cacheService.refresh();
        return LicenseCategoryMapper.toResponse(category);
    }

    /**
     * @description Kiểm tra sự tồn tại của hạng bằng lái trong Database.
     * @param {string} id - ID hạng bằng cần kiểm tra.
     * @returns {Promise<boolean>} True nếu tồn tại, ngược lại là false.
     */
    public async exists(id: string): Promise<boolean> {
        return await this._repo.exists(id);
    }
}