import { Response } from "express";
import { Result } from "@/application/dtos/response/shared/api.response.dto";
import { catchAsync } from "@/shared/utils/catch-async.utils";
import { Message } from "@/shared/errors/messages/success-messages-vn";
import { IAuthRequest } from "@/shared/types/authRequest.types";
import { IUserService } from "@/domain/interfaces/services/identity/commands/i-user.service";
import { UpdateProfileRequestDTO } from "@/application/dtos/request/user/update-profile.request.dto";
import { ChangePasswordRequestDTO } from "@/application/dtos/request/user/update-password.request.dto";

/**
 * @interface IUserControllerCradle
 * @description (Dependency Container) chứa các dịch vụ cần thiết để quản lý người dùng (Users).
 * @guard TypeScript Guard - Đảm bảo tính an toàn về kiểu dữ liệu, chỉ cho phép tiêm đúng các Interface dịch vụ đã được định nghĩa.
 */
export interface IUserControllerCradle {
  /** @description Dịch vụ thực hiện các thao tác thay đổi dữ liệu người dùng (Cập nhật hồ sơ, đổi mật khẩu, xóa).*/
  userService: IUserService;
}

/**
 * @class UserController
 * @description Lớp điều phối (Orchestrator) các yêu cầu HTTP liên quan đến quản lý người dùng.
 * @principle Loose Coupling - Sử dụng Interface để giao tiếp với tầng Application, giúp giảm thiểu sự phụ thuộc trực tiếp vào các implementation cụ thể.
 */
export class UserController {
  /** @private @readonly @description Instance xử lý các logic nghiệp vụ thay đổi trạng thái người dùng. */
  private readonly _userService: IUserService;

  /**
   * @constructor
   * @description Khởi tạo UserController bằng cách giải nén các phụ thuộc từ Cradle thông qua cơ chế DI.
   * @param {IUserControllerCradle} cradle - Chứa các dịch vụ chuyên biệt cần thiết để vận hành module Người dùng.
   */
  constructor({ userService }: IUserControllerCradle) {
    this._userService = userService;
  }

  /**
   * @description Tác dụng: Sửa thông tin cá nhân của người dùng.
   * @param {Request} req - Chứa userId trong params và UpdateProfileDTO trong body.
   * @param {Response} res - Phản hồi tiêu chuẩn.
   * @returns {Promise<void>}
   */
  public updateProfile = catchAsync(
    async (req: IAuthRequest, res: Response): Promise<void> => {
      const userId = req.user.userId;

      // 3. Đóng gói dữ liệu vào một Object duy nhất cho DTO
      const dto = new UpdateProfileRequestDTO({
        ...req.body, // Lấy fullName, username, ...
        pictureFile: req.file, // Lấy file từ multer
      });

      const updatedUser = await this._userService.updateProfile(userId, dto);

      Result.ok(
        res,
        updatedUser,
        Message.USER.UPDATE_SUCCESS,
        "USER_UPDATE_SUCCESS",
      );
    },
  );
  /**
   * @description Tác dụng: API endpoint thay đổi mật khẩu người dùng.
   * @param {IAuthRequest} req - Đã được gán TokenPayload qua Middleware.
   * @param {Response} res - Phản hồi tiêu chuẩn.
   * @returns {Promise<void>}
   */
  public changePassword = catchAsync(
    async (req: IAuthRequest, res: Response): Promise<void> => {
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
        "USER_PASSWORD_CHANGED",
      );
    },
  );
}
