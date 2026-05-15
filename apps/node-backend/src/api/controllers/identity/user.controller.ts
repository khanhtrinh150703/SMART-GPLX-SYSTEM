import { Response } from 'express';
import { Result } from '@/application/dtos/response/shared/api.response.dto';
import { catchAsync } from '@/shared/utils/catch-async.utils';
import { Message } from '@/shared/errors/messages/success-messages-vn';
import { IAuthRequest } from '@/shared/types/authRequest.types';
import { UserQueryDTO } from '@/application/dtos/request/user/user-query.request.dto';
import { IUserService } from '@/domain/interfaces/services/identity/commands/i-user.service';
import { UpdateProfileRequestDTO } from '@/application/dtos/request/user/update-profile.request.dto';
import { ChangePasswordRequestDTO } from '@/application/dtos/request/user/update-password.request.dto';
import { ChangeStatusRequestDTO } from '@/application/dtos/request/user/update-status.request.dto';
import { UpdateAdminRequestDTO } from '@/application/dtos/request/user/update-admin.request.dto';
import { IUserQueryService } from '@/domain/interfaces/services/identity/queries';

/**
 * @interface IUserControllerCradle
 * @description "Túi đồ nghề" (Dependency Container) chứa các dịch vụ cần thiết để quản lý người dùng (Users).
 * @guard TypeScript Guard - Đảm bảo tính an toàn về kiểu dữ liệu, chỉ cho phép tiêm đúng các Interface dịch vụ đã được định nghĩa.
 */
export interface IUserControllerCradle {
  /** @description Dịch vụ thực hiện các thao tác thay đổi dữ liệu người dùng (Cập nhật hồ sơ, đổi mật khẩu, xóa).*/
  userService: IUserService;

  /** @description Dịch vụ chuyên trách truy vấn thông tin, tìm kiếm và thống kê danh sách người dùng. */
  userQueryService: IUserQueryService;
}

/**
 * @class UserController
 * @description Lớp điều phối (Orchestrator) các yêu cầu HTTP liên quan đến quản lý người dùng.
 * @principle Loose Coupling - Sử dụng Interface để giao tiếp với tầng Application, giúp giảm thiểu sự phụ thuộc trực tiếp vào các implementation cụ thể.
 */
export class UserController {
  /** @private @readonly @description Instance xử lý các logic nghiệp vụ thay đổi trạng thái người dùng. */
  private readonly _userService: IUserService;

  /** @private @readonly @description Instance xử lý các yêu cầu đọc và tra cứu dữ liệu người dùng. */
  private readonly _userQueryService: IUserQueryService;

  /**
   * @constructor
   * @description Khởi tạo UserController bằng cách giải nén các phụ thuộc từ Cradle thông qua cơ chế DI.
   * @param {IUserControllerCradle} cradle - Chứa các dịch vụ chuyên biệt cần thiết để vận hành module Người dùng.
   */
  constructor({ userService, userQueryService }: IUserControllerCradle) {
    this._userService = userService;
    this._userQueryService = userQueryService;
  }

  /**
   * @description Tác dụng: Sửa thông tin cá nhân của người dùng.
   * @param {Request} req - Chứa userId trong params và UpdateProfileDTO trong body.
   * @param {Response} res - Phản hồi tiêu chuẩn.
   * @returns {Promise<void>}
   */
  public updateProfile = catchAsync(async (req: IAuthRequest, res: Response): Promise<void> => {
    const userId = req.user.userId;

    // 3. Đóng gói dữ liệu vào một Object duy nhất cho DTO
    const dto = new UpdateProfileRequestDTO({
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
   * @description Tác dụng: Sửa thông tin cá nhân của người dùng.
   * @param {Request} req - Chứa userId trong params và UpdateProfileDTO trong body.
   * @param {Response} res - Phản hồi tiêu chuẩn.
   * @returns {Promise<void>}
   */
  public updateProfileAdmin = catchAsync(async (req: IAuthRequest, res: Response): Promise<void> => {
    const userId = req.params.id as string; // Hoặc req.user.id tùy theo Payload cậu đặt

    // 3. Đóng gói dữ liệu vào một Object duy nhất cho DTO
    const dto = new UpdateProfileRequestDTO({
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
   * @description Tác dụng: API endpoint thay đổi mật khẩu người dùng.
   * @param {IAuthRequest} req - Đã được gán TokenPayload qua Middleware.
   * @param {Response} res - Phản hồi tiêu chuẩn.
   * @returns {Promise<void>}
   */
  public changePassword = catchAsync(async (req: IAuthRequest, res: Response): Promise<void> => {
    // 1. Lấy userId trực tiếp (Hết lỗi đỏ nhờ IAuthRequest và Middleware)
    const userId = req.user.userId;

    // 2. Khởi tạo DTO từ body (Ép kiểu sang Record để tránh any)
    const dto = new ChangePasswordRequestDTO(req.body);

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
   * @description Tác dụng: Thay đổi trạng thái hoạt động của User (Dành cho Admin).
   * @param {Request} req - Chứa ChangeStatusDTO trong body.
   * @param {Response} res - Phản hồi tiêu chuẩn.
   * @returns {Promise<void>}
   */
  public updateStatus = catchAsync(async (req: IAuthRequest, res: Response): Promise<void> => {
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
   * @description Tác dụng: Xóa tài khoản người dùng (Xóa mềm - Soft Delete).
   * @param {Request} req - Chứa userId trong params.
   * @param {Response} res - Phản hồi tiêu chuẩn.
   * @returns {Promise<void>}
   */
  public deleteUser = catchAsync(async (req: IAuthRequest, res: Response): Promise<void> => {
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
   * @description Tác dụng: Khôi phục tài khoản người dùng (Hồi sinh - Restore).
   * @param {Request} req - Chứa userId trong params.
   * @param {Response} res - Phản hồi tiêu chuẩn.
   * @returns {Promise<void>}
   */
  public restoreUser = catchAsync(async (req: IAuthRequest, res: Response): Promise<void> => {
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
   * @description Lấy list các users
   * @route GET /api/v1/users
   * @access Private (Admin only)
   * @description Lấy danh sách người dùng có phân trang và lọc.
   * @param {Response} res - Phản hồi tiêu chuẩn.
   * @returns {Promise<void>}
   */
  public getUsers = catchAsync(async (req: IAuthRequest, res: Response): Promise<void> => {
    // 1. Thu thập Query Params từ URL (vd: ?page=1&limit=10&role=STUDENT)
    // Cậu có thể dùng class-transformer để ép kiểu sang UserQueryDTO ở đây
    const query: UserQueryDTO = req.query as unknown as UserQueryDTO;
    // 2. Gọi tầng Service xử lý nghiệp vụ
    const result = await this._userQueryService.getPaginatedUsers(query);

    // 3. Trả về phản hồi thông qua BaseResponse để đồng nhất cấu trúc JSON
    Result.ok(
      res,
      result,
      Message.USER.FETCH_USER,
      'USER_FETCH_SUCCESS'
    );
  });

  /**
   * @description Chức năng cập nhật thông tin của admin
   * @route PUT /api/v1/users/:id/admin
   * @access Private (Admin only)
   * @description Admin cập nhật thông tin và vai trò của người dùng.
   * @param {IAuthRequest} req - Yêu cầu chứa userId trong params và dữ liệu trong body.
   * @param {Response} res - Phản hồi tiêu chuẩn.
   * @returns {Promise<void>}
   */
  public updateUserByAdmin = catchAsync(async (req: IAuthRequest, res: Response): Promise<void> => {
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