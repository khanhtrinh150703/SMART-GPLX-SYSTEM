// src/components/ui/sidebar/Sidebar.tsx
"use client";

import React from "react";
import { X } from "lucide-react";
import { cn } from "@/lib/utils/utils";
import SidebarLogo from "../layouts/SideBar/SidebarLogo";
import { sidebarVariants } from "@/components/layouts/SideBar/sidebar.variants";
import { NAV_ITEMS } from "@/components/layouts/SideBar/sidebar.constants";
import SidebarItem from "../layouts/SideBar/SidebarItem";

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
  return (
    <>
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
          "fixed lg:relative top-0 left-0 h-full z-50 transition-all duration-300 ease-in-out flex flex-col shadow-2xl overflow-hidden",
          isOpen
            ? "translate-x-0 w-72"
            : "-translate-x-full lg:translate-x-0 w-0 lg:w-0",
          className,
        )}
      >
        <div className="flex items-center justify-between px-6 h-24 shrink-0 border-b border-white/5">
          <div className="w-full h-full flex items-center justify-center">
            <SidebarLogo />
          </div>

          <button
            onClick={() => setIsOpen(false)}
            className="p-2 text-slate-500 hover:text-white hover:bg-white/10 rounded-xl transition-all active:scale-95 lg:hidden" // Trên PC thì nút này có thể ẩn nếu ông thích
          >
            <X size={20} />
          </button>
        </div>

        {/* Menu Items: Thêm opacity-0 khi đóng để không bị lỗi chữ đè */}
        <nav
          className={cn(
            "flex-1 px-4 py-6 space-y-2 overflow-y-auto custom-scrollbar transition-opacity duration-200",
            !isOpen && "opacity-0",
          )}
        >
          {NAV_ITEMS.map((item) => (
            <SidebarItem key={item.href} {...item} />
          ))}
        </nav>

        {/* Footer Info */}
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
