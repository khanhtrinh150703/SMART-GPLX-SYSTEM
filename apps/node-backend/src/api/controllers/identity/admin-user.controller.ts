import { AdminCreateUserRequestDTO } from "@/application/dtos/request/auth/admin-create-user.request.dto";
import { UpdateAdminRequestDTO } from "@/application/dtos/request/user/update-admin.request.dto";
import { UpdateProfileRequestDTO } from "@/application/dtos/request/user/update-profile.request.dto";
import { ChangeStatusRequestDTO } from "@/application/dtos/request/user/update-status.request.dto";
import { UserQueryDTO } from "@/application/dtos/request/user/user-query.request.dto";
import { Result } from "@/application/dtos/response/shared/api.response.dto";
import { IUserService, IUserQueryService } from "@/domain/interfaces/services";
import { Message } from "@/shared/errors/messages/success-messages-vn";
import { IAuthRequest } from "@/shared/types";
import { catchAsync } from "@/shared/utils";
import { Response } from "express";

/**
 * @interface IAdminUserControllerCradle
 * @description (Dependency Container) chứa các dịch vụ cần thiết cho đặc quyền Admin quản lý người dùng.
 * @guard TypeScript Guard - Chặn đứng nguy cơ lọt kiểu any, ép buộc tiêm chính xác Interface đã định nghĩa.
 */
export interface IAdminUserControllerCradle {
  /** @description Dịch vụ thực hiện các thao tác ghi/thay đổi dữ liệu người dùng (Tạo mới, khóa, phân quyền). */
  userService: IUserService;

  /** @description Dịch vụ chuyên trách truy vấn, tìm kiếm nâng cao và lọc danh sách người dùng cho Admin. */
  userQueryService: IUserQueryService;
}

/**
 * @class AdminUserController
 * @description Lớp điều phối (Orchestrator) các yêu cầu HTTP mang đặc quyền Admin để quản lý toàn bộ tài khoản trong hệ thống.
 * @principle Loose Coupling & Clean Architecture - Giao tiếp nghiêm ngặt qua Interface, cô lập hoàn toàn tầng API với tầng nghiệp vụ Core.
 */
export class AdminUserController {
  /** @private @readonly @description Instance điều phối các nghiệp vụ thay đổi trạng thái hoặc khởi tạo người dùng. */
  private readonly _userService: IUserService;

  /** @private @readonly @description Instance xử lý các yêu cầu tra cứu thông tin chi tiết hoặc danh sách từ Admin. */
  private readonly _userQueryService: IUserQueryService;

  /**
   * @constructor
   * @description Khởi tạo AdminUserController bằng cách bóc tách giải nén các dịch vụ phụ thuộc từ Cradle.
   * @param {IAdminUserControllerCradle} cradle - Thùng chứa phụ thuộc chứa các service đặc quyền đã qua cấu hình Awilix.
   */
  constructor({ userService, userQueryService }: IAdminUserControllerCradle) {
    this._userService = userService;
    this._userQueryService = userQueryService;
  }

  /**
   * @description Tác dụng: Sửa thông tin cá nhân của người dùng.
   * @route PATCH /api/v1/users/admin/:id
   * @param {Request} req - Chứa userId trong params và UpdateProfileDTO trong body.
   * @param {Response} res - Phản hồi tiêu chuẩn.
   * @returns {Promise<void>}
   */
  public updateProfileAdmin = catchAsync(
    async (req: IAuthRequest, res: Response): Promise<void> => {
      const userId = req.params.id as string;

      // 3. Đóng gói dữ liệu vào một Object duy nhất cho DTO
      const dto = new UpdateProfileRequestDTO({
        ...req.body,
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
   * @description Quản trị viên khởi tạo một tài khoản người dùng mới (Học viên, Giáo viên, Điều phối viên) với các quyền hạn đi kèm.
   * @route POST /api/v1/users/admin
   * @param {Request} req - Đối tượng yêu cầu HTTP, chứa thông tin tài khoản thô trong req.body.
   * @param {Response} res - Đối tượng phản hồi HTTP đạt chuẩn cấu trúc Result.ok của hệ thống.
   * @returns {Promise<void>} Kết thúc luồng điều phối phản hồi về phía Client.
   */
  public adminCreateUser = catchAsync(
    async (req: IAuthRequest, res: Response): Promise<void> => {
      // 1. Khởi tạo Self-validating DTO tự động kiểm tra và làm sạch dữ liệu từ body đầu vào
      const dto = new AdminCreateUserRequestDTO(req.body);
      // 2. Điều phối dữ liệu xuống Service xử lý nghiệp vụ tạo tài khoản ở tầng Application
      const createdUser = await this._userService.adminCreateUser(dto);

      // 3. Phản hồi Client bằng cấu trúc Result.ok chuẩn chỉnh như form mẫu bạn cung cấp
      Result.ok(
        res,
        createdUser,
        Message.USER.CREATED_SUCCESSFULLY, 
        "USER_CREATED_SUCCESSFULLY",
      );
    },
  );

  /**
   * @description Chức năng cập nhật thông tin của admin
   * @route PUT /api/v1/users/:id/admin
   * @access Private (Admin only)
   * @description Admin cập nhật thông tin và vai trò của người dùng.
   * @param {IAuthRequest} req - Yêu cầu chứa userId trong params và dữ liệu trong body.
   * @param {Response} res - Phản hồi tiêu chuẩn.
   * @returns {Promise<void>}
   */
  public updateUserByAdmin = catchAsync(
    async (req: IAuthRequest, res: Response): Promise<void> => {
      // 1. Lấy userId từ Path Parameters
      const userId = req.params.id as string;

      // 2. Thu thập dữ liệu từ body và khởi tạo DTO
      const dto = new UpdateAdminRequestDTO(req.body);
      // 3. Gọi tầng Service để thực hiện nghiệp vụ (bao gồm cả Transaction)
      await this._userService.updateUserByAdmin(userId, dto);

      // 4. Trả về phản hồi thành công (thường update xong chỉ cần trả message/200 OK)
      Result.ok(
        res,
        null, // Không nhất thiết trả lại User object nếu Admin đang quản lý danh sách lớn
        Message.USER.UPDATE_SUCCESS,
        "USER_UPDATE_SUCCESS",
      );
    },
  );

  /**
   * @description Tác dụng: Thay đổi trạng thái hoạt động của User (Dành cho Admin).
   * @param {Request} req - Chứa ChangeStatusDTO trong body.
   * @param {Response} res - Phản hồi tiêu chuẩn.
   * @returns {Promise<void>}
   */
  public updateStatus = catchAsync(
    async (req: IAuthRequest, res: Response): Promise<void> => {
      const userId = req.params.id as string;
      const dto = new ChangeStatusRequestDTO(req.body);

      await this._userService.updateStatus(userId, dto);

      Result.ok(
        res,
        undefined,
        Message.USER.STATUS_UPDATED,
        "USER_STATUS_UPDATED",
      );
    },
  );

  /**
   * @description Tác dụng: Xóa tài khoản người dùng (Xóa mềm - Soft Delete).
   * @param {Request} req - Chứa userId trong params.
   * @param {Response} res - Phản hồi tiêu chuẩn.
   * @returns {Promise<void>}
   */
  public deleteUser = catchAsync(
    async (req: IAuthRequest, res: Response): Promise<void> => {
      const userId = req.params.id as string;

      // Chức năng xóa thường không cần DTO body, chỉ cần ID
      await this._userService.deleteUser(userId);

      Result.ok(
        res,
        undefined,
        Message.USER.DELETE_SUCCESS,
        "USER_DELETED_SUCCESS",
      );
    },
  );

  /**
   * @description Tác dụng: Khôi phục tài khoản người dùng (Hồi sinh - Restore).
   * @param {Request} req - Chứa userId trong params.
   * @param {Response} res - Phản hồi tiêu chuẩn.
   * @returns {Promise<void>}
   */
  public restoreUser = catchAsync(
    async (req: IAuthRequest, res: Response): Promise<void> => {
      const userId = req.params.id as string;

      // Gọi Service để xử lý logic "hồi sinh" (xóa bỏ timestamp deletedAt)
      await this._userService.restoreUser(userId);

      Result.ok(
        res,
        undefined,
        Message.USER.RESTORE_SUCCESS,
        "USER_RESTORED_SUCCESS",
      );
    },
  );

  /**
   * @description Lấy list các users
   * @route GET /api/v1/users
   * @access Private (Admin only)
   * @description Lấy danh sách người dùng có phân trang và lọc.
   * @param {Response} res - Phản hồi tiêu chuẩn.
   * @returns {Promise<void>}
   */
  public getUsers = catchAsync(
    async (req: IAuthRequest, res: Response): Promise<void> => {
      // 1. Thu thập Query Params từ URL (vd: ?page=1&limit=10&role=STUDENT)
      // Cậu có thể dùng class-transformer để ép kiểu sang UserQueryDTO ở đây
      const query: UserQueryDTO = req.query as unknown as UserQueryDTO;
      // 2. Gọi tầng Service xử lý nghiệp vụ
      const result = await this._userQueryService.getPaginatedUsers(query);

      // 3. Trả về phản hồi thông qua BaseResponse để đồng nhất cấu trúc JSON
      Result.ok(res, result, Message.USER.FETCH_USER, "USER_FETCH_SUCCESS");
    },
  );
}
