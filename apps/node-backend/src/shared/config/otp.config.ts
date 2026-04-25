export const OTP_CONFIG = {
    // Độ dài mã OTP (6 số)
    length: parseInt(process.env.OTP_LENGTH || '6', 10),

    // Thời gian hết hạn OTP (phút)
    ttlMinutes: parseInt(process.env.OTP_TTL_MINUTES || '5', 10),

    // Khoảng giá trị cho crypto.randomInt
    min: 100000,
    max: 999999,
};