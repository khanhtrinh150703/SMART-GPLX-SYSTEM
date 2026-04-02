
import { LicenseCategory } from '@/domain/entities/license-category/license-category.entity';
import { ILicenseCategoryRepository } from '@/domain/interfaces/repositories/i-license-category-repository';
import { AppError, ErrorCode } from '@/shared/errors';
import { CreateLicenseCategoryDTO } from '../dtos/request/license-category/create-license-category.dto';
import { UpdateLicenseCategoryDTO } from '../dtos/request/license-category/update-license-category.dto';
import { LicenseCategoryResponse } from '../dtos/response/license-category/res-license-category.dto';
import { LicenseCategoryMapper } from '@/infrastructure/database/mappers/license-category.mapper';
import { ICradle } from '@/shared/types/container.types';
import { ILicenseCategoryService } from '@/domain/interfaces/services/i-license-category.service';

/**
 * Service xử lý logic nghiệp vụ cho Hạng bằng lái.
 */
export class LicenseCategoryService implements ILicenseCategoryService {
    private readonly _repo: ILicenseCategoryRepository;

    constructor({ licenseCategoryRepository }: ICradle) {
        this._repo = licenseCategoryRepository;
    }

    /**
     * Lấy danh sách hạng bằng lái.
     * @returns {Promise<LicenseCategoryResponse[]>}
     */
    public async getAll(): Promise<LicenseCategoryResponse[]> {
        const categories = await this._repo.findAll();
        // Chuyển đổi toàn bộ danh sách sang Response DTO
        return LicenseCategoryMapper.toResponseList(categories);
    }

    /**
     * Tạo hạng bằng lái mới.
     * @param {CreateLicenseCategoryDTO} dto - Dữ liệu đầu vào.
     */
    public async createCategory(dto: CreateLicenseCategoryDTO): Promise<LicenseCategoryResponse> {
        dto.isValid();

        const existing = await this._repo.findByName(dto.name);
        if (existing) {
            throw new AppError(ErrorCode.LICENSE.NAME_ALREADY_EXISTS);
        }

        const category = new LicenseCategory({
            id: crypto.randomUUID(),
            name: dto.name,
            description: dto.description,
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
     * @param {UpdateLicenseCategoryDTO} dto - Dữ liệu cập nhật từ Client.
     * @returns {Promise<void>}
     */
    public async updateCategory(dto: UpdateLicenseCategoryDTO): Promise<LicenseCategoryResponse> {
        // 1. Tự kiểm tra định dạng dữ liệu
        dto.isValid();

        // 2. Kiểm tra sự tồn tại của hạng bằng lái
        const category = await this._repo.findById(dto.id);
        if (!category) {
            throw new AppError(ErrorCode.LICENSE.NOT_FOUND);
        }

        // 3. Nếu tên thay đổi, kiểm tra xem tên mới đã tồn tại chưa (Unique Check)
        if (category.name !== dto.name) {
            const existingName = await this._repo.findByName(dto.name);
            if (existingName) {
                throw new AppError(ErrorCode.LICENSE.ALREADY_EXISTS);
            }
        }

        // 4. Sử dụng Rich Domain Model để cập nhật logic bên trong Entity
        category.updateDetails(dto.name, dto.description);

        // 5. Lưu lại thay đổi thông qua Repository
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
        if (category.isDeleted()) {
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
}