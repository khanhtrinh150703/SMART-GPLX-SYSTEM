// Role - Vai trò người dùng
export interface UserRole {
  id: string;
  name: string;
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
}

export interface IUpdateProfileResponse {
  user: User;           // Thực thể người dùng
  accessToken: string;  // Vé thông hành mới
  refreshToken: string; // Vé làm mới mới
}

// UserState - Trạng thái lưu trữ trong Store (Zustand)
export interface UserState {
  user: User | null;
  setUser: (user: User) => void;
  clearUser: () => void;
}
