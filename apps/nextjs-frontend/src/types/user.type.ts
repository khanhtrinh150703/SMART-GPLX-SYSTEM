import { UserRoleEnum } from "@/constants/enum/use.enum";

// Role - Vai trò người dùng
export interface UserRole {
  id: string;
  name: UserRoleEnum;
  displayName: string;
}

export interface UserChangePassword {
  oldPassword: string;
  newPassword: string;
}

// User - Thực thể người dùng chuẩn
export interface User {
  id: string;
  email: string;
  username: string;
  fullName: string;
  urlPicture: string;
  status: string;
  createdAt?: string; // Optional: Có thể không cần ở mọi nơi
  updatedAt?: string;
  roles: UserRole[];
  permissions: string[];
}

export interface IUpdateProfileResponse {
  user: User;           // Thực thể người dùng
  accessToken: string;  // Vé thông hành mới
  refreshToken: string; // Vé làm mới mới
}

