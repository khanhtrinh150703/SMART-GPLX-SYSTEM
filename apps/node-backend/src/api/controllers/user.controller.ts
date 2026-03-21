import { ChangePasswordDTO, ChangeStatusDTO, UpdateProfileDTO } from '@/application/dtos/request/user.dto';
import { UserService } from '@/application/services/user.service';
import { UserMapper } from '@/infrastructure/database/mappers/user.mapper';
import { UserRepository } from '@/infrastructure/database/user.repository';
import { Result } from '@/shared/utils/response';
import { Request, Response, NextFunction } from 'express';

const userRepo = new UserRepository();
const userService = new UserService(userRepo);

export class UserController {

    // 1. Sửa thông tin cá nhân
    static async updateProfile(req: Request, res: Response, next: NextFunction) {
        try {
            // Lấy userId từ URL params (ví dụ: /api/v1/users/:id/profile)
            const userId = req.params.id as string;

            // 1. Khởi tạo DTO từ body
            const dto = new UpdateProfileDTO(req.body);

            // 2. Gọi Service xử lý logic cập nhật
            const updatedUser = await userService.updateProfile(userId, dto);

            // 3. Sử dụng Mapper để loại bỏ thông tin nhạy cảm
            const cleanUser = UserMapper.toResponse(updatedUser);

            // 4. Trả về response chuẩn hóa
            return Result.ok(res, {
                user: cleanUser,
                message: "Cập nhật thông tin thành công"
            });

        } catch (error) {
            next(error);
        }
    }

    // 2. Đổi mật khẩu
    static async changePassword(req: Request, res: Response, next: NextFunction) {
        try {
            const userId = req.params.id as string;

            // 1. Khởi tạo DTO từ body
            const dto = new ChangePasswordDTO(req.body);

            // 2. Gọi Service xử lý logic đổi mật khẩu
            // Service này chỉ trả về object { message: "..." }, không trả về user
            const result = await userService.changePassword(userId, dto);

            // 3 & 4. Trả về response chuẩn hóa trực tiếp (không cần Mapper vì không lộ data)
            return Result.ok(res, result);

        } catch (error) {
            next(error);
        }
    }

    // 3. Đổi trạng thái (Dành cho Admin)
    static async updateStatus(req: Request, res: Response, next: NextFunction) {
        try {
            const userId = req.params.id as string;

            // 1. Khởi tạo DTO từ body
            const dto = new ChangeStatusDTO(req.body);

            // 2. Gọi Service xử lý logic cập nhật trạng thái
            const result = await userService.updateStatus(userId, dto);

            // 3 & 4. Trả về response
            return Result.ok(res, result);

        } catch (error) {
            next(error);
        }
    }

    // 4. Xóa tài khoản (Soft Delete)
    static async deleteUser(req: Request, res: Response, next: NextFunction) {
        try {
            const userId = req.params.id as string;

            // 1. Chức năng xóa thường không cần DTO body, chỉ cần ID từ URL

            // 2. Gọi Service xử lý logic xóa mềm
            const result = await userService.deleteUser(userId);

            // 3 & 4. Trả về response
            return Result.ok(res, result);

        } catch (error) {
            next(error);
        }
    }
}