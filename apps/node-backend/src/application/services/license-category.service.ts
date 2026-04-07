
import { LicenseCategory } from '@/domain/entities/license-category/license-category.entity';
import { ILicenseCategoryRepository } from '@/domain/interfaces/repositories/i-license-category-repository';
import { AppError, ErrorCode } from '@/shared/errors';
import { LicenseCategoryResponse } from '../dtos/response/license-category/license-category.respone.dto';
import { LicenseCategoryMapper } from '@/infrastructure/database/mappers/license-category.mapper';
import { ILicenseCategoryService } from '@/domain/interfaces/services/i-license-category.service';
import { CreateLicenseCategoryRequestDTO } from '../dtos/request/license-category/create-license-category.request.dto';
import { UpdateLicenseCategoryRequestDTO } from '../dtos/request/license-category/update-license-category.request.dto';
import { LicenseCategoryQueryDTO } from '../dtos/request/license-category/license-category-query.request.dto';
import { PaginationUtil } from '@/shared/utils/pagination.util';
import { PaginatedResult } from '@/shared/types/pagination.types';

/**
 * @interface ILicenseCategoryServiceCradle
 * @description Định nghĩa các phụ thuộc (dependencies) cần thiết cho LicenseCategoryService.
 * Giúp tuân thủ nguyên tắc Interface Segregation (ISP).
 */
export interface ILicenseCategoryServiceCradle {
    licenseCategoryRepository: ILicenseCategoryRepository;
}

/**
 * @class LicenseCategoryService
 * @description Service xử lý logic nghiệp vụ liên quan đến các Hạng bằng lái (A1, A2, B1, B2...).
 */
export class LicenseCategoryService implements ILicenseCategoryService {
    private readonly _repo: ILicenseCategoryRepository;

    /**
     * @description Khởi tạo Service với các dependency được "tiêm" từ DI Container.
     * @param {ILicenseCategoryServiceCradle} cradle - Chỉ chứa những thứ Service này thực sự cần.
     */
    constructor({ licenseCategoryRepository }: ILicenseCategoryServiceCradle) {
        this._repo = licenseCategoryRepository;
    }

    /**
     * @description Lấy danh sách hạng bằng lái đã qua bộ lọc (tìm kiếm/trạng thái) và ánh xạ sang DTO sạch.
     * @param {LicenseCategoryQueryDTO} query - DTO chứa các tiêu chí lọc và thông số phân trang từ Request.
     * @returns {Promise<PaginatedResult<LicenseCategoryResponseDTO>>} Trả về DTO thay vì Entity để đảm bảo tính đóng gói và bảo mật.
     */
    public async getPaginatedCategories(query: LicenseCategoryQueryDTO): Promise<PaginatedResult<LicenseCategoryResponse>> {
        // 1. Chuẩn hóa thông số phân trang (đảm bảo luôn là số dương)
        const page = Number(query.page) || 1;
        const limit = Number(query.limit) || 10;
        
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
     * Tạo hạng bằng lái mới.
     * @param {CreateLicenseCategoryRequestDTO} dto - Dữ liệu đầu vào.
     */
    public async createCategory(dto: CreateLicenseCategoryRequestDTO): Promise<LicenseCategoryResponse> {

        const existing = await this._repo.findByName(dto.name);
        if (existing) {
            throw new AppError(ErrorCode.LICENSE.NAME_ALREADY_EXISTS);
        }

        const category = new LicenseCategory({
            id: crypto.randomUUID(),
            name: dto.name,
            description: dto.description,
            minAge: dto.minAge,
            deletedAt: null
        });

        await this._repo.save(category);
        return LicenseCategoryMapper.toResponse(category);
    }

    /**
     * Xóa hạng bằng lái kèm theo kiểm tra ràng buộc.
     * @param {string} id - ID hạng bằng cần xóa.
     */
    public async deleteCategory(id: string): Promise<void> {
        // 1. Kiểm tra tồn tại
        const category = await this._repo.findById(id);
        if (!category) {
            throw new AppError(ErrorCode.LICENSE.NOT_FOUND);
        }

        // 2. Kiểm tra ràng buộc dữ liệu từ nhiều nguồn (đã được repo gom lại)
        const { questions, matrices, attempts } = await this._repo.countRelatedData(id);

        if (questions > 0 || matrices > 0 || attempts > 0) {
            // Logic ném lỗi nghiệp vụ tập trung
            throw new AppError(ErrorCode.LICENSE.IS_IN_USE);
        }

        // 3. Thực hiện xóa mềm
        await this._repo.delete(id);
    }

    /**
     * Cập nhật thông tin hạng bằng lái.
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
        await this._repo.update(category);
        return LicenseCategoryMapper.toResponse(category);
    }

    /**
     * Khôi phục hạng bằng lái đã bị xóa mềm.
     * @param {string} id - ID hạng bằng cần khôi phục.
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

        // 4. Thực hiện khôi phục
        await this._repo.restore(id);
        return LicenseCategoryMapper.toResponse(category);
    }

    public async exists(id: string): Promise<boolean> {
        return await this._repo.exists(id);
    }
}