'use client';

import { useEffect } from 'react';
import Button from '@/src/components/ui/Button';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log lỗi ra các dịch vụ như Sentry hoặc console của BE
    console.error("Tracing Error:", error);
  }, [error]);

  return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center text-center px-4">
      {/* Icon minh họa lỗi - Tối giản */}
      <div className="w-20 h-20 bg-red-50 rounded-full flex items-center justify-center mb-6">
        <svg className="w-10 h-10 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
        </svg>
      </div>

      <h2 className="text-2xl font-bold text-gray-900 mb-2">Có lỗi hệ thống xảy ra</h2>
      <p className="text-gray-500 max-w-sm mb-8">
        Hệ thống Smart-GPLX đang gặp một chút trục trặc kỹ thuật. Đừng lo lắng, dữ liệu của bạn vẫn an toàn.
      </p>

      <div className="flex gap-4">
        <Button 
          text="Thử lại" 
          onClick={() => reset()} // Hàm reset() của Next.js giúp render lại component bị lỗi
          className="bg-gray-900 text-white px-8"
        />
        <Button 
          text="Về trang chủ" 
        //   variant="outline" // Giả sử bạn có thêm prop variant
          onClick={() => window.location.href = '/'}
          className="border border-gray-200 text-gray-600"
        />
      </div>
    </div>
  );
}