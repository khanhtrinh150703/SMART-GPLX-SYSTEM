'use client'; // BẮT BUỘC: Để nhận hàm reset() từ Next.js

import { useEffect } from 'react';
import { GlobalErrorView } from '@/components/common/Errors/GlobalErrorView';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("Critical System Error:", error);
  }, [error]);

  return <GlobalErrorView error={error} reset={reset} />;
}