import { IRoleService } from "@/domain/interfaces/services/i-role.service";
import { IRoleRepository } from "@/domain/interfaces/repositories/i-role.repository";
import { Role } from "@/domain/entities/role/role.entity";
import { AppError, ErrorCode } from "@/shared/errors";

/**
 * @interface IRoleServiceCradle
 * @description Định nghĩa các phụ thuộc (dependencies) dành riêng cho RoleService.
 * Giúp TypeScript kiểm soát chặt chẽ các repository được "tiêm" vào.
 */
export interface IRoleServiceCradle {
    roleRepository: IRoleRepository;
}

/**
 * @class RoleService
 * @description Triển khai các nghiệp vụ liên quan đến vai trò (Role) và phân quyền.
 * Đóng vai trò cung cấp dữ liệu Role cho các Service khác trong hệ thống.
 */
export class RoleService implements IRoleService {
    private readonly _roleRepo: IRoleRepository;

    /**
     * @description Khởi tạo Service với túi đồ nghề chuyên dụng cho Role.
     * @param {IRoleServiceCradle} cradle - Chứa các repository đã được đăng ký trong DI Container.
     */
    constructor({ roleRepository }: IRoleServiceCradle) {
        // Gán trực tiếp từ Cradle chuyên biệt, không dùng ICradle tổng
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