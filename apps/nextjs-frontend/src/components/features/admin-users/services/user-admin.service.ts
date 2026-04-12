import { userAdminApi } from "../api/user-admin.api";
import { StandardResponse } from "@/types/common.type";
import { PaginatedResult } from "@/types/paginaton.type";
import { UserQueryDTO } from "@/types/query-user";
import { UserResponseDTO } from "@/types/user-respone";
import { IUpdateProfileResponse } from "@/types/user.type";
import { AdminUpdatePayload } from "@/components/features/admin-users/schema/user.schema";

/**
 * userAdminService: Nghiệp vụ quản lý người dùng dành cho Admin.
 * (Business logic for user management - Admin only)
 */
export const userAdminService = {
  /**
   * Lấy danh sách người dùng phân trang.
   * (Get paginated users list)
   */
  getUsers: async (params: UserQueryDTO): Promise<StandardResponse<PaginatedResult<UserResponseDTO>>> => {
    return await userAdminApi.getAll(params);
  },

  /**
   * Admin cập nhật thông tin cho người dùng bất kỳ.
   * (Admin updates information for any specific user)
   */
  updateProfileAdmin: async (
    userId: string,
    data: AdminUpdatePayload
  ): Promise<StandardResponse<IUpdateProfileResponse>> => {
    
    // 1. Chuyển đổi dữ liệu sang FormData (Data Transformation)
    const formData = new FormData();
    
    // Kiểm tra và append dữ liệu nếu tồn tại
    if (data.fullName !== undefined) {
      formData.append("fullName", data.fullName);
    }

    // Nếu sau này bạn mở rộng thêm ảnh đại diện cho Admin sửa:
    // if (data.urlPicture instanceof File) {
    //   formData.append("pictureFile", data.urlPicture);
    // }

    // 2. Gọi lớp API thực hiện PATCH request
    const response = await userAdminApi.updateUser(userId, formData);

    /**
     * 3. Lưu ý về Side Effect:
     * Ở đây không cập nhật Zustand của Admin (useUserStore) 
     * vì Admin đang sửa thông tin của người dùng khác.
     */
    
    return response;
  },

  /**
   * Xóa người dùng (Delete User)
   */
  deleteUser: async (id: string): Promise<StandardResponse<null>> => {
    return await userAdminApi.delete(id);
  },

  /**
   * Khôi phục người dùng (Restore User)
   */
  restoreUser: async (id: string): Promise<StandardResponse<null>> => {
    return await userAdminApi.restore(id);
  },
};