'use client';

import React from 'react'; // Bắt buộc import React để dùng React.use
import { ErrorFactory } from "@/components/common/Errors/ErrorFactory";

/**
 * ErrorPage Component
 * params: Đóng vai trò là một Promise chứa các tham số từ URL
 */
export default function ErrorPage({ 
  params 
}: { 
  params: Promise<{ code: string }> // Định nghĩa params là một Promise
}) {
  // 💡 Giải pháp: Sử dụng React.use() để giải nén Promise đồng bộ trong Client Component
  const { code } = React.use(params);

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-700">
      <ErrorFactory code={code} />
    </div>
  );
}