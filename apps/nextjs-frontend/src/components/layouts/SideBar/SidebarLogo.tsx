// src/components/layouts/SideBar/SidebarLogo.tsx
import Link from "next/link";
import { cn } from "@/lib/utils/utils";

export default function SidebarLogo({ className }: { className?: string }) {
  return (
    <Link 
      href="/overview" 
      // SỬA LẠI: Tự căn giữa nội dung bên trong, dọn sạch outline/khung
      className={cn(
        "flex items-center justify-center outline-none group transition-all",
        className
      )}
    >
      <h1 className="text-xl font-black text-white tracking-tighter">
        Smart<span className="text-emerald-500">GPLX</span>
      </h1>
    </Link>
  );
}