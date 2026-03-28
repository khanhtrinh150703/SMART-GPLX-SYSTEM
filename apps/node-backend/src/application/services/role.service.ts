import { IRoleService } from "@/domain/interfaces/services/i-role.service";
import { IRoleRepository } from "@/domain/interfaces/repositories/i-role.repository";
import { Role } from "@/domain/entities/role/role.entity";
import { AppError, ErrorCode } from "@/shared/errors";
import { ICradle } from "@/shared/types/container.types";

/**
 * @class RoleService
 * @implements IRoleService
 * @description Triển khai các nghiệp vụ về Role, đóng vai trò trung gian cho các Service khác
 */
export class RoleService implements IRoleService {
    // 1. Khai báo thuộc tính của class ở đây
    private readonly _roleRepo: IRoleRepository;

    /**
     * @param {ICradle} cradle - Object chứa tất cả dependencies từ Container
     */
    constructor({ roleRepository }: ICradle) {
        // 2. Gán dependency từ object vào thuộc tính class
        // LƯU Ý: Tên 'roleRepository' phải khớp 100% với Key 
        // cậu đã register trong container.ts
        this._roleRepo = roleRepository;
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