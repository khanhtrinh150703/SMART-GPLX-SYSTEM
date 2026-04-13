import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { cn } from "@/lib/utils/utils";

/**
 * Cấu hình phông chữ Inter chuyên dụng cho UI/UX.
 * - subsets: ["vietnamese"] - Đảm bảo hiển thị đúng dấu tiếng Việt.
 * - variable: "--font-inter" - Tạo biến CSS để sử dụng linh hoạt trong Tailwind.
 */
const inter = Inter({
  subsets: ["vietnamese"],
  weight: ["400", "500", "600", "700", "800", "900"],
  variable: "--font-inter",
});

/**
 * Metadata (Dữ liệu mô tả) cho toàn bộ ứng dụng.
 */
export const metadata: Metadata = {
  title: "Smart GPLX System | Hệ thống đào tạo lái xe thông minh",
  description: "Hệ thống sát hạch và quản lý giấy phép lái xe tích hợp AI.",
  icons: {
    icon: "/Smart.png", 
  },
};

/**
 * RootLayout - Bố cục gốc của hệ thống.
 * @param {Object} props - Thuộc tính truyền vào component.
 */
export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="vi" suppressHydrationWarning>
      <body
        className={cn(
          "min-h-screen bg-slate-50 font-sans text-slate-900 antialiased",
          inter.variable, // Truyền biến phông chữ vào CSS
          inter.className, // Áp dụng trực tiếp phông chữ Inter cho body
        )}
      >
        {children}
      </body>
    </html>
  );
}
