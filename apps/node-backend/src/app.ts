import express from "express";
import morgan from 'morgan';
import rootRouter from "./api/routes/index";
import swaggerUi from 'swagger-ui-express';
import { specs } from './infrastructure/swagger/swagger.config';
import { globalErrorHandler } from './api/middlewares/error.handler';
import { requestTimer } from "./api/middlewares/timer.middlewares";

const app = express();

app.use(morgan('dev'));

app.use(express.json()); // Đọc body JSON

// Đăng ký đường dẫn tài liệu API
// Swagger UI
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(specs));
// Gắn các tuyến đường API
app.use('/api/v1', rootRouter);

// "Lưới an toàn" bắt mọi lỗi
app.use(globalErrorHandler);
app.use(requestTimer)

export default app; // Xuất bản động cơ ra ngoài