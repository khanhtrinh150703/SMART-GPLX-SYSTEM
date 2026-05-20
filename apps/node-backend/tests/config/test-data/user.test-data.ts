// @file: src/test/integration/mocks/admin-create-user.mock.ts
import { IAdminCreateUserInputDTO } from "@/application/dtos/request/auth/admin-create-user.request.dto";

/** @description Dữ liệu cập nhật thông tin cá nhân chung */
export const USER_UPDATE_DATA = {
  fullName: "Cậu Vàng V2",
  urlPicture: "https://cdn.smart-gplx.com/avatar.png",
} as const;

/**
 * @description Hàm sinh danh sách các Payload HỢP LỆ dựa trên ID phân quyền thực tế của Database
 * @param studentRoleId ID của vai trò STUDENT bốc từ DB
 * @param teacherRoleId ID của vai trò TEACHER bốc từ DB
 */
export const getMockAdminCreateUserValid = (
  studentRoleId: string,
  teacherRoleId: string,
): Record<string, IAdminCreateUserInputDTO> => ({
  STUDENT_FLOW: {
    username: "hocvien.gplx",
    fullName: "Nguyễn Văn Học Viên",
    email: "hocvien.gplx@gmail.com",
    password: "Password123@",
    confirmPassword: "Password123@",
    roles: [studentRoleId], // Truyền trực tiếp ID phân quyền, không truyền chuỗi tên vai trò
  },
  TEACHER_FLOW: {
    username: "giangvien.gplx",
    fullName: "Trần Minh Giảng Viên",
    email: "giangvien.gplx@gmail.com",
    password: "SecurePass321#",
    confirmPassword: "SecurePass321#",
    roles: [teacherRoleId], // Truyền trực tiếp ID phân quyền, không truyền chuỗi tên vai trò
  },
});

/**
 * @description Hàm sinh danh sách các Payload LỖI nhằm quét sạch lỗ hổng bảo mật (Defensive Testing)
 * @param studentRoleId ID của vai trò STUDENT bốc từ DB
 */
export const getMockAdminCreateUserInvalid = (studentRoleId: string) => ({
  // --- 1. Nhóm lỗi format dữ liệu cấu trúc bề mặt ---
  PASSWORD_MISMATCH: {
    username: "admin.test",
    fullName: "Test Mismatch",
    email: "mismatch@gmail.com",
    password: "Password123@",
    confirmPassword: "WrongPassword123@",
    roles: [studentRoleId],
  },
  USERNAME_TOO_SHORT: {
    username: "ad",
    fullName: "Test Short Username",
    email: "short@gmail.com",
    password: "Password123@",
    confirmPassword: "Password123@",
    roles: [studentRoleId],
  },
  INVALID_EMAIL: {
    username: "email.error",
    fullName: "Test Invalid Email",
    email: "invalid-email-format",
    password: "Password123@",
    confirmPassword: "Password123@",
    roles: [studentRoleId],
  },
  EMPTY_ROLES: {
    username: "role.error",
    fullName: "Test Empty Roles",
    email: "roleerror@gmail.com",
    password: "Password123@",
    confirmPassword: "Password123@",
    roles: [],
  },

  // --- 2. Nhóm lỗi biên & Tiêm nhiễm kiểu dữ liệu nguy hiểm ---
  SPACES_ONLY: {
    username: "   ", // Trim xong bằng chuỗi rỗng -> Bị chặn đứng từ cửa ngõ
    fullName: "Nguyễn Văn Cách",
    email: "spaces@gmail.com",
    password: "Password123@",
    confirmPassword: "Password123@",
    roles: [studentRoleId],
  },
  ROLES_CONTAIN_INVALID_TYPE: {
    username: "role.type.error",
    fullName: "Test Dirty Roles Array",
    email: "dirtyrole@gmail.com",
    password: "Password123@",
    confirmPassword: "Password123@",
    roles: [123, null, studentRoleId] as unknown as string[], // Giả lập dữ liệu bẩn từ Client tấn công Type System
  },

  // --- 3. Nhóm lỗi logic nghiệp vụ hệ thống (Business Rule Cases) ---
  NON_EXISTENT_ROLE: {
    username: "invalid.role.name",
    fullName: "Test Role Not Found",
    email: "role_not_found@gmail.com",
    password: "Password123@",
    confirmPassword: "Password123@",
    roles: ["88888888-8888-8888-8888-888888888888"],
  },
});

/**
 * @description Dữ liệu mẫu hợp lệ và bất hợp lệ dành riêng cho kịch bản Admin Update User (PUT)
 * @param studentRoleId ID vai trò Học viên lấy động từ Database
 * @param teacherRoleId ID vai trò Giáo viên lấy động từ Database
 */
export const getAdminUpdateUserMockData = (
  studentRoleId: string,
  teacherRoleId: string,
) => ({
  valid: {
    FULL_FLOW: {
      fullName: "Nguyễn Văn Admin Cập Nhật",
      roles: [studentRoleId, teacherRoleId],
    },
  },
  invalid: {
    EMPTY_PAYLOAD: {},
    SPACES_NAME: {
      fullName: "   ",
    },
    TOO_SHORT_NAME: {
      fullName: "A",
    },
    TOO_LONG_NAME: {
      fullName: "A".repeat(101),
    },
    EMPTY_ROLES: {
      roles: [],
    },
  },
});

/**
 * @description Dữ liệu mẫu hợp lệ và bất hợp lệ dành riêng cho kịch bản Admin Update Profile (PATCH)
 */
export const getAdminUpdateProfileMockData = () => ({
  valid: {
    TEXT_ONLY: {
      fullName: "Học Viên Đổi Tên Bởi Admin",
    },
    MULTIPART_FIELD: {
      fullName: "Cậu Vàng Upload",
    },
  },
  invalid: {
    EMPTY_PAYLOAD: {},
    EMPTY_NAME: {
      fullName: "",
    },
    TOO_LONG_NAME: {
      fullName: "B".repeat(51), // Khớp chốt chặn biên > 50 của Profile DTO
    },
  },
});
