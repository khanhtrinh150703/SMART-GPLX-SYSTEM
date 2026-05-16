"use client";

import { useEffect, useState } from "react";
import { createPortal } from "react-dom";

interface PortalProps {
  children: React.ReactNode;
}

/**
 * Portal - Thành phần đưa nội dung ra ngoài root DOM
 * Giúp tránh các lỗi overflow/z-index của CSS
 */
export const Portal = ({ children }: PortalProps) => {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const raf = requestAnimationFrame(() => {
      setMounted(true);
    });
    return () => cancelAnimationFrame(raf);
  }, []);

  // Chỉ render trên client (tránh lỗi Hydration của Next.js)
  return mounted ? createPortal(children, document.body) : null;
};
