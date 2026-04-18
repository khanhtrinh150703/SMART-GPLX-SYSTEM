import { Router } from "express";
import { authMiddleware } from "../middlewares/auth.middleware";
import { requirePermission } from "../middlewares/permission.middleware";
import { container } from "@/shared/utils/container";
import { ImportController } from "../controllers/import.controller";
import { uploadImport } from "../middlewares/upload.middleware";
import { validateFileSize } from "../middlewares/error.middleware";


const router = Router();
const controller = container.resolve('importController') as ImportController;


// Tất cả các route bên dưới đều yêu cầu đăng nhập (Dịch: All routes below require authentication)
router.use(authMiddleware);

/**
 * @description Luồng API Import Question (Dịch: Question Import API Flow)
 * Sử dụng requirePermission để đảm bảo chỉ User có quyền mới được truy cập.
 */

// Bước 1: Khởi tạo phiên (Dịch: Init session)
router.post(
    "/init", 
    requirePermission('import:questions'), 
    controller.init
);

// Bước 2: Tải lên từng mảnh (Dịch: Upload chunk)
// Lưu ý: 'chunk' là key trong FormData gửi từ phía Frontend
router.post(
    "/upload-chunk", 
    requirePermission('import:questions'), 
    validateFileSize(uploadImport.single('chunk')), 
    controller.uploadChunk
);

// Bước 3: Hoàn tất và xử lý (Dịch: Finalize and process)
router.post(
    "/complete", 
    requirePermission('import:questions'), 
    controller.complete
);

router.get('/status/:jobId', controller.getStatus);
export default router;