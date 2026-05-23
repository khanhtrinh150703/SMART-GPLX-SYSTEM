import { Router } from "express";

// 1. Middlewares (Gom theo nhóm nghiệp vụ)
import { authMiddleware, requirePermission } from "@/api/middlewares/identity";
import { uploadImport } from "@/api/middlewares/integration";
import { validateFileSize } from "@/api/middlewares/shared";
import { validateUuidParam } from "@/api/middlewares/validate";

// 2. DI Container
import { container } from "@/shared/utils/container";

const router = Router();

/** @description Bộ điều khiển tiếp nhận, điều phối và xử lý các yêu cầu HTTP liên quan đến quy trình nhập dữ liệu . */
const controller = container.cradle.importController;

/**
 * @description Tất cả các route liên quan đến Import đều yêu cầu đăng nhập
 */
router.use(authMiddleware);
router.use(requirePermission('questions:import'));

/**
 * @description Bước 1: Khởi tạo phiên làm việc để chuẩn bị upload file .
 * @route POST /api/v1/import/init
 * @access Private (Yêu cầu quyền questions:import)
 */
router.post(
    "/init", 
    controller.init
);

/**
 * @description Bước 2: Tải lên từng mảnh dữ liệu của file.
 * Lưu ý: 'chunk' là key trong FormData gửi từ phía Frontend.
 * @route POST /api/v1/import/upload-chunk
 * @access Private (Yêu cầu quyền questions:import)
 */
router.post(
    "/upload-chunk", 
    validateFileSize(uploadImport.single('chunk')), 
    controller.uploadChunk
);

/**
 * @description Bước 3: Hoàn tất quá trình tải lên và bắt đầu xử lý dữ liệu vào hệ thống .
 * @route POST /api/v1/import/complete
 * @access Private (Yêu cầu quyền questions:import)
 */
router.post(
    "/complete", 
    controller.complete
);

/**
 * @description Theo dõi trạng thái của tiến trình xử lý import ngầm (Dịch: Get import job status).
 * @route GET /api/v1/import/status/:jobId
 * @access Private (Yêu cầu quyền questions:import)
 */
router.get(
    '/status/:jobId', 
    validateUuidParam("jobId"), 
    controller.getStatus
);

export default router;