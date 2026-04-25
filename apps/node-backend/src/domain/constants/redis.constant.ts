/**
 * @description Định nghĩa các prefix cho Redis Key theo cấu trúc: [service]:[module]:[purpose]
 */
export const REDIS_CONSTANTS = {
  PREFIX: {
    AUTH: {
      // Nhóm đăng ký & xác thực
      OTP: 'auth:otp:',
      OTP_LOCK: 'auth:otp-lock:',
      PENDING_USER: 'auth:pending-user:',
      
      // Nhóm Token Management
      ACCESS_TOKEN: 'auth:access-token:',
      REFRESH_TOKEN: 'auth:refresh-token:',
      BLACKLIST: 'auth:blacklist:',
    },
    // Trinh có thể thêm các module khác ở đây sau này
    // QUESTION: 'question:',
  }
} as const;
