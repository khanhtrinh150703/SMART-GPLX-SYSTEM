// src/components/common/Header.tsx
"use client";

import { useState } from "react";
import { LogOut, Menu, ChevronLeft } from "lucide-react"; 
import Button from "@/components/ui/Button/Button";
import { useUserStore } from "@/store/user/user.store";
import { cn } from "@/lib/utils/utils";
import Link from "next/link";

interface HeaderProps {
  isOpen: boolean; // 💡 Thêm cái này để Header biết Sidebar đang thế nào
  onToggleSidebar: () => void; // Đổi tên cho chuẩn logic toggle
}

export default function Header({ isOpen, onToggleSidebar }: HeaderProps) {
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const { user, logout } = useUserStore();

  const handleLogout = async () => {
    setIsLoggingOut(true);
    logout();
    window.location.replace("/login");
  };

  const userInitials = user?.fullName
    ? user.fullName.split(" ").pop()?.substring(0, 2).toUpperCase()
    : "TV";

  return (
    <header 
      className={cn(
        "h-20 bg-white border-b border-slate-100 flex items-center justify-between px-8 z-30 transition-all duration-300 ease-in-out",
        // 💡 Nếu Sidebar mở (72 = 288px), Header có thể cần lùi lại hoặc thay đổi margin
        // Nếu Header của bạn là 'fixed', bạn cần thêm: isOpen ? "pl-72" : "pl-0"
      )}
    >
      {/* 1. NHÓM TRÁI: Nút Toggle + Tiêu đề */}
      <div className="flex items-center gap-4">
        <button
          onClick={onToggleSidebar}
          className="p-2 -ml-2 text-slate-500 hover:text-emerald-600 hover:bg-emerald-50 rounded-xl transition-all active:scale-90"
        >
          {/* 💡 Thay đổi icon tùy theo trạng thái để UX "xịn" hơn */}
          {isOpen ? <ChevronLeft size={24} /> : <Menu size={24} />}
        </button>

        <div>
          <h2 className="text-xl font-black text-slate-800 tracking-tight">
            Bảng điều khiển
          </h2>
          <p className="text-xs text-slate-400 font-medium mt-0.5">
            Hệ thống hoạt động bình thường (System Stable)
          </p>
        </div>
      </div>

      {/* 2. User Actions */}
      <div className="flex items-center gap-5">
        <Button
          variant="ghost"
          size="md"
          onClick={handleLogout}
          isLoading={isLoggingOut}
          className="text-slate-500 hover:text-rose-600 hover:bg-rose-50 gap-2 font-bold"
        >
          <span className="hidden sm:inline text-sm">Đăng xuất</span>
          <LogOut className="w-4 h-4" />
        </Button>

        <Link href="/profile" className="group relative transition-transform active:scale-90">
          <div className="w-10 h-10 rounded-2xl bg-emerald-50 border-2 border-emerald-500 flex items-center justify-center overflow-hidden transition-all group-hover:shadow-[0_0_15px_rgba(16,185,129,0.3)]">
            <span className="text-emerald-700 font-black text-xs">{userInitials}</span>
          </div>
          <span className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-emerald-500 border-2 border-white rounded-full" />
        </Link>
      </div>
    </header>
  );
}