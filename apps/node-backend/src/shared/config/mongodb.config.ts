import dotenv from 'dotenv';
dotenv.config();

export interface IMongoConfig {
  readonly url: string;
  readonly dbName: string;
}

/**
 * @description Đối tượng cấu hình MongoDB lấy từ biến môi trường
 */
export const mongoConfig: IMongoConfig = {
  url: process.env.MONGO_URL || 'mongodb://localhost:27017',
  dbName: process.env.MONGO_DB_NAME || 'smart_gplx_db',
};