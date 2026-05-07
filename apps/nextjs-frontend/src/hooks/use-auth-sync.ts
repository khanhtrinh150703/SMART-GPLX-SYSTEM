"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useUserStore } from "@/store/user/user.store";

/**
 * Hook: Đồng bộ trạng thái xác thực liên Tab (Cross-tab Auth Synchronization)
 * Xử lý Hydration check và lắng nghe sự thay đổi của bộ nhớ cục bộ (Storage Event).
 */
export const useAuthSync = () => {
  const router = useRouter();
  const accessToken = useUserStore((state) => state.accessToken);
  const setAuth = useUserStore((state) => state.setAuth);

  useEffect(() => {
    // 1. Kiểm tra Hydration ngay khi Mount (Component được gắn vào DOM)
    if (accessToken && accessToken !== "undefined" && accessToken !== "null") {
      router.replace("/overview");
    }

    // 2. Lắng nghe thay đổi từ các Tab khác (Cross-tab Event Listener)
    const handleStorageChange = (event: StorageEvent) => {
      if (event.key === "user-storage") { // Tên key của Zustand persist
        try {
          const newValue = event.newValue;
          if (!newValue) return;

          const parsed = JSON.parse(newValue);
          const stateData = parsed.state;

          // Nếu Tab khác vừa đăng nhập thành công
          if (stateData?.accessToken && stateData.accessToken !== "undefined") {
            setAuth(stateData.user, stateData.accessToken, stateData.refreshToken);
            router.replace("/overview");
          }
        } catch (error) {
          console.error("Lỗi phân tích dữ liệu đồng bộ (Storage parsing error):", error);
        }
      }
    };

    window.addEventListener("storage", handleStorageChange);
    return () => window.removeEventListener("storage", handleStorageChange);
  }, [accessToken, router, setAuth]);
};