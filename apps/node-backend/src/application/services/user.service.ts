import { AppError, ErrorCode } from "@/shared/errors";
import { UserStatus } from "@/domain/entities/user/user.status";
import { User } from "@/domain/entities/user/user.entity";
import { IUserRepository } from "@/domain/interfaces/repositories/i-user.repository";
import { REGEX } from "@/domain/constants/regex.constant";
import { ITokenManager } from "@/domain/interfaces/external/i-token-manager";
import { UserRole } from "@/domain/constants/roles.constant";
import { IUserService } from "@/domain/interfaces/services/i-user.service";
import { UserQueryDTO } from "../dtos/request/user/user-query.request.dto";
import { PaginatedResult } from "@/shared/types/pagination.types";
import { PaginationUtil } from "@/shared/utils/pagination.util";
import { UserMapper } from "@/infrastructure/database/mappers/user.mapper";
import { UserResponseDTO } from "../dtos/response/user/user.respone.dto";
import { Role } from "@/domain/entities/role/role.entity";
import { IFileStorageService } from "@/domain/interfaces/external/i-file-storage.service";
import bcrypt from 'bcrypt';
import { UpdateProfileRequestDTO } from "../dtos/request/user/update-profile.request.dto";
import { ChangePasswordRequestDTO } from "../dtos/request/user/update-password.request.dto";
import { ChangeStatusRequestDTO } from "../dtos/request/user/update-status.request.dto";
import { LoginResponseDTO } from "../dtos/response/auth/auth.respone.dto";
import { STORAGE_FOLDERS } from "@/domain/constants/storage.constant";
import logger from '@/infrastructure/logging/winston.logger';
import { IUserRoleRepository } from "@/domain/interfaces/repositories/i-user-role.repository";
import { UpdateAdminRequestDTO } from "../dtos/request/user/update-admin.request.dto";
import { PrismaClient } from "@prisma/client";
import { MasterDataCacheService } from "@/infrastructure/security/master-data-cache.service";

/**
 * @interface IUserServiceCradle
 * @description Định nghĩa các phụ thuộc cần thiết cho UserService.
 * Bao gồm Repository để truy cập DB, TokenManager cho bảo mật và FileStorage cho upload ảnh.
 */
export interface IUserServiceCradle {
    userRepository: IUserRepository;
    userRoleRepository: IUserRoleRepository;
    tokenManager: ITokenManager;
    fileStorageService: IFileStorageService;
    prisma: PrismaClient; // <--- Thêm dòng này
}

/**
 * @class UserService
 * @description Xử lý các nghiệp vụ lõi liên quan đến Người dùng (User Domain).
 */
export class UserService implements IUserService {
    private readonly _userRepo: IUserRepository;
    private readonly _tokenManager: ITokenManager;
    private readonly _fileStorageService: IFileStorageService;
    private readonly _userRoleRepo: IUserRoleRepository;
    private readonly _prisma: PrismaClient;

    constructor({
        userRepository,
        userRoleRepository,
        tokenManager,
        fileStorageService,
        prisma // <--- 2. Nhận từ Cradle
    }: IUserServiceCradle) {
        this._userRepo = userRepository;
        this._userRoleRepo = userRoleRepository;
        this._tokenManager = tokenManager;
        this._fileStorageService = fileStorageService;
        this._prisma = prisma; // <--- 3. Gán giá trị
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

    /**
     * @description Thực hiện cập nhật hồ sơ người dùng (Dịch: Update user profile logic)
     * @param {string} userId - ID của người dùng cần cập nhật
     * @param {UpdateProfileRequestDTO} dto - Dữ liệu yêu cầu từ Client
     * @returns {Promise<LoginResponseDTO>} DTO phản hồi sau khi cập nhật thành công
     */
    public async updateProfile(userId: string, dto: UpdateProfileRequestDTO): Promise<LoginResponseDTO> {
        // 1. Lấy Entity từ Database (Dịch: Fetch entity from DB)
        const user = await this.getActiveUserOrThrow(userId);

        // Lưu lại đường dẫn ảnh cũ để xóa sau khi upload thành công (Dịch: Keep old path for cleanup)
        const oldPicturePath = user.urlPicture;
        let newUrlPicture: string | undefined;

        // 2. Xử lý File nếu có (Dịch: Handle file upload if exists)
        if (dto.pictureFile) {
            // Sử dụng Constant đã định nghĩa, không dùng magic string 'avatars'
            newUrlPicture = await this._fileStorageService.saveFile(
                dto.pictureFile,
                STORAGE_FOLDERS.PROFILE
            );
        }

        // 3. Thực hiện logic nghiệp vụ tại Entity (Rich Domain Model)
        user.updateProfile(dto.fullName, newUrlPicture);

        // 4. Persistence - Lưu vào Database
        const updatedUser = await this._userRepo.update(user);

        // 5. Cleanup - Xóa ảnh cũ nếu việc cập nhật ảnh mới thành công
        if (newUrlPicture && oldPicturePath) {
            this._fileStorageService.deleteFile(oldPicturePath).catch((err: unknown) => {
                logger.error(`[Cleanup] Failed to delete old avatar: ${oldPicturePath}`, err);
            });
        }

        // 6. Mapping - Chuyển đổi Entity sang DTO để trả về
        return UserMapper.toLoginResponse(updatedUser, "", "");
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
            await this._userRepo.update(user, tx);

            // Đồng bộ hóa Role nếu Admin có gửi danh sách mới
            if (dto.roles) {
                await this._userRoleRepo.syncUserRoles(userId, dto.roles, tx);
            }
        });

        // Logging hành động admin
        console.log(`[Admin Action] User ${userId} updated successfully.`);
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
     * @param {ChangePasswordRequestDTO} dto - Dữ liệu mật khẩu cũ và mới.
     */
    public async changePassword(userId: string, dto: ChangePasswordRequestDTO): Promise<void> {
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
     * Cập nhật trạng thái hoạt động của tài khoản (Dành cho quản trị viên).
     * @param {string} userId - ID của người dùng cần cập nhật.
     * @param {ChangeStatusRequestDTO} dto - Dữ liệu trạng thái mới.
     * @returns {Promise<void>}
     */
    public async updateStatus(userId: string, dto: ChangeStatusRequestDTO): Promise<void> {
        const user = await this.getActiveUserOrThrow(userId);
        user.updateStatus(dto.status as UserStatus);
        await this._userRepo.update(user);
    }

    /**
     * Thực hiện xóa mềm (Soft Delete) tài khoản người dùng.
     * @param {string} userId - ID của người dùng cần xóa.
     * @returns {Promise<void>}
     */
    public async deleteUser(userId: string): Promise<void> {
        const user = await this.getActiveUserOrThrow(userId);
        user.softDelete();
        await this._userRepo.update(user);
    }

    /**
     * Khôi phục tài khoản người dùng đã bị xóa mềm về trạng thái hoạt động.
     * @param {string} userId - ID của người dùng cần khôi phục.
     * @returns {Promise<void>}
     */
    public async restoreUser(userId: string): Promise<void> {
        const user = await this._userRepo.findByIdInSystem(userId);

        if (!user) {
            throw new AppError(ErrorCode.USER.NOT_FOUND);
        }

        user.restore();
        await this._userRepo.update(user);
    }

    /**
     * Tìm kiếm người dùng qua Username và xác thực trạng thái tài khoản.
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
     * Tìm kiếm người dùng qua Email và xác thực trạng thái tài khoản.
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
    * Tìm kiếm người dùng qua Email và xác thực trạng thái tài khoản.
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
     * Tìm kiếm người dùng qua định danh linh hoạt (Email hoặc Username) và kiểm tra trạng thái tài khoản.
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
    public async getPaginatedUsers(query: UserQueryDTO): Promise<PaginatedResult<UserResponseDTO>> {
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
     * Tạo mới người dùng, thiết lập vai trò mặc định và lưu vào cơ sở dữ liệu.
     * @param {Object} data - Tập hợp thông tin định danh và mật khẩu đã băm của người dùng.
     * @returns {Promise<User>} Thực thể người dùng sau khi đã được gán vai trò và lưu trữ thành công.
     */
    public async createUser(data: {
        id: string;
        username: string;
        email: string;
        fullName: string;
        passwordHash: string;
    }): Promise<User> {
        const roleData = MasterDataCacheService.getRoleByName(UserRole.STUDENT);

        if (!roleData) {
            throw new AppError(ErrorCode.AUTH.ROLES_NOT_INITIALIZED);
        }

        const defaultRole = Role.reconstitute({
            id: roleData.id,
            name: roleData.name,
            description: roleData.description,
            permissions: []
        });

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