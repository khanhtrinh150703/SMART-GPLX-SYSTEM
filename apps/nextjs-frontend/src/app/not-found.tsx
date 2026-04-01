// src/app/not-found.tsx
"use client";

import { NotFoundView } from "@/components/common/Errors/NotFoundView";

export default function NotFound() {
  // 💡 Mượn xác hoàn hồn: Chỉ render giao diện từ kho chứa
  return <NotFoundView />;
}
