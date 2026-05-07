import { User } from '@/types/user.type';
import { create } from 'zustand';
import { persist, createJSONStorage, subscribeWithSelector } from 'zustand/middleware';
import Cookies from 'js-cookie';
import { jwtDecode } from 'jwt-decode';

/**
 * Interface cho Payload của JWT (Khớp với Backend của ông)
 */
interface JwtPayload {
  userId: string;
  roles: string[];
  permissions: string[];
  iat: number;
  exp: number;
}

/**
 * Định nghĩa cấu trúc State của User Store
 */
interface UserState {
  user: User | null;
  accessToken: string | null;
  refreshToken: string | null;
  permissions: string[];
  _hasHydrated: boolean; // Flag kiểm tra Zustand đã load xong từ LocalStorage chưa

  // Actions
  setAuth: (user: User | null, access: string | null, refresh: string | null) => void;
  setTokens: (access: string | null, refresh: string | null) => void;
  setUser: (user: User | null) => void;
  setHasHydrated: (state: boolean) => void;
  logout: () => void;
}

/**
 * Helper: Giải mã quyền từ Token (Dùng để khởi tạo Store đồng bộ)
 */
const getPermissionsFromToken = (token: string | undefined): string[] => {
  if (!token) return [];
  try {
    const decoded = jwtDecode<JwtPayload>(token);
    return decoded.permissions || [];
  } catch {
    return [];
  }
};

export const useUserStore = create<UserState>()(
  subscribeWithSelector(
    persist(
      (set) => ({
        // --- INITIAL STATE (Đọc trực tiếp từ Cookies để tránh mất Auth khi F5) ---
        user: null, // Sẽ được lấy từ LocalStorage qua persist
        accessToken: Cookies.get('accessToken') || null,
        refreshToken: Cookies.get('refreshToken') || null,
        permissions: getPermissionsFromToken(Cookies.get('accessToken')),
        _hasHydrated: false,

        // --- ACTIONS ---

        /**
         * Thiết lập Auth sau khi Login thành công
         */
        setAuth: (user, accessToken, refreshToken) => {
          if (!accessToken) return;

          const permissions = getPermissionsFromToken(accessToken);

          // Lưu vào Cookies (Client-side access)
          Cookies.set('accessToken', accessToken, { expires: 7, secure: true, sameSite: 'strict' });
          if (refreshToken) {
            Cookies.set('refreshToken', refreshToken, { expires: 30, secure: true, sameSite: 'strict' });
          }

          set({ user, accessToken, refreshToken, permissions });
        },

        /**
         * Cập nhật Tokens mới (Silent Refresh)
         */
        setTokens: (accessToken, refreshToken) => {
          if (!accessToken) return;

          const permissions = getPermissionsFromToken(accessToken);

          Cookies.set('accessToken', accessToken, { secure: true, sameSite: 'strict' });
          if (refreshToken) {
            Cookies.set('refreshToken', refreshToken, { secure: true, sameSite: 'strict' });
          }

          set({ accessToken, refreshToken, permissions });
        },

        /**
         * Cập nhật thông tin User (Update Profile)
         */
        setUser: (user) => set({ user }),

        /**
         * Cập nhật trạng thái Hydration
         */
        setHasHydrated: (state) => set({ _hasHydrated: state }),

        /**
         * Logout: Xóa sạch dấu vết
         */
        logout: () => {
          Cookies.remove('accessToken');
          Cookies.remove('refreshToken');

          // Reset state về mặc định
          set({
            user: null,
            accessToken: null,
            refreshToken: null,
            permissions: []
          });

          // Phát sự kiện để các Tab khác cũng Logout theo (nếu mở nhiều tab)
          localStorage.setItem('logout-event', Date.now().toString());

          // Xóa LocalStorage của Zustand
          useUserStore.persist.clearStorage();
        },
      }),
      {
        name: 'user-storage', // Key lưu trong LocalStorage
        storage: createJSONStorage(() => localStorage),
        /**
         * CHỈ PERSIST DỮ LIỆU CẦN THIẾT
         * Tokens và Permissions đã được đọc từ Cookies lúc khởi tạo, 
         * nên ta chỉ cần persist 'user' để hiển thị UI (Tên, Ảnh).
         */
        partialize: (state) => ({
          user: state.user,
          accessToken: state.accessToken,
        }),

        /**
         * Xử lý sau khi Hydration xong
         */
        onRehydrateStorage: () => (state) => {
          state?.setHasHydrated(true);
        },
      }
    )
  )
);