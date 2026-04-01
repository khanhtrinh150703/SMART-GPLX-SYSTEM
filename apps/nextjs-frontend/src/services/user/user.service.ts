// src/services/user/user.service.ts

import { userApi } from "@/api/user/user.api";
import { StandardResponse } from "@/types/common.type";
import { IUpdateProfileResponse, UserChangePassword } from "@/types/user.type"; // 💡 Import Interface mới
import { useUserStore } from "../../store/user/user.store";
import { ChangePasswordValues, ProfileFormValues } from "@/lib/validations/user.schema";

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

    if (data.username) {
      formData.append("username", data.username);
    }

    // Xử lý tệp tin ảnh đại diện (Picture File)
    if (data.urlPicture instanceof File) {
      formData.append("pictureFile", data.urlPicture);
    }

    // 2. Gọi lớp API (API Layer) thực hiện PATCH request
    const response = await userApi.updateProfile(formData);

    // 3. Tác vụ phụ (Side Effect): Cập nhật trạng thái toàn cục (Global State)
    // Chỉ cập nhật khi API thành công và có dữ liệu user bên trong.
    if (response.success && response.data?.user) {
      const { setUser } = useUserStore.getState();

      // 💡 Bóc tách đúng thực thể User để nạp vào Zustand
      setUser(response.data.user);

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
};