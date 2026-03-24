import { AppError, ErrorCode } from "@/shared/errors";
import bcrypt from 'bcrypt';
import { UserStatus } from "@/domain/entities/user/user.status";
import { User } from "@/domain/entities/user/user.entity"
import { IUserRepository } from "@/domain/interfaces/repositories/i-user.repository";
import { ChangePasswordDTO, ChangeStatusDTO, UpdateProfileDTO } from "../dtos/request/user.dto";

/**
 * Service quản lý các nghiệp vụ lõi liên quan đến Người dùng.
 */
export class UserService {
    // Thêm modifier 'readonly' để bảo vệ dependency
    constructor(private readonly userRepo: IUserRepository) { }

    /**
     * Tác dụng: Cập nhật thông tin cá nhân của người dùng.
     * @param {string} userId - ID của người dùng.
     * @param {UpdateProfileDTO} dto - Dữ liệu cần cập nhật (tên, ảnh đại diện...).
     * @returns {Promise<User>} - Trả về Entity User sau khi cập nhật.
     */
    public async updateProfile(userId: string, dto: UpdateProfileDTO): Promise<User> {
        const existingUser = await this.userRepo.findById(userId);

        if (!existingUser) {
            throw new AppError(ErrorCode.USER.NOT_FOUND);
        }

        // Cập nhật dữ liệu trên Entity
        if (dto.fullName !== undefined && dto.urlPicture !== undefined) {
            existingUser.updateProfile(dto.fullName, dto.urlPicture);
        }

        // Lưu dữ liệu đã thay đổi vào Database
        const updatedUser = await this.userRepo.update(existingUser);

        return updatedUser;
    }

    /**
     * Tác dụng: Xử lý logic đổi mật khẩu của người dùng.
     * @param {string} userId - ID của người dùng.
     * @param {ChangePasswordDTO} dto - Chứa mật khẩu cũ và mật khẩu mới.
     * @returns {Promise<void>} - Service chỉ thực thi, không trả về dữ liệu.
     */
    public async changePassword(userId: string, dto: ChangePasswordDTO): Promise<void> {
        // --- BƯỚC 1: CHEAP CHECK ---
        if (dto.oldPassword === dto.newPassword) {
            throw new AppError(ErrorCode.VALIDATION.PASSWORD_MUST_BE_DIFFERENT);
        }

        if (!dto.isPassword()) {
            throw new AppError(ErrorCode.VALIDATION.INVALID_PASSWORD);
        }

        if (!dto.isPasswordMapping()) {
            throw new AppError(ErrorCode.VALIDATION.CONFIRM_PASSWORD_MISMATCH);
        }

        // --- BƯỚC 2: DATABASE CHECK ---
        const existingUser = await this.userRepo.findById(userId);

        if (!existingUser || !existingUser.passwordHash) {
            throw new AppError(ErrorCode.USER.NOT_FOUND);
        }

        // --- BƯỚC 3: HEAVY CHECK ---
        const isMatch = await bcrypt.compare(dto.oldPassword, existingUser.passwordHash);

        if (!isMatch) {
            throw new AppError(ErrorCode.AUTH.INVALID_CREDENTIALS);
        }

        // --- BƯỚC 4: XỬ LÝ VÀ LƯU TRỮ ---
        const hashedNewPassword = await bcrypt.hash(dto.newPassword, 10);

        existingUser.updatePassword(hashedNewPassword);
        await this.userRepo.update(existingUser);

        // Lưu ý: Đã xóa phần return { message: ... }. 
        // Service hoàn thành nhiệm vụ và im lặng kết thúc (void).
    }

    /**
     * Tác dụng: Thay đổi trạng thái tài khoản (Dành cho Admin).
     * @param {string} userId - ID của người dùng.
     * @param {ChangeStatusDTO} dto - Chứa trạng thái mới cần cập nhật.
     * @returns {Promise<void>}
     */
    public async updateStatus(userId: string, dto: ChangeStatusDTO): Promise<void> {
        const existingUser = await this.userRepo.findById(userId);

        if (!existingUser) {
            throw new AppError(ErrorCode.USER.NOT_FOUND);
        }

        existingUser.updateStatus(dto.status as UserStatus);
        await this.userRepo.update(existingUser);
    }

    /**
     * Tác dụng: Xóa mềm (Soft Delete) tài khoản người dùng.
     * @param {string} userId - ID của người dùng cần xóa.
     * @returns {Promise<void>}
     */
    public async deleteUser(userId: string): Promise<void> {
        const existingUser = await this.userRepo.findById(userId);

        if (!existingUser) {
            throw new AppError(ErrorCode.USER.NOT_FOUND);
        }

        existingUser.softDelete();
        await this.userRepo.update(existingUser);
    }

    /**
     * Tác dụng: Tìm kiếm người dùng bằng Username.
     * @param {string} username - Tên đăng nhập.
     * @returns {Promise<User>} - Trả về Entity User.
     */
    public async getUserByUsername(username: string): Promise<User> {
        const existingUser = await this.userRepo.findByUserName_deleted(username);

        if (!existingUser) {
            throw new AppError(ErrorCode.AUTH.INVALID_CREDENTIALS);
        }

        if (existingUser.isDeleted()) {
            throw new AppError(ErrorCode.AUTH.ACCOUNT_LOCKED);
        }

        return existingUser;
    }

    /**
     * Tác dụng: Kiểm tra xem username hoặc email đã tồn tại trong hệ thống chưa.
     * @param {string} username - Tên đăng nhập.
     * @param {string} email - Địa chỉ email.
     * @returns {Promise<boolean>} - Trả về true nếu đã tồn tại.
     */
    public async checkExisting(username: string, email: string): Promise<boolean> {
        const existingUser = await this.userRepo.checkUserExists(email, username);

        if (!existingUser) return false;

        if (Array.isArray(existingUser)) {
            return existingUser.length > 0;
        }

        return true;
    }

    /**
     * Tác dụng: Tạo mới một người dùng và lưu vào database.
     * @param {Object} data - Dữ liệu thô để tạo User.
     * @returns {Promise<User>} - Trả về Entity User sau khi tạo thành công.
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

        if (!newUser) {
            throw new AppError(ErrorCode.SYSTEM.DATABASE_ERROR);
        }

        return newUser;
    }
}