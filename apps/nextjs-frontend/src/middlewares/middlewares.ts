// src/middleware.ts
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// 1. Chỉ quản lý danh sách các trang KHÔNG cần đăng nhập
// Mọi trang không nằm trong đây sẽ mặc định là Private (Riêng tư)
const publicRoutes = ['/auth', '/about', '/contact', '/take-exam'];

export function middleware(request: NextRequest) {
  const token = request.cookies.get('session_token')?.value;
  const { pathname } = request.nextUrl;

  // Kiểm tra xem pathname hiện tại có thuộc danh sách công khai không
  const isPublicRoute = publicRoutes.some(route => 
    pathname === route || pathname.startsWith(`${route}/`)
  );

  /**
   * TRƯỜNG HỢP 1: TRUY CẬP TRANG RIÊNG TƯ (PRIVATE)
   * Nếu không phải public và không có token -> Đá về login
   */
  if (!isPublicRoute && !token) {
    return NextResponse.redirect(new URL('/auth/login', request.url));
  }

  /**
   * TRƯỜNG HỢP 2: TRUY CẬP TRANG AUTH KHI ĐÃ CÓ TOKEN
   * Nếu đang ở các trang đăng nhập/đăng ký mà đã có token -> Đẩy vào dashboard
   */
  if (pathname.startsWith('/auth') && token) {
    return NextResponse.redirect(new URL('/overview', request.url));
  }

  return NextResponse.next();
}

// 2. Tận dụng Matcher để loại bỏ các file tĩnh (Tối ưu performance)
export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
};