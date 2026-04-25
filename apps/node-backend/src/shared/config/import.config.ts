export const IMPORT_CONFIG = {
  chunk: {
    /** @description Giới hạn kích thước mỗi mảnh (byte) - Mặc định 10MB */
    sizeLimit: parseInt(process.env.IMPORT_CHUNK_SIZE_LIMIT || '10485760', 10),
  },
  session: {
    /** @description Thời gian sống của một phiên import (giờ) - Mặc định 24h */
    expiryHours: parseInt(process.env.IMPORT_SESSION_EXPIRY_HOURS || '24', 10),
    
    /** @description Quy đổi ra giây để dùng cho Redis/Database TTL nếu cần */
    get expirySeconds(): number {
      return this.expiryHours * 3600;
    }
  },
};