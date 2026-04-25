import { AppError, ErrorCode } from "@/shared/errors";
import { UserStatus } from "@/domain/entities/user/user.status";
import { User } from "@/domain/entities/user/user.entity";
import { IUserRepository } from "@/domain/interfaces/repositories/identity/i-user.repository";
import { REGEX } from "@/domain/constants/regex.constant";
import { ITokenManager } from "@/domain/interfaces/external/i-token-manager";
import { UserRole } from "@/domain/constants/roles.constant";
import { IUserService } from "@/domain/interfaces/services/identity/i-user.service";
import { PaginatedResult } from "@/shared/types/pagination.types";
import { PaginationUtil } from "@/shared/utils/pagination.util";
import { UserMapper } from "@/infrastructure/database/mappers/identity/user.mapper";
import { STORAGE_FOLDERS } from "@/domain/constants/storage.constant";
import { IUserRoleRepository } from "@/domain/interfaces/repositories/identity/i-user-role.repository";
import { PrismaClient } from "@prisma/client";
import { IMediaService } from "@/domain/interfaces/services/integration/i-media.service";
import { IMasterDataCacheService } from "@/domain/interfaces/services/exam-mgmt/i-master-data-cache.service";
import bcrypt from 'bcrypt';
import logger from '@/infrastructure/logging/winston.logger';
import { Role } from "@/domain/entities/role/role.entity";
import { PAGINATION_CONFIG } from "@/shared/config/pagination.config";
import { UpdateAdminRequestDTO } from "@/application/dtos/request/user/update-admin.request.dto";
import { ChangePasswordRequestDTO } from "@/application/dtos/request/user/update-password.request.dto";
import { UpdateProfileRequestDTO } from "@/application/dtos/request/user/update-profile.request.dto";
import { ChangeStatusRequestDTO } from "@/application/dtos/request/user/update-status.request.dto";
import { UserQueryDTO } from "@/application/dtos/request/user/user-query.request.dto";
import { ILoginResponseDTO } from "@/application/dtos/response/auth/auth.respone.dto";
import { UserResponseDTO } from "@/application/dtos/response/user/user.respone.dto";

/**
 * @interface IUserServiceCradle
 * @description Định nghĩa các phụ thuộc cần thiết cho UserService.
 * Bao gồm Repository để truy cập DB, TokenManager cho bảo mật và FileStorage cho upload ảnh.
 */
export interface IUserServiceCradle {
    userRepository: IUserRepository;
    userRoleRepository: IUserRoleRepository;
    tokenManager: ITokenManager;
    mediaService: IMediaService;
    masterDataCacheService: IMasterDataCacheService;
    prisma: PrismaClient;
}

/**
 * @class UserService
 * @description Xử lý các nghiệp vụ lõi liên quan đến Người dùng (User Domain).
 */
export class UserService implements IUserService {
    private readonly _userRepo: IUserRepository;
    private readonly _tokenManager: ITokenManager;
    private readonly _mediaService: IMediaService;
    private readonly _userRoleRepo: IUserRoleRepository;
    private readonly _cacheService: IMasterDataCacheService;
    private readonly _prisma: PrismaClient;

    constructor({
        userRepository,
        userRoleRepository,
        tokenManager,
        mediaService,
        masterDataCacheService,
        prisma
    }: IUserServiceCradle) {
        this._userRepo = userRepository;
        this._userRoleRepo = userRoleRepository;
        this._tokenManager = tokenManager;
        this._mediaService = mediaService;
        this._cacheService = masterDataCacheService;
        this._prisma = prisma;
    }

    /**
     * @description Thực hiện cập nhật hồ sơ người dùng (Dịch: Update user profile logic)
     * @param {string} userId - ID của người dùng cần cập nhật
     * @param {UpdateProfileRequestDTO} dto - Dữ liệu yêu cầu từ Client
     * @returns {Promise<ILoginResponseDTO>} DTO phản hồi sau khi cập nhật thành công
     */
    public async updateProfile(userId: string, dto: UpdateProfileRequestDTO): Promise<ILoginResponseDTO> {
        // 1. Lấy Entity từ Database (Dịch: Fetch entity from DB)
        const user = await this.getActiveUserOrThrow(userId);

        const oldPicturePath = user.props.urlPicture; // Truy cập qua props cho đúng chuẩn DDD
        let newUrlPicture: string | undefined;

        // 2. Xử lý File nếu có (Dịch: Handle file upload if exists)
        if (dto.pictureFile) {
            newUrlPicture = await this._mediaService.save(
                dto.pictureFile,
                STORAGE_FOLDERS.PROFILE
            );
        }

        // 3. Thực hiện logic nghiệp vụ tại Entity (Rich Domain Model)
        // (Dịch: Mô hình Domain giàu tính năng - chứa logic thay vì chỉ chứa dữ liệu)
        user.updateProfile(dto.fullName, newUrlPicture);

        // 4. Persistence - Lưu vào Database (Dịch: Tầng lưu trữ dữ liệu vĩnh viễn)
        const updatedUser = await this._userRepo.updateUser(user);
        if (!updatedUser) throw new AppError(ErrorCode.SYSTEM.DATABASE_ERROR);

        // 5. Cleanup - Xóa ảnh cũ nếu upload thành công (Dịch: Dọn dẹp tài nguyên)
        if (newUrlPicture && oldPicturePath) {
            this._mediaService.deleteFile(oldPicturePath).catch((err: unknown) => {
                logger.error(`[Cleanup] Failed to delete old avatar: ${oldPicturePath}`, err);
            });
        }

        // 6. Refresh Session (Single Session Policy)
        await this._tokenManager.revokeTokenByPattern(updatedUser.id);
        const tokens = await this._tokenManager.generateAndStoreTokens(updatedUser);

        // 7. Mapping kết quả từ updatedUser (Source of Truth)
        return UserMapper.toLoginResponse(updatedUser, tokens);
    }

    /**
     * @description API dành cho Admin cập nhật thông tin và quyền hạn người dùng.
     * @param userId - ID của người dùng mục tiêu.
     * @param dto - Dữ liệu cập nhật từ Admin.
     */
    public async updateUserByAdmin(userId: string, dto: UpdateAdminRequestDTO): Promise<void> {
        // 1. Kiểm tra nghiệp vụ (Dùng Entity Rich Logic)
        const user = await this._userRepo.findActiveById(userId);
        if (!user) throw new AppError(ErrorCode.USER.NOT_FOUND);

        // 3. Kiểm tra tính hợp lệ sơ bộ của DTO trước khi xuống Service
        if (!dto.isValid()) {
            throw new AppError(ErrorCode.USER.UPDATE_FAILED);
            // Hoặc dùng mã lỗi chi tiết hơn nếu ông đã định nghĩa trong DTO
        }
        // Cập nhật thông tin vào Entity (Validation thực hiện bên trong Entity)
        if (dto.fullName) user.updateFullName(dto.fullName);

        // 2. Chạy Transaction
        await this._prisma.$transaction(async (tx) => {
            // Lưu thông tin cơ bản (Cần ép kiểu tx về Prisma.TransactionClient trong Repo update)
            await this._userRepo.updateUser(user, tx);

            // Đồng bộ hóa Role nếu Admin có gửi danh sách mới
            if (dto.roles) {
                await this._userRoleRepo.syncUserRoles(userId, dto.roles, tx);
            }
        });
    }

    /**
     * @description  Tác dụng: Cập nhật thông tin người dùng vào cơ sở dữ liệu.
     * @param {User} user - Đối tượng Entity User đã được thay đổi dữ liệu.
     * @returns {Promise<User>} - Trả về Entity sau khi lưu thành công.
     */
    public update = async (user: User): Promise<User> => {
        const updatedUser = await this._userRepo.updateUser(user);
        return updatedUser;
    };

    /**
     * @description Tác dụng: Thực hiện nghiệp vụ đổi mật khẩu và thu hồi toàn bộ phiên đăng nhập cũ.
     * @param {string} userId - ID người dùng lấy từ Token xác thực.
     * @param {ChangePasswordRequestDTO} dto - Dữ liệu mật khẩu cũ và mới.
     */
    public async changePassword(userId: string, dto: ChangePasswordRequestDTO): Promise<void> {
        // 1. Rule 8: DTO tự validate dữ liệu đầu vào (Cheap Check)
        dto.validateOrThrow();

        // 2. Kiểm tra sự tồn tại của người dùng
        const user = await this._userRepo.findActiveById(userId);
        if (!user) throw new AppError(ErrorCode.USER.NOT_FOUND);

        // 3. Rule 6: Rich Domain Model - Logic nghiệp vụ nằm trong Entity
        // Bao gồm so sánh mật khẩu cũ và cập nhật mật khẩu mới (Heavy Check)
        await user.updatePassword(
            dto.oldPassword,
            dto.newPassword,
            bcrypt.compare
        );

        // 4. Lưu thay đổi vào cơ sở dữ liệu
        const updatedUser = await this.update(user);

        if (!updatedUser) throw new AppError(ErrorCode.SYSTEM.DATABASE_ERROR);

        await this._tokenManager.revokeTokenByPattern(userId);
    }

    /**
     * @description Cập nhật trạng thái hoạt động của tài khoản (Dành cho quản trị viên).
     * @param {string} userId - ID của người dùng cần cập nhật.
     * @param {ChangeStatusRequestDTO} dto - Dữ liệu trạng thái mới.
     * @returns {Promise<void>}
     */
    public async updateStatus(userId: string, dto: ChangeStatusRequestDTO): Promise<void> {
        const user = await this.getActiveUserOrThrow(userId);
        user.updateStatus(dto.status as UserStatus);
        await this._userRepo.updateUser(user);
    }

    /**
     * Thực hiện xóa mềm (Soft Delete) tài khoản người dùng.
     * @param {string} userId - ID của người dùng cần xóa.
     * @returns {Promise<void>}
     */
    public async deleteUser(userId: string): Promise<void> {
        const user = await this.getActiveUserOrThrow(userId);
        user.softDelete();
        await this._userRepo.updateUser(user);
    }

    /**
     * @description Khôi phục tài khoản người dùng đã bị xóa mềm về trạng thái hoạt động.
     * @param {string} userId - ID của người dùng cần khôi phục.
     * @returns {Promise<void>}
     */
    public async restoreUser(userId: string): Promise<void> {
        const user = await this._userRepo.findByIdInSystem(userId);

        if (!user) {
            throw new AppError(ErrorCode.USER.NOT_FOUND);
        }

        user.restore();
        await this._userRepo.updateUser(user);
    }

    /**
     * @description Tìm kiếm người dùng qua Username và xác thực trạng thái tài khoản.
     * @param {string} username - Tên đăng nhập cần tìm.
     * @returns {Promise<User>} Thực thể người dùng đang hoạt động và không bị khóa.
     */
    public async getUserByUserName(username: string): Promise<User> {
        const user = await this._userRepo.findActiveByUsername(username);

        if (!user) throw new AppError(ErrorCode.USER.NOT_FOUND);

        this.ensureAccountNotLocked(user);

        return user;
    }

    /**
     * @description Tìm kiếm người dùng qua Email và xác thực trạng thái tài khoản.
     * @param {string} email - Địa chỉ email cần tìm.
     * @returns {Promise<User>} Thực thể người dùng đang hoạt động và không bị khóa.
     */
    public async getUserByEmail(email: string): Promise<User> {
        const user = await this._userRepo.findActiveByEmail(email);

        if (!user) throw new AppError(ErrorCode.USER.NOT_FOUND);

        this.ensureAccountNotLocked(user);

        return user;
    }

    /**
    * @description Tìm kiếm người dùng qua Email và xác thực trạng thái tài khoản.
    * @param {string} userId - UserID cần tìm.
    * @returns {Promise<User>} Thực thể người dùng đang hoạt động và không bị khóa.
    */
    public async getUserById(userId: string): Promise<User> {
        const user = await this._userRepo.findActiveById(userId);

        if (!user) throw new AppError(ErrorCode.USER.NOT_FOUND);

        this.ensureAccountNotLocked(user);

        return user;
    }

    /**
     * @description Tác dụng: Kiểm tra tính duy nhất của Username và Email.
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
        return false;
    }

    /**
     * @description Tìm kiếm người dùng qua định danh linh hoạt (Email hoặc Username) và kiểm tra trạng thái tài khoản.
     * @param {string} identifier - Email hoặc tên đăng nhập của người dùng.
     * @returns {Promise<User>} Thực thể người dùng hợp lệ và không bị khóa.
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

    /**
     * @description Lấy danh sách người dùng đã qua bộ lọc và ánh xạ sang DTO sạch.
     * @returns {Promise<PaginatedResult<UserResponseDTO>>} Trả về DTO thay vì Entity để bảo mật.
     */
    public async getPaginatedUsers(query: UserQueryDTO): Promise<PaginatedResult<UserResponseDTO>> {
        // 1. Chuẩn hóa thông số phân trang
        const page = Number(query.page) || PAGINATION_CONFIG.DEFAULT_PAGE;
        const limit = Math.min(
            Number(query.limit) || PAGINATION_CONFIG.DEFAULT_LIMIT,
            PAGINATION_CONFIG.MAX_LIMIT
        );

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
     * @description Tạo mới người dùng, thiết lập vai trò mặc định và lưu vào cơ sở dữ liệu.
     * @param {Object} data - Tập hợp thông tin định danh và mật khẩu đã băm của người dùng.
     * @returns {Promise<User>} Thực thể người dùng sau khi đã được gán vai trò và lưu trữ thành công.
     */
    public async createUser(user: User): Promise<User> {

        const roleData = this._cacheService.getRoleByName(UserRole.STUDENT)

        if (!roleData) {
            throw new AppError(ErrorCode.AUTH.ROLES_NOT_INITIALIZED);
        }

        const defaultRole = Role.reconstitute({
            id: roleData.id,
            name: roleData.name,
            description: roleData.description,
            permissions: []
        });

        user.assignRole(defaultRole)

        const newUser = await this._userRepo.createUser(user);

        return newUser;
    }

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

}