// eslint.config.mjs
import eslint from '@eslint/js';
import tseslint from 'typescript-eslint';
import globals from 'globals'; // 1. Import thêm thư viện này

export default tseslint.config(
    // 1. KHỐI IGNORES
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
    
    // 3. KHỐI RULES CHO TYPESCRIPT
    {
        files: ["**/*.ts"],
        rules: {
            "no-console": "off",
            "@typescript-eslint/no-explicit-any": "warn",
            "@typescript-eslint/no-unused-vars": ["error", {
                "args": "all",
                "argsIgnorePattern": "^_",
                "varsIgnorePattern": "^_",
                "caughtErrorsIgnorePattern": "^_"
            }]
        }
    },

    // 4. FIX LỖI 'module' CHO TAILWIND (VÀ CÁC FILE JS KHÁC)
    {
        files: ["**/*.js", "**/*.cjs"], // Áp dụng cho các file .js và .cjs
        languageOptions: {
            globals: {
                ...globals.node // Khai báo các biến của Node.js (như module, exports, process)
            }
        }
    }
);