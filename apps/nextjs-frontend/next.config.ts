import type { NextConfig } from "next";
import path from 'path';
const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'http',
        hostname: 'localhost',
        // CHÚ Ý: Port này phải là port của node-backend (thường là 5000, 8000 hoặc 8080)
        // Nếu Backend chạy port 3000 sẽ trùng với Next.js, bạn nên kiểm tra lại nhé.
        port: '5000',
        pathname: '/uploads/**',
      },
      {
        protocol: 'http',
        hostname: '127.0.0.1',
        port: '5000',
        pathname: '/uploads/**',
      },
    ],
  },
  // 2. Nếu bạn gặp lỗi khi chạy build do ESLint hoặc TypeScript quá khắt khe
  // Bạn có thể thêm các dòng sau (tùy chọn):
  /*
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  */
};

export default nextConfig;