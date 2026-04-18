import { Router } from 'express';
import authRoutes from './auth.routes';
import userRoutes from './user.routes'; 
import licenseRoutes from './license-category.routes'; 
import chapterRoutes from './chapter.routes'; 
import questionRoutes from './quesion.routes'; 
import roleRoutes from './roles.routes'
import importRoutes from './import.routes';

/**
 * @description Router tổng (Root Router) của ứng dụng.
 * Đóng vai trò là điểm tập trung để phân phối và gắn kết các Router nhánh vào các tiền tố (Prefixes) tương ứng.
 * Giúp quản lý mã nguồn theo module và hỗ trợ việc mở rộng/versioning API dễ dàng.
 */
const rootRouter = Router();

/** @description Phân đoạn API liên quan đến xác thực, cấp phát và thu hồi Token. */
rootRouter.use('/auth', authRoutes);

/** @description Phân đoạn API quản lý thông tin người dùng, hồ sơ và phân quyền. */
rootRouter.use('/users', userRoutes);

/** @description Phân đoạn API quản lý danh mục các hạng bằng lái xe (A1, A2, B1, B2...). */
rootRouter.use('/license-categories', licenseRoutes);

/** @description Phân đoạn API quản lý các chương lý thuyết (Khái niệm, Biển báo, Sa hình...). */
rootRouter.use('/chapters', chapterRoutes);

/** @description Phân đoạn API quản lý các câu hỏi lý thuyết (Khái niệm, Biển báo, Sa hình...). */
rootRouter.use('/questions', questionRoutes);

/** @description Phân đoạn API quản lý các vai trò và phân quyền hệ thống (Admin, Instructor, Student...). */
rootRouter.use('/roles', roleRoutes);

/** @description Phân đoạn API quản lý quy trình nhập dữ liệu hệ thống (Khởi tạo, Tải mảnh, Hoàn tất...). */
rootRouter.use('/import', importRoutes);

export default rootRouter;