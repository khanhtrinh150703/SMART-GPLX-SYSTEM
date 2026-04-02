import express from "express";
import cors from "cors"; // 1. Đổi sang cú pháp import chuẩn của TypeScript
import morgan from 'morgan';
import swaggerUi from 'swagger-ui-express';
import path from 'path';
import rootRouter from "./api/routes/index";
import { specs } from './infrastructure/swagger/index';
import { globalErrorHandler } from './api/middlewares/error.middleware';
import { requestTimer } from "./api/middlewares/timer.middleware";
import { apiMonitor } from "./api/middlewares/monitor.middleware";
import logger from "./infrastructure/logging/winston.logger";

const app = express();
const uploadPath = path.join(__dirname, '..', 'uploads');

// =========================================================
// 1. SECURITY & PARSING (Bảo mật & Phân tích dữ liệu)
// =========================================================

// Cấu hình CORS (Cross-Origin Resource Sharing - Chia sẻ tài nguyên chéo nguồn gốc)
// Đặt ở trên cùng để "mở cửa" cho trình duyệt trước khi làm bất cứ việc gì khác
app.use(cors({
  origin: 'http://localhost:3001', // Mở cửa cho cổng 3001 của Frontend
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS', 'PATCH'], // Các phương thức HTTP được phép
  allowedHeaders: ['Content-Type', 'Authorization'], // Các tiêu đề (Headers) được phép
  credentials: true // Cho phép gửi kèm Cookie/Token bảo mật
}));


app.use('/uploads', express.static(uploadPath));

// Phân tích dữ liệu JSON gửi từ Frontend (Biến req.body thành Object)
// Phải đặt trước các Router và Monitor để chúng có thể đọc được dữ liệu
app.use(express.json());
// Dự phòng phân tích dữ liệu dạng form-data cơ bản
app.use(express.urlencoded({ extended: true })); 


// =========================================================
// 2. LOGGING & MONITORING (Ghi nhật ký & Giám sát hiệu suất)
// =========================================================
logger.info("🚀 Server Smart-GPLX đang khởi động...");

app.use(morgan('dev')); // Log request ra console với màu sắc
app.use(apiMonitor);    // Monitor phải đứng TRƯỚC Router để đo đạc
app.use(requestTimer);  // Bộ đếm thời gian xử lý


// =========================================================
// 3. ROUTES & DOCS (Định tuyến & Tài liệu API)
// =========================================================
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(specs));
app.use('/api/v1', rootRouter);


// =========================================================
// 4. ERROR HANDLING (Xử lý lỗi tập trung)
// =========================================================
// Lưới bắt lỗi cuối cùng - PHẢI luôn nằm ở dưới cùng của file
app.use(globalErrorHandler);

export default app; // Xuất bản app ra ngoài để file server.ts gọi tới