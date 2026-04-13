import { Response } from 'express';
import { Result } from '@/shared/responses/api-response';
import { catchAsync } from '@/shared/utils/catch-async.utils';
import { Message } from '@/shared/errors/messages/success-messages-vn';
import { AuthRequest } from '@/shared/types/auth.types';
import { UserQueryDTO } from '@/application/dtos/request/user/user-query.request.dto';
import { IUserService } from '@/domain/interfaces/services/i-user.service';
import { UpdateProfileDTO } from '@/application/dtos/request/user/update-profile.request.dto';
import { ChangePasswordRequestDTO } from '@/application/dtos/request/user/update-password.request.dto';
import { ChangeStatusRequestDTO } from '@/application/dtos/request/user/update-status.request.dto';
import { UpdateAdminRequestDTO } from '@/application/dtos/request/user/update-admin.request.dto';

/**
 * @interface IUserControllerCradle
 * @description Định nghĩa các phụ thuộc (dependencies) cần thiết cho UserController.
 * Giúp TypeScript canh gác chặt chẽ, chỉ cho phép tiêm đúng IUserService vào đây.
 */
export interface IUserControllerCradle {
  userService: IUserService;
}

/**
 * @class UserController
 * @description Tiếp nhận các HTTP Request và điều phối xử lý nghiệp vụ liên quan đến Người dùng.
 */
export class UserController {
  // 1. Khai báo thuộc tính riêng tư (Sử dụng Interface để đạt tính Loose Coupling)
  private readonly _userService: IUserService;

  /**
   * @description Khởi tạo UserController với "túi đồ nghề" chuyên biệt cho User.
   * @param {IUserControllerCradle} cradle - Object chứa các dependencies được tiêm tự động từ Awilix.
   */
  constructor({ userService }: IUserControllerCradle) {
    // 2. Gán instance userService từ Cradle vào thuộc tính class
    // LƯU Ý: Tên 'userService' phải khớp chính xác với Key trong file container.ts
    this._userService = userService;
  }

  /**
   * Tác dụng: Sửa thông tin cá nhân của người dùng.
   * @param {Request} req - Chứa userId trong params và UpdateProfileDTO trong body.
   * @param {Response} res - Phản hồi tiêu chuẩn.
   * @returns {Promise<void>}
   */
  public updateProfile = catchAsync(async (req: AuthRequest, res: Response): Promise<void> => {
    const userId = req.user.userId; // Hoặc req.user.id tùy theo Payload cậu đặt

    // 3. Đóng gói dữ liệu vào một Object duy nhất cho DTO
    const dto = new UpdateProfileDTO({
      ...req.body,      // Lấy fullName, username, ...
      pictureFile: req.file // Lấy file từ multer
    });

    const updatedUser = await this._userService.updateProfile(userId, dto);

    Result.ok(
      res,
      updatedUser,
      Message.USER.UPDATE_SUCCESS,
      'USER_UPDATE_SUCCESS'
    );
  });

  /**
   * Tác dụng: Sửa thông tin cá nhân của người dùng.
   * @param {Request} req - Chứa userId trong params và UpdateProfileDTO trong body.
   * @param {Response} res - Phản hồi tiêu chuẩn.
   * @returns {Promise<void>}
   */
  public updateProfileAdmin = catchAsync(async (req: AuthRequest, res: Response): Promise<void> => {
    const userId = req.params.id as string; // Hoặc req.user.id tùy theo Payload cậu đặt

    // 3. Đóng gói dữ liệu vào một Object duy nhất cho DTO
    const dto = new UpdateProfileDTO({
      ...req.body,      // Lấy fullName, username, ...
    });

    const updatedUser = await this._userService.updateProfile(userId, dto);


    Result.ok(
      res,
      updatedUser,
      Message.USER.UPDATE_SUCCESS,
      'USER_UPDATE_SUCCESS'
    );
  });

  /**
   * Tác dụng: API endpoint thay đổi mật khẩu người dùng.
   * @param {AuthRequest} req - Đã được gán TokenPayload qua Middleware.
   * @param {Response} res - Phản hồi tiêu chuẩn.
   * @returns {Promise<void>}
   */
  public changePassword = catchAsync(async (req: AuthRequest, res: Response): Promise<void> => {
    // 1. Lấy userId trực tiếp (Hết lỗi đỏ nhờ AuthRequest và Middleware)
    const userId = req.user.userId;

    // 2. Khởi tạo DTO từ body (Ép kiểu sang Record để tránh any)
    const dto = new ChangePasswordRequestDTO(req.body as Record<string, unknown>);

    // 3. Gọi Service
    await this._userService.changePassword(userId, dto);

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
  public updateStatus = catchAsync(async (req: AuthRequest, res: Response): Promise<void> => {
    const userId = req.params.id as string;
    const dto = new ChangeStatusRequestDTO(req.body);

    await this._userService.updateStatus(userId, dto);

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
  public deleteUser = catchAsync(async (req: AuthRequest, res: Response): Promise<void> => {
    const userId = req.params.id as string;

    // Chức năng xóa thường không cần DTO body, chỉ cần ID
    await this._userService.deleteUser(userId);

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
  public restoreUser = catchAsync(async (req: AuthRequest, res: Response): Promise<void> => {
    const userId = req.params.id as string;

    // Gọi Service để xử lý logic "hồi sinh" (xóa bỏ timestamp deletedAt)
    await this._userService.restoreUser(userId);

    Result.ok(
      res,
      undefined,
      Message.USER.RESTORE_SUCCESS,
      'USER_RESTORED_SUCCESS'
    );
  });

  /**
   * @route GET /api/v1/users
   * @access Private (Admin only)
   * @description Lấy danh sách người dùng có phân trang và lọc.
   * @param {Response} res - Phản hồi tiêu chuẩn.
   * @returns {Promise<void>}
   */
  public getUsers = catchAsync(async (req: AuthRequest, res: Response): Promise<void> => {
    // 1. Thu thập Query Params từ URL (vd: ?page=1&limit=10&role=STUDENT)
    // Cậu có thể dùng class-transformer để ép kiểu sang UserQueryDTO ở đây
    const query: UserQueryDTO = req.query as unknown as UserQueryDTO;
    // 2. Gọi tầng Service xử lý nghiệp vụ
    const result = await this._userService.getPaginatedUsers(query);

    // 3. Trả về phản hồi thông qua BaseResponse để đồng nhất cấu trúc JSON
    Result.ok(
      res,
      result,
      Message.USER.FETCH_USER,
      'USER_FETCH_SUCCESS'
    );
  });

  /**
   * @route PUT /api/v1/users/:id/admin
   * @access Private (Admin only)
   * @description Admin cập nhật thông tin và vai trò của người dùng.
   * @param {AuthRequest} req - Yêu cầu chứa userId trong params và dữ liệu trong body.
   * @param {Response} res - Phản hồi tiêu chuẩn.
   * @returns {Promise<void>}
   */
  public updateUserByAdmin = catchAsync(async (req: AuthRequest, res: Response): Promise<void> => {
    // 1. Lấy userId từ Path Parameters
    const userId = req.params.id as string;
    
    // 2. Thu thập dữ liệu từ body và khởi tạo DTO
    // DTO này sẽ thực hiện logic validate (fullName, roles) ngay trong constructor hoặc hàm isValid()
    const dto = new UpdateAdminRequestDTO(req.body);

    // 3. Gọi tầng Service để thực hiện nghiệp vụ (bao gồm cả Transaction)
    await this._userService.updateUserByAdmin(userId, dto);

    // 4. Trả về phản hồi thành công (thường update xong chỉ cần trả message/200 OK)
    Result.ok(
      res,
      null, // Không nhất thiết trả lại User object nếu Admin đang quản lý danh sách lớn
      Message.USER.UPDATE_SUCCESS,
      'USER_UPDATE_SUCCESS'
    );
  });
}