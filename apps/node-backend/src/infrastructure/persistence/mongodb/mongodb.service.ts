// @/infrastructure/persistence/mongodb/mongodb.service.ts
import { MongoClient, Db } from 'mongodb';
import { IMongoConfig } from '@/shared/config/mongodb.config';
import { IMongoDBService } from '@/domain/interfaces/services/external/i-mongodb.service';
import { AppError, ErrorCode } from '@/shared/errors';
import mongoose from 'mongoose';

/**
 * @description Interface định nghĩa các phụ thuộc cho MongoDBService (Awilix ICradle)
 */
export interface IMongoDBCradle {
    mongoConfig: IMongoConfig;
}

/**
 * @description Thực thi kết nối MongoDB cấp thấp.
 * Nằm ở tầng infrastructure để che giấu chi tiết kỹ thuật.
 */
export class MongoDBService implements IMongoDBService {
    private _client: MongoClient | null = null;
    private _db: Db | null = null;
    private readonly _config: IMongoConfig;

    constructor({ mongoConfig }: IMongoDBCradle) {
        this._config = mongoConfig;
    }

    /**
     * @description Khởi tạo kết nối. Sử dụng Type Guard để đảm bảo Zero-Any.
     */
    public async connect(): Promise<void> {
        // 1 = connected, 2 = connecting
        if (mongoose.connection.readyState === 1) return;

        try {
            await mongoose.connect(this._config.uri, {
                dbName: this._config.dbName,
                // Các cấu hình bổ sung nếu cần
            });

            console.info(`[Infrastructure] Mongoose connected to: ${this._config.dbName}`);
        } catch (error) {
            throw new AppError(
                ErrorCode.MONGODB.CONNECTION_ERROR,
                `Kết nối Mongoose thất bại: ${(error as Error).message}`
            );
        }
    }

    /**
     * @description Getter trả về DB instance. Bắt buộc đã connect trước đó.
     */
    public get db(): Db {
        if (!(this._db instanceof Db)) {
            throw new AppError(
                ErrorCode.MONGODB.NOT_INITIALIZED,
                'Yêu cầu truy cập Database nhưng MongoDB chưa được khởi tạo.'
            );
        }
        return this._db;
    }

    public async close(): Promise<void> {
        if (this._client instanceof MongoClient) {
            await this._client.close();
            console.info('[Infrastructure] MongoDB connection closed.');
        }
    }
}