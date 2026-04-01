import { User } from '@/types/user.type';
import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

interface UserState {
    user: User | null;
    accessToken: string | null;
    // Actions (Hành động)
    setUser: (user: User | null) => void;
    setToken: (token: string | null) => void;
    clear: () => void;
    logout: () => void;
}

/** * User Store: Quản lý trạng thái người dùng toàn cục.
 * Sử dụng Persist Middleware để tự động lưu vào LocalStorage.
 */
export const useUserStore = create<UserState>()(
    persist(
        (set) => ({
            user: null,
            accessToken: null,

            setUser: (user) => set({ user }),
            setToken: (accessToken) => set({ accessToken }),

            // 💡 Hàm clear dùng để reset state trong RAM
            clear: () => {
                // 1. Reset RAM về null
                set({ user: null, accessToken: null });
                // 2. Ép Zustand xóa sạch LocalStorage ngay lập tức
                useUserStore.persist.clearStorage();
                // 3. Cẩn thận hơn: Xóa thủ công lần nữa
                localStorage.removeItem('user-storage');
            },

            // 💡 Hàm logout dùng để "quét sạch" cả RAM và LocalStorage
            logout: () => {
                set({ user: null, accessToken: null });
                useUserStore.persist.clearStorage();
            },
        }),
        {
            name: 'user-storage',
            storage: createJSONStorage(() => localStorage),
        }
    )
);