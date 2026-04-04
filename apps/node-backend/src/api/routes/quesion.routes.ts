import { container } from "@/shared/utils/container";
import { Router } from "express";
import { QuestionController } from "../controllers/question.controller";

/**
 * @description Khởi tạo route cho Question module
 * @returns {Router} Đối tượng Express Router
 */
const router = Router();

// Lấy controller từ Dependency Injection Container (Awilix Proxy)
const questionController = container.resolve("questionController") as QuestionController;

// ==========================================
// QUẢN LÝ CÂU HỎI & ĐÁP ÁN (WRITE)
// ==========================================
router.post("/", questionController.create);
router.put("/:id", questionController.update);
// router.delete("/:id", questionController.delete);

// ==========================================
// TRUY VẤN DỮ LIỆU (READ)
// ==========================================
router.get("/:id", questionController.getById);
router.get("/chapter/:chapterId", questionController.getByChapter);
/**
 * @route   DELETE /api/v1/license-categories/:id
 * @desc    Xóa hạng bằng lái (Kiểm tra ràng buộc tại Service)
 * @access  Private (Admin)
 */
router.delete(
    '/:id',
    // authMiddleware,
    // roleMiddleware(['ADMIN']),
    questionController.delete
);

/**
 * @route   PATCH /api/v1/license-categories/:id/restore
 * @desc    Khôi phục hạng bằng lái đã xóa mềm
 * @access  Private (Admin)
 */
router.patch(
    '/:id/restore',
    // authMiddleware,
    // roleMiddleware(['ADMIN']),
    questionController.restore
);


export default router;