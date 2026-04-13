"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function BFCacheHandler() {
  const router = useRouter();

  useEffect(() => {
    const handlePageShow = (event: PageTransitionEvent) => {
      // 💡 Nếu trang được lấy từ bộ nhớ đệm (Back/Forward)
      if (event.persisted) {
        // Cách 1: Cực đoan nhưng hiệu quả 100% (Giống hệt ấn F5)
        window.location.reload();
        
        // Cách 2: Nếu muốn mượt hơn (Chỉ dùng cho Next.js App Router)
        // router.refresh(); 
      }
    };

    window.addEventListener("pageshow", handlePageShow);
    
    // Thêm một chốt chặn cho các trình duyệt đời cũ
    window.addEventListener("popstate", () => {
       // Kiểm tra nếu thấy content trống thì ép load lại
       const mainContent = document.querySelector('main');
       if (mainContent && mainContent.innerHTML === "") {
           window.location.reload();
       }
    });

    return () => {
      window.removeEventListener("pageshow", handlePageShow);
    };
  }, [router]);

  return null;
}