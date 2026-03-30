// src/app/error.tsx
'use client';

import { GlobalErrorView } from "@/components/common/Errors/GlobalErrorView";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  // 💡 Mượn xác hoàn hồn: Gọi giao diện từ kho Components
  return <GlobalErrorView error={error} reset={reset} />;
}