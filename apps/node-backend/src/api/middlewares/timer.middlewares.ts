import { Request, Response, NextFunction } from 'express';

export const requestTimer = (req: Request, res: Response, next: NextFunction) => {
  const start = process.hrtime(); // Dùng hrtime để đo chính xác đến nanogiây

  // Khi request kết thúc (đã gửi xong cho khách)
  res.on('finish', () => {
    const diff = process.hrtime(start);
    const timeInMs = (diff[0] * 1e3 + diff[1] * 1e-6).toFixed(3);
    console.log(`[API MONITOR] ${req.method} ${req.originalUrl} - ESTIMATE: ${timeInMs}ms`);
  });

  next();
};