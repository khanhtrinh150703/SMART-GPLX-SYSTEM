// --- 1. NODE.JS CORE MODULES (Hệ thống Core của Node) ---
import path from "path";

// --- 2. THIRD-PARTY PACKAGES (Thư viện framework & Middlewares bên thứ ba) ---
import express from "express";
import cors from "cors";
import morgan from "morgan";

// --- 3. DOCUMENTATION (Tài liệu API mã nguồn) ---
import swaggerUi from "swagger-ui-express";

// 1. Routers
import rootRouter from "./api/routes";

// 2. Middlewares (Gom từ index của shared)
import {
  globalErrorHandler,
  requestTimer,
  apiMetricsRoute,
  prometheusMiddleware,
  lokiMiddleware, 
} from "./api/middlewares/shared";

// 3. Infrastructure & Config
import { specs } from "./infrastructure/swagger";
import { container } from "./shared/utils/container";
import { STORAGE_CONFIG, swaggerAuth } from "./shared/config";

const app = express();
const uploadPath = path.resolve(STORAGE_CONFIG.PUBLIC_DIR);
const logger = container.cradle.logger;
const metricRegistry = container.cradle.metricRegistry;

const loki = lokiMiddleware(logger);
const prometheus = prometheusMiddleware(metricRegistry);

// =========================================================
// 1. SECURITY & PARSING (Bảo mật & Phân tích dữ liệu)
// =========================================================
app.set("trust proxy", true);
app.use(
  cors({
    origin: [
      "https://gplx.dividesk.com",
      "https://www.gplx.dividesk.com",
      "http://localhost:3000",
    ],
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS", "PATCH"],
    allowedHeaders: ["Content-Type", "Authorization", "x-refresh-token"],
    credentials: true,
  }),
);

app.use("/uploads", express.static(uploadPath));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// =========================================================
// 2. LOGGING & MONITORING (Ghi nhật ký & Giám sát hiệu suất)
// =========================================================
logger.info("🚀 Hệ thống Smart-GPLX đang khởi động...");

// app.use(morgan("dev")); 
app.use(morgan("dev", {
  skip: (req) => req.baseUrl === "/metrics" || req.path === "/metrics"
}));
app.use(loki); 
app.use(prometheus);
app.use(requestTimer); 

// =========================================================
// 3. ROUTES & DOCS (Định tuyến & Tài liệu API)
// =========================================================

apiMetricsRoute(metricRegistry)(app); 

app.use("/api-docs", swaggerAuth, swaggerUi.serve, swaggerUi.setup(specs));
app.use("/api/v1", rootRouter);

// =========================================================
// 4. ERROR HANDLING (Xử lý lỗi tập trung)
// =========================================================
app.use(globalErrorHandler);

export default app;