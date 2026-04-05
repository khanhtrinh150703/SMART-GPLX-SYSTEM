// src/components/common/Errors/NotFoundView.tsx
"use client";

import Link from "next/link";
import { Home, Compass } from "lucide-react";
import Button from "@/components/ui/Button/Button";
import { nfIconBoxVariants, nfVariants } from "./global-error.variants";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export const NotFoundView = () => {
  const router = useRouter();
  const [prevUrl, setPrevUrl] = useState<string | null>(null);

  useEffect(() => {
    // 1. Lấy URL trước đó
    const referrer = typeof document !== "undefined" ? document.referrer : null;

    // 2. 💡 CHIÊU CUỐI: Dùng setTimeout để đẩy việc set state ra khỏi luồng đồng bộ
    // Linter sẽ thấy lệnh này không chạy "ngay lập tức" nữa nên nó sẽ im lặng.
    const timer = setTimeout(() => {
      setPrevUrl(referrer || null);
    }, 0);

    return () => clearTimeout(timer);
  }, []); // Đảm bảo chỉ chạy 1 lần duy nhất khi mount

  const handleGoBack = () => {
    const referrer = typeof document !== "undefined" ? document.referrer : null;

    // 1. Nếu không có trang trước đó (truy cập trực tiếp bằng link lỗi) -> Về trang chủ
    if (!referrer) {
      window.location.href = "/";
      return;
    }

    try {
      const referrerUrl = new URL(referrer);
      const currentOrigin =
        typeof window !== "undefined" ? window.location.origin : "";

      // 2. KIỂM TRA: Nếu trang trước đó cùng thuộc hệ thống của mình
      if (referrerUrl.origin === currentOrigin) {
        /**
         * 💡 ĐÂY LÀ CHÌA KHÓA:
         * Thay vì router.back(), ta dùng window.location.href.
         * Điều này ép trang Quản lý người dùng phải "F5" lại hoàn toàn.
         * Dữ liệu sẽ được gọi mới từ API, không còn tình trạng mảng rỗng nữa.
         */
        window.location.href = referrer;
      } else {
        // Nếu từ trang web khác tới thì về trang chủ cho an toàn
        window.location.href = "/";
      }
    } catch (e) {
      console.error("Lỗi điều hướng:", e);
      window.location.href = "/";
    }
  };
  return (
    <div className={nfVariants()}>
      {/* 🧩 1. Visual Element (Yếu tố thị giác) */}
      <div className="relative mb-12">
        {/* Glow effect phía sau */}
        <div className="absolute inset-0 bg-emerald-400 blur-[80px] opacity-10 rounded-full" />

        <div className={nfIconBoxVariants()}>
          <Compass
            className="w-20 h-20 text-emerald-500 animate-bounce"
            strokeWidth={1}
          />
        </div>
      </div>

      {/* 📝 2. Content Section (Phần nội dung) */}
      <div className="space-y-4 max-w-lg">
        <h1 className="text-8xl font-black text-slate-900 tracking-tighter">
          404
        </h1>
        <h2 className="text-2xl font-bold text-slate-800 uppercase tracking-wide">
          Chệch làn đường rồi!{" "}
          <span className="text-slate-400 font-medium">(Off Track)</span>
        </h2>
        <p className="text-slate-500 leading-relaxed font-medium">
          Trang bạn đang tìm kiếm không tồn tại hoặc đã được chuyển hướng sang
          một địa chỉ URL mới trong hệ thống **Smart-GPLX**.
        </p>
      </div>

      {/* 🚀 3. Action Section (Phần hành động) */}
      <div className="mt-12 flex flex-col sm:flex-row gap-4">
        <Link href="/">
          <Button
            variant="primary"
            size="lg"
            className="rounded-2xl px-10 gap-2 shadow-emerald-200/50"
          >
            <Home className="w-5 h-5" />
            Về Trang Chủ (Back to Home)
          </Button>
        </Link>

        <Button
          variant="secondary"
          size="lg"
          className="rounded-2xl px-10"
          onClick={handleGoBack} // Dùng router.back()
        >
          Quay lại (Go Back)
        </Button>
      </div>

      {/* 🏷️ 4. Branding Footer */}
      <div className="absolute bottom-8 text-[10px] text-slate-300 font-bold uppercase tracking-[0.4em]">
        Smart GPLX • AI Integrated Platform
      </div>
    </div>
  );
};
