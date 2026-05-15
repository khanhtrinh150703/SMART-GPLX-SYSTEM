import { UserQueryDTO } from "@/application/dtos/request/user/user-query.request.dto";
import { IUserResponseDTO } from "@/application/dtos/response/user/user.respone.dto";
import { REGEX } from "@/domain/constants/regex.constant";
import { User } from "@/domain/entities/user/user.entity";
import { IUserRepository } from "@/domain/interfaces/repositories/identity";
import { IUserQueryService } from "@/domain/interfaces/services";
import { UserMapper } from "@/infrastructure/database/mappers";
import { PAGINATION_CONFIG } from "@/shared/config/pagination.config";
import { AppError, ErrorCode } from "@/shared/errors";
import { PaginatedResult } from "@/shared/types/pagination.types";
import { PaginationUtil } from "@/shared/utils/pagination.util";

/**
 * @interface IUserQueryServiceCradle
 * @description Tập hợp các phụ thuộc (Dependencies) dành riêng cho UserQueryService.
 */
export interface IUserQueryServiceCradle {
    /** @description Repository chịu trách nhiệm truy xuất dữ liệu từ Database cho thực thể Người dùng. */
    userRepository: IUserRepository;
}

/**
 * @class UserQueryService
 * @description Dịch vụ thực hiện các tác vụ đọc dữ liệu (Read-side) trong Domain Người dùng.
 * @principle CQRS - Đảm bảo tách biệt luồng truy vấn để tối ưu hóa hiệu năng và bảo mật.
 */
export class UserQueryService implements IUserQueryService {
    /** @private @readonly @description Instance truy xuất dữ liệu User. */
    private readonly _userRepo: IUserRepository;

    /**
     * @constructor
     * @description Khởi tạo Service với các phụ thuộc được tiêm từ DI Container.
     * @param {IUserQueryServiceCradle} cradle - Chứa instance của Repository cần thiết.
     */
    constructor({ userRepository }: IUserQueryServiceCradle) {
        this._userRepo = userRepository;
    }
    
    /**
     * @description Tìm kiếm người dùng qua Username và xác thực trạng thái tài khoản.
     * @param {string} username - Tên đăng nhập cần tìm.
     * @returns {Promise<User>} Thực thể người dùng đang hoạt động và không bị khóa.
     * @throws {AppError} USER.NOT_FOUND - Nếu người dùng gắn liền với Token không tồn tại. 
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
     * @throws {AppError} USER.NOT_FOUND - Nếu người dùng gắn liền với Token không tồn tại. 
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
     * @throws {AppError} USER.NOT_FOUND - Nếu người dùng gắn liền với Token không tồn tại.
     */
    public async getUserById(userId: string): Promise<User> {
        const user = await this._userRepo.findActiveById(userId);

        if (!user) throw new AppError(ErrorCode.USER.NOT_FOUND);

        this.ensureAccountNotLocked(user);

        return user;
    }

    /**
     * @description Tìm kiếm người dùng qua định danh linh hoạt (Email hoặc Username) và kiểm tra trạng thái tài khoản.
     * @param {string} identifier - Email hoặc tên đăng nhập của người dùng.
     * @returns {Promise<User>} Thực thể người dùng hợp lệ và không bị khóa.
     * @throws {AppError} AUTH.INVALID_CREDENTIALS - Nếu sai tên đăng nhập hoặc mật khẩu (Dùng lỗi chung để tránh lộ thông tin).
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
     * @returns {Promise<PaginatedResult<IUserResponseDTO>>} Trả về DTO thay vì Entity để bảo mật.
     */
    public async getPaginatedUsers(query: UserQueryDTO): Promise<PaginatedResult<IUserResponseDTO>> {
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
     * @description Đảm bảo tài khoản vẫn khả dụng. Ném lỗi nếu người dùng đã bị xóa mềm (Soft-deleted).
     * @param {User} user - Thực thể người dùng cần kiểm tra trạng thái. (User entity to validate).
     * @throws {AppError} AUTH.ACCOUNT_LOCKED - Nếu tài khoản đã bị đánh dấu xóa trong hệ thống.
     */
    private ensureAccountNotLocked(user: User): void {
        if (user.isDeleted()) {
            throw new AppError(ErrorCode.AUTH.ACCOUNT_LOCKED);
        }
    }
}