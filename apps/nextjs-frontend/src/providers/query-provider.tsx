"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useState } from "react";

export default function QueryProvider({ children }: { children: React.ReactNode }) {
  // Điều này đảm bảo QueryClient không bao giờ bị tạo lại (Singleton)
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            staleTime: 0, // Coi dữ liệu luôn cũ (Stale) để sẵn sàng tải lại
            gcTime: 1000 * 60 * 60, // Thời gian dọn rác (Garbage collection) là 1 giờ
            refetchOnWindowFocus: true, // Tải lại khi quay lại tab (Window focus refetch)
          },
        },
      })
  );

  return (
    <QueryClientProvider client={queryClient}>
      {children}
    </QueryClientProvider>
  );
}