import type { Config } from "tailwindcss";
// 🚀 1. Import plugin thay vì dùng require
import scrollbar from 'tailwind-scrollbar';

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/**/*.{js,ts,jsx,tsx,mdx}", // Thêm src nếu ông có dùng thư mục này
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#10b981',
          hover: '#059669',
          light: '#d1fae5',
        },
        surface: {
          DEFAULT: '#ffffff',
          background: '#f8fafc',
        },
        // 💡 Gợi ý: Đặt tên 'brand' hoặc 'content' thay vì 'text' 
        // để tránh trùng với class 'text-...' mặc định của Tailwind
        content: {
          main: '#111827',
          muted: '#6b7280',
        }
      },
      borderRadius: {
        'theme': '0.75rem',
      }
    },
  },
  // 🚀 2. Đưa vào mảng plugins
  plugins: [
    scrollbar({ nocompatible: true })
  ],
};

export default config;