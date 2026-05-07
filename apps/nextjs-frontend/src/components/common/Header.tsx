"use client";

import { useEffect, useState } from "react";
import { LogOut, Menu, ChevronLeft, Play, LogIn } from "lucide-react";
import Button from "@/components/ui/Button/Button";
import { useUserStore } from "@/store/user/user.store";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import ActionMotion from "../ui/ActionMotion/ActionMotion";

export default function Header({
  isOpen,
  onToggleSidebar,
}: {
  isOpen: boolean;
  onToggleSidebar: () => void;
}) {
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const [loading, setLoading] = useState(false);

  // 1. Lấy thêm cờ _hasHydrated từ Store
  const { user, logout, accessToken, _hasHydrated } = useUserStore();
  const router = useRouter();
  const pathname = usePathname();

  const isAuthenticated = !!accessToken && accessToken !== "undefined";

  useEffect(() => {
    const timer = setTimeout(() => {
      if (isLoggingOut) setIsLoggingOut(false);
    }, 0);
    return () => clearTimeout(timer);
  }, [pathname, isLoggingOut]);

  const handleStartExam = () => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      router.push("/take-exam");
    }, 500);
  };

  if (!_hasHydrated) {
    return (
      <header className="h-16 md:h-20 bg-white border-b border-slate-100 flex items-center justify-between px-4 md:px-8 animate-pulse">
        <div className="w-8 h-8 bg-slate-100 rounded-lg" />{" "}
        {/* Placeholder cho Menu button */}
        <div className="w-32 h-8 bg-slate-100 rounded-xl" />{" "}
        {/* Placeholder cho Action button */}
      </header>
    );
  }

  return (
    <header className="h-16 md:h-20 bg-white border-b border-slate-100 flex items-center justify-between px-4 md:px-8 z-30 transition-all duration-300">
      {/* --- TRÁI: SIDEBAR TOGGLE & TITLE --- */}
      <div className="flex items-center gap-2 md:gap-4 overflow-hidden shrink-0">
        <button
          onClick={onToggleSidebar}
          className="p-1.5 text-slate-500 hover:text-emerald-600 transition-all shrink-0"
        >
          {isOpen ? (
            <ChevronLeft className="w-5 h-5 md:w-6 md:h-6" />
          ) : (
            <Menu className="w-5 h-5 md:w-6 md:h-6" />
          )}
        </button>

        <div className="flex flex-col justify-center min-w-0 hidden md:block">
          <h2 className="text-xl font-black text-slate-800 tracking-tight">
            Bảng điều khiển
          </h2>
          <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">
            System Stable
          </p>
        </div>
      </div>

      {/* --- PHẢI: ACTIONS --- */}
      <div className="flex items-center gap-3 md:gap-6 shrink-0">
        {/* Nút Thi Thử - Giữ nguyên cho cả Guest và User */}
        <div className="shrink-0">
          <ActionMotion
            label="Thi thử"
            isLoading={loading}
            onClick={handleStartExam}
            variant="emerald"
            icon={<Play className="w-4 h-4 md:w-5 md:h-5 fill-current" />}
            className="text-[11px] px-4 py-2 md:text-sm md:px-6 md:py-2.5 !w-auto"
          />
        </div>

        <div className="hidden sm:block w-[1px] h-6 md:h-8 bg-slate-100" />

        {/* --- NHÓM USER/GUEST ACTIONS --- */}
        <div className="flex items-center gap-1.5 md:gap-3">
          {isAuthenticated ? (
            /* TRẠNG THÁI: ĐÃ ĐĂNG NHẬP (Authenticated State) */
            <>
              <Button
                variant="ghost_danger"
                size="sm"
                onClick={async () => {
                  try {
                    setIsLoggingOut(true);
                    await logout();
                    window.location.replace("/login");
                  } catch (error) {
                    console.error("Lỗi đăng xuất:", error);
                    setIsLoggingOut(false);
                  }
                }}
                isLoading={isLoggingOut}
                className="font-bold text-slate-400 hover:text-rose-600 px-2.5 lg:px-4"
              >
                <span className="hidden lg:inline mr-2">Đăng xuất</span>
                <LogOut className="w-3.5 h-3.5 md:w-4 md:h-4" />
              </Button>

              {/* Avatar chỉ hiện khi đã đăng nhập */}
              <Link
                href="/profile"
                className="w-8 h-8 md:w-10 md:h-10 shrink-0 rounded-xl md:rounded-2xl bg-emerald-50 border-2 border-emerald-500 flex items-center justify-center transition-transform active:scale-90 shadow-sm"
              >
                <span className="text-emerald-700 font-black text-[10px] md:text-xs">
                  {user?.fullName
                    ?.split(" ")
                    .pop()
                    ?.substring(0, 2)
                    .toUpperCase() || "TV"}
                </span>
              </Link>
            </>
          ) : (
            /* TRẠNG THÁI: CHƯA ĐĂNG NHẬP (Guest State) */
            <Button
              variant="outline"
              size="sm"
              onClick={() => router.push("/login")}
              className="font-bold text-emerald-600 border-emerald-200 hover:bg-emerald-50 px-4 md:px-6 rounded-xl md:rounded-2xl flex items-center gap-2"
            >
              <span>Đăng nhập</span>
              <LogIn className="w-4 h-4" />
            </Button>
          )}
        </div>
      </div>
    </header>
  );
}
