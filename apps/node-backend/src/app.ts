import express from "express";
import cors from "cors";
import morgan from "morgan";
import swaggerUi from "swagger-ui-express";
import path from "path";

// 1. Routers
import rootRouter from "./api/routes";

// 2. Middlewares (Gom từ index của shared)
import {
  globalErrorHandler,
  requestTimer,
  apiMonitor,
} from "./api/middlewares/shared";

// 3. Infrastructure & Config
import { specs } from "./infrastructure/swagger";
import { STORAGE_CONFIG } from "./shared/config/storage.config";
import { ILogger } from "./domain/interfaces/logging";
import { container } from "./shared/utils/container";

const app = express();
const uploadPath = path.resolve(STORAGE_CONFIG.PUBLIC_DIR);
const logger = container.resolve("logger") as ILogger;
const monitorMiddleware = apiMonitor(logger);
// =========================================================
// 1. SECURITY & PARSING (Bảo mật & Phân tích dữ liệu)
// =========================================================

// Cấu hình CORS (Cross-Origin Resource Sharing - Chia sẻ tài nguyên chéo nguồn gốc)
// Đặt ở trên cùng để "mở cửa" cho trình duyệt trước khi làm bất cứ việc gì khác

app.set("trust proxy", true);

app.use(
  cors({
    origin: "http://localhost:3000", // Mở cửa cho cổng 3000 của Frontend
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS", "PATCH"], // Các phương thức HTTP được phép
    allowedHeaders: ["Content-Type", "Authorization", "x-refresh-token"], // Các tiêu đề (Headers) được phép
    credentials: true, // Cho phép gửi kèm Cookie/Token bảo mật
  }),
);

app.use("/uploads", express.static(uploadPath));

// Phân tích dữ liệu JSON gửi từ Frontend (Biến req.body thành Object)
// Phải đặt trước các Router và Monitor để chúng có thể đọc được dữ liệu
app.use(express.json());
// Dự phòng phân tích dữ liệu dạng form-data cơ bản
app.use(express.urlencoded({ extended: true }));

// =========================================================
// 2. LOGGING & MONITORING (Ghi nhật ký & Giám sát hiệu suất)
// =========================================================

logger.info("🚀 Hệ thống Smart-GPLX đang khởi động...");

app.use(morgan("dev")); // Log request ra console với màu sắc
app.use(monitorMiddleware); // Monitor phải đứng TRƯỚC Router để đo đạc
app.use(requestTimer); // Bộ đếm thời gian xử lý

// =========================================================
// 3. ROUTES & DOCS (Định tuyến & Tài liệu API)
// =========================================================
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(specs));
app.use("/api/v1", rootRouter);

// =========================================================
// 4. ERROR HANDLING (Xử lý lỗi tập trung)
// =========================================================
// Lưới bắt lỗi cuối cùng - PHẢI luôn nằm ở dưới cùng của file
app.use(globalErrorHandler);

export default app; // Xuất bản app ra ngoài để file server.ts gọi tới
