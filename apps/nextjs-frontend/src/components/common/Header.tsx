'use client'; // Có tương tác (Hooks, Events) nên phải dùng 'use client'

import { useRouter } from 'next/navigation'; // Bộ điều hướng

export default function Header() {
  const router = useRouter();

  // Hàm xử lý Đăng xuất (Logout Handler)
  const handleLogout = () => {
    // 1. Xóa Token (Vé thông hành) khỏi bộ nhớ trình duyệt
    localStorage.removeItem('accessToken');
    
    // 2. Điều hướng về trang Đăng nhập
    router.push('/login');
  };

  return (
    <header className="h-20 bg-white border-b border-gray-100 flex items-center justify-between px-8 shadow-sm z-10">
      {/* Tiêu đề trang hiện tại */}
      <div>
        <h2 className="text-xl font-bold text-gray-800">Bảng điều khiển</h2>
        <p className="text-sm text-gray-500">Chào mừng bạn trở lại, hệ thống hoạt động bình thường.</p>
      </div>

      {/* Khu vực thông tin người dùng & Đăng xuất */}
      <div className="flex items-center gap-6">
        {/* Nút Đăng xuất (Logout Button) */}
        <button 
          onClick={handleLogout}
          className="flex items-center gap-2 px-4 py-2 rounded-xl text-gray-600 hover:text-rose-600 hover:bg-rose-50 transition-all font-medium"
        >
          <span className="hidden sm:inline">Đăng xuất</span>
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
          </svg>
        </button>

        {/* Avatar người dùng bo tròn (Avatar) */}
        <div className="w-10 h-10 rounded-full bg-emerald-100 border-2 border-emerald-500 flex items-center justify-center overflow-hidden">
          <span className="text-emerald-700 font-bold">TV</span>
        </div>
      </div>
    </header>
  );
}