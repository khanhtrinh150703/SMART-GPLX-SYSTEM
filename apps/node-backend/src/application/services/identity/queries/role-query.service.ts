import { IRoleQueryService } from "@/domain/interfaces/services/identity/queries/i-role-query.service";
import { IRoleRepository } from "@/domain/interfaces/repositories/identity/i-role.repository";
import { Role } from "@/domain/entities/role/role.entity";
import { AppError, ErrorCode } from "@/shared/errors";
import { RoleMapper } from "@/infrastructure/database/mappers/identity/role.mapper";
import { ISelectionResponseDTO } from "@/application/dtos/response/shared/selection.response.dto";
import { IMasterDataCacheService } from "@/domain/interfaces/services/exam-mgmt/i-master-data-cache.service";

/**
 * @interface IRoleQueryServiceCradle
 * @description Tập hợp các phụ thuộc (Dependencies) cần thiết để thực hiện các truy vấn liên quan đến Vai trò.
 */
export interface IRoleQueryServiceCradle {
    /** @description Repository chịu trách nhiệm truy xuất dữ liệu Vai trò từ Database. */
    roleRepository: IRoleRepository;

    /** @description Dịch vụ quản lý bộ nhớ đệm cho các dữ liệu danh mục (Master Data). */
    masterDataCacheService: IMasterDataCacheService;
}

/**
 * @class RoleQueryService
 * @description Dịch vụ chuyên trách các tác vụ đọc dữ liệu (Read-side) liên quan đến Vai trò và Phân quyền.
 * @principle High Availability - Kết hợp truy vấn Database và tối ưu hóa tốc độ bằng bộ nhớ đệm (Cache).
 */
export class RoleQueryService implements IRoleQueryService {
    /** @private @readonly @description Repository vai trò. */
    private readonly _roleRepo: IRoleRepository;

    /** @private @readonly @description Dịch vụ truy xuất cache hệ thống. */
    private readonly _cacheService: IMasterDataCacheService;

    /**
     * @constructor
     * @description Khởi tạo RoleQueryService thông qua cơ chế tiêm phụ thuộc (Dependency Injection).
     * @param {IRoleQueryServiceCradle} cradle - Chứa instance của Repository và Service Cache.
     */
    constructor({ roleRepository, masterDataCacheService }: IRoleQueryServiceCradle) {
        this._roleRepo = roleRepository;
        this._cacheService = masterDataCacheService;
    }

    public async getRoleSelections(): Promise<ISelectionResponseDTO[]> {
        const roles = await this._cacheService.getAllRoles();
        return RoleMapper.toSelectionList(roles);
    }

    /**
     * @description Tìm Role theo tên. Nếu không thấy sẽ ném lỗi nghiệp vụ.
     * @param {string} name - Tên Role cần tìm
     * @returns {Promise<Role>} - Thực thể Role tìm thấy
     */
    public async getRoleByName(name: string): Promise<Role> {
        const role = await this._roleRepo.findByName(name);

        if (!role) {
            throw new AppError(
                ErrorCode.USER.NOT_FOUND,
            );
        }

        return role;
    }

    /**
     * @description Tìm Role theo ID.
     * @param {string} id - UUID của Role
     * @returns {Promise<Role>}
     */
    public async getRoleById(id: string): Promise<Role> {
        const role = await this._roleRepo.findById(id);

        if (!role) {
            throw new AppError(
                ErrorCode.USER.NOT_FOUND,
            );
        }
        return role;
    }

    /**
     * @description Lấy danh sách tất cả vai trò hiện có
     * @returns {Promise<Role[]>}
     */
    public async getAllRoles(): Promise<Role[]> {
        return await this._roleRepo.findAll();
    }

}