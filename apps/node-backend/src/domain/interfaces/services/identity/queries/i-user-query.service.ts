import { UserQueryDTO } from "@/application/dtos/request/user/user-query.request.dto";
import { UserResponseDTO } from "@/application/dtos/response/user/user.respone.dto";
import { User } from "@/domain/entities/user/user.entity";
import { PaginatedResult } from "@/shared/types/pagination.types";

/**
 * @interface IUserQuerySevice
 * @description Giao diện định nghĩa các truy vấn đọc dữ liệu (Read-side) cho module Identity.
 * Tập trung vào hiệu suất bằng cách trả về trực tiếp DTO, không thông qua Domain Entity.
 */
export interface IUserQueryService {
    /**
    * @description Lấy thông tin chi tiết của một người dùng dựa trên mã định danh (ID).
    * @param {string} userId - Mã định danh (ID) của người dùng cần truy xuất.
    * @returns {Promise<User>} Trả về đối tượng người dùng (User) tương ứng.
    */
    getUserById(userId: string): Promise<User>;

    /**
     * @description Truy vấn danh sách người dùng có hỗ trợ phân trang và bộ lọc tìm kiếm.
     * @param {UserQueryDTO} query - Tham số truy vấn (Page, Limit, Search, Role, Status).
     * @returns {Promise<PaginatedResult<UserResponseDTO>>} Kết quả phân trang và siêu dữ liệu (Metadata).
     */
    getPaginatedUsers(query: UserQueryDTO): Promise<PaginatedResult<UserResponseDTO>>;

    /**
     * @description Tìm kiếm người dùng dựa trên tên đăng nhập.
     * @param {string} username - Tên đăng nhập cần truy vấn.
     * @returns {Promise<User>}
     */
    getUserByUserName(username: string): Promise<User>;

    /**
     * @description Tìm kiếm người dùng dựa trên địa chỉ Email.
     * @param {string} email - Địa chỉ email cần truy vấn.
     * @returns {Promise<User>}
     */
    getUserByEmail(email: string): Promise<User>;

    /**
     * @description Tìm kiếm người dùng linh hoạt qua Email hoặc Tên đăng nhập.
     * @param {string} identifier - Chuỗi định danh (Email/Username).
     * @returns {Promise<User>}
     */
    getUserByIdentifier(identifier: string): Promise<User>;
}