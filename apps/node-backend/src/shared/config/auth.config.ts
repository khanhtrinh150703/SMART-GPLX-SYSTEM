export const AUTH_CONFIG = {
    jwt: {
        access: {
            secret: process.env.JWT_ACCESS_SECRET || 'secret',
            // Dùng cho thư viện JWT (ví dụ: '15m', '1d')
            expiresIn: process.env.JWT_ACCESS_EXPIRES_IN || '15m',
            // Dùng cho Redis hoặc tính toán (giây) - Mặc định 15 phút
            ttlSeconds: parseInt(process.env.JWT_ACCESS_TTL || '900', 10),
        },
        refresh: {
            secret: process.env.JWT_REFRESH_SECRET || 'refresh_secret',
            expiresIn: process.env.JWT_REFRESH_EXPIRES_IN || '7d',
            // Mặc định 7 ngày
            ttlSeconds: parseInt(process.env.JWT_REFRESH_TTL || '604800', 10),
        },
    },
    otp: {
        ttlSeconds: parseInt(process.env.OTP_TTL || '300', 10), 
    },
    security: {
        lockTimeSeconds: parseInt(process.env.LOCK_TIME || '60', 10),
        pendingTtlSeconds: parseInt(process.env.PENDING_TTL || '600', 10),
    },
    bcrypt: {
        saltRounds: 10, // Độ phức tạp khi hash
    },
};