// src/middleware.ts
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// 1. Định nghĩa các đường dẫn cần bảo vệ (Private Routes)
const protectedRoutes = ['/dashboard', '/profile', '/exam'];
// 2. Định nghĩa các đường dẫn chỉ dành cho người chưa login (Public Routes)
const publicRoutes = ['/auth/login', '/auth/register', '/auth/verify-otp'];

export function middleware(request: NextRequest) {
  // Lấy token từ Cookie (BE thường dùng Header, FE thường dùng Cookie để Middleware đọc được)
  const token = request.cookies.get('session_token')?.value;
  const { pathname } = request.nextUrl;

  // Trường hợp 1: Truy cập trang bảo mật nhưng chưa có Token
  if (protectedRoutes.some(route => pathname.startsWith(route)) && !token) {
    // Redirect về trang login
    return NextResponse.redirect(new URL('/auth/login', request.url));
  }

  // Trường hợp 2: Đã login rồi nhưng lại cố vào trang Login/Register
  if (publicRoutes.some(route => pathname.startsWith(route)) && token) {
    // Redirect thẳng vào Dashboard
    return NextResponse.redirect(new URL('/dashboard', request.url));
  }

  // Cho phép đi tiếp nếu không vi phạm gì
  return NextResponse.next();
}

// 3. Cấu hình "Matcher" - Đây là phần quan trọng nhất để tối ưu hiệu năng
export const config = {
  /*
   * Match tất cả các đường dẫn trừ:
   * - api (các lời gọi API)
   * - _next/static (file tĩnh như CSS, JS)
   * - _next/image (ảnh tối ưu)
   * - favicon.ico (icon trang web)
   */
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
};