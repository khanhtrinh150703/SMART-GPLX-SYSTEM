"use client";

import React, { useMemo } from "react";
import { X } from "lucide-react";
import { cn } from "@/lib/utils/utils";
import SidebarLogo from "../layouts/SideBar/SidebarLogo";
import SidebarItem from "../layouts/SideBar/SidebarItem";
import { sidebarVariants } from "@/components/layouts/SideBar/sidebar.variants";
import { NAV_ITEMS } from "@/components/layouts/SideBar/sidebar.constants";
import { useUserStore } from "@/store/user/user.store"; // 👈 Lấy trực tiếp từ Store cho chuẩn

interface SidebarProps {
  className?: string;
  isOpen: boolean;
  setIsOpen: (val: boolean) => void;
}

export default function Sidebar({
  className,
  isOpen,
  setIsOpen,
}: SidebarProps) {
  const _hasHydrated = useUserStore((state) => state._hasHydrated);
  const { permissions } = useUserStore();

  const filteredNavItems = useMemo(() => {
    return NAV_ITEMS.filter((item) => {
      // ✅ TRƯỜNG HỢP 1: Menu công khai (Dashboard, Hồ sơ...)
      // Nếu không yêu cầu quyền cụ thể, cho hiện luôn
      if (!item.requiredPermission) return true;

      // ✅ TRƯỜNG HỢP 2: Quyền tối thượng (Super Admin)
      // Nếu User có vé "admin:all", mở khóa tất cả menu không cần check thêm
      if (permissions.includes("admin:all")) return true;

      // ✅ TRƯỜNG HỢP 3: Check "vé" cụ thể
      // Kiểm tra xem mã quyền yêu cầu của Menu có nằm trong túi của User không
      return permissions.includes(item.requiredPermission);
    });
  }, [permissions]); // 🚀 Chỉ tính toán lại khi bộ quyền trong Store thay đổi

  if (!_hasHydrated) {
    return <aside className="... animate-pulse bg-slate-100" />;
  }
  return (
    <>
      {/* Overlay - Giữ nguyên logic đóng mở */}
      <div
        className={cn(
          "fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-40 transition-all duration-300 lg:hidden",
          isOpen ? "opacity-100 visible" : "opacity-0 invisible",
        )}
        onClick={() => setIsOpen(false)}
      />

      <aside
        className={cn(
          sidebarVariants({ theme: "dark" }),
          "fixed lg:relative top-0 left-0 h-full z-50 transition-all duration-300 ease-in-out flex flex-col",
          "overflow-hidden",
          isOpen
            ? "translate-x-0 w-72"
            : "-translate-x-full lg:translate-x-0 w-0 lg:w-0",
          className,
        )}
      >
        {/* Header - Logo */}
        <div className="flex items-center justify-between px-6 h-24 shrink-0 border-b border-white/5">
          <div className="w-full flex items-center justify-center">
            <SidebarLogo />
          </div>
          <button onClick={() => setIsOpen(false)} className="lg:hidden">
            <X size={20} className="text-slate-500" />
          </button>
        </div>

        {/* 🚀 NAV SECTION: Dùng danh sách đã được lọc logic ở trên */}
        <nav
          className={cn(
            "flex-1 px-4 py-6 space-y-2 overflow-y-auto transition-opacity",
            "custom-scrollbar",
            !isOpen && "opacity-0",
          )}
        >
          {filteredNavItems.map((item) => (
            <SidebarItem
              key={item.href}
              href={item.href}
              title={item.title} // Chú ý: Dùng title VN như NAV_ITEMS mới
              icon={item.icon}
            />
          ))}
        </nav>

        {/* Footer */}
        <div className={cn("p-4 transition-opacity", !isOpen && "opacity-0")}>
          <div className="bg-white/5 border border-white/10 rounded-2xl p-4 text-center">
            <p className="text-[10px] text-slate-500 font-black uppercase tracking-[0.2em]">
              Smart GPLX v1.0
            </p>
          </div>
        </div>
      </aside>
    </>
  );
}
