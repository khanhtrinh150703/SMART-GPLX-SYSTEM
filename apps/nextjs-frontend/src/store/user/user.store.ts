import { User } from '@/types/user.type';
import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

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
      user: null,
      accessToken: null,
      refreshToken: null,

      setAuth: (user, accessToken, refreshToken) => {
        // Chốt chặn bảo vệ: Nếu token là chuỗi "undefined" hoặc "null" thì hủy bỏ
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

      setTokens: (accessToken, refreshToken) => {
        if (!accessToken || accessToken === 'undefined') return;
        
        set({
          accessToken,
          refreshToken,
        });
      },

      logout: () => {
        // 1. Reset trạng thái trong RAM
        set({ user: null, accessToken: null, refreshToken: null });
        
        // 2. Xóa sạch dấu vết trong LocalStorage
        useUserStore.persist.clearStorage();
        localStorage.removeItem('user-storage');
      },
    }),
    {
      name: 'user-storage', // Tên key trong LocalStorage
      storage: createJSONStorage(() => localStorage),
      // Chỉ lưu những trường này xuống đĩa, tránh lưu các hàm (actions)
      partialize: (state) => ({
        user: state.user,
        accessToken: state.accessToken,
        refreshToken: state.refreshToken,
      }),
    }
  )
);