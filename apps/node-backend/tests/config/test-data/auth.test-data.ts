/** @description Danh sách tài khoản và dữ liệu mẫu cho Auth Integration Test */
export const AUTH_PAYLOAD = {
    // Dữ liệu đăng ký và đổi mật khẩu cho User chính
    USER_TEST: {
        username: 'cau_vang',
        email: 'gplx@dividesk.com',
        fullName: 'Cậu Vàng',
        password: 'Password123!',
        newPassword: 'NewSecurePassword123@',
        secondnewPassword: 'NewSecurePassword123@A',
        newPassword_wrong_confirm: 'NewSecurePassword123@z',
        confirmPassword: 'Password123!',
        wrongPassword: 'WrongPassword123!',
    },

    // Tài khoản Admin hệ thống
    ADMIN_ACCOUNT: {
        username: 'admin',
        password: 'AdminPassword123@',
    },

    // Tài khoản User thông thường
    NORMAL_ACCOUNT: {
        username: 'student_test',
        password: 'UserPassword123@',
    },

    // Các trường hợp dữ liệu không hợp lệ
    INVALID_DATA: {
        email: 'not-an-email',
        shortPassword: '123',
        emptyUsername: '',
    }
} as const;