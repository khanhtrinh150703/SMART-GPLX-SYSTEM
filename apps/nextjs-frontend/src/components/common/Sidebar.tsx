"use client";

import React, { useMemo } from "react";
import { X } from "lucide-react";
import { cn } from "@/lib/utils/utils";
import { sidebarVariants } from "@/components/layouts/SideBar/sidebar.variants";
import { NAV_ITEMS } from "@/components/layouts/SideBar/sidebar.constants";
import { useUserStore } from "@/store/user/user.store"; 
import SidebarItem from "../layouts/SideBar/SidebarItem";
import SidebarLogo from "../layouts/SideBar/SidebarLogo";

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
  // 1. Lấy thông tin từ User Store
  const { accessToken, permissions, _hasHydrated } = useUserStore();

  // 2. Xác định trạng thái đăng nhập (Authentication Check)
  const isAuthenticated = !!accessToken && accessToken !== "undefined";

  // 3. Logic lọc Menu theo quyền (Permission Filtering)
  const filteredNavItems = useMemo(() => {
    if (!isAuthenticated) return []; // Nếu không đăng nhập, không trả về item nào

    return NAV_ITEMS.filter((item) => {
      if (!item.requiredPermission) return true;
      if (permissions.includes("admin:all")) return true;
      return permissions.includes(item.requiredPermission);
    });
  }, [permissions, isAuthenticated]);

  /**
   * 🚀 LUỒNG XỬ LÝ ĐẶC BIỆT (Special Handling):
   * 1. Hydration Guard: Đợi Zustand tải xong dữ liệu từ LocalStorage.
   * 2. Auth Guard: Nếu không có Token, biến Sidebar thành "vô hình" (return null).
   */
  if (!_hasHydrated) {
    return <aside className="fixed left-0 top-0 h-full w-72 animate-pulse bg-slate-100 z-50" />;
  }

  if (!isAuthenticated) {
    return null; // Không render Sidebar nếu không có Token (Close/Hide Sidebar)
  }

  return (
    <>
      {/* Overlay: Chỉ hiện trên Mobile khi Sidebar mở */}
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
        {/* Header - Logo Section */}
        <div className="flex items-center justify-between px-6 h-24 shrink-0 border-b border-white/5">
          <div className="w-full flex items-center justify-center">
            <SidebarLogo />
          </div>
          <button onClick={() => setIsOpen(false)} className="lg:hidden">
            <X size={20} className="text-slate-500" />
          </button>
        </div>

        {/* Navigation Section */}
        <nav
          className={cn(
            "flex-1 px-4 py-6 space-y-2 overflow-y-auto transition-opacity custom-scrollbar",
            !isOpen && "opacity-0",
          )}
        >
          {filteredNavItems.map((item) => (
            <SidebarItem
              key={item.href}
              href={item.href}
              title={item.title}
              icon={item.icon}
            />
          ))}
        </nav>

        {/* Footer Section */}
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