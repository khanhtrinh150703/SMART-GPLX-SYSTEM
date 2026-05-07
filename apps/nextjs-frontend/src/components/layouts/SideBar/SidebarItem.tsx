"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils/utils";
import { sidebarItemVariants } from "./sidebar.variants";

interface SidebarItemProps {
  href: string;
  title: string;
  icon: LucideIcon;
  className?: string;
}

export default function SidebarItem({
  href,
  title,
  icon: Icon,
  className,
}: SidebarItemProps) {
  const pathname = usePathname();
  const isActive = pathname === href;

  return (
    <Link
      href={href}
      className={cn(
        sidebarItemVariants({ status: isActive ? "active" : "inactive" }),
        className,
      )}
    >
      {/* 🧩 1. Background Glow (Lớp sáng mờ nằm sau - Trong suốt) */}
      {isActive && (
        <div
          className="absolute inset-0 bg-emerald-500/5 blur-2xl rounded-full -z-10 animate-in fade-in zoom-in duration-1000"
          aria-hidden="true"
        />
      )}

      {/* 🧩 2. Icon Section (Phần biểu tượng) */}
      <div
        className={cn(
          "relative flex items-center justify-center transition-all duration-500 ease-out",
          isActive
            ? "text-emerald-400 drop-shadow-[0_0_8px_rgba(52,211,153,0.5)]"
            : "group-hover:text-emerald-300",
        )}
      >
        <Icon size={22} strokeWidth={isActive ? 2 : 1.5} />
      </div>

      {/* 📝 3. Text Section (Phần chữ) */}
      <span
        className={cn(
          "text-[15px] tracking-wide transition-all duration-500",
          isActive ? "translate-x-1" : "group-hover:translate-x-2",
        )}
      >
        {title}
      </span>

      {/* 💡 4. Minimalist Indicator (Chỉ thị tối giản - Dạng điểm sáng) */}
      {isActive && (
        <div className="absolute left-2 w-1 h-1 bg-emerald-400 rounded-full shadow-[0_0_10px_#34d399]" />
      )}
    </Link>
  );
}
