import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

// Định nghĩa kiểu dữ liệu cho User (User Type)
interface User {
  id: string;
  email: string;
  username: string;
  fullName: string;
  urlPicture: string;
  status: string;
  roles: Array<{ id: string; name: string; displayName: string }>;
}

interface UserState {
  user: User | null;
  setUser: (user: User) => void;
  clearUser: () => void;
}

export const useUserStore = create<UserState>()(
  persist(
    (set) => ({
      user: null,
      setUser: (user) => set({ user }),
      clearUser: () => set({ user: null }),
    }),
    {
      name: 'user-storage', // Tên key trong localStorage
      storage: createJSONStorage(() => localStorage),
    }
  )
);