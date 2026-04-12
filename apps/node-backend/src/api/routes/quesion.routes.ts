import { container } from "@/shared/utils/container";
import { Router } from "express";
import { QuestionController } from "../controllers/question.controller";
import { upload } from "../middlewares/upload.middleware";

const router = Router();

// Lấy controller từ Dependency Injection Container (Awilix Proxy)
const questionController = container.resolve("questionController") as QuestionController;

/**
 * @description Tạo mới một câu hỏi cùng các phương án trả lời.
 * @route POST /api/v1/questions
 * @access Private (Admin)
 */
router.post(
  '/',
  upload.fields([
    { name: 'imageFile', maxCount: 1 },    // Khớp với key imageFile từ FE
    { name: 'answerImages', maxCount: 10 } // Khớp với key answerImages từ FE
  ]),
  questionController.create
);

/**
 * @description Lấy danh sách toàn bộ câu hỏi với bộ lọc và phân trang (Dịch: Get all questions with filters and pagination)
 * @route GET /api/v1/questions
 * @access Private (Admin Only) - Yêu cầu Token và quyền Quản trị viên
 */
router.get("/", questionController.list);

/**
 * @description Cập nhật thông tin câu hỏi và nội dung các đáp án.
 * @route PUT /api/v1/questions/:id
 * @access Private (Admin)
 */
router.put(
  "/:id", upload.fields([
    { name: 'imageFile', maxCount: 1 },    // Khớp với key imageFile từ FE
    { name: 'answerImages', maxCount: 10 } // Khớp với key answerImages từ FE
  ]),
  questionController.update
);

/**
 * @description Lấy thông tin chi tiết của một câu hỏi theo ID.
 * @route GET /api/v1/questions/:id
 * @access Public/Private
 */
router.get("/:id", questionController.getById);

/**
 * @description Lấy danh sách các câu hỏi thuộc về một chương (Chapter) cụ thể.
 * @route GET /api/v1/questions/chapter/:chapterId
 * @access Public/Private
 */
router.get("/chapter/:chapterId", questionController.getByChapter);

/**
 * @description Xóa (xóa mềm) câu hỏi khỏi hệ thống.
 * @route DELETE /api/v1/questions/:id
 * @access Private (Admin)
 */
router.delete("/:id", questionController.delete);

/**
 * @description Khôi phục lại câu hỏi đã bị xóa mềm trước đó.
 * @route PATCH /api/v1/questions/:id/restore
 * @access Private (Admin)
 */
router.patch("/:id/restore", questionController.restore);


export default router;