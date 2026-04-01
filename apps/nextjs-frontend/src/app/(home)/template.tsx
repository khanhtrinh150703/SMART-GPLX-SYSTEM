"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";

export default function HomeTemplate({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  useEffect(() => {
    // 1. Đưa về đầu trang
    window.scrollTo(0, 0);
    
    // 2. Kích hoạt sự kiện scroll để "đánh thức" toàn bộ thư viện animation
    const trigger = () => {
      window.dispatchEvent(new Event("scroll"));
      // Nếu có dùng Lenis, hãy thêm lenis.resize() ở đây nếu ông có instance
    };

    const timer = setTimeout(trigger, 200);
    return () => clearTimeout(timer);
  }, [pathname]);

  return <>{children}</>;
}