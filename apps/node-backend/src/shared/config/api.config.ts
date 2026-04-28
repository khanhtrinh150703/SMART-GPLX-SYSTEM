export const API_CONFIG = {
  /** @description Tiền tố mặc định cho toàn bộ các route của hệ thống */
  PREFIX: process.env.API_PREFIX || '/api',
  
  /** @description Phiên bản hiện tại của API */
  VERSION: process.env.API_VERSION || 'v1',

  /** @description Helper để lấy đường dẫn gốc hoàn chỉnh */
  get BASE_URL(): string {
    return `${this.PREFIX}/${this.VERSION}`;
  }
};