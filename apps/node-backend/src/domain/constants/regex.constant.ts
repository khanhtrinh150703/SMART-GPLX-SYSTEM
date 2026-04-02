
export const REGEX = {
    /** * --- EMAIL PATTERNS --- 
     * Các mẫu kiểm tra định dạng thư điện tử
     */
    EMAIL: {
        /** Định dạng email cơ bản (Standard) */
        BASIC: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,

        /** Định dạng Gmail cụ thể (Yêu cầu ít nhất 6 ký tự trước @) */
        GMAIL_ONLY: /^[a-z0-9](\.?[a-z0-9]){5,}@gmail\.com$/,

        /** Email giáo dục hoặc công ty (Ví dụ kết thúc bằng .edu.vn hoặc .gov) */
        ORGANIZATION: /^[^\s@]+@[^\s@]+\.(edu\.vn|gov|org|com\.vn)$/,

        EMAIL: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
    },

    /** * --- PASSWORD PATTERNS --- */
    PASSWORD: {
        /** Ít nhất 1 chữ cái & 1 số */
        COMPLEXITY: /^(?=.*[A-Za-z])(?=.*\d).+$/,
        /** Mật khẩu mạnh: Chữ hoa, chữ thường, số, ký tự đặc biệt, tối thiểu 8 ký tự */
        STRONG: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/
    },

    /** * --- CONTACT PATTERNS --- */
    PHONE: {
        /** Định dạng số điện thoại Việt Nam (10 số, bắt đầu bằng 03, 05, 07, 08, 09) */
        VIETNAM: /(84|0[3|5|7|8|9])+([0-9]{8})\b/
    },
    LICENSE: {
        NAME_FORMAT: /^[A-Z0-9]+$/
    }
} as const;