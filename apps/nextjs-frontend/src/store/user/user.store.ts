import { create } from "zustand";
import {
  persist,
  createJSONStorage,
  subscribeWithSelector,
} from "zustand/middleware";
import { jwtDecode } from "jwt-decode";
import { User } from "@/types/user.type";
import { authService } from "@/services/auth/auth.service"; // Lớp API Service
import { authCookie } from "@/services/auth/auth.helper";

/**
 * @description Cấu trúc dữ liệu mã hóa trong JWT (JWT Payload Structure)
 */
interface JwtPayload {
  userId: string;
  roles: string[];
  permissions: string[];
  iat: number;
  exp: number;
}

interface UserState {
  user: User | null;
  accessToken: string | null;
  refreshToken: string | null;
  permissions: string[];
  _hasHydrated: boolean; // Kiểm tra trạng thái đồng bộ hóa (Hydration state)

  // Actions (Hành động)
  setAuth: (user: User | null, access: string, refresh: string | null) => void;
  setTokens: (access: string, refresh: string | null) => void;
  setUser: (user: User | null) => void;
  setHasHydrated: (state: boolean) => void;
  clearLocalAuth: () => void;
  logout: () => Promise<void>;
}

const getPermissions = (token: string | null): string[] => {
  if (!token) return [];
  try {
    return jwtDecode<JwtPayload>(token).permissions || [];
  } catch {
    return [];
  }
};

export const useUserStore = create<UserState>()(
  subscribeWithSelector(
    persist(
      (set, get) => ({
        // --- INITIAL STATE ---
        user: null,
        accessToken: authCookie.getAccess() || null,
        refreshToken: authCookie.getRefresh() || null,
        permissions: getPermissions(authCookie.getAccess() || null),
        _hasHydrated: false,

        // --- ACTIONS ---

        setAuth: (user, access, refresh) => {
          authCookie.set(access, refresh);
          set({
            user,
            accessToken: access,
            refreshToken: refresh,
            permissions: getPermissions(access),
          });
        },

        setTokens: (access, refresh) => {
          authCookie.set(access, refresh);
          set({
            accessToken: access,
            refreshToken: refresh,
            permissions: getPermissions(access),
          });
        },

        setUser: (user) => set({ user }),

        setHasHydrated: (state) => set({ _hasHydrated: state }),

        /**
         * @description Dọn dẹp dữ liệu tại máy cục bộ (Local Cleanup)
         */
        clearLocalAuth: () => {
          authCookie.clear();
          set({
            user: null,
            accessToken: null,
            refreshToken: null,
            permissions: [],
          });
          useUserStore.persist.clearStorage();
        },

        /**
         * @description Đăng xuất hoàn toàn (Full Logout)
         * Luồng xử lý: Lấy Token -> Gọi API -> Dọn dẹp Local
         */
        logout: async () => {
          // 1. LẤY TOKEN HIỆN TẠI TRƯỚC (Capture token first)
          // Phải lấy trước khi clearLocalAuth chạy
          const token = get().accessToken;

          // 2. GỌI API LOGOUT (Call API)
          // Truyền token trực tiếp để đảm bảo API này luôn có "vé" để gửi đi
          const logoutPromise = authService.logout(token ?? undefined);

          // 3. DỌN DẸP LOCAL (Immediate Local Cleanup)
          // Thực hiện ngay để bảo mật và UI phản hồi nhanh
          get().clearLocalAuth();

          // 4. THÔNG BÁO CHO CÁC TAB KHÁC (Cross-tab broadcast)
          localStorage.setItem("logout-event", Date.now().toString());
          await logoutPromise;
        },
      }),
      {
        name: "user-storage",
        storage: createJSONStorage(() => localStorage),
        // Chỉ lưu thông tin User và Token cần thiết (Partial persistence)
        partialize: (state) => ({
          user: state.user,
          accessToken: state.accessToken,
          refreshToken: state.refreshToken,
        }),
        onRehydrateStorage: () => (state) => {
          state?.setHasHydrated(true);
        },
      },
    ),
  ),
);
