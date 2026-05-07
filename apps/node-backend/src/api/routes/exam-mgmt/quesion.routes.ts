import { Router } from "express";

// 1. Controller (Gom từ index của exam-mgmt)
import { QuestionController } from "@/api/controllers/exam-mgmt";

// 2. Middlewares (Gom theo nhóm nghiệp vụ: Bảo mật | Tích hợp | Hệ thống)
import { authMiddleware, requirePermission } from "@/api/middlewares/identity";
import { upload } from "@/api/middlewares/integration";
import { validateFileSize } from "@/api/middlewares/shared";

// 3. DI Container
import { container } from "@/shared/utils/container";

const router = Router();

// Lấy controller từ Dependency Injection Container (Awilix Proxy)
const questionController = container.resolve("questionController") as QuestionController;

// Cấu hình upload dùng chung cho Question (Tránh lặp lại cấu hình fields)
const questionUpload = upload.fields([
  { name: 'imageFile', maxCount: 1 },    // Khớp với key imageFile từ FE
  { name: 'answerImages', maxCount: 10 } // Khớp với key answerImages từ FE
]);

// ============================================================================
// NHÓM 1: CÔNG KHAI (PUBLIC SCOPE)
// Các route này không cần authMiddleware để học viên có thể vào xem/ôn tập.
// ============================================================================



// ============================================================================
// NHÓM 2: QUẢN LÝ (ADMIN & INSTRUCTOR SCOPE)
// Tất cả các route bên dưới dòng này đều yêu cầu Đăng nhập + Quyền hạn cao.
// ============================================================================

router.use(authMiddleware);

/**
 * @description Lấy danh sách tóm tắt câu hỏi phục vụ Selection Pool (Ma trận/Đề thi).
 * @route GET /api/v1/questions/selection-pool
 * @access Private (Admin/Instructor) - Yêu cầu quyền đọc dữ liệu câu hỏi.
 */
router.get(
  "/selection-pool",
  requirePermission('questions:read'),
  questionController.getSelectionPool
);

/**
 * @description Lấy danh sách các câu hỏi thuộc về một chương (Chapter) cụ thể.
 * @route GET /api/v1/questions/chapter/:chapterId
 * @access Public/Private
 */
router.get("/chapter/:chapterId", questionController.getByChapter);

/**
 * @description Lấy thông tin chi tiết của một câu hỏi theo ID.
 * @route GET /api/v1/questions/:id
 * @access Public/Private
 */
router.get("/:id", questionController.getById);

/**
 * Quản lý danh sách câu hỏi tại root path "/"
 */

/**
 * @description Lấy danh sách toàn bộ câu hỏi với bộ lọc và phân trang.
 * @route GET /api/v1/questions
 * @access Private (Admin/Instructor) - Yêu cầu vé questions:read
 */
router.get("/", requirePermission('questions:read'), questionController.list);

router.route("/")
  /**
   * @description Tạo mới một câu hỏi cùng các phương án trả lời.
   * @route POST /api/v1/questions
   * @access Private (Admin/Instructor) - Yêu cầu vé questions:manage
   */
  .post(requirePermission('questions:manage'), validateFileSize(questionUpload), questionController.create);

router.use(requirePermission('questions:manage'));

/**
 * Quản lý chi tiết câu hỏi tại path "/:id"
 */
router.route("/:id")
  /**
   * @description Cập nhật thông tin câu hỏi và nội dung các đáp án.
   * @route PUT /api/v1/questions/:id
   * @access Private (Admin/Instructor) - Yêu cầu vé questions:manage
   */
  .put(questionUpload, questionController.update)

  /**
   * @description Xóa (xóa mềm) câu hỏi khỏi hệ thống.
   * @route DELETE /api/v1/questions/:id
   * @access Private (Admin/Instructor) - Yêu cầu vé questions:manage
   */
  .delete(questionController.delete);

/**
 * @description Khôi phục lại câu hỏi đã bị xóa mềm trước đó.
 * @route PATCH /api/v1/questions/:id/restore
 * @access Private (Admin/Instructor) - Yêu cầu vé questions:manage
 */
router.patch("/:id/restore", questionController.restore);

export default router;