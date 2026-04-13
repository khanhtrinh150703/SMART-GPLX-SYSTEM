import { User } from '@/types/user.type';
import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

/**
 * Định nghĩa cấu trúc dữ liệu và hành động của Store.
 * (State and Action definitions)
 */
interface UserState {
  user: User | null;
  accessToken: string | null;
  refreshToken: string | null;

  // Actions
  /**
   * @description Thiết lập toàn bộ thông tin xác thực sau khi Login.
   */
  setAuth: (user: User | null, accessToken: string | null, refreshToken: string | null) => void;

  /**
   * @description Cập nhật chỉ cặp Token (Dùng cho logic Silent Refresh).
   */
  setTokens: (accessToken: string | null, refreshToken: string | null) => void;

  /**
   * @description Chỉ cập nhật thông tin User (Dùng khi Update Profile).
   * Đã fix lỗi "implicit any" bằng cách gắn type User | null.
   */
  setUser: (user: User | null) => void;

  /**
   * @description Xóa sạch dữ liệu (Dùng khi Logout hoặc Token hết hạn hoàn toàn).
   */
  logout: () => void;
}

/**
 * User Store: Quản lý trạng thái người dùng và Token toàn cục.
 * Tích hợp Persist để lưu trữ bền vững tại LocalStorage.
 */
export const useUserStore = create<UserState>()(
  persist(
    (set) => ({
      // --- STATE ---
      user: null,
      accessToken: null,
      refreshToken: null,

      // --- ACTIONS ---

      // 1. Dùng cho Đăng nhập
      setAuth: (user, accessToken, refreshToken) => {
        // Chốt chặn bảo vệ: Nếu token bị rỗng hoặc là chuỗi tào lao thì hủy bỏ
        if (!accessToken || accessToken === 'undefined' || accessToken === 'null') {
          console.error("Store Error: Cố gắng lưu AccessToken không hợp lệ.");
          return;
        }

        set({
          user,
          accessToken,
          refreshToken,
        });
      },

      // 2. Dùng cho Refresh Token (Chỉ thay đổi token, giữ nguyên User)
      setTokens: (accessToken, refreshToken) => {
        if (!accessToken || accessToken === 'undefined' || accessToken === 'null') return;
        
        set({
          accessToken,
          refreshToken,
        });
      },

      // 3. Dùng cho Cập nhật hồ sơ (Chỉ thay đổi User, giữ nguyên Token cũ)
      setUser: (user: User | null) => {
        set({ user });
      },
      
      // 4. Đăng xuất
      logout: () => {
        // Reset trạng thái trong bộ nhớ RAM
        set({ user: null, accessToken: null, refreshToken: null });
        
        // Xóa sạch dấu vết trong LocalStorage để đảm bảo an toàn
        useUserStore.persist.clearStorage();
        localStorage.removeItem('user-storage');
      },
    }),
    {
      name: 'user-storage', // Tên key lưu trong ổ cứng
      storage: createJSONStorage(() => localStorage),
      
      /**
       * Partialize: Chỉ chọn lọc các trường dữ liệu cần lưu xuống LocalStorage.
       * Điều này giúp tránh việc lưu các hàm (actions) gây rác bộ nhớ.
       */
      partialize: (state) => ({
        user: state.user,
        accessToken: state.accessToken,
        refreshToken: state.refreshToken,
      }),
    }
  )
);