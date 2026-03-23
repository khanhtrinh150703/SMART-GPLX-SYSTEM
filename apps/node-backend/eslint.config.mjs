// eslint.config.mjs
import eslint from '@eslint/js';
import tseslint from 'typescript-eslint';

export default tseslint.config(
    // 1. KHỐI IGNORES: Đặt riêng ở đây để bỏ qua hoàn toàn các file này
    {
        ignores: [
            "**/jest.config.js", 
            "dist/**", 
            "node_modules/**", 
            "coverage/**"
        ],
    },
    
    // 2. CẤU HÌNH CƠ BẢN
    eslint.configs.recommended,
    ...tseslint.configs.recommended,
    
    // 3. KHỐI RULES: Tùy chỉnh luật chơi cho Smart-GPLX-System
    {
        files: ["**/*.ts"], // Áp dụng các luật này cho file TypeScript
        rules: {
            "no-console": "off", // Cho phép dùng console.log thoải mái ở Backend
            "@typescript-eslint/no-explicit-any": "warn", // Chỉ cảnh báo khi dùng 'any'
            
            // Cấu hình quan trọng nhất để xử lý lỗi 'next' hay 'urlPicture'
            "@typescript-eslint/no-unused-vars": ["error", {
                "args": "all",
                "argsIgnorePattern": "^_", // Bỏ qua nếu biến bắt đầu bằng dấu _
                "varsIgnorePattern": "^_", // Bỏ qua nếu biến bắt đầu bằng dấu _
                "caughtErrorsIgnorePattern": "^_"
            }]
        }
    }
);