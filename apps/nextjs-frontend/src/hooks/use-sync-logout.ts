"use client";

import { useEffect } from "react";
import { useUserStore } from "@/store/user/user.store";
import { useRouter } from "next/navigation";

export const useSyncLogout = () => {
  const logout = useUserStore((state) => state.logout);
  const router = useRouter();

  useEffect(() => {
    const handleStorageChange = (event: StorageEvent) => {
      // Nếu thấy key 'logout-event' thay đổi ở Tab khác
      if (event.key === "logout-event") {
        console.log("Phát hiện lệnh Logout từ Tab khác. Đang thoát...");
        
        // Reset state của tab hiện tại
        useUserStore.setState({ user: null, accessToken: null, refreshToken: null });
        
        // Đẩy về trang Login
        router.push("/login");
        router.refresh();
      }
    };

    window.addEventListener("storage", handleStorageChange);
    return () => window.removeEventListener("storage", handleStorageChange);
  }, [logout, router]);
};