import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      // 1. CẤU HÌNH MÀU SẮC DÙNG CHUNG
      colors: {
        primary: {
          DEFAULT: '#10b981', // Màu chủ đạo (Ví dụ đang để Xanh Ngọc)
          hover: '#059669',   // Màu khi di chuột qua
          light: '#d1fae5',   // Màu nền nhạt (dùng cho thông báo/viền)
        },
        surface: {
          DEFAULT: '#ffffff', // Màu nền của form, thẻ card
          background: '#f8fafc', // Màu nền của toàn trang web
        },
        text: {
          main: '#111827',    // Màu chữ chính (Đen nhạt)
          muted: '#6b7280',   // Màu chữ phụ (Xám)
        }
      },
      // 2. CẤU HÌNH GÓC BO TRÒN DÙNG CHUNG
      borderRadius: {
        'theme': '0.75rem', // Xài class `rounded-theme` thay vì `rounded-xl`
      }
    },
  },
  plugins: [],
};
export default config;