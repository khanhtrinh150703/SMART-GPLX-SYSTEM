import express from "express";
import morgan from 'morgan';
import rootRouter from "./api/routes/index";
import swaggerUi from 'swagger-ui-express';
import { specs } from './infrastructure/swagger/swagger.config';
import { globalErrorHandler } from './api/middlewares/error.handler';
import { requestTimer } from "./api/middlewares/timer.middlewares";
import { apiMonitor } from "./api/middlewares/monitor.middlewares";
import logger from "./infrastructure/logging/logger";

const app = express();

// 1. Các middleware cơ bản
app.use(morgan('dev'));
app.use(express.json());

// 2. PHẢI ĐẶT Ở ĐÂY: Monitor phải đứng TRƯỚC Router
app.use(apiMonitor);
// Log thử một câu khi app load (chỉ 1 câu duy nhất)
logger.info("🚀 Server Smart-GPLX đang khởi động...");
app.use(requestTimer);

// 3. Các tuyến đường API
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(specs));
app.use('/api/v1', rootRouter);

// 4. Lưới bắt lỗi cuối cùng
app.use(globalErrorHandler);

export default app; // Xuất bản động cơ ra ngoài