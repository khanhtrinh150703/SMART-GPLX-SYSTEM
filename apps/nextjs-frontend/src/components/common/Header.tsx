'use client'; // Có tương tác (Hooks, Events) nên phải dùng 'use client'

import { useRouter } from 'next/navigation'; // Bộ điều hướng (Router)
import Link from 'next/link'; // Liên kết điều hướng của Next.js (Next.js Link)
import { useState } from 'react'; // Quản lý trạng thái (State Hook)

export default function Header() {
  const router = useRouter();
  
  // Quản lý trạng thái đang xử lý đăng xuất (Loading state for logout)
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  // Hàm xử lý Đăng xuất (Logout Handler)
  const handleLogout = async () => {
    try {
      // 1. Kích hoạt trạng thái loading: Bật vòng xoay và vô hiệu hóa nút
      setIsLoggingOut(true); 
      
      // 2. Xóa Token (Vé thông hành) khỏi bộ nhớ trình duyệt (Local Storage)
      localStorage.removeItem('accessToken');
      
      // 3. Điều hướng về trang Đăng nhập (Redirect to Login)
      router.push('/login');
    } catch (error) {
      console.error('Lỗi khi đăng xuất:', error);
      setIsLoggingOut(false); // Chỉ tắt loading nếu có lỗi, vì nếu thành công component sẽ bị unmount (gỡ bỏ)
    }
  };

  return (
    <header className="h-20 bg-white border-b border-gray-100 flex items-center justify-between px-8 shadow-sm z-10">
      {/* Tiêu đề trang hiện tại (Current Page Title) */}
      <div>
        <h2 className="text-xl font-bold text-gray-800">Bảng điều khiển</h2>
        <p className="text-sm text-gray-500">Chào mừng bạn trở lại, hệ thống hoạt động bình thường.</p>
      </div>

      {/* Khu vực thông tin người dùng & Đăng xuất (User Info & Logout Area) */}
      <div className="flex items-center gap-6">
        
        {/* Nút Đăng xuất (Logout Button) */}
        <button 
          onClick={handleLogout}
          disabled={isLoggingOut}
          className={`flex items-center gap-2 px-4 py-2 rounded-2xl text-gray-600 font-medium transition-all ${
            isLoggingOut 
              ? 'opacity-70 cursor-not-allowed bg-gray-50' 
              : 'hover:text-rose-600 hover:bg-rose-50'
          }`}
        >
          {isLoggingOut ? (
            // Vòng xoay (Spinner) hiển thị khi đang xử lý
            <svg className="animate-spin h-5 w-5 text-rose-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
          ) : (
            <>
              <span className="hidden sm:inline">Đăng xuất</span>
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
              </svg>
            </>
          )}
        </button>

        {/* Avatar người dùng (User Avatar) - Đã được bọc bằng Link */}
        <Link 
          href="/profile" 
          aria-label="Đi tới Hồ sơ cá nhân"
          className="w-10 h-10 rounded-full bg-emerald-100 border-2 border-emerald-500 flex items-center justify-center overflow-hidden transition-all hover:shadow-soft hover:ring-2 hover:ring-emerald-200"
        >
          <span className="text-emerald-700 font-bold">TV</span>
        </Link>
        
      </div>
    </header>
  );
}