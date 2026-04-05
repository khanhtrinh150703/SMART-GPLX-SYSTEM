// src/components/common/Header.tsx
'use client';

import { useState } from 'react';
import { LogOut} from 'lucide-react'; // 💡 Dùng Lucide cho gọn
import Link from 'next/link';
import Button from '@/components/ui/Button/Button';
import { useUserStore } from '@/store/user/user.store';

export default function Header() {
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const { user, logout } = useUserStore(); // 💡 Lấy thông tin user và hàm reset từ Store

  // Hàm xử lý Đăng xuất (Logout Handler)
  const handleLogout = async () => {
    setIsLoggingOut(true);
    // 💡 Xóa sạch cả RAM (Zustand) và Disk (LocalStorage)
    logout(); 
    // Dùng replace để xóa lịch sử điều hướng, không cho "Back" lại Dashboard
    window.location.replace('/login'); 
  };

  // Lấy chữ cái đầu (Get Initials)
  const userInitials = user?.fullName 
    ? user.fullName.split(' ').pop()?.substring(0, 2).toUpperCase() 
    : 'TV';

  return (
    <header className="h-20 bg-white border-b border-slate-100 flex items-center justify-between px-8 z-10">
      {/* 1. Page Title (Tiêu đề trang hiện tại) */}
      <div className="animate-in fade-in slide-in-from-left-4 duration-500">
        <h2 className="text-xl font-black text-slate-800 tracking-tight">
          Bảng điều khiển
        </h2>
        <p className="text-xs text-slate-400 font-medium mt-0.5">
          Hệ thống hoạt động bình thường (System Stable)
        </p>
      </div>

      {/* 2. User Actions (Khu vực tương tác) */}
      <div className="flex items-center gap-5">
        
        {/* Nút Đăng xuất dùng Component Button đã tối ưu */}
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

        {/* 3. Avatar: Bo góc 2xl cho đồng bộ với Badge */}
        <Link 
          href="/profile" 
          className="group relative transition-transform active:scale-90"
        >
          <div className="w-10 h-10 rounded-2xl bg-emerald-50 border-2 border-emerald-500 flex items-center justify-center overflow-hidden transition-all group-hover:shadow-[0_0_15px_rgba(16,185,129,0.3)]">
             <span className="text-emerald-700 font-black text-xs">
               {userInitials}
             </span>
          </div>
          {/* Chấm Online màu xanh Emerald */}
          <span className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-emerald-500 border-2 border-white rounded-full" />
        </Link>
        
      </div>
    </header>
  );
}