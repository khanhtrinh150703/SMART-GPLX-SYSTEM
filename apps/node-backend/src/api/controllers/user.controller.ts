import { Request, Response } from 'express';
import { ChangePasswordDTO, ChangeStatusDTO, UpdateProfileDTO } from '@/application/dtos/request/user.dto';
import { UserService } from '@/application/services/user.service';
import { UserMapper } from '@/infrastructure/database/mappers/user.mapper';
import { Result } from '@/shared/responses/api-response';

// Import hàm bọc lỗi thần thánh
import { catchAsync } from '@/shared/utils/catch-async';
import { Message } from '@/shared/errors/messages/success-messages-vn';
import { AuthRequest } from '@/shared/types/auth.types';


export class UserController {

  // Áp dụng DI: Tiêm UserService thông qua Constructor
  constructor(private readonly userService: UserService) { }

  /**
   * Tác dụng: Sửa thông tin cá nhân của người dùng.
   * @param {Request} req - Chứa userId trong params và UpdateProfileDTO trong body.
   * @param {Response} res - Phản hồi tiêu chuẩn.
   * @returns {Promise<void>}
   */
  public updateProfile = catchAsync(async (req: Request, res: Response): Promise<void> => {
    const userId = req.params.id as string; // Lấy ID từ URL (VD: /api/v1/users/:id)
    const dto = new UpdateProfileDTO(req.body);

    const updatedUser = await this.userService.updateProfile(userId, dto);

    // Loại bỏ mật khẩu/thông tin nhạy cảm trước khi trả về
    const cleanUser = UserMapper.toLoginResponse(updatedUser, "", "");

    Result.ok(
      res,
      cleanUser,
      Message.USER.UPDATE_SUCCESS,
      'USER_UPDATE_SUCCESS'
    );
  });

  /**
     * Tác dụng: API endpoint thay đổi mật khẩu người dùng.
     * @param {AuthRequest} req - Đã được gán TokenPayload qua Middleware.
     */
  public changePassword = catchAsync(async (req: AuthRequest, res: Response): Promise<void> => {
    // 1. Lấy userId trực tiếp (Hết lỗi đỏ nhờ AuthRequest và Middleware)
    const userId = req.user.userId;

    // 2. Khởi tạo DTO từ body (Ép kiểu sang Record để tránh any)
    const dto = new ChangePasswordDTO(req.body as Record<string, unknown>);

    // 3. Gọi Service
    await this.userService.changePassword(userId, dto);

    // 4. Trả về kết quả chuẩn
    Result.ok(
      res,
      undefined,
      Message.USER.PASSWORD_CHANGED,
      'USER_PASSWORD_CHANGED'
    );
  });

  /**
   * Tác dụng: Thay đổi trạng thái hoạt động của User (Dành cho Admin).
   * @param {Request} req - Chứa ChangeStatusDTO trong body.
   * @param {Response} res - Phản hồi tiêu chuẩn.
   * @returns {Promise<void>}
   */
  public updateStatus = catchAsync(async (req: Request, res: Response): Promise<void> => {
    const userId = req.params.id as string;
    const dto = new ChangeStatusDTO(req.body);

    await this.userService.updateStatus(userId, dto);

    Result.ok(
      res,
      undefined,
      Message.USER.STATUS_UPDATED,
      'USER_STATUS_UPDATED'
    );
  });

  /**
   * Tác dụng: Xóa tài khoản người dùng (Xóa mềm - Soft Delete).
   * @param {Request} req - Chứa userId trong params.
   * @param {Response} res - Phản hồi tiêu chuẩn.
   * @returns {Promise<void>}
   */
  public deleteUser = catchAsync(async (req: Request, res: Response): Promise<void> => {
    const userId = req.params.id as string;

    // Chức năng xóa thường không cần DTO body, chỉ cần ID
    await this.userService.deleteUser(userId);

    Result.ok(
      res,
      undefined,
      Message.USER.DELETE_SUCCESS,
      'USER_DELETED_SUCCESS'
    );
  });

  /**
   * Tác dụng: Khôi phục tài khoản người dùng (Hồi sinh - Restore).
   * @param {Request} req - Chứa userId trong params.
   * @param {Response} res - Phản hồi tiêu chuẩn.
   * @returns {Promise<void>}
   */
  public restoreUser = catchAsync(async (req: Request, res: Response): Promise<void> => {
    const userId = req.params.id as string;

    // Gọi Service để xử lý logic "hồi sinh" (xóa bỏ timestamp deletedAt)
    await this.userService.restoreUser(userId);

    Result.ok(
      res,
      undefined,
      Message.USER.RESTORE_SUCCESS,
      'USER_RESTORED_SUCCESS'
    );
  });
}