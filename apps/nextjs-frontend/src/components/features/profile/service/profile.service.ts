import { StandardResponse } from "@/types/common.type";
import { IUpdateProfileResponse } from "@/types/user.type";
import { ChangePasswordValues, ProfileFormValues } from "@/lib/validations/user.schema";
import { useUserStore } from "@/store/user/user.store";
import { profileApi } from "../api/profile/profile.api";

/**
 * profileService: Xử lý nghiệp vụ cho trang cá nhân.
 * (Business logic for personal profile)
 */
export const profileService = {
  /**
   * Cập nhật hồ sơ và ảnh đại diện (Update Profile & Avatar)
   */
  updateProfile: async (data: ProfileFormValues): Promise<StandardResponse<IUpdateProfileResponse>> => {
    // 1. Chuyển đổi sang FormData (Data Transformation)
    const formData = new FormData();
    formData.append("fullName", data.fullName);

    if (data.urlPicture instanceof File) {
      formData.append("pictureFile", data.urlPicture);
    }

    // 2. Gọi lớp API
    const response = await profileApi.update(formData);

    // 3. Side Effect: Cập nhật Zustand khi thành công (Update Global State)
    if (response.success && response.data?.user) {
      useUserStore.getState().setUser(response.data.user);
    }

    return response;
  },

  /**
   * Thay đổi mật khẩu (Change Password)
   */
  changePassword: async (payload: ChangePasswordValues) => {
    const apiData = {
      oldPassword: payload.oldPassword,
      newPassword: payload.newPassword,
    };

    const response = await profileApi.changePassword(apiData);
    return response;
  },
};