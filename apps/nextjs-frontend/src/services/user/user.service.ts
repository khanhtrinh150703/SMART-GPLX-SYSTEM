// src/services/user/user.service.ts

import { userApi } from "@/api/user/user.api";
import { StandardResponse } from "@/types/common.type";
import { IUpdateProfileResponse, UserChangePassword } from "@/types/user.type"; // 💡 Import Interface mới
import { useUserStore } from "../../store/user/user.store";
import { AdminUpdateFormValues, ChangePasswordValues, ProfileFormValues } from "@/lib/validations/user.schema";
import { UserQueryDTO } from "@/types/query-user";
import { PaginatedResult } from "@/types/paginaton";
import { UserResponseDTO } from "@/types/user-respone";

/**
 * Lớp Xử lý Nghiệp vụ (Business Logic Layer) cho Người dùng
 */
export const userService = {
  /**
   * Cập nhật Hồ sơ Người dùng (Update Profile)
   * @param data - Dữ liệu từ Form (Plain Object - Đối tượng thuần túy)
   * @returns Promise chứa gói dữ liệu cập nhật mới (User + Tokens)
   */
  updateProfile: async (
    data: ProfileFormValues
  ): Promise<StandardResponse<IUpdateProfileResponse>> => { // ✅ Đã sửa kiểu trả về

    // 1. Chuyển đổi dữ liệu sang FormData (Data Transformation)
    // Giúp gửi tệp tin (Binary/Files) lên Server dễ dàng.
    const formData = new FormData();
    formData.append("fullName", data.fullName);

    // if (data.username) {
    //   formData.append("username", data.username);
    // }

    // Xử lý tệp tin ảnh đại diện (Picture File)
    if (data.urlPicture instanceof File) {
      formData.append("pictureFile", data.urlPicture);
    }

    // 2. Gọi lớp API (API Layer) thực hiện PATCH request
    const response = await userApi.updateProfile(formData);

    // 3. Tác vụ phụ (Side Effect): Cập nhật trạng thái toàn cục (Global State)
    // Chỉ cập nhật khi API thành công và có dữ liệu user bên trong.
    if (response.success && response.data?.user) {
      const { setAuth } = useUserStore.getState();

      // 💡 Bóc tách đúng thực thể User để nạp vào Zustand
      setAuth(response.data.user, response.data.accessToken, response.data.refreshToken);

      // 💡 Bonus: Nếu muốn cập nhật Token luôn thì làm ở đây
      // localStorage.setItem('accessToken', response.data.accessToken);
    }

    // 4. Trả về phản hồi cho lớp Giao diện (UI Layer)
    return response;
  },

  updateProfileAdmin: async (userId: string,
    data: AdminUpdateFormValues
  ): Promise<StandardResponse<IUpdateProfileResponse>> => { // ✅ Đã sửa kiểu trả về

    // 1. Chuyển đổi dữ liệu sang FormData (Data Transformation)
    // Giúp gửi tệp tin (Binary/Files) lên Server dễ dàng.
    const formData = new FormData();
    formData.append("fullName", data.fullName);

    // if (data.username) {
    //   formData.append("username", data.username);
    // }

    // // Xử lý tệp tin ảnh đại diện (Picture File)
    // if (data.urlPicture instanceof File) {
    //   formData.append("pictureFile", data.urlPicture);
    // }

    // 2. Gọi lớp API (API Layer) thực hiện PATCH request
    const response = await userApi.updateProfileAdmin(formData, userId);

    // 3. Tác vụ phụ (Side Effect): Cập nhật trạng thái toàn cục (Global State)
    // Chỉ cập nhật khi API thành công và có dữ liệu user bên trong.
    if (response.success && response.data?.user) {
      const { setAuth } = useUserStore.getState();

      // 💡 Bóc tách đúng thực thể User để nạp vào Zustand
      setAuth(response.data.user, response.data.accessToken, response.data.refreshToken);

      // 💡 Bonus: Nếu muốn cập nhật Token luôn thì làm ở đây
      // localStorage.setItem('accessToken', response.data.accessToken);
    }

    // 4. Trả về phản hồi cho lớp Giao diện (UI Layer)
    return response;
  },

  /**
     * Change user password 
     * (Thay đổi mật khẩu người dùng)
     * Note: No try/catch here as per architectural rules 
     * (Lưu ý: Không dùng try/catch tại đây theo quy tắc kiến trúc)
     */
  changePassword: async (payload: ChangePasswordValues) => {
    // 1. Chuẩn hóa dữ liệu nếu cần (Data transformation)

    // 2. Gọi tầng API
    const apiData: UserChangePassword = {
      oldPassword: payload.oldPassword,
      newPassword: payload.newPassword,
    };

    // 2. Gọi tầng API - Bây giờ sẽ hết gạch đỏ vì apiData khớp 100% với UserChangePassword
    const response = await userApi.changePassword(apiData);

    // 3. Trả về dữ liệu
    return response.data;
  },



  /**
   * Lấy danh sách Người dùng có phân trang (Get Paginated Users)
   * @param params - Đối tượng truy vấn (Query Object) bao gồm page, limit, search...
   * @returns Promise chứa kết quả phân trang (Paginated Result) và thông tin Meta.
   */
  getUsers: async (
    params: UserQueryDTO
  ): Promise<StandardResponse<PaginatedResult<UserResponseDTO>>> => {
    /**
     * Luồng xử lý (Execution Flow): 
     * Service nhận tham số từ UI -> Gọi API Layer -> Trả dữ liệu về cho UI.
     * Lưu ý: Không sử dụng try/catch tại đây theo quy tắc Coding Rules.
     */
    const response = await userApi.getAllUsers(params);

    return response;
  },

  /**
   * Xóa người dùng (Delete User)
   * @param id - ID định danh người dùng.
   */
  deleteUser: async (id: string): Promise<StandardResponse<null>> => {
    // Chuyển tiếp (Forward) yêu cầu xuống API Layer
    return await userApi.delete(id);
  },

  /**
   * Xóa người dùng (Delete User)
   * @param id - ID định danh người dùng.
   */
  restoreUser: async (id: string): Promise<StandardResponse<null>> => {
    // Chuyển tiếp (Forward) yêu cầu xuống API Layer
    return await userApi.restore(id);
  },
};