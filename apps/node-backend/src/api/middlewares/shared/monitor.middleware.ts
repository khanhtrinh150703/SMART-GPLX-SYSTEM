import { Request, Response, NextFunction } from 'express';
import { ILogger } from '@/domain/interfaces/logging'; // Import Interface thay vì Instance

/**
 * @description Chuyển thành Factory Function để nhận logger từ Awilix
 */
export const apiMonitor = (logger: ILogger) => {
    return (req: Request, res: Response, next: NextFunction): void => {
        const start = process.hrtime();

        res.on('finish', () => {
            const diff = process.hrtime(start);
            const durationInMs = (diff[0] * 1e3 + diff[1] * 1e-6).toFixed(2);

            // logger này được truyền từ app.ts vào, đảm bảo đã tồn tại
            logger.info(`API_LOG`, {
                method: req.method,
                path: req.originalUrl,
                duration: durationInMs,
                labels: { 
                    module: 'api',
                    status: res.statusCode.toString() 
                }
            });
        });
        
        next();
    };
};