// src/components/ui/sidebar/SidebarItem.tsx
'use client';
import { cn } from "@/lib/utils/utils";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { sidebarItemVariants } from "./sidebar.variants";

interface SidebarItemProps {
  href: string;
  label: string;
  icon: React.ReactNode;
}

export default function SidebarItem({ href, label, icon }: SidebarItemProps) {
  const pathname = usePathname();
  // 💡 Tự động kiểm tra trạng thái Active
  const isActive = pathname === href || (href !== '/' && pathname.startsWith(href));

  return (
    <Link 
      href={href} 
      className={cn(sidebarItemVariants({ status: isActive ? 'active' : 'inactive' }))}
    >
      <span className={cn(
        "transition-colors",
        isActive ? "text-emerald-500" : "text-slate-500 group-hover:text-emerald-400"
      )}>
        {icon}
      </span>
      <span>{label}</span>
      
      {/* 💡 Indicator: Thanh nhỏ bên cạnh khi active cho sang */}
      {isActive && (
        <div className="ml-auto w-1 h-5 bg-emerald-500 rounded-full shadow-[0_0_8px_rgba(16,185,129,0.6)]" />
      )}
    </Link>
  );
}