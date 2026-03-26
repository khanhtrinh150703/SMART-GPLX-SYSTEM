import { AppError, ErrorCode } from "@/shared/errors";
import bcrypt from 'bcrypt';
import { UserStatus } from "@/domain/entities/user/user.status";
import { User } from "@/domain/entities/user/user.entity";
import { IUserRepository } from "@/domain/interfaces/repositories/i-user.repository";
import { ChangePasswordDTO, ChangeStatusDTO, UpdateProfileDTO } from "../dtos/request/user.dto";
import { REGEX } from "@/domain/constants/regex.constant";
import { ITokenManager } from "@/domain/interfaces/services/i-token-manager";

/**
 * Service quản lý các nghiệp vụ lõi liên quan đến Người dùng.
 * Đã được tối ưu hóa để tái sử dụng logic và đảm bảo tính minh bạch.
 */
export class UserService {
    /**
     * Tiêm phụ thuộc (DI) qua constructor.
     * @param {IUserRepository} userRepo - Repo quản lý dữ liệu người dùng (MySQL).
     * @param {ITokenManager} tokenManager - Manager quản lý logic Token (Redis/JWT).
     */
    constructor(private readonly userRepo: IUserRepository,
        private readonly tokenManager: ITokenManager
    ) { }

    // ============================================================
    // PRIVATE HELPERS (Các hàm bổ trợ để tái sử dụng)
    // ============================================================

    /**
     * Tìm kiếm người dùng đang hoạt động theo ID hoặc ném lỗi nếu không tồn tại.
     * @param {string} userId 
     * @returns {Promise<User>}
     */
    private async getActiveUserOrThrow(userId: string): Promise<User> {
        const user = await this.userRepo.findActiveById(userId);
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

        return await this.userRepo.update(user);
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
        return await this.userRepo.update(user);
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
        const user = await this.userRepo.findActiveById(userId);
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
        await this.userRepo.update(user);

        /**
         * 6. CHIẾN THUẬT BẢO MẬT: Logout All
         * Sau khi đổi mật khẩu thành công, ta gọi Manager để xóa sạch Token trong Redis.
         * Điều này đảm bảo kẻ gian (nếu có access token cũ) sẽ bị văng ra ngay lập tức.
         */
        await this.tokenManager.revokeToken(userId);
    }

    /**
     * Tác dụng: Thay đổi trạng thái tài khoản (Dành cho Admin).
     */
    public async updateStatus(userId: string, dto: ChangeStatusDTO): Promise<void> {
        const user = await this.getActiveUserOrThrow(userId);
        user.updateStatus(dto.status as UserStatus);
        await this.userRepo.update(user);
    }

    /**
     * Tác dụng: Xóa mềm (Soft Delete) tài khoản người dùng.
     */
    public async deleteUser(userId: string): Promise<void> {
        const user = await this.getActiveUserOrThrow(userId);
        user.softDelete();
        await this.userRepo.update(user);
    }


    /**
 * Tác dụng: Khôi phục tài khoản người dùng đã bị xóa mềm.
 * @param {string} userId - ID của người dùng cần khôi phục.
 */
    public async restoreUser(userId: string): Promise<void> {
        // 1. Tìm user (Bao gồm cả những người có deletedAt != null)
        // Bạn cần một hàm tìm kiếm không lọc trạng thái 'deleted'
        const user = await this.userRepo.findByIdInSystem(userId);

        if (!user) {
            throw new AppError(ErrorCode.USER.NOT_FOUND);
        }

        // 2. Gọi logic nghiệp vụ ở tầng Domain
        user.restore();

        // 3. Cập nhật lại vào Database
        await this.userRepo.update(user);
    }
    /**
     * Tác dụng: Tìm kiếm người dùng bằng Username và kiểm tra trạng thái khóa.
     */
    public async getUserByUserName(username: string): Promise<User> {
        const user = await this.userRepo.findActiveByUsername(username);

        if (!user) throw new AppError(ErrorCode.USER.NOT_FOUND);

        this.ensureAccountNotLocked(user);

        return user;
    }

    /**
     * Tác dụng: Tìm kiếm người dùng bằng Username và kiểm tra trạng thái khóa.
     */
    public async getUserByEmail(email: string): Promise<User> {
        const user = await this.userRepo.findActiveByEmail(email);

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
        const existingUsers = await this.userRepo.findExistingInSystem(normalizedEmail, normalizedUsername);

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
            ? await this.userRepo.findByEmailInSystem(identifier)
            : await this.userRepo.findByUsernameInSystem(identifier);

        if (!user) throw new AppError(ErrorCode.AUTH.INVALID_CREDENTIALS);

        this.ensureAccountNotLocked(user);

        return user;
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
        const userEntity = User.create({
            id: data.id,
            username: data.username,
            email: data.email,
            fullName: data.fullName,
            passwordHash: data.passwordHash,
        });

        const newUser = await this.userRepo.create(userEntity);
        if (!newUser) throw new AppError(ErrorCode.SYSTEM.DATABASE_ERROR);

        return newUser;
    }
}