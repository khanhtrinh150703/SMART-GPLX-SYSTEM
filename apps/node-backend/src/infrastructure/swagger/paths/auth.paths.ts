import { API_CONSTANTS } from "@/domain/constants/api.constant";


export const authPaths = {
    [`${API_CONSTANTS.API_BASE}/auth/register/init`]: {
        post: {
            tags: ['Authentication'],
            summary: 'Đăng ký thành viên mới',
            description: 'Khởi tạo đăng ký và gửi OTP vào email',
            operationId: 'registerInit',
            requestBody: {
                required: true,
                content: {
                    'application/json': {
                        schema: { $ref: '#/components/schemas/RegisterDTO' },
                    },
                },
            },
            responses: {
                '200': {
                    description: 'Đăng ký thành công, vui lòng kiểm tra OTP trong email',
                    content: {
                        'application/json': {
                            schema: { $ref: '#/components/schemas/SuccessResponse' },
                        },
                    },
                },
                '400': { $ref: '#/components/responses/ValidationError' },
                '409': { $ref: '#/components/responses/ConflictError' },
            },
        },
    },

    [`${API_CONSTANTS.API_BASE}/auth/resend-otp`]: {
        post: {
            tags: ['Authentication'],
            summary: 'Gửi lại mã OTP',
            description: 'Có cooldown 60 giây giữa các lần gửi',
            operationId: 'resendOtp',
            requestBody: {
                required: true,
                content: {
                    'application/json': {
                        schema: {
                            type: 'object',
                            properties: {
                                email: { type: 'string', format: 'email', example: 'gasadas1234@gmail.com' },
                            },
                            required: ['email'],
                        },
                    },
                },
            },
            responses: {
                '200': {
                    description: 'Mã OTP mới đã được gửi',
                    content: {
                        'application/json': {
                            schema: { $ref: '#/components/schemas/SuccessResponse' },
                        },
                    },
                },
                '400': { description: 'Email không hợp lệ hoặc phiên đăng ký hết hạn' },
                '429': { $ref: '#/components/responses/TooManyRequestsError' },
            },
        },
    },

    [`${API_CONSTANTS.API_BASE}/auth/register/verify`]: {
        post: {
            tags: ['Authentication'],
            summary: 'Xác thực OTP để hoàn tất đăng ký',
            description: 'Xác thực OTP để tạo tài khoản',
            operationId: 'verifyRegister',
            requestBody: {
                required: true,
                content: {
                    'application/json': {
                        schema: { $ref: '#/components/schemas/VerifyUserDTO' },
                    },
                },
            },
            responses: {
                '200': {
                    description: 'Xác thực thành công, tài khoản đã được tạo',
                    content: {
                        'application/json': {
                            schema: { $ref: '#/components/schemas/SuccessResponse' },
                        },
                    },
                },
                '400': { description: 'Mã OTP sai hoặc không hợp lệ' },
                '401': { $ref: '#/components/responses/UnauthorizedError' },
                '410': { description: 'Phiên đăng ký đã hết hạn (quá 10 phút)' },
            },
        },
    },

    [`${API_CONSTANTS.API_BASE}/auth/login`]: {
        post: {
            tags: ['Authentication'],
            summary: 'Đăng nhập',
            description: 'Hỗ trợ đăng nhập bằng username hoặc email',
            operationId: 'login',
            requestBody: {
                required: true,
                content: {
                    'application/json': {
                        schema: { $ref: '#/components/schemas/LoginDTO' },
                    },
                },
            },
            responses: {
                '200': {
                    description: 'Đăng nhập thành công',
                    content: {
                        'application/json': {
                            schema: { $ref: '#/components/schemas/LoginResponse' },
                        },
                    },
                },
                '401': { $ref: '#/components/responses/UnauthorizedError' },
            },
        },
    },

    [`${API_CONSTANTS.API_BASE}/auth/refresh-token`]: {
        post: {
            tags: ['Authentication'],
            summary: 'Làm mới mã xác thực (Refresh Token)',
            description: 'Sử dụng Refresh Token để cấp mới bộ đôi Access Token và Refresh Token mới. Hỗ trợ cơ chế Token Rotation để bảo mật.',
            operationId: 'refreshToken',
            requestBody: {
                required: true,
                content: {
                    'application/json': {
                        schema: { $ref: '#/components/schemas/RefreshTokenRequest' },
                    },
                },
            },
            responses: {
                '200': {
                    description: 'Cấp mới Token thành công',
                    content: {
                        'application/json': {
                            schema: { $ref: '#/components/schemas/TokenResponse' },
                        },
                    },
                },
                '400': {
                    description: 'Dữ liệu không hợp lệ (Thiếu token hoặc sai định dạng)',
                },
                '401': {
                    description: 'Phiên làm việc hết hạn hoặc Token đã bị thu hồi (Unauthorized)',
                },
                '403': {
                    description: 'Tài khoản đã bị khóa (Account Locked)',
                },
                '404': {
                    description: 'Người dùng không tồn tại (User Not Found)',
                },
            },
        },
    },

    [`${API_CONSTANTS.API_BASE}/auth/forgot-password`]: {
        post: {
            tags: ['Authentication'],
            summary: 'Yêu cầu gửi OTP quên mật khẩu',
            operationId: 'forgotPassword',
            requestBody: {
                required: true,
                content: {
                    'application/json': {
                        schema: { $ref: '#/components/schemas/ForgotPasswordDTO' },
                    },
                },
            },
            responses: {
                '200': {
                    description: 'OTP đã được gửi qua email',
                    content: { 'application/json': { schema: { $ref: '#/components/schemas/SuccessResponse' } } },
                },
                '404': { description: 'Email không tồn tại trong hệ thống' },
                '429': { description: 'Gửi quá nhanh, đang bị khóa tạm thời' },
            },
        },
    },
    // Forgot & Reset Password
    [`${API_CONSTANTS.API_BASE}/auth/forgot-password`]: {
        post: {
            tags: ['Authentication'],
            summary: 'Yêu cầu gửi OTP quên mật khẩu',
            operationId: 'forgotPassword',
            requestBody: {
                required: true,
                content: {
                    'application/json': {
                        schema: { $ref: '#/components/schemas/ForgotPasswordDTO' },
                    },
                },
            },
            responses: {
                '200': {
                    description: 'OTP đã được gửi qua email',
                    content: { 'application/json': { schema: { $ref: '#/components/schemas/SuccessResponse' } } },
                },
                '404': { description: 'Email không tồn tại trong hệ thống' },
                '429': { description: 'Gửi quá nhanh, đang bị khóa tạm thời' },
            },
        },
    },

    [`${API_CONSTANTS.API_BASE}/auth/reset-password`]: {
        post: {
            tags: ['Authentication'],
            summary: 'Xác thực OTP và đặt lại mật khẩu mới',
            operationId: 'resetPassword',
            requestBody: {
                required: true,
                content: {
                    'application/json': {
                        schema: { $ref: '#/components/schemas/ResetPasswordDTO' },
                    },
                },
            },
            responses: {
                '200': {
                    description: 'Đặt lại mật khẩu thành công',
                    content: { 'application/json': { schema: { $ref: '#/components/schemas/SuccessResponse' } } },
                },
                '400': { description: 'Mã OTP sai hoặc đã hết hạn' },
            },
        },
    },
};