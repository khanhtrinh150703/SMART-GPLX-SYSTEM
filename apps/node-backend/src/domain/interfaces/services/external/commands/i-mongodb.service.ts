import { Db } from 'mongodb';

/**
 * @interface IMongoDBService
 * @description Quản lý vòng đời kết nối và truy cập thực thể MongoDB.
 */
export interface IMongoDBService {
  /**
   * @description Thiết lập kết nối tới MongoDB Cluster.
   * @throws {Error} Nếu kết nối thất bại.
   */
  connect(): Promise<void>;

  /**
   * @description Ngắt kết nối an toàn khỏi cơ sở dữ liệu.
   */
  close(): Promise<void>;

  /**
   * @description Truy cập thực thể Database để thực hiện các truy vấn.
   * @returns {Db} Đối tượng Database của MongoDB Driver.
   */
  readonly db: Db;
}