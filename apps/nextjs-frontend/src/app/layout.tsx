// app/layout.tsx
import type { Metadata } from "next";
import { Inter } from "next/font/google"; // Import font Inter (hoặc Roboto tùy bạn)
import "./globals.css";

// Cấu hình font chữ có hỗ trợ tiếng Việt
const inter = Inter({ 
  subsets: ["vietnamese"],
  weight: ['400', '500', '600', '700'], 
});

export const metadata: Metadata = {
  title: "Smart GPLX System",
  description: "Hệ thống sát hạch giấy phép lái xe thông minh",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="vi">
      {/* Áp dụng font chữ inter cho toàn bộ body.
        Dùng màu nền `bg-surface-background` và màu chữ `text-text-main` đã định nghĩa ở Bước 1
      */}
      <body className={`${inter.className} bg-surface-background text-text-main antialiased`}>
        {children}
      </body>
    </html>
  );
}