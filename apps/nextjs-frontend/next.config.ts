import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    // 1. Cấp phép cho Next.js tối ưu ảnh từ các nguồn tuyệt đối
    remotePatterns: [
      {
        protocol: 'http',
        hostname: 'localhost',
        port: '3000',
        pathname: '/uploads/**',
      },
      {
        protocol: 'http',
        hostname: '127.0.0.1',
        port: '3000',
        pathname: '/uploads/**',
      },
    ],
  },

  // 2. CẤU HÌNH QUAN TRỌNG: Proxy từ Port 3000 sang Port 5000
  async rewrites() {
    return [
      {
        // Khi gọi /uploads/abc.jpg ở Port 3000
        source: '/uploads/:path*',
        // Nó sẽ âm thầm lấy từ Port 5000
        destination: 'http://localhost:3000/uploads/:path*',
      },
    ];
  },

  /* Các cấu hình khác nếu cần (đã bỏ eslint/typescript theo yêu cầu) */
};

export default nextConfig;