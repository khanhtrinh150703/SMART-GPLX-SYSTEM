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
        logout: async (): Promise<void> => {
          // 1. LẤY TOKEN HIỆN TẠI TRƯỚC (Capture current token)
          // Phải lấy trước khi tiến hành dọn dẹp bộ nhớ cục bộ
          const token = get().accessToken;

          // CƠ CHẾ PHÒNG VỆ SỚM (EARLY RETURN GUARD):
          // Nếu mã xác thực (Token) không tồn tại (đã bị xóa hoặc hết hạn),
          // dọn dẹp local, đồng bộ đa tab rồi thoát ngay, không gọi lên BE để tránh lỗi 401.
          if (!token) {
            get().clearLocalAuth(); // Dọn dẹp cục bộ (Local cleanup)
            localStorage.setItem("logout-event", Date.now().toString()); // Đồng bộ đa tab (Multi-tab synchronization)
            return; // Thoát hàm sớm (Exit function early)
          }

          // 2. GỌI API LOGOUT (Call logout API)
          // Lúc này chắc chắn token hợp lệ tồn tại để gửi đi (Guaranteed token delivery)
          const logoutPromise = authService.logout(token);

          // 3. DỌN DẸP LOCAL LẬP TỨC (Immediate local cleanup)
          // Thực hiện ngay để bảo mật và tối ưu hóa trải nghiệm người dùng (UX optimization)
          get().clearLocalAuth();

          // 4. THÔNG BÁO CHO CÁC TAB KHÁC (Cross-tab broadcast event)
          localStorage.setItem("logout-event", Date.now().toString());

          try {
            // Đợi phản hồi kết quả từ máy chủ Backend (Await backend response)
            await logoutPromise;
          } catch (error: unknown) {
            // Tuyệt đối không ném lỗi ra ngoài làm gián đoạn luồng trải nghiệm đăng xuất của UI
            console.warn(
              "[Auth Store Warning] Tiến trình xóa phiên phía Backend trả về lỗi:",
              error,
            );
          }
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
