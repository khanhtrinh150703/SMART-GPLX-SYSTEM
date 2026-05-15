import dotenv from 'dotenv';
dotenv.config();

export interface IMongoConfig {
  readonly uri: string;
  readonly dbName: string;
}

/**
 * @description Đối tượng cấu hình MongoDB lấy từ biến môi trường
 */
export const mongoConfig: IMongoConfig = {
  uri: process.env.MONGO_URI || 'mongodb://localhost:27017',
  dbName: process.env.MONGO_DB_NAME || 'smart_gplx_db',
};