import { userAdminApi } from "../api/user-admin.api";
import { StandardResponse } from "@/types/common.type";
import { PaginatedResult } from "@/types/paginaton.type";
import { UserQueryDTO } from "@/types/query-user";
import { UserResponseDTO } from "@/components/features/admin-users/types/user-respone";
import { IUpdateProfileResponse, User } from "@/types/user.type";
import { AdminUpdatePayload, CreateUserPayload } from "@/components/features/admin-users/schema/user.schema";
import { DeleteResponse } from "@/types/respone/delete.common";

/**
 * userAdminService: Nghiệp vụ quản lý người dùng dành cho Admin.
 * (Business logic for user management - Admin only)
 */
export const userAdminService = {
  /**
   * Lấy danh sách người dùng phân trang.
   * (Get paginated users list)
   */
  getUsers: async (
    params: UserQueryDTO,
  ): Promise<StandardResponse<PaginatedResult<UserResponseDTO>>> => {
    return await userAdminApi.getAll(params);
  },

  /**
   * Admin cập nhật thông tin học viên (JSON Mode).
   * @param userId - ID của học viên cần sửa.
   * @param data - Dữ liệu bao gồm fullName và roles[].
   */
  updateProfileAdmin: async (
    userId: string,
    data: AdminUpdatePayload,
  ): Promise<StandardResponse<IUpdateProfileResponse>> => {
    const response = await userAdminApi.updateUserByAdmin(userId, data);
    return response;
  },

  /**
   * @description Quản trị viên khởi tạo một tài khoản người dùng mới (Học viên, Giáo viên, Điều phối viên).
   * @param {CreateUserPayload} dto - Gói dữ liệu thô chứa thông tin đăng ký tài khoản được lấy từ Form của Frontend.
   * @returns {Promise<StandardResponse<User>>} Phản hồi chuẩn từ hệ thống chứa thông tin User vừa được tạo thành công.
   */
  adminCreateUser: async (
    dto: CreateUserPayload,
  ): Promise<StandardResponse<User>> => {
    // 1. Gọi xuống API Client để thực thi phương thức POST với endpoint sạch và Request Body chứa dto
    const response = await userAdminApi.adminCreateUser(dto);

    // 2. Trả về kết quả sạch cho tầng Component (Giao diện) xử lý hiển thị thông báo Toast thành công
    return response;
  },

  /**
   * Xóa người dùng (Delete User)
   */
  deleteUser: async (id: string): Promise<StandardResponse<DeleteResponse>> => {
    const respone = await userAdminApi.delete(id);
    return respone;
  },

  /**
   * Khôi phục người dùng (Restore User)
   */
  restoreUser: async (id: string): Promise<StandardResponse<null>> => {
    return await userAdminApi.restore(id);
  },
};
