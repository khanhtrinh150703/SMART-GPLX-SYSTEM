import { AppError, ErrorCode } from "@/shared/errors";
import bcrypt from 'bcrypt';
import { UserStatus } from "@/domain/entities/user/user.status";
import { User } from "@/domain/entities/user/user.entity";
import { IUserRepository } from "@/domain/interfaces/repositories/i-user.repository";
import { ChangePasswordDTO, ChangeStatusDTO, UpdateProfileDTO } from "../dtos/request/user.dto";
import { REGEX } from "@/domain/constants/regex.constant";
import { ITokenManager } from "@/domain/interfaces/external/i-token-manager";
import { SystemRoles } from "@/domain/constants/roles.constant";
import { IRoleService } from "@/domain/interfaces/services/i-role.service";
import { IUserService } from "@/domain/interfaces/services/i-user.service";
import { UserQueryDTO } from "../dtos/request/user-query.dto";
import { PaginatedResult } from "@/shared/types/pagination.types";
import { PaginationUtil } from "@/shared/utils/pagination.util";
import { UserMapper } from "@/infrastructure/database/mappers/user.mapper";
import { UserResponseDTO } from "../dtos/response/user.dto";
import { ICradle } from "@/shared/types/container.types";

/**
 * Service quản lý các nghiệp vụ lõi liên quan đến Người dùng.
 * Đã được tối ưu hóa để tái sử dụng logic và đảm bảo tính minh bạch.
 */
export class UserService implements IUserService {
    // 1. Khai báo các thuộc tính của class ở đây
    private readonly _userRepo: IUserRepository;
    private readonly _tokenManager: ITokenManager;
    private readonly _roleService: IRoleService;

    /**
     * @param {ICradle} cradle - Object chứa tất cả dependencies từ Container
     */
    constructor({ userRepository, tokenManager, roleService }: ICradle) {
        // 2. Gán các dependency từ object vào thuộc tính class
        // LƯU Ý: Tên 'userRepository', 'tokenManager', 'roleService' 
        // phải khớp 100% với Key cậu đã register trong container.ts
        this._userRepo = userRepository;
        this._tokenManager = tokenManager;
        this._roleService = roleService;
    }
    // ============================================================
    // PRIVATE HELPERS (Các hàm bổ trợ để tái sử dụng)
    // ============================================================

    /**
     * Tìm kiếm người dùng đang hoạt động theo ID hoặc ném lỗi nếu không tồn tại.
     * @param {string} userId 
     * @returns {Promise<User>}
     */
    private async getActiveUserOrThrow(userId: string): Promise<User> {
        const user = await this._userRepo.findActiveById(userId);
        if (!user) {
            throw new AppError(ErrorCode.USER.NOT_FOUND);
        }
        return user;
    }

    /**
     * Kiểm tra trạng thái tài khoản và ném lỗi nếu đã bị xóa.
     * @param {User} user 
     */
    private ensureAccountNotLocked(user: User): void {
        if (user.isDeleted()) {
            throw new AppError(ErrorCode.AUTH.ACCOUNT_LOCKED);
        }
    }

    // ============================================================
    // PUBLIC METHODS (Logic nghiệp vụ chính)
    // ============================================================

    /**
     * Tác dụng: Cập nhật thông tin cá nhân của người dùng.
     * @param {string} userId - ID của người dùng.
     * @param {UpdateProfileDTO} dto - Dữ liệu cần cập nhật.
     * @returns {Promise<User>}
     */
    public async updateProfile(userId: string, dto: UpdateProfileDTO): Promise<User> {
        const user = await this.getActiveUserOrThrow(userId);

        if (dto.fullName !== undefined && dto.urlPicture !== undefined) {
            user.updateProfile(dto.fullName, dto.urlPicture);
        }

        return await this._userRepo.update(user);
    }

    /**
     * Tác dụng: Cập nhật thông tin người dùng vào cơ sở dữ liệu.
     * Đây là hàm wrapper để AuthService hoặc các Service khác có thể gọi mà không cần chạm vào Repo.
     * @param {User} user - Đối tượng Entity User đã được thay đổi dữ liệu.
     * @returns {Promise<User>} - Trả về Entity sau khi lưu thành công.
     */
    public update = async (user: User): Promise<User> => {
        // Service chỉ đóng vai trò điều hướng lệnh xuống Repository
        // Tuyệt đối không viết logic update trường nào ở đây, Entity đã làm việc đó rồi.
        return await this._userRepo.update(user);
    };

    /**
       * Tác dụng: Thực hiện nghiệp vụ đổi mật khẩu và thu hồi toàn bộ phiên đăng nhập cũ.
       * @param {string} userId - ID người dùng lấy từ Token xác thực.
       * @param {ChangePasswordDTO} dto - Dữ liệu mật khẩu cũ và mới.
       */
    public async changePassword(userId: string, dto: ChangePasswordDTO): Promise<void> {
        // 1. Rule 8: DTO tự validate dữ liệu đầu vào (Cheap Check)
        dto.validateOrThrow();

        // 2. Kiểm tra sự tồn tại của người dùng
        const user = await this._userRepo.findActiveById(userId);
        if (!user) throw new AppError(ErrorCode.USER.NOT_FOUND);

        // 3. Hash mật khẩu mới (Infrastructure logic phục vụ Domain)
        const hashedNewPassword = await bcrypt.hash(dto.newPassword, 10);

        // 4. Rule 6: Rich Domain Model - Logic nghiệp vụ nằm trong Entity
        // Bao gồm so sánh mật khẩu cũ và cập nhật mật khẩu mới (Heavy Check)
        await user.updatePassword(
            dto.oldPassword,
            hashedNewPassword,
            bcrypt.compare
        );

        // 5. Lưu thay đổi vào cơ sở dữ liệu
        await this._userRepo.update(user);

        /**
         * 6. CHIẾN THUẬT BẢO MẬT: Logout All
         * Sau khi đổi mật khẩu thành công, ta gọi Manager để xóa sạch Token trong Redis.
         * Điều này đảm bảo kẻ gian (nếu có access token cũ) sẽ bị văng ra ngay lập tức.
         */
        await this._tokenManager.revokeTokenByPattern(userId);
    }

    /**
     * Tác dụng: Thay đổi trạng thái tài khoản (Dành cho Admin).
     */
    public async updateStatus(userId: string, dto: ChangeStatusDTO): Promise<void> {
        const user = await this.getActiveUserOrThrow(userId);
        user.updateStatus(dto.status as UserStatus);
        await this._userRepo.update(user);
    }

    /**
     * Tác dụng: Xóa mềm (Soft Delete) tài khoản người dùng.
     */
    public async deleteUser(userId: string): Promise<void> {
        const user = await this.getActiveUserOrThrow(userId);
        user.softDelete();
        await this._userRepo.update(user);
    }


    /**
 * Tác dụng: Khôi phục tài khoản người dùng đã bị xóa mềm.
 * @param {string} userId - ID của người dùng cần khôi phục.
 */
    public async restoreUser(userId: string): Promise<void> {
        // 1. Tìm user (Bao gồm cả những người có deletedAt != null)
        // Bạn cần một hàm tìm kiếm không lọc trạng thái 'deleted'
        const user = await this._userRepo.findByIdInSystem(userId);

        if (!user) {
            throw new AppError(ErrorCode.USER.NOT_FOUND);
        }

        // 2. Gọi logic nghiệp vụ ở tầng Domain
        user.restore();

        // 3. Cập nhật lại vào Database
        await this._userRepo.update(user);
    }
    /**
     * Tác dụng: Tìm kiếm người dùng bằng Username và kiểm tra trạng thái khóa.
     */
    public async getUserByUserName(username: string): Promise<User> {
        const user = await this._userRepo.findActiveByUsername(username);

        if (!user) throw new AppError(ErrorCode.USER.NOT_FOUND);

        this.ensureAccountNotLocked(user);

        return user;
    }

    /**
     * Tác dụng: Tìm kiếm người dùng bằng Username và kiểm tra trạng thái khóa.
     */
    public async getUserByEmail(email: string): Promise<User> {
        const user = await this._userRepo.findActiveByEmail(email);

        if (!user) throw new AppError(ErrorCode.USER.NOT_FOUND);

        this.ensureAccountNotLocked(user);

        return user;
    }


    /**
     * Tác dụng: Kiểm tra tính duy nhất của Username và Email.
     * @throws {AppError} - Ném lỗi cụ thể nếu đã tồn tại.
     * @returns {Promise<boolean>} - Trả về false nếu KHÔNG tìm thấy trùng lặp.
     */
    public async checkExisting(username: string, email: string): Promise<boolean> {
        const normalizedEmail = email.trim().toLowerCase();
        const normalizedUsername = username.trim().toLowerCase();

        // 1. Lấy danh sách trùng từ Repo (findMany)
        const existingUsers = await this._userRepo.findExistingInSystem(normalizedEmail, normalizedUsername);

        // 2. Nếu có bản ghi trùng khớp
        if (existingUsers.length > 0) {
            const isUsernameTaken = existingUsers.some(u => u.username === normalizedUsername);
            const isEmailTaken = existingUsers.some(u => u.email === normalizedEmail);

            // Ném lỗi ưu tiên để UI hiển thị chính xác
            if (isUsernameTaken) {
                throw new AppError(ErrorCode.USER.USERNAME_EXISTS);
            }

            if (isEmailTaken) {
                throw new AppError(ErrorCode.USER.EMAIL_EXISTS);
            }
        }

        // 3. Nếu chạy đến đây, nghĩa là không có ai trùng
        // Trả về false để báo hiệu: "Không tìm thấy sự tồn tại nào"
        return false;
    }

    /**
     * Xử lý tìm kiếm người dùng khi đăng nhập bằng định danh linh hoạt.
     */
    public async getUserByIdentifier(identifier: string): Promise<User> {
        const isEmail = REGEX.EMAIL.EMAIL.test(identifier);

        const user = isEmail
            ? await this._userRepo.findByEmailInSystem(identifier)
            : await this._userRepo.findByUsernameInSystem(identifier);

        if (!user) throw new AppError(ErrorCode.AUTH.INVALID_CREDENTIALS);

        this.ensureAccountNotLocked(user);

        return user;
    }

    // // Trong RoleService hoặc UserService (Nơi thực hiện lệnh đổi quyền)
    // public async updatePermissions(userId: string, newRoles: string[]): Promise<void> {
    //     // 1. Lưu vào MySQL (Sử dụng UserRepository.update như mình đã viết)
    //     await this._userRepo.updateRoles(userId, newRoles);

    //     // 2. PHÁT LỆNH TRẢM: Xóa trắng cache quyền của User này trong Redis
    //     // Chúng ta sẽ viết thêm hàm này vào TokenManager
    //     await this._tokenManager.clearPermissionsCache(userId);
    // }


    /**
     * @description Lấy danh sách người dùng đã qua bộ lọc và ánh xạ sang DTO sạch.
     * @returns {Promise<PaginatedResult<UserResponseDTO>>} Trả về DTO thay vì Entity để bảo mật.
     */
    public async getUsers(query: UserQueryDTO): Promise<PaginatedResult<UserResponseDTO>> {
        // 1. Chuẩn hóa thông số phân trang
        const page = Number(query.page) || 1;
        const limit = Number(query.limit) || 10;

        // 2. Tính toán skip cho Repository
        const skip = PaginationUtil.getSkip(page, limit);

        // 3. Truy vấn dữ liệu từ DB (Lấy Entity gốc)
        const [users, total] = await this._userRepo.findAndCount(query, skip, limit);

        // 4. ÁNH XẠ DỮ LIỆU (Mapping): Chuyển mảng Entity sang mảng Response DTO sạch
        // Chúng ta dùng .map() vì users là một danh sách (Array)
        const userResponses = users.map(user => UserMapper.toResponse(user));

        // 5. Đóng gói và trả về kết quả cuối cùng
        return PaginationUtil.createPaginatedResponse(userResponses, total, page, limit);
    }

    /**
     * Tác dụng: Tạo mới một người dùng và lưu vào database.
     */
    public async createUser(data: {
        id: string;
        username: string;
        email: string;
        fullName: string;
        passwordHash: string;
    }): Promise<User> {
        const defaultRole = await this._roleService.getRoleByName(SystemRoles.STUDENT);
        const userEntity = User.create({
            id: data.id,
            username: data.username,
            email: data.email,
            fullName: data.fullName,
            passwordHash: data.passwordHash,
        });

        userEntity.assignRole(defaultRole);
        const newUser = await this._userRepo.create(userEntity);
        if (!newUser) throw new AppError(ErrorCode.SYSTEM.DATABASE_ERROR);

        return newUser;
    }
}