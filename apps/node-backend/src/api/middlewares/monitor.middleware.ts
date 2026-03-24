import { Request, Response, NextFunction } from 'express';
import logger from '../../infrastructure/logging/winston.logger';

export const apiMonitor = (req: Request, res: Response, next: NextFunction): void => {
    const start = process.hrtime();

    res.on('finish', () => {
        const diff = process.hrtime(start);
        const durationInMs = (diff[0] * 1e3 + diff[1] * 1e-6).toFixed(2);

        logger.info(`API_LOG`, {
            // Dữ liệu chi tiết (Metadata)
            method: req.method,
            path: req.originalUrl,
            duration: durationInMs,
            
            // ĐẨY LÊN THÀNH LABELS (Để hiện trong danh sách Labels của Loki)
            labels: { 
                module: 'api',
                status: res.statusCode.toString() 
            }
        });
    });
    next();
};